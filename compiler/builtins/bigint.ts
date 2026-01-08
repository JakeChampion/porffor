import type {} from './porffor.d.ts';

// digits is an array of u32s as digits in base 2^32
export const __Porffor_bigint_fromDigits = (negative: boolean, digits: i32[]): bigint => {
  const len: i32 = digits.length;
  if (len > 16383) throw new RangeError('Maximum BigInt size exceeded'); // (65536 - 4) / 4

  // use digits pointer as bigint pointer, as only used here
  let ptr: i32 = Porffor.wasm`local.get ${digits}`;

  Porffor.wasm.i32.store8(ptr, negative ? 1 : 0, 0, 0); // sign
  Porffor.wasm.i32.store16(ptr, len, 0, 2); // digit count

  let allZero: boolean = true;
  for (let i: i32 = 0; i < len; i++) {
    const d: i32 = digits[i];
    if (d != 0) allZero = false;

    Porffor.wasm.i32.store(ptr + i * 4, d, 0, 4);
  }

  if (allZero) {
    // todo: free ptr
    return 0 as bigint;
  }

  return (ptr + 0x8000000000000) as bigint;
};

// store small (abs(n) < 2^51 (0x8000000000000)) values inline (no allocation)
// like a ~s52 (s53 exc 2^51+(0-2^32) for u32 as pointer) inside a f64
export const __Porffor_bigint_inlineToDigitForm = (n: number): number => {
  const ptr: i32 = Porffor.malloc(4); // 4 meta + 1 digit
  Porffor.wasm.i32.store8(ptr, n < 0, 0, 0);
  Porffor.wasm.i32.store16(ptr, 1, 0, 2);
  Porffor.wasm.i32.store(ptr, Math.abs(n), 0, 4);

  return ptr;
};


export const __Porffor_bigint_fromNumber = (n: number): bigint => {
  if (!Number.isInteger(n) || !Number.isFinite(n)) throw new RangeError('Cannot use non-integer as BigInt');
  if (Math.abs(n) < 0x8000000000000) return n as bigint;

  const negative: boolean = n < 0;
  n = Math.abs(n);

  const digits: i32[] = Porffor.malloc();
  while (n > 0) {
    digits.unshift(n % 0x100000000);
    n = Math.trunc(n / 0x100000000);
  }

  return __Porffor_bigint_fromDigits(negative, digits);
};

export const __Porffor_bigint_toNumber = (x: number): number => {
  if (Math.abs(x) < 0x8000000000000) return x as number;
  x -= 0x8000000000000;

  const negative: boolean = Porffor.wasm.i32.load8_u(x, 0, 0) != 0;
  const len: i32 = Porffor.wasm.i32.load16_u(x, 0, 2);

  let out: number = 0;
  for (let i: i32 = 0; i < len; i++) {
    const d: i32 = Porffor.wasm.i32.load(x + i * 4, 0, 4);
    out = out * 0x100000000 + d;
  }

  if (negative) out = -out;
  return out;
};

export const __Porffor_bigint_fromString = (n: string|bytestring): bigint => {
  let len: i32 = n.length;

  // Strip leading whitespace
  let start: i32 = 0;
  while (start < len) {
    const c: i32 = n.charCodeAt(start);
    // Space, tab, newline, carriage return, form feed, vertical tab, and other Unicode whitespace
    if (Porffor.fastOr(c == 0x20, c == 0x09, c == 0x0a, c == 0x0d, c == 0x0c, c == 0x0b, c == 0xa0, c == 0xfeff)) {
      start++;
    } else {
      break;
    }
  }

  // Strip trailing whitespace
  let end: i32 = len;
  while (end > start) {
    const c: i32 = n.charCodeAt(end - 1);
    if (Porffor.fastOr(c == 0x20, c == 0x09, c == 0x0a, c == 0x0d, c == 0x0c, c == 0x0b, c == 0xa0, c == 0xfeff)) {
      end--;
    } else {
      break;
    }
  }

  // Empty string after trimming returns 0n
  if (start >= end) return 0n;

  let negative: boolean = false;
  let offset: i32 = start;

  // Check for sign
  const firstChar: i32 = n.charCodeAt(offset);
  if (firstChar == 45) { // '-'
    negative = true;
    offset++;
  } else if (firstChar == 43) { // '+'
    offset++;
  }

  if (offset >= end) throw new SyntaxError('Cannot convert empty string to BigInt');

  // Check for radix prefix
  let radix: i32 = 10;
  if (n.charCodeAt(offset) == 48 && offset + 1 < end) { // '0'
    const prefixChar: i32 = n.charCodeAt(offset + 1);
    if (Porffor.fastOr(prefixChar == 120, prefixChar == 88)) { // 'x' or 'X'
      radix = 16;
      offset += 2;
    } else if (Porffor.fastOr(prefixChar == 98, prefixChar == 66)) { // 'b' or 'B'
      radix = 2;
      offset += 2;
    } else if (Porffor.fastOr(prefixChar == 111, prefixChar == 79)) { // 'o' or 'O'
      radix = 8;
      offset += 2;
    }
  }

  if (offset >= end) throw new SyntaxError('Cannot convert empty string to BigInt');

  // Parse digits according to radix
  let acc: number = 0;
  let i: i32 = offset;
  while (i < end) {
    const char: i32 = n.charCodeAt(i);
    let digit: i32 = -1;

    if (char >= 48 && char <= 57) { // '0'-'9'
      digit = char - 48;
    } else if (char >= 65 && char <= 90) { // 'A'-'Z'
      digit = char - 65 + 10;
    } else if (char >= 97 && char <= 122) { // 'a'-'z'
      digit = char - 97 + 10;
    }

    if (Porffor.fastOr(digit < 0, digit >= radix)) {
      throw new SyntaxError('Invalid character in BigInt string');
    }

    acc = acc * radix + digit;
    i++;
  }

  // Handle negative
  if (negative) acc = -acc;

  // For small values, return inline
  if (Math.abs(acc) < 0x8000000000000) {
    return acc as bigint;
  }

  // For larger values, need to use digit representation
  // This is a simplified path - for very large strings we'd need proper arbitrary precision
  return __Porffor_bigint_fromNumber(acc);
};

export const __Porffor_bigint_toString = (x: number, radix: any): string|bytestring => {
  // todo: actually use bigint
  return __Number_prototype_toString(Math.trunc(__Porffor_bigint_toNumber(x)), radix);
};

// todo: hook up all funcs below to codegen
export const __Porffor_bigint_add = (a: number, b: number, sub: boolean): bigint => {
  if (Math.abs(a) < 0x8000000000000) {
    if (Math.abs(b) < 0x8000000000000) {
      if (sub) b = -b;
      return __Porffor_bigint_fromNumber(Math.trunc(a + b));
    }

    a = __Porffor_bigint_inlineToDigitForm(a);
  } else if (Math.abs(b) < 0x8000000000000) {
    b = __Porffor_bigint_inlineToDigitForm(b);
  }

  a -= 0x8000000000000;
  b -= 0x8000000000000;

  const aNegative: boolean = Porffor.wasm.i32.load8_u(a, 0, 0) != 0;
  const aLen: i32 = Porffor.wasm.i32.load16_u(a, 0, 2);

  let bNegative: boolean = Porffor.wasm.i32.load8_u(b, 0, 0) != 0;
  if (sub) bNegative = !bNegative;
  const bLen: i32 = Porffor.wasm.i32.load16_u(b, 0, 2);

  const maxLen: i32 = Math.max(aLen, bLen);
  const digits: i32[] = Porffor.malloc();

  // fast path: same sign
  let negative: boolean = false;
  let carry: i32 = 0;
  if (aNegative == bNegative) {
    negative = aNegative;

    for (let i: i32 = 0; i < maxLen; i++) {
      let aDigit: i32 = 0;
      const aOffset: i32 = aLen - i;
      if (aOffset > 0) aDigit = Porffor.wasm.i32.load(a + aOffset * 4, 0, 0);

      let bDigit: i32 = 0;
      const bOffset: i32 = bLen - i;
      if (bOffset > 0) bDigit = Porffor.wasm.i32.load(b + bOffset * 4, 0, 0);

      let sum: i32 = aDigit + bDigit + carry;
      if (sum >= 0x100000000) {
        sum -= 0x100000000;
        carry = 1;
      } else if (sum < 0) {
        sum += 0x100000000;
        carry = 1;
      } else {
        carry = 0;
      }

      digits.unshift(sum);
    }
  } else {
    let aLarger: i32 = 0;
    for (let i: i32 = 0; i < maxLen; i++) {
      let aDigit: i32 = 0;
      const aOffset: i32 = aLen - i;
      if (aOffset > 0) aDigit = Porffor.wasm.i32.load(a + aOffset * 4, 0, 0);

      let bDigit: i32 = 0;
      const bOffset: i32 = bLen - i;
      if (bOffset > 0) bDigit = Porffor.wasm.i32.load(b + bOffset * 4, 0, 0);

      let sum: i32 = carry;
      if (aNegative) sum -= aDigit;
        else sum += aDigit;
      if (bNegative) sum -= bDigit;
        else sum += bDigit;

      if (aDigit != bDigit) aLarger = aDigit > bDigit ? 1 : -1;

      if (sum >= 0x100000000) {
        sum -= 0x100000000;
        carry = 1;
      } else if (sum < 0) {
        sum += 0x100000000;
        carry = -1;
      } else {
        carry = 0;
      }

      digits.unshift(sum);
    }

    if (aLarger == 1) negative = aNegative;
      else if (aLarger == -1) negative = bNegative;
  }

  if (carry != 0) {
    digits.unshift(Math.abs(carry));
    if (carry < 0) negative = !negative;
  }

  return __Porffor_bigint_fromDigits(negative, digits);
};

export const __Porffor_bigint_sub = (a: i32, b: i32): bigint => {
  return __Porffor_bigint_add(a, b, true);
};

export const __Porffor_bigint_mul = (a: i32, b: i32): bigint => {
  // todo
};

export const __Porffor_bigint_div = (a: i32, b: i32): bigint => {
  // todo
};

export const __Porffor_bigint_rem = (a: i32, b: i32): bigint => {
  // todo
};

export const __Porffor_bigint_eq = (a: i32, b: i32): boolean => {
  // todo
};

export const __Porffor_bigint_ne = (a: i32, b: i32): boolean => {
  return !__Porffor_bigint_eq(a, b);
};

export const __Porffor_bigint_gt = (a: i32, b: i32): boolean => {
  // todo
};

export const __Porffor_bigint_ge = (a: i32, b: i32): boolean => {
  // todo
};

export const __Porffor_bigint_lt = (a: i32, b: i32): boolean => {
  return !__Porffor_bigint_ge(a, b);
};

export const __Porffor_bigint_le = (a: i32, b: i32): boolean => {
  return !__Porffor_bigint_gt(a, b);
};

// 7.1.13 ToBigInt (argument)
// https://tc39.es/ecma262/#sec-tobigint
export const __ecma262_ToBigInt = (argument: any): bigint => {
  // 1. Let prim be ? ToPrimitive(argument, number).
  const prim: any = ecma262.ToPrimitive.Number(argument);

  // 2. Return the value that prim corresponds to in Table 12.
  // Table 12: BigInt Conversions
  // Argument Type 	Result
  // BigInt 	Return prim.
  if (Porffor.type(prim) == Porffor.TYPES.bigint) return prim;

  // String
  //     1. Let n be StringToBigInt(prim).
  //     2. If n is undefined, throw a SyntaxError exception.
  //     3. Return n.
  if ((Porffor.type(prim) | 0b10000000) == Porffor.TYPES.bytestring) return __Porffor_bigint_fromString(prim);

  // Boolean 	Return 1n if prim is true and 0n if prim is false.
  if (Porffor.type(prim) == Porffor.TYPES.boolean) return prim ? 1n : 0n;

  // Number 	Throw a TypeError exception.
  // Symbol 	Throw a TypeError exception.
  // Undefined 	Throw a TypeError exception.
  // Null 	Throw a TypeError exception.
  throw new TypeError('Cannot convert to BigInt');
};

// 21.2.1.1 BigInt (value)
// https://tc39.es/ecma262/#sec-bigint-constructor-number-value
export const BigInt = (value: any): bigint => {
  // 1. If NewTarget is not undefined, throw a TypeError exception.
  // 2. Let prim be ? ToPrimitive(value, number).
  const prim: any = ecma262.ToPrimitive.Number(value);

  // 3. If prim is a Number, return ? NumberToBigInt(prim).
  if (Porffor.type(prim) == Porffor.TYPES.number) return __Porffor_bigint_fromNumber(prim);

  // 4. Otherwise, return ? ToBigInt(prim).
  return __ecma262_ToBigInt(prim);
};

export const __BigInt_prototype_toString = (_this: any, radix: any) => {
  if (Porffor.type(_this) != Porffor.TYPES.bigint) {
    throw new TypeError('BigInt.prototype.toString requires this to be a BigInt');
  }
  return __Porffor_bigint_toString(_this, radix);
};

export const __BigInt_prototype_toLocaleString = (_this: any) => {
  if (Porffor.type(_this) != Porffor.TYPES.bigint) {
    throw new TypeError('BigInt.prototype.toLocaleString requires this to be a BigInt');
  }
  return __Porffor_bigint_toString(_this, 10);
};

export const __BigInt_prototype_valueOf = (_this: any) => {
  // thisBigIntValue: If Type(value) is BigInt, return value.
  // Otherwise, throw a TypeError exception.
  if (Porffor.type(_this) != Porffor.TYPES.bigint) {
    throw new TypeError('BigInt.prototype.valueOf requires this to be a BigInt');
  }
  return _this;
};

// 21.2.2.1 BigInt.asIntN ( bits, bigint )
// https://tc39.es/ecma262/#sec-bigint.asintn
export const __BigInt_asIntN = (bits: any, bigint: any): bigint => {
  // 1. Set bits to ? ToIndex(bits).
  bits = ecma262.ToIndex(bits);

  // 2. Set bigint to ? ToBigInt(bigint).
  bigint = __ecma262_ToBigInt(bigint);

  // 3. Let mod be ℝ(bigint) modulo 2^bits.
  // 4. If mod ≥ 2^(bits-1), return ℤ(mod - 2^bits).
  // 5. Return ℤ(mod).

  // For small values, use number arithmetic
  const n: number = __Porffor_bigint_toNumber(bigint);
  if (bits == 0) return 0n;
  if (bits >= 53) {
    // For large bit counts, just return the original if it fits
    return bigint;
  }

  const mod2bits: number = 2 ** bits;
  const mod2bitsm1: number = 2 ** (bits - 1);

  // Calculate mod (always positive in mathematical sense)
  let mod: number = n % mod2bits;
  if (mod < 0) mod += mod2bits;

  // If mod >= 2^(bits-1), return mod - 2^bits (make it negative)
  if (mod >= mod2bitsm1) {
    return __Porffor_bigint_fromNumber(mod - mod2bits);
  }

  return __Porffor_bigint_fromNumber(mod);
};

// 21.2.2.2 BigInt.asUintN ( bits, bigint )
// https://tc39.es/ecma262/#sec-bigint.asuintn
export const __BigInt_asUintN = (bits: any, bigint: any): bigint => {
  // 1. Set bits to ? ToIndex(bits).
  bits = ecma262.ToIndex(bits);

  // 2. Set bigint to ? ToBigInt(bigint).
  bigint = __ecma262_ToBigInt(bigint);

  // 3. Return ℤ(ℝ(bigint) modulo 2^bits).

  // For small values, use number arithmetic
  const n: number = __Porffor_bigint_toNumber(bigint);
  if (bits == 0) return 0n;
  if (bits >= 53) {
    // For large bit counts with non-negative values, return as-is
    if (n >= 0) return bigint;
  }

  const mod2bits: number = 2 ** bits;

  // Calculate mod (always positive)
  let mod: number = n % mod2bits;
  if (mod < 0) mod += mod2bits;

  return __Porffor_bigint_fromNumber(mod);
};

