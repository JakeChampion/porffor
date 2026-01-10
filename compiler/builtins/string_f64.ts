import type {} from './porffor.d.ts';

// Relational string comparison: returns -1 if a < b, 0 if a == b, 1 if a > b
export const __Porffor_strcmp_rel = (a: any, b: any): number => {
  // Convert non-strings to strings
  if ((Porffor.type(a) | 0b10000000) != Porffor.TYPES.bytestring) {
    a = ecma262.ToString(a);
  }
  if ((Porffor.type(b) | 0b10000000) != Porffor.TYPES.bytestring) {
    b = ecma262.ToString(b);
  }

  const aLen: i32 = a.length;
  const bLen: i32 = b.length;
  const minLen: i32 = aLen < bLen ? aLen : bLen;

  let aPtr: i32 = Porffor.wasm`local.get ${a}`;
  let bPtr: i32 = Porffor.wasm`local.get ${b}`;

  const aIsBytestring: boolean = Porffor.type(a) == Porffor.TYPES.bytestring;
  const bIsBytestring: boolean = Porffor.type(b) == Porffor.TYPES.bytestring;

  // Compare character by character using direct memory access
  for (let i: i32 = 0; i < minLen; i++) {
    let ca: i32;
    let cb: i32;

    if (aIsBytestring) {
      ca = Porffor.wasm.i32.load8_u(aPtr + i, 0, 4);
    } else {
      ca = Porffor.wasm.i32.load16_u(aPtr + i * 2, 0, 4);
    }

    if (bIsBytestring) {
      cb = Porffor.wasm.i32.load8_u(bPtr + i, 0, 4);
    } else {
      cb = Porffor.wasm.i32.load16_u(bPtr + i * 2, 0, 4);
    }

    if (ca < cb) return -1;
    if (ca > cb) return 1;
  }

  // All compared characters are equal, compare by length
  if (aLen < bLen) return -1;
  if (aLen > bLen) return 1;
  return 0;
};

export const __Porffor_compareStrings = (a: any, b: any): boolean => {
  if ((Porffor.type(a) | 0b10000000) != Porffor.TYPES.bytestring) {
    // a is not string or bytestring
    // check if it is bad type or value
    if (Porffor.fastOr(
      a == null,

      Porffor.type(a) == Porffor.TYPES.symbol,
      Porffor.type(a) == Porffor.TYPES.boolean
    )) return false;

    a = ecma262.ToString(a);
  }

  if ((Porffor.type(b) | 0b10000000) != Porffor.TYPES.bytestring) {
    // b is not string or bytestring
    // check if it is bad type or value
    if (Porffor.fastOr(
      b == null,

      Porffor.type(b) == Porffor.TYPES.symbol,
      Porffor.type(b) == Porffor.TYPES.boolean
    )) return false;

    b = ecma262.ToString(b);
  }

  return Porffor.strcmp(a, b);
};

export const __Porffor_concatStrings = (a: any, b: any): any => {
  if ((Porffor.type(a) | 0b10000000) != Porffor.TYPES.bytestring) {
    // a is not string or bytestring
    a = ecma262.ToString(a);
  }

  if ((Porffor.type(b) | 0b10000000) != Porffor.TYPES.bytestring) {
    // b is not string or bytestring
    b = ecma262.ToString(b);
  }

  return Porffor.strcat(a, b);
};


// 22.1.1.1 String (value)
// https://tc39.es/ecma262/#sec-string-constructor-string-value
export const String = function (...args: any[]): string|bytestring|StringObject {
  let s: bytestring|string = '';

  // 1. If value is not present, then
  // a. Let s be the empty String.
  // s is already empty

  // 2. Else,
  if (args.length > 0) {
    const value: any = args[0];

    // a. If NewTarget is undefined and value is a Symbol, return SymbolDescriptiveString(value).
    if (!new.target && Porffor.type(value) == Porffor.TYPES.symbol) return __Symbol_prototype_toString(value);

    // b. Let s be ? ToString(value).
    s = ecma262.ToString(value);
  }

  // 3. If NewTarget is undefined, return s.
  if (!new.target) return s;

  // 4. Return StringCreate(s, ? GetPrototypeFromConstructor(NewTarget, "%String.prototype%")).

  // force bytestrings to strings
  if (Porffor.type(s) == Porffor.TYPES.bytestring) s = Porffor.bytestringToString(s);

  return s as StringObject;
};

export const __String_fromCharCode = (...codes: any[]): bytestring|string => {
  let out: string = Porffor.malloc();

  const len: i32 = codes.length;
  out.length = len;

  let bytestringable: boolean = true;
  for (let i: i32 = 0; i < len; i++) {
    // ToUint16: NaN, +0, -0, +Infinity, -Infinity all become 0
    const n: number = ecma262.ToNumber(codes[i]);
    let v: i32;
    if (Number.isNaN(n) || !Number.isFinite(n)) {
      v = 0;
    } else {
      // ToUint16: use modulo to handle values > 2^31 correctly
      v = Math.trunc(n) % 65536;
      if (v < 0) v += 65536;
    }
    if (v > 0x7F) bytestringable = false;

    Porffor.wasm.i32.store16(Porffor.wasm`local.get ${out}` + i * 2, v, 0, 4);
  }

  if (bytestringable) {
    let out2: bytestring = Porffor.wasm`local.get ${out}`;
    for (let i: i32 = 0; i < len; i++) {
      Porffor.wasm.i32.store8(
        Porffor.wasm`local.get ${out}` + i,
        Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${out}` + i * 2, 0, 4),
        0, 4);
    }

    return out2;
  }

  return out;
};

export const __String_fromCodePoint = (...codePoints: any[]): string => {
  let out: string = Porffor.malloc();

  const len: i32 = codePoints.length;
  let outLength: i32 = 0;

  for (let i: i32 = 0; i < len; i++) {
    const codepoint: number = ecma262.ToNumber(codePoints[i]);

    if (codepoint != (codepoint | 0)) {
      throw new RangeError('Invalid code point');
    }

    // Check if code point is valid (0 to 0x10FFFF)
    if (Porffor.fastOr(codepoint < 0, codepoint > 0x10FFFF)) {
      throw new RangeError('Invalid code point');
    }

    if (codepoint <= 0xFFFF) {
      // BMP code point - single 16-bit unit
      outLength++;
    } else {
      // Supplementary code point - surrogate pair (2 units)
      outLength += 2;
    }
  }

  out.length = outLength;
  let outIndex: i32 = 0;

  for (let i: i32 = 0; i < len; i++) {
    const codepoint: number = ecma262.ToNumber(codePoints[i]);

    if (codepoint <= 0xFFFF) {
      // BMP code point
      Porffor.wasm.i32.store16(Porffor.wasm`local.get ${out}` + outIndex * 2, codepoint, 0, 4);
      outIndex++;
    } else {
      // Supplementary code point - encode as surrogate pair
      const cpMinusBase: i32 = codepoint - 0x10000;
      const highSurrogate: i32 = 0xD800 + (cpMinusBase >> 10);
      const lowSurrogate: i32 = 0xDC00 + (cpMinusBase & 0x3FF);

      Porffor.wasm.i32.store16(Porffor.wasm`local.get ${out}` + outIndex * 2, highSurrogate, 0, 4);
      Porffor.wasm.i32.store16(Porffor.wasm`local.get ${out}` + outIndex * 2, lowSurrogate, 0, 6);
      outIndex += 2;
    }
  }

  return out;
};

// in f64 file as returns NaN which returns 0 in i32
export const __String_prototype_charCodeAt = (_this: string, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (Porffor.fastOr(index < 0, index >= len)) return NaN;

  return Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${_this}` + index * 2, 0, 4);
};

export const __ByteString_prototype_charCodeAt = (_this: bytestring, index: any) => {
  index = ecma262.ToIntegerOrInfinity(index);

  const len: i32 = _this.length;

  if (Porffor.fastOr(index < 0, index >= len)) return NaN;

  return Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${_this}` + index, 0, 4);
};

// in f64 file as needs to check for Infinity which is lost when truncated to i32
export const __String_prototype_repeat = (_this: string, cnt: any) => {
  // 5. Let n be ? ToIntegerOrInfinity(count).
  const n: number = ecma262.ToIntegerOrInfinity(cnt);
  // 6. If n < 0, throw a RangeError exception.
  // 7. If n is +∞, throw a RangeError exception.
  if (n < 0 || !Number.isFinite(n)) throw new RangeError('Invalid count value');
  // Now safe to use as i32
  const count: i32 = n;
  // 8. If n is 0, return the empty String.
  // 9. (combined) If S is the empty String, return the empty String.
  const thisLen: i32 = _this.length * 2;
  if (thisLen == 0 || count == 0) return '';

  let out: string = Porffor.malloc();

  for (let i: i32 = 0; i < count; i++) {
    Porffor.wasm`
;; dst = out + 4 + i * thisLen
local.get ${out}
i32.trunc_sat_f64_s
i32.const 4
i32.add
local.get ${i}
i32.trunc_sat_f64_s
local.get ${thisLen}
i32.trunc_sat_f64_s
i32.mul
i32.add

;; src = this + 4
local.get ${_this}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; size = thisLen
local.get ${thisLen}
i32.trunc_sat_f64_s

memory.copy 0 0`;
  }

  Porffor.wasm.i32.store(out, thisLen * count, 0, 0);
  return out;
};

// in f64 file as needs to check for Infinity which is lost when truncated to i32
export const __ByteString_prototype_repeat = (_this: bytestring, cnt: any) => {
  // 5. Let n be ? ToIntegerOrInfinity(count).
  const n: number = ecma262.ToIntegerOrInfinity(cnt);
  // 6. If n < 0, throw a RangeError exception.
  // 7. If n is +∞, throw a RangeError exception.
  if (n < 0 || !Number.isFinite(n)) throw new RangeError('Invalid count value');
  // Now safe to use as i32
  const count: i32 = n;
  // 8. If n is 0, return the empty String.
  // 9. (combined) If S is the empty String, return the empty String.
  const thisLen: i32 = _this.length;
  if (thisLen == 0 || count == 0) return '';

  let out: bytestring = Porffor.malloc();

  for (let i: i32 = 0; i < count; i++) {
    Porffor.wasm`
;; dst = out + 4 + i * thisLen
local.get ${out}
i32.trunc_sat_f64_s
i32.const 4
i32.add
local.get ${i}
i32.trunc_sat_f64_s
local.get ${thisLen}
i32.trunc_sat_f64_s
i32.mul
i32.add

;; src = this + 4
local.get ${_this}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; size = thisLen
local.get ${thisLen}
i32.trunc_sat_f64_s

memory.copy 0 0`;
  }

  Porffor.wasm.i32.store(out, thisLen * count, 0, 0);
  return out;
};

export const __String_prototype_split = (_this: string, separator: any, limit: any) => {
  const out: any[] = Porffor.malloc();

  // ToUint32(undefined) -> use max, ToUint32(negative) -> large positive
  if (Porffor.type(limit) == Porffor.TYPES.undefined) limit = Number.MAX_SAFE_INTEGER;
  if (limit < 0) limit = Number.MAX_SAFE_INTEGER;

  // ToUint32(0) = 0, ToUint32(NaN) = 0, ToUint32(2^32 * n) = 0
  if (limit == 0 || limit != limit || limit % 4294967296 == 0) {
    out.length = 0;
    return out;
  }

  if (Porffor.type(separator) == Porffor.TYPES.undefined) {
    out[0] = _this;
    out.length = 1;
    return out;
  }

  separator = ecma262.ToString(separator);

  const thisLen: i32 = _this.length;
  const sepLen: i32 = separator.length;

  if (sepLen == 0) {
    for (let i: i32 = 0; i < thisLen && i < limit; i++) {
      out[i] = _this[i];
    }
    out.length = thisLen < limit ? thisLen : limit;
    return out;
  }

  let outLen: i32 = 0;
  let start: i32 = 0;

  if (sepLen == 1) {
    // fast path: single char separator
    const sepChar: i32 = separator.charCodeAt(0);
    for (let i: i32 = 0; i < thisLen; i++) {
      if (_this.charCodeAt(i) == sepChar) {
        if (outLen >= limit) {
          out.length = outLen;
          return out;
        }
        out[outLen++] = _this.substring(start, i);
        start = i + 1;
      }
    }
  } else {
    let sepInd: i32 = 0;
    for (let i: i32 = 0; i < thisLen; i++) {
      if (_this.charCodeAt(i) == separator.charCodeAt(sepInd)) {
        if (++sepInd == sepLen) {
          if (outLen >= limit) {
            out.length = outLen;
            return out;
          }
          out[outLen++] = _this.substring(start, i - sepLen + 1);
          start = i + 1;
          sepInd = 0;
        }
      } else {
        sepInd = 0;
      }
    }
  }

  if (outLen < limit) {
    out[outLen++] = _this.substring(start);
  }

  out.length = outLen;
  return out;
};

export const __ByteString_prototype_split = (_this: bytestring, separator: any, limit: any) => {
  const out: any[] = Porffor.malloc();

  // ToUint32(undefined) -> use max, ToUint32(negative) -> large positive
  if (Porffor.type(limit) == Porffor.TYPES.undefined) limit = Number.MAX_SAFE_INTEGER;
  if (limit < 0) limit = Number.MAX_SAFE_INTEGER;

  // ToUint32(0) = 0, ToUint32(NaN) = 0, ToUint32(2^32 * n) = 0
  if (limit == 0 || limit != limit || limit % 4294967296 == 0) {
    out.length = 0;
    return out;
  }

  if (Porffor.type(separator) == Porffor.TYPES.undefined) {
    out[0] = _this;
    out.length = 1;
    return out;
  }

  separator = ecma262.ToString(separator);

  const thisLen: i32 = _this.length;
  const sepLen: i32 = separator.length;

  if (sepLen == 0) {
    for (let i: i32 = 0; i < thisLen && i < limit; i++) {
      out[i] = _this[i];
    }
    out.length = thisLen < limit ? thisLen : limit;
    return out;
  }

  let outLen: i32 = 0;
  let start: i32 = 0;

  if (sepLen == 1) {
    // fast path: single char separator
    const sepChar: i32 = separator.charCodeAt(0);
    for (let i: i32 = 0; i < thisLen; i++) {
      if (_this.charCodeAt(i) == sepChar) {
        if (outLen >= limit) {
          out.length = outLen;
          return out;
        }
        out[outLen++] = _this.substring(start, i);
        start = i + 1;
      }
    }
  } else {
    let sepInd: i32 = 0;
    for (let i: i32 = 0; i < thisLen; i++) {
      if (_this.charCodeAt(i) == separator.charCodeAt(sepInd)) {
        if (++sepInd == sepLen) {
          if (outLen >= limit) {
            out.length = outLen;
            return out;
          }
          out[outLen++] = _this.substring(start, i - sepLen + 1);
          start = i + 1;
          sepInd = 0;
        }
      } else {
        sepInd = 0;
      }
    }
  }

  if (outLen < limit) {
    out[outLen++] = _this.substring(start);
  }

  out.length = outLen;
  return out;
};

// 22.1.2.4 String.raw ( template, ...substitutions )
// https://tc39.es/ecma262/#sec-string.raw
export const __String_raw = (template: any, ...substitutions: any[]): string => {
  // 1. Let substitutionCount be the number of elements in substitutions.
  const substitutionCount: i32 = substitutions.length;

  // 2. Let cooked be ? ToObject(template).
  // 3. Let literals be ? ToObject(? Get(cooked, "raw")).
  const literals: any = template.raw;
  if (literals == null) throw new TypeError('Cannot convert undefined or null to object');

  // 4. Let literalCount be ? LengthOfArrayLike(literals).
  const literalCount: number = ecma262.ToIntegerOrInfinity(Porffor.type(literals) == Porffor.TYPES.object ? (literals as object)['length'] : literals.length);

  // 5. If literalCount ≤ 0, return the empty String.
  if (literalCount <= 0) return '';

  // 6. Let R be the empty String.
  let R: string = '';

  // 7. Let nextIndex be 0.
  let nextIndex: i32 = 0;

  // 8. Repeat,
  while (true) {
    // a. Let nextLiteralVal be ? Get(literals, ! ToString(𝔽(nextIndex))).
    // b. Let nextLiteral be ? ToString(nextLiteralVal).
    // c. Set R to the string-concatenation of R and nextLiteral.
    R = __Porffor_concatStrings(R, literals[nextIndex]);

    // d. If nextIndex + 1 = literalCount, return R.
    if (nextIndex + 1 == literalCount) return R;

    // e. If nextIndex < substitutionCount, then
    if (nextIndex < substitutionCount) {
      // i. Let nextSubVal be substitutions[nextIndex].
      // ii. Let nextSub be ? ToString(nextSubVal).
      // iii. Set R to the string-concatenation of R and nextSub.
      R = __Porffor_concatStrings(R, substitutions[nextIndex]);
    }

    // f. Set nextIndex to nextIndex + 1.
    nextIndex += 1;
  }
};

// padStart/padEnd need to be in f64 file because padString can be any value (e.g. NaN)
// which would be truncated to 0 in i32 mode
export const __String_prototype_padStart = (_this: string, targetLength: number, padString: any = undefined) => {
  // 3. Let intMaxLength be ToLength(maxLength).
  targetLength = ecma262.ToLength(targetLength);

  let out: string = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const len: i32 = _this.length;

  const todo: i32 = targetLength - len;
  if (todo > 0) {
    if (Porffor.type(padString) == Porffor.TYPES.undefined) {
      for (let i: i32 = 0; i < todo; i++) {
        Porffor.wasm.i32.store16(outPtr, 32, 0, 4);
        outPtr += 2;
      }

      out.length = targetLength;
    } else {
      // Convert padString to string if not already
      padString = ecma262.ToString(padString);
      // Convert bytestring to string since we use UTF-16 memory access
      if (Porffor.type(padString) == Porffor.TYPES.bytestring) {
        padString = Porffor.bytestringToString(padString);
      }
      const padStringLen: i32 = padString.length;
      if (padStringLen > 0) {
        for (let i: i32 = 0; i < todo; i++) {
          Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${padString}` + (i % padStringLen) * 2, 0, 4), 0, 4);
          outPtr += 2;
        }
        out.length = targetLength;
      } else out.length = len;
    }
  } else out.length = len;

  const thisPtrEnd: i32 = thisPtr + len * 2;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr, 0, 4), 0, 4);

    thisPtr += 2;
    outPtr += 2;
  }

  return out;
};

export const __ByteString_prototype_padStart = (_this: bytestring, targetLength: number, padString: any = undefined) => {
  // 3. Let intMaxLength be ToLength(maxLength).
  targetLength = ecma262.ToLength(targetLength);

  let out: bytestring = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const len: i32 = _this.length;

  const todo: i32 = targetLength - len;
  if (todo > 0) {
    if (Porffor.type(padString) == Porffor.TYPES.undefined) {
      for (let i: i32 = 0; i < todo; i++) {
        Porffor.wasm.i32.store8(outPtr++, 32, 0, 4);
      }

      out.length = targetLength;
    } else {
      // Convert padString to string if not already
      padString = ecma262.ToString(padString);
      // If padString is non-bytestring, delegate to String version
      if (Porffor.type(padString) != Porffor.TYPES.bytestring) {
        return __String_prototype_padStart(Porffor.bytestringToString(_this), targetLength, padString);
      }
      const padStringLen: i32 = padString.length;
      if (padStringLen > 0) {
        for (let i: i32 = 0; i < todo; i++) {
          Porffor.wasm.i32.store8(outPtr++, Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${padString}` + (i % padStringLen), 0, 4), 0, 4);
        }

        out.length = targetLength;
      } else out.length = len;
    }
  } else out.length = len;

  const thisPtrEnd: i32 = thisPtr + len;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store8(outPtr++, Porffor.wasm.i32.load8_u(thisPtr++, 0, 4), 0, 4);
  }

  return out;
};


export const __String_prototype_padEnd = (_this: string, targetLength: number, padString: any = undefined) => {
  // 3. Let intMaxLength be ToLength(maxLength).
  targetLength = ecma262.ToLength(targetLength);

  let out: string = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const len: i32 = _this.length;

  const thisPtrEnd: i32 = thisPtr + len * 2;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(thisPtr, 0, 4), 0, 4);

    thisPtr += 2;
    outPtr += 2;
  }

  const todo: i32 = targetLength - len;
  if (todo > 0) {
    if (Porffor.type(padString) == Porffor.TYPES.undefined) {
      for (let i: i32 = 0; i < todo; i++) {
        Porffor.wasm.i32.store16(outPtr, 32, 0, 4);
        outPtr += 2;
      }

      out.length = targetLength;
    } else {
      // Convert padString to string if not already
      padString = ecma262.ToString(padString);
      // Convert bytestring to string since we use UTF-16 memory access
      if (Porffor.type(padString) == Porffor.TYPES.bytestring) {
        padString = Porffor.bytestringToString(padString);
      }
      const padStringLen: i32 = padString.length;
      if (padStringLen > 0) {
        for (let i: i32 = 0; i < todo; i++) {
          Porffor.wasm.i32.store16(outPtr, Porffor.wasm.i32.load16_u(Porffor.wasm`local.get ${padString}` + (i % padStringLen) * 2, 0, 4), 0, 4);
          outPtr += 2;
        }
        out.length = targetLength;
      } else out.length = len;
    }
  } else out.length = len;

  return out;
};

// 22.1.3.32 String.prototype.trimStart ()
export const __String_prototype_trimStart = (_this: any) => {
  const t: i32 = Porffor.type(_this);
  if (Porffor.fastOr(t == Porffor.TYPES.undefined, t == Porffor.TYPES.object && _this === null)) {
    throw new TypeError('String.prototype.trimStart called on null or undefined');
  }
  const str: any = ecma262.ToString(_this);

  const len: i32 = str.length;

  if (Porffor.type(str) == Porffor.TYPES.bytestring) {
    const strPtr: i32 = Porffor.wasm`local.get ${str}`;
    const strPtrEnd: i32 = strPtr + len;
    let n: i32 = 0;
    let scanPtr: i32 = strPtr;
    while (scanPtr < strPtrEnd) {
      const chr: i32 = Porffor.wasm.i32.load8_u(scanPtr++, 0, 4);
      if (Porffor.fastOr(chr == 0x9, chr == 0xb, chr == 0xc, chr == 0x20, chr == 0xa, chr == 0xd, chr == 0xa0)) { n++; }
      else break;
    }
    // Fast path: no trimming needed
    if (n == 0) return str;

    const outLen: i32 = len - n;
    let out: bytestring = Porffor.malloc();
    // Use memory.copy like repeat does
    Porffor.wasm`
;; dst = out + 4
local.get ${out}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; src = str + 4 + n (skip whitespace)
local.get ${str}
i32.trunc_sat_f64_s
i32.const 4
i32.add
local.get ${n}
i32.trunc_sat_f64_s
i32.add

;; size = outLen
local.get ${outLen}
i32.trunc_sat_f64_s

memory.copy 0 0`;
    Porffor.wasm.i32.store(out, outLen, 0, 0);
    return out;
  }

  const strPtr: i32 = Porffor.wasm`local.get ${str}`;
  const strPtrEnd: i32 = strPtr + len * 2;
  let n: i32 = 0;
  let scanPtr: i32 = strPtr;
  while (scanPtr < strPtrEnd) {
    const chr: i32 = Porffor.wasm.i32.load16_u(scanPtr, 0, 4);
    scanPtr += 2;
    if (Porffor.fastOr(chr == 0x9, chr == 0xb, chr == 0xc, chr == 0xfeff, chr == 0x20, chr == 0xa0, chr == 0x1680, chr == 0x2000, chr == 0x2001, chr == 0x2002, chr == 0x2003, chr == 0x2004, chr == 0x2005, chr == 0x2006, chr == 0x2007, chr == 0x2008, chr == 0x2009, chr == 0x200a, chr == 0x202f, chr == 0x205f, chr == 0x3000, chr == 0xa, chr == 0xd, chr == 0x2028, chr == 0x2029)) { n++; }
    else break;
  }
  // Fast path: no trimming needed
  if (n == 0) return str;

  const outLen: i32 = len - n;
  let out: string = Porffor.malloc();
  // Use memory.copy
  Porffor.wasm`
;; dst = out + 4
local.get ${out}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; src = str + 4 + n * 2 (skip whitespace)
local.get ${str}
i32.trunc_sat_f64_s
i32.const 4
i32.add
local.get ${n}
i32.trunc_sat_f64_s
i32.const 2
i32.mul
i32.add

;; size = outLen * 2
local.get ${outLen}
i32.trunc_sat_f64_s
i32.const 2
i32.mul

memory.copy 0 0`;
  Porffor.wasm.i32.store(out, outLen, 0, 0);
  return out;
};

export const __ByteString_prototype_trimStart = (_this: any) => __String_prototype_trimStart(_this);

// 22.1.3.31 String.prototype.trimEnd ()
export const __String_prototype_trimEnd = (_this: any) => {
  const t: i32 = Porffor.type(_this);
  if (Porffor.fastOr(t == Porffor.TYPES.undefined, t == Porffor.TYPES.object && _this === null)) {
    throw new TypeError('String.prototype.trimEnd called on null or undefined');
  }
  const str: any = ecma262.ToString(_this);

  const len: i32 = str.length;

  if (Porffor.type(str) == Porffor.TYPES.bytestring) {
    let endPos: i32 = len;
    let scanPtr: i32 = Porffor.wasm`local.get ${str}` + len - 1;
    const strPtr: i32 = Porffor.wasm`local.get ${str}`;
    while (scanPtr >= strPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(scanPtr--, 0, 4);
      if (Porffor.fastOr(chr == 0x9, chr == 0xb, chr == 0xc, chr == 0x20, chr == 0xa, chr == 0xd, chr == 0xa0)) { endPos--; }
      else break;
    }
    // Fast path: no trimming needed
    if (endPos == len) return str;

    let out: bytestring = Porffor.malloc();
    // Use memory.copy like repeat does
    Porffor.wasm`
;; dst = out + 4
local.get ${out}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; src = str + 4
local.get ${str}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; size = endPos
local.get ${endPos}
i32.trunc_sat_f64_s

memory.copy 0 0`;
    Porffor.wasm.i32.store(out, endPos, 0, 0);
    return out;
  }

  let endPos: i32 = len;
  let scanPtr: i32 = Porffor.wasm`local.get ${str}` + len * 2 - 2;
  const strPtr: i32 = Porffor.wasm`local.get ${str}`;
  while (scanPtr >= strPtr) {
    const chr: i32 = Porffor.wasm.i32.load16_u(scanPtr, 0, 4);
    scanPtr -= 2;
    if (Porffor.fastOr(chr == 0x9, chr == 0xb, chr == 0xc, chr == 0xfeff, chr == 0x20, chr == 0xa0, chr == 0x1680, chr == 0x2000, chr == 0x2001, chr == 0x2002, chr == 0x2003, chr == 0x2004, chr == 0x2005, chr == 0x2006, chr == 0x2007, chr == 0x2008, chr == 0x2009, chr == 0x200a, chr == 0x202f, chr == 0x205f, chr == 0x3000, chr == 0xa, chr == 0xd, chr == 0x2028, chr == 0x2029)) { endPos--; }
    else break;
  }
  // Fast path: no trimming needed
  if (endPos == len) return str;

  let out: string = Porffor.malloc();
  // Use memory.copy
  Porffor.wasm`
;; dst = out + 4
local.get ${out}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; src = str + 4
local.get ${str}
i32.trunc_sat_f64_s
i32.const 4
i32.add

;; size = endPos * 2
local.get ${endPos}
i32.trunc_sat_f64_s
i32.const 2
i32.mul

memory.copy 0 0`;
  Porffor.wasm.i32.store(out, endPos, 0, 0);
  return out;
};

export const __ByteString_prototype_trimEnd = (_this: any) => __String_prototype_trimEnd(_this);

// 22.1.3.30 String.prototype.trim ()
export const __String_prototype_trim = (_this: any) => {
  return __String_prototype_trimStart(__String_prototype_trimEnd(_this));
};

export const __ByteString_prototype_trim = (_this: any) => __String_prototype_trim(_this);

export const __ByteString_prototype_padEnd = (_this: bytestring, targetLength: number, padString: any = undefined) => {
  // 3. Let intMaxLength be ToLength(maxLength).
  targetLength = ecma262.ToLength(targetLength);

  let out: bytestring = Porffor.malloc();

  let outPtr: i32 = Porffor.wasm`local.get ${out}`;
  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;

  const len: i32 = _this.length;

  const thisPtrEnd: i32 = thisPtr + len;

  while (thisPtr < thisPtrEnd) {
    Porffor.wasm.i32.store8(outPtr++, Porffor.wasm.i32.load8_u(thisPtr++, 0, 4), 0, 4);
  }

  const todo: i32 = targetLength - len;
  if (todo > 0) {
    if (Porffor.type(padString) == Porffor.TYPES.undefined) {
      for (let i: i32 = 0; i < todo; i++) {
        Porffor.wasm.i32.store8(outPtr++, 32, 0, 4);
      }

      out.length = targetLength;
    } else {
      // Convert padString to string if not already
      padString = ecma262.ToString(padString);
      // If padString is non-bytestring, delegate to String version
      if (Porffor.type(padString) != Porffor.TYPES.bytestring) {
        return __String_prototype_padEnd(Porffor.bytestringToString(_this), targetLength, padString);
      }
      const padStringLen: i32 = padString.length;
      if (padStringLen > 0) {
        for (let i: i32 = 0; i < todo; i++) {
          Porffor.wasm.i32.store8(outPtr++, Porffor.wasm.i32.load8_u(Porffor.wasm`local.get ${padString}` + (i % padStringLen), 0, 4), 0, 4);
        }

        out.length = targetLength;
      } else out.length = len;
    }
  } else out.length = len;

  return out;
};

// indexOf implementations - in f64 file for proper NaN/Infinity support in ecma262.ToString
export const __String_prototype_indexOf = (_this: string, searchString: any, position: any = 0) => {
  searchString = ecma262.ToString(searchString);
  if (Porffor.type(searchString) == Porffor.TYPES.bytestring) {
    searchString = Porffor.bytestringToString(searchString);
  }
  position = ecma262.ToIntegerOrInfinity(position);

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLenX2: i32 = searchString.length * 2;

  const len: i32 = _this.length;
  if (position > 0) {
    if (position > len) position = len;
  } else position = 0;

  const thisPtrEnd: i32 = thisPtr + (len * 2) - searchLenX2;

  thisPtr += position * 2;

  while (thisPtr <= thisPtrEnd) {
    let match: boolean = true;
    for (let i: i32 = 0; i < searchLenX2; i += 2) {
      let chr: i32 = Porffor.wasm.i32.load16_u(thisPtr + i, 0, 4);
      let expected: i32 = Porffor.wasm.i32.load16_u(searchPtr + i, 0, 4);

      if (chr != expected) {
        match = false;
        break;
      }
    }

    if (match) return (thisPtr - Porffor.wasm`local.get ${_this}`) / 2;

    thisPtr += 2;
  }

  return -1;
};

export const __ByteString_prototype_indexOf = (_this: bytestring, searchString: any, position: any = 0) => {
  searchString = ecma262.ToString(searchString);

  // If result is not a bytestring, convert _this to string and use String version
  if (Porffor.type(searchString) != Porffor.TYPES.bytestring) {
    return __String_prototype_indexOf(Porffor.bytestringToString(_this), searchString, position);
  }

  position = ecma262.ToIntegerOrInfinity(position);

  let thisPtr: i32 = Porffor.wasm`local.get ${_this}`;
  const searchPtr: i32 = Porffor.wasm`local.get ${searchString}`;

  const searchLen: i32 = searchString.length;

  const len: i32 = _this.length;
  if (position > 0) {
    if (position > len) position = len;
  } else position = 0;

  const thisPtrEnd: i32 = thisPtr + len - searchLen;

  thisPtr += position;

  while (thisPtr <= thisPtrEnd) {
    let match: boolean = true;
    for (let i: i32 = 0; i < searchLen; i++) {
      let chr: i32 = Porffor.wasm.i32.load8_u(thisPtr + i, 0, 4);
      let expected: i32 = Porffor.wasm.i32.load8_u(searchPtr + i, 0, 4);

      if (chr != expected) {
        match = false;
        break;
      }
    }

    if (match) return thisPtr - Porffor.wasm`local.get ${_this}`;

    thisPtr++;
  }

  return -1;
};