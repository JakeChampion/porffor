import type {} from './porffor.d.ts';

// digits is an array of u32s as digits in base 2^32
// Use number[] to avoid i32 clamping of values > 2^31-1
export const __Porffor_bigint_fromDigits = (negative: boolean, digits: number[]): bigint => {
  const len: i32 = digits.length;
  if (len > 16383) throw new RangeError('Maximum BigInt size exceeded'); // (65536 - 4) / 4

  // Read all digits FIRST before overwriting the array header
  // Use number type to avoid i32 clamping of values > 2^31-1
  let allZero: boolean = true;
  const tempDigits: number[] = Porffor.malloc();
  for (let i: i32 = 0; i < len; i++) {
    // Read as number to preserve full 32-bit unsigned value
    const d: number = digits[i];
    tempDigits[i] = d;
    if (d != 0) allZero = false;
  }

  if (allZero) {
    return 0 as bigint;
  }

  // use digits pointer as bigint pointer, as only used here
  let ptr: i32 = Porffor.wasm`local.get ${digits}`;

  Porffor.wasm.i32.store8(ptr, negative ? 1 : 0, 0, 0); // sign
  Porffor.wasm.i32.store16(ptr, len, 0, 2); // digit count

  // Now write the digits from our temp copy
  for (let i: i32 = 0; i < len; i++) {
    // Convert to signed i32 for storage - this preserves bit pattern
    let d: number = tempDigits[i];
    // Convert unsigned (0 to 2^32-1) to signed (-2^31 to 2^31-1) for i32.store
    if (d >= 2147483648) d = d - 4294967296;
    Porffor.wasm.i32.store(ptr + i * 4, d, 0, 4);
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

// Negate a BigInt value (creates a new BigInt, does not mutate)
export const __Porffor_bigint_negate = (x: number): bigint => {
  // For inline (small) values, just negate
  if (Math.abs(x) < 0x8000000000000) {
    return (-x) as bigint;
  }

  // For memory-based BigInts, copy and flip the sign bit
  const srcPtr: i32 = x - 0x8000000000000;
  const currentSign: i32 = Porffor.wasm.i32.load8_u(srcPtr, 0, 0);
  const len: i32 = Porffor.wasm.i32.load16_u(srcPtr, 0, 2);

  // Allocate new memory: 4 bytes header + len*4 bytes for digits
  const dstPtr: i32 = Porffor.malloc(4 + len * 4);

  // Copy and flip sign
  Porffor.wasm.i32.store8(dstPtr, currentSign == 0 ? 1 : 0, 0, 0);
  Porffor.wasm.i32.store16(dstPtr, len, 0, 2);

  // Copy digits
  for (let i: i32 = 0; i < len; i++) {
    const digit: i32 = Porffor.wasm.i32.load(srcPtr + i * 4, 0, 4);
    Porffor.wasm.i32.store(dstPtr + i * 4, digit, 0, 4);
  }

  return (dstPtr + 0x8000000000000) as bigint;
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
    // Convert signed i32 to unsigned
    const dUnsigned: number = d < 0 ? d + 4294967296 : d;
    out = out * 0x100000000 + dUnsigned;
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
      // Per spec: negative hex literals are not allowed
      if (negative) throw new SyntaxError('Invalid BigInt string');
      radix = 16;
      offset += 2;
    } else if (Porffor.fastOr(prefixChar == 98, prefixChar == 66)) { // 'b' or 'B'
      // Per spec: negative binary literals are not allowed
      if (negative) throw new SyntaxError('Invalid BigInt string');
      radix = 2;
      offset += 2;
    } else if (Porffor.fastOr(prefixChar == 111, prefixChar == 79)) { // 'o' or 'O'
      // Per spec: negative octal literals are not allowed
      if (negative) throw new SyntaxError('Invalid BigInt string');
      radix = 8;
      offset += 2;
    }
  }

  if (offset >= end) throw new SyntaxError('Cannot convert empty string to BigInt');

  // Parse digits into base 2^32 representation
  // Start with a single digit of 0
  // Use number[] to avoid i32 clamping of values > 2^31-1
  const digits: number[] = Porffor.malloc();
  digits[0] = 0;
  let digitCount: i32 = 1;

  let i: i32 = offset;
  while (i < end) {
    const char: i32 = n.charCodeAt(i);
    let inputDigit: i32 = -1;

    if (char >= 48 && char <= 57) { // '0'-'9'
      inputDigit = char - 48;
    } else if (char >= 65 && char <= 90) { // 'A'-'Z'
      inputDigit = char - 65 + 10;
    } else if (char >= 97 && char <= 122) { // 'a'-'z'
      inputDigit = char - 97 + 10;
    }

    if (Porffor.fastOr(inputDigit < 0, inputDigit >= radix)) {
      throw new SyntaxError('Invalid character in BigInt string');
    }

    // Multiply existing digits by radix and add inputDigit
    // Use i64 for intermediate calculations to avoid overflow
    let carry: number = inputDigit;
    for (let j: i32 = digitCount - 1; j >= 0; j--) {
      const product: number = digits[j] * radix + carry;
      digits[j] = product % 0x100000000;
      carry = Math.trunc(product / 0x100000000);
    }

    // If there's remaining carry, add a new most significant digit
    if (carry > 0) {
      // Shift all digits right and add new digit at front
      for (let j: i32 = digitCount; j > 0; j--) {
        digits[j] = digits[j - 1];
      }
      digits[0] = carry;
      digitCount++;
    }

    i++;
  }

  // Check if result is zero
  let allZero: boolean = true;
  for (let j: i32 = 0; j < digitCount; j++) {
    if (digits[j] != 0) {
      allZero = false;
      break;
    }
  }
  if (allZero) return 0n;

  // Remove leading zeros
  while (digitCount > 1 && digits[0] == 0) {
    for (let j: i32 = 0; j < digitCount - 1; j++) {
      digits[j] = digits[j + 1];
    }
    digitCount--;
  }

  // Check if small enough to be inline
  if (digitCount == 1 && digits[0] < 0x8000000000000) {
    const val: number = negative ? -digits[0] : digits[0];
    return val as bigint;
  }
  if (digitCount == 2) {
    const val: number = digits[0] * 0x100000000 + digits[1];
    if (val < 0x8000000000000) {
      return (negative ? -val : val) as bigint;
    }
  }

  // Build memory-based BigInt
  digits.length = digitCount;
  return __Porffor_bigint_fromDigits(negative, digits);
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

export const __Porffor_bigint_eq = (a: number, b: number): boolean => {
  // Both inline (small) - direct comparison
  if (Math.abs(a) < 0x8000000000000 && Math.abs(b) < 0x8000000000000) {
    return a == b;
  }

  // One inline, one memory-based - convert inline to memory form for comparison
  if (Math.abs(a) < 0x8000000000000) {
    a = __Porffor_bigint_inlineToDigitForm(a) + 0x8000000000000;
  }
  if (Math.abs(b) < 0x8000000000000) {
    b = __Porffor_bigint_inlineToDigitForm(b) + 0x8000000000000;
  }

  // Both memory-based now
  const ptrA: i32 = a - 0x8000000000000;
  const ptrB: i32 = b - 0x8000000000000;

  // Compare signs
  const signA: i32 = Porffor.wasm.i32.load8_u(ptrA, 0, 0);
  const signB: i32 = Porffor.wasm.i32.load8_u(ptrB, 0, 0);
  if (signA != signB) return false;

  // Compare lengths
  const lenA: i32 = Porffor.wasm.i32.load16_u(ptrA, 0, 2);
  const lenB: i32 = Porffor.wasm.i32.load16_u(ptrB, 0, 2);
  if (lenA != lenB) return false;

  // Compare all digits
  for (let i: i32 = 0; i < lenA; i++) {
    const digitA: i32 = Porffor.wasm.i32.load(ptrA + i * 4, 0, 4);
    const digitB: i32 = Porffor.wasm.i32.load(ptrB + i * 4, 0, 4);
    if (digitA != digitB) return false;
  }

  return true;
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

  if (bits == 0) return 0n;

  // For bits > 32, use number-based approach (may lose precision for very large BigInts)
  // For bits <= 32, we can extract the lowest digit directly for precise results
  const bigintNum: number = bigint as number;

  if (bits > 32 || Math.abs(bigintNum) < 0x8000000000000) {
    // Use number arithmetic for small BigInts or large bit counts
    const n: number = __Porffor_bigint_toNumber(bigint);

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
  }

  // Memory-based BigInt with bits <= 32 - extract the lowest digit directly
  const ptr: i32 = bigintNum - 0x8000000000000;
  const negative: boolean = Porffor.wasm.i32.load8_u(ptr, 0, 0) != 0;
  const len: i32 = Porffor.wasm.i32.load16_u(ptr, 0, 2);

  // Get lowest digit (last digit in big-endian storage)
  const lowestDigit: i32 = Porffor.wasm.i32.load(ptr + (len - 1) * 4, 0, 4);
  // Convert signed i32 to unsigned number
  let lowBits: number = lowestDigit < 0 ? lowestDigit + 4294967296 : lowestDigit;

  const mod2bits: number = 2 ** bits;
  const mod2bitsm1: number = 2 ** (bits - 1);

  let mod: number;
  if (negative) {
    // For negative numbers, compute two's complement
    // -x mod 2^bits = 2^bits - (x mod 2^bits), unless x mod 2^bits is 0
    const posMod: number = lowBits % mod2bits;
    if (posMod == 0) {
      mod = 0;
    } else {
      mod = mod2bits - posMod;
    }
  } else {
    mod = lowBits % mod2bits;
  }

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

  if (bits == 0) return 0n;

  // For bits > 32, use number-based approach (may lose precision for very large BigInts)
  // For bits <= 32, we can extract the lowest digit directly for precise results
  const bigintNum: number = bigint as number;

  if (bits > 32 || Math.abs(bigintNum) < 0x8000000000000) {
    // Use number arithmetic for small BigInts or large bit counts
    const n: number = __Porffor_bigint_toNumber(bigint);

    const mod2bits: number = 2 ** bits;

    // Calculate mod (always positive)
    let mod: number = n % mod2bits;
    if (mod < 0) mod += mod2bits;

    return __Porffor_bigint_fromNumber(mod);
  }

  // Memory-based BigInt with bits <= 32 - extract the lowest digit directly
  const ptr: i32 = bigintNum - 0x8000000000000;
  const negative: boolean = Porffor.wasm.i32.load8_u(ptr, 0, 0) != 0;
  const len: i32 = Porffor.wasm.i32.load16_u(ptr, 0, 2);

  // Get lowest digit (last digit in big-endian storage)
  const lowestDigit: i32 = Porffor.wasm.i32.load(ptr + (len - 1) * 4, 0, 4);
  // Convert signed i32 to unsigned number
  let lowBits: number = lowestDigit < 0 ? lowestDigit + 4294967296 : lowestDigit;

  const mod2bits: number = 2 ** bits;

  let mod: number;
  if (negative) {
    // For negative numbers, compute two's complement
    // -x mod 2^bits = 2^bits - (x mod 2^bits), unless x mod 2^bits is 0
    const posMod: number = lowBits % mod2bits;
    if (posMod == 0) {
      mod = 0;
    } else {
      mod = mod2bits - posMod;
    }
  } else {
    mod = lowBits % mod2bits;
  }

  return __Porffor_bigint_fromNumber(mod);
};

