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

  // Strip leading zeros from tempDigits and check for inline optimization
  let firstNonZero: i32 = 0;
  for (let i: i32 = 0; i < len; i++) {
    if (tempDigits[i] != 0) {
      firstNonZero = i;
      break;
    }
  }
  const effectiveLen: i32 = len - firstNonZero;

  // Check if small enough to be inline (abs < 2^51)
  if (effectiveLen == 1) {
    const val: number = tempDigits[firstNonZero];
    if (val < 0x8000000000000) {
      return (negative ? -val : val) as bigint;
    }
  } else if (effectiveLen == 2) {
    const val: number = tempDigits[firstNonZero] * 0x100000000 + tempDigits[firstNonZero + 1];
    if (val < 0x8000000000000) {
      return (negative ? -val : val) as bigint;
    }
  }

  // use digits pointer as bigint pointer, as only used here
  let ptr: i32 = Porffor.wasm`local.get ${digits}`;

  Porffor.wasm.i32.store8(ptr, negative ? 1 : 0, 0, 0); // sign
  Porffor.wasm.i32.store16(ptr, effectiveLen, 0, 2); // digit count (excluding leading zeros)

  // Now write the non-zero digits from our temp copy
  for (let i: i32 = 0; i < effectiveLen; i++) {
    // Convert to signed i32 for storage - this preserves bit pattern
    let d: number = tempDigits[firstNonZero + i];
    // Convert unsigned (0 to 2^32-1) to signed (-2^31 to 2^31-1) for i32.store
    if (d >= 2147483648) d = d - 4294967296;
    Porffor.wasm.i32.store(ptr + i * 4, d, 0, 4);
  }

  return (ptr + 0x8000000000000) as bigint;
};

// store small (abs(n) < 2^51 (0x8000000000000)) values inline (no allocation)
// like a ~s52 (s53 exc 2^51+(0-2^32) for u32 as pointer) inside a f64
export const __Porffor_bigint_inlineToDigitForm = (n: number): number => {
  const negative: boolean = n < 0;
  const absN: number = Math.abs(n);

  // Check if value needs 2 digits (>= 2^32)
  if (absN >= 4294967296) {
    // Need 2 digits: high and low
    const ptr: i32 = Porffor.malloc(12); // 4 meta + 2 digits (8 bytes)
    Porffor.wasm.i32.store8(ptr, negative, 0, 0);
    Porffor.wasm.i32.store16(ptr, 2, 0, 2);

    // High digit: absN / 2^32
    let high: number = Math.trunc(absN / 4294967296);
    if (high >= 2147483648) high = high - 4294967296;
    Porffor.wasm.i32.store(ptr, high, 0, 4);

    // Low digit: absN % 2^32
    let low: number = absN % 4294967296;
    if (low >= 2147483648) low = low - 4294967296;
    Porffor.wasm.i32.store(ptr + 4, low, 0, 4);

    return ptr;
  }

  // Single digit (value < 2^32)
  const ptr: i32 = Porffor.malloc(8); // 4 meta + 1 digit (4 bytes)
  Porffor.wasm.i32.store8(ptr, negative, 0, 0);
  Porffor.wasm.i32.store16(ptr, 1, 0, 2);
  // Convert unsigned (0 to 2^32-1) to signed (-2^31 to 2^31-1) for i32.store
  // This is needed because i32.store uses signed truncation from f64
  let d: number = absN;
  if (d >= 2147483648) d = d - 4294967296;
  Porffor.wasm.i32.store(ptr, d, 0, 4);

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
  // Handle inline BigInts (small values that fit in f64)
  if (Math.abs(x) < 0x8000000000000) {
    return __Number_prototype_toString(x, radix);
  }

  // For memory-based BigInts, we need to convert without going through f64
  // to avoid precision loss for values > 2^53
  const ptr: i32 = x - 0x8000000000000;
  const negative: boolean = Porffor.wasm.i32.load8_u(ptr, 0, 0) != 0;
  const len: i32 = Porffor.wasm.i32.load16_u(ptr, 0, 2);

  // For now, only support radix 10 for large BigInts
  // Copy digits to a working array for division
  const digits: number[] = Porffor.malloc();
  for (let i: i32 = 0; i < len; i++) {
    const d: i32 = Porffor.wasm.i32.load(ptr + i * 4, 0, 4);
    // Convert signed i32 to unsigned
    const dUnsigned: number = d < 0 ? d + 4294967296 : d;
    digits[i] = dUnsigned;
  }
  digits.length = len;

  // Convert to decimal string by repeated division by 10
  let result: bytestring = '';
  let digitCount: i32 = len;

  while (digitCount > 0) {
    // Divide all digits by 10, keeping track of remainder
    let remainder: number = 0;
    let newDigitCount: i32 = 0;
    let leadingZero: boolean = true;

    for (let i: i32 = 0; i < digitCount; i++) {
      // Combine remainder from previous digit with current digit
      const current: number = remainder * 4294967296 + digits[i];
      const quotient: number = Math.trunc(current / 10);
      remainder = current - quotient * 10;

      if (quotient != 0 || !leadingZero) {
        digits[newDigitCount] = quotient;
        newDigitCount++;
        leadingZero = false;
      }
    }

    digitCount = newDigitCount;

    // Prepend the remainder digit to result
    const digit: bytestring = __Number_prototype_toString(remainder, 10);
    result = digit + result;
  }

  if (result.length == 0) result = '0';
  if (negative) result = '-' + result;

  return result;
};

// todo: hook up all funcs below to codegen
export const __Porffor_bigint_add = (a: number, b: number, sub: boolean): bigint => {
  if (Math.abs(a) < 0x8000000000000) {
    if (Math.abs(b) < 0x8000000000000) {
      if (sub) b = -b;
      return __Porffor_bigint_fromNumber(Math.trunc(a + b));
    }

    a = __Porffor_bigint_inlineToDigitForm(a) + 0x8000000000000;
  } else if (Math.abs(b) < 0x8000000000000) {
    b = __Porffor_bigint_inlineToDigitForm(b) + 0x8000000000000;
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
  let carry: number = 0;
  if (aNegative == bNegative) {
    negative = aNegative;

    for (let i: i32 = 0; i < maxLen; i++) {
      let aDigit: i32 = 0;
      const aOffset: i32 = aLen - i;
      if (aOffset > 0) aDigit = Porffor.wasm.i32.load(a + aOffset * 4, 0, 0);

      let bDigit: i32 = 0;
      const bOffset: i32 = bLen - i;
      if (bOffset > 0) bDigit = Porffor.wasm.i32.load(b + bOffset * 4, 0, 0);

      // Convert i32 digits to unsigned values and compute sum using f64 to avoid overflow
      const aUnsigned: number = aDigit < 0 ? aDigit + 0x100000000 : aDigit;
      const bUnsigned: number = bDigit < 0 ? bDigit + 0x100000000 : bDigit;
      let sum: number = aUnsigned + bUnsigned + carry;
      if (sum >= 0x100000000) {
        sum -= 0x100000000;
        carry = 1;
      } else {
        carry = 0;
      }

      digits.unshift(sum);
    }
  } else {
    // Different signs: need to subtract magnitudes
    // First, compare absolute magnitudes to determine which is larger
    let cmp: i32 = 0; // 1 = |a| > |b|, -1 = |a| < |b|, 0 = equal
    if (aLen != bLen) {
      cmp = aLen > bLen ? 1 : -1;
    } else {
      // Same length, compare digit by digit from most significant
      // Digits are stored at ptr+4, ptr+8, etc. (4-byte header)
      for (let i: i32 = 1; i <= aLen; i++) {
        const aDigit: i32 = Porffor.wasm.i32.load(a + i * 4, 0, 0);
        const bDigit: i32 = Porffor.wasm.i32.load(b + i * 4, 0, 0);
        // Convert to unsigned for comparison
        const aU: number = aDigit < 0 ? aDigit + 0x100000000 : aDigit;
        const bU: number = bDigit < 0 ? bDigit + 0x100000000 : bDigit;
        if (aU != bU) {
          cmp = aU > bU ? 1 : -1;
          break;
        }
      }
    }

    if (cmp == 0) {
      // Equal magnitudes, result is 0
      return 0 as bigint;
    }

    // Subtract smaller from larger
    let larger: i32, largerLen: i32, smaller: i32, smallerLen: i32;
    if (cmp > 0) {
      larger = a; largerLen = aLen;
      smaller = b; smallerLen = bLen;
      negative = aNegative;
    } else {
      larger = b; largerLen = bLen;
      smaller = a; smallerLen = aLen;
      negative = bNegative;
    }

    // Subtract: larger - smaller (from least significant digit)
    // Use same offset pattern as same-sign branch: ptr + offset * 4 where offset goes from len down to 1
    let borrow: i32 = 0;
    for (let i: i32 = 0; i < largerLen; i++) {
      const largerOffset: i32 = largerLen - i;
      const smallerOffset: i32 = smallerLen - i;

      const largerDigit: i32 = Porffor.wasm.i32.load(larger + largerOffset * 4, 0, 0);
      const largerU: number = largerDigit < 0 ? largerDigit + 0x100000000 : largerDigit;

      let smallerU: number = 0;
      if (smallerOffset > 0) {
        const smallerDigit: i32 = Porffor.wasm.i32.load(smaller + smallerOffset * 4, 0, 0);
        smallerU = smallerDigit < 0 ? smallerDigit + 0x100000000 : smallerDigit;
      }

      let diff: number = largerU - smallerU - borrow;
      if (diff < 0) {
        diff += 0x100000000;
        borrow = 1;
      } else {
        borrow = 0;
      }

      digits.unshift(diff);
    }
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

  const bigintNum: number = bigint as number;

  // For inline BigInts (abs < 2^51), use number arithmetic
  if (Math.abs(bigintNum) < 0x8000000000000) {
    const n: number = bigintNum;

    // For bits <= 51, we can use direct number arithmetic
    if (bits <= 51) {
      const mod2bits: number = 2 ** bits;
      const mod2bitsm1: number = 2 ** (bits - 1);

      let mod: number = n % mod2bits;
      if (mod < 0) mod += mod2bits;

      if (mod >= mod2bitsm1) {
        return (mod - mod2bits) as bigint;
      }
      return mod as bigint;
    }

    // For bits > 51, result is just the original value (can't overflow)
    return bigint;
  }

  // Memory-based BigInt - extract digits directly
  const ptr: i32 = bigintNum - 0x8000000000000;
  const negative: boolean = Porffor.wasm.i32.load8_u(ptr, 0, 0) != 0;
  const len: i32 = Porffor.wasm.i32.load16_u(ptr, 0, 2);

  // Calculate how many 32-bit digits we need
  const digitsNeeded: i32 = Math.ceil(bits / 32);
  const extraBits: i32 = bits % 32;

  // Extract the lowest digitsNeeded digits (or all if len < digitsNeeded)
  const actualDigits: i32 = len < digitsNeeded ? len : digitsNeeded;

  // Build the result in a temporary array
  const tempDigits: number[] = Porffor.malloc();
  for (let i: i32 = 0; i < digitsNeeded; i++) {
    const srcIdx: i32 = len - actualDigits + i;
    if (srcIdx >= 0 && i >= digitsNeeded - actualDigits) {
      const digit: i32 = Porffor.wasm.i32.load(ptr + srcIdx * 4, 0, 4);
      const digitU: number = digit < 0 ? digit + 4294967296 : digit;
      tempDigits.push(digitU);
    } else {
      tempDigits.push(0);
    }
  }

  // Mask out extra bits from the most significant digit if needed
  if (extraBits != 0 && tempDigits.length > 0) {
    const mask: number = (1 << extraBits) - 1;
    tempDigits[0] = tempDigits[0] & mask;
  }

  // For negative numbers, compute two's complement
  if (negative) {
    // Two's complement: invert all bits and add 1
    let carry: i32 = 1;
    for (let i: i32 = tempDigits.length - 1; i >= 0; i--) {
      // Invert
      let inverted: number = 4294967295 - tempDigits[i];
      // Add carry
      inverted = inverted + carry;
      if (inverted >= 4294967296) {
        inverted = inverted - 4294967296;
        carry = 1;
      } else {
        carry = 0;
      }
      tempDigits[i] = inverted;
    }

    // Mask again after two's complement
    if (extraBits != 0 && tempDigits.length > 0) {
      const mask: number = (1 << extraBits) - 1;
      tempDigits[0] = tempDigits[0] & mask;
    }
  }

  // Check if the sign bit (bit bits-1) is set
  const signBitDigit: i32 = Math.floor((bits - 1) / 32);
  const signBitPos: i32 = (bits - 1) % 32;
  let isNegativeResult: boolean = false;

  if (signBitDigit < tempDigits.length) {
    const digitIdx: i32 = tempDigits.length - 1 - signBitDigit;
    if (digitIdx >= 0) {
      const testDigit: number = tempDigits[digitIdx];
      if ((testDigit & (1 << signBitPos)) != 0) {
        isNegativeResult = true;
      }
    }
  }

  if (isNegativeResult) {
    // Subtract 2^bits by computing two's complement of the result
    let carry: i32 = 1;
    for (let i: i32 = tempDigits.length - 1; i >= 0; i--) {
      let inverted: number = 4294967295 - tempDigits[i];
      inverted = inverted + carry;
      if (inverted >= 4294967296) {
        inverted = inverted - 4294967296;
        carry = 1;
      } else {
        carry = 0;
      }
      tempDigits[i] = inverted;
    }

    // Mask again
    if (extraBits != 0 && tempDigits.length > 0) {
      const mask: number = (1 << extraBits) - 1;
      tempDigits[0] = tempDigits[0] & mask;
    }

    return __Porffor_bigint_fromDigits(true, tempDigits);
  }

  return __Porffor_bigint_fromDigits(false, tempDigits);
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

  const bigintNum: number = bigint as number;

  // For inline BigInts (abs < 2^51), use number arithmetic
  if (Math.abs(bigintNum) < 0x8000000000000) {
    const n: number = bigintNum;

    // For bits <= 51, we can use direct number arithmetic
    if (bits <= 51) {
      const mod2bits: number = 2 ** bits;

      let mod: number = n % mod2bits;
      if (mod < 0) mod += mod2bits;

      return mod as bigint;
    }

    // For bits > 51, result is just the original value for positive, or needs adjustment for negative
    if (n >= 0) return bigint;

    // For negative inline values with bits > 51, compute 2^bits + n
    // This would require larger representation, handled below
  }

  // Memory-based BigInt - extract digits directly
  const ptr: i32 = bigintNum - 0x8000000000000;
  const negative: boolean = Porffor.wasm.i32.load8_u(ptr, 0, 0) != 0;
  const len: i32 = Porffor.wasm.i32.load16_u(ptr, 0, 2);

  // Calculate how many 32-bit digits we need
  const digitsNeeded: i32 = Math.ceil(bits / 32);
  const extraBits: i32 = bits % 32;

  // Extract the lowest digitsNeeded digits (or all if len < digitsNeeded)
  const actualDigits: i32 = len < digitsNeeded ? len : digitsNeeded;

  // Build the result in a temporary array
  const tempDigits: number[] = Porffor.malloc();
  for (let i: i32 = 0; i < digitsNeeded; i++) {
    const srcIdx: i32 = len - actualDigits + i;
    if (srcIdx >= 0 && i >= digitsNeeded - actualDigits) {
      const digit: i32 = Porffor.wasm.i32.load(ptr + srcIdx * 4, 0, 4);
      const digitU: number = digit < 0 ? digit + 4294967296 : digit;
      tempDigits.push(digitU);
    } else {
      tempDigits.push(0);
    }
  }

  // Mask out extra bits from the most significant digit if needed
  if (extraBits != 0 && tempDigits.length > 0) {
    const mask: number = (1 << extraBits) - 1;
    tempDigits[0] = tempDigits[0] & mask;
  }

  // For negative numbers, compute two's complement
  if (negative) {
    // Two's complement: invert all bits and add 1
    let carry: i32 = 1;
    for (let i: i32 = tempDigits.length - 1; i >= 0; i--) {
      // Invert
      let inverted: number = 4294967295 - tempDigits[i];
      // Add carry
      inverted = inverted + carry;
      if (inverted >= 4294967296) {
        inverted = inverted - 4294967296;
        carry = 1;
      } else {
        carry = 0;
      }
      tempDigits[i] = inverted;
    }

    // Mask again after two's complement
    if (extraBits != 0 && tempDigits.length > 0) {
      const mask: number = (1 << extraBits) - 1;
      tempDigits[0] = tempDigits[0] & mask;
    }
  }

  // asUintN always returns a non-negative result
  return __Porffor_bigint_fromDigits(false, tempDigits);
};

