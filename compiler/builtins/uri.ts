// @porf --valtype=i32
import type {} from './porffor.d.ts';

// Legacy escape function
export const escape = (input: any): bytestring => {
  input = __ecma262_ToString(input);
  const len: i32 = input.length;
  let outLength: i32 = 0;

  let i: i32 = Porffor.wasm`local.get ${input}`;

  // Check if input is bytestring or string
  if (Porffor.wasm`local.get ${input+1}` == Porffor.TYPES.bytestring) {
    // Handle bytestring input
    const endPtr: i32 = i + len;

    // First pass: calculate output length
    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

      // Characters that should NOT be escaped: A-Z a-z 0-9 @ * + - . / _
      if ((chr >= 48 && chr <= 57) ||  // 0-9
          (chr >= 65 && chr <= 90) ||  // A-Z
          (chr >= 97 && chr <= 122) || // a-z
          chr == 42 || chr == 43 || chr == 45 || chr == 46 || chr == 47 || chr == 64 || chr == 95) {
        outLength += 1;
      } else {
        outLength += 3; // %XX
      }
    }

    // Second pass: encode
    let output: bytestring = Porffor.malloc();
    output.length = outLength;

    i = Porffor.wasm`local.get ${input}`;
    let j: i32 = Porffor.wasm`local.get ${output}`;

    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

      if ((chr >= 48 && chr <= 57) ||  // 0-9
          (chr >= 65 && chr <= 90) ||  // A-Z
          (chr >= 97 && chr <= 122) || // a-z
          chr == 42 || chr == 43 || chr == 45 || chr == 46 || chr == 47 || chr == 64 || chr == 95) {
        Porffor.wasm.i32.store8(j++, chr, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, 37, 0, 4); // %

        let nibble: i32 = chr >> 4;
        if (nibble < 10) {
          Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
        } else {
          Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
        }

        nibble = chr & 0x0F;
        if (nibble < 10) {
          Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
        } else {
          Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
        }
      }
    }

    return output;
  }

  // Handle string input (16-bit characters)
  const endPtr: i32 = i + len * 2;

  // First pass: calculate output length
  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    // Characters that should NOT be escaped: A-Z a-z 0-9 @ * + - . / _
    if ((chr >= 48 && chr <= 57) ||  // 0-9
        (chr >= 65 && chr <= 90) ||  // A-Z
        (chr >= 97 && chr <= 122) || // a-z
        chr == 42 || chr == 43 || chr == 45 || chr == 46 || chr == 47 || chr == 64 || chr == 95) {
      outLength += 1;
    } else if (chr < 256) {
      outLength += 3; // %XX
    } else {
      outLength += 6; // %uXXXX
    }
  }

  // Second pass: encode
  let output: bytestring = Porffor.malloc();
  output.length = outLength;

  i = Porffor.wasm`local.get ${input}`;
  let j: i32 = Porffor.wasm`local.get ${output}`;

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    if ((chr >= 48 && chr <= 57) ||  // 0-9
        (chr >= 65 && chr <= 90) ||  // A-Z
        (chr >= 97 && chr <= 122) || // a-z
        chr == 42 || chr == 43 || chr == 45 || chr == 46 || chr == 47 || chr == 64 || chr == 95) {
      Porffor.wasm.i32.store8(j++, chr, 0, 4);
    } else if (chr < 256) {
      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %

      let nibble: i32 = chr >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      nibble = chr & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    } else {
      // %uXXXX
      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      Porffor.wasm.i32.store8(j++, 117, 0, 4); // u

      let nibble: i32 = (chr >> 12) & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      nibble = (chr >> 8) & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      nibble = (chr >> 4) & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      nibble = chr & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    }
  }

  return output;
};

// Legacy unescape function
export const unescape = (input: any): string => {
  input = __ecma262_ToString(input);
  const len: i32 = input.length;
  let outLength: i32 = 0;

  // First pass: calculate output length
  let i: i32 = Porffor.wasm`local.get ${input}`;
  const endPtr: i32 = i + len;

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
    if (chr == 37) { // %
      if (i + 4 < endPtr && Porffor.wasm.i32.load8_u(i, 0, 4) == 117) { // u
        i += 5;
      } else if (i + 1 < endPtr) {
        i += 2;
      }
    }
    outLength += 1;
  }

  // Second pass: decode
  let output: string = Porffor.malloc();
  output.length = outLength;

  i = Porffor.wasm`local.get ${input}`;
  let j: i32 = Porffor.wasm`local.get ${output}`;

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

    if (chr == 37) { // %
      if (i + 4 < endPtr && Porffor.wasm.i32.load8_u(i, 0, 4) == 117) { // u
        // %uXXXX
        const d1: i32 = Porffor.wasm.i32.load8_u(i + 1, 0, 4);
        const d2: i32 = Porffor.wasm.i32.load8_u(i + 2, 0, 4);
        const d3: i32 = Porffor.wasm.i32.load8_u(i + 3, 0, 4);
        const d4: i32 = Porffor.wasm.i32.load8_u(i + 4, 0, 4);

        let n1: i32 = d1 - 48;
        if (n1 > 9) {
          n1 = d1 - 55;
          if (n1 > 15) n1 = d1 - 87;
        }

        let n2: i32 = d2 - 48;
        if (n2 > 9) {
          n2 = d2 - 55;
          if (n2 > 15) n2 = d2 - 87;
        }

        let n3: i32 = d3 - 48;
        if (n3 > 9) {
          n3 = d3 - 55;
          if (n3 > 15) n3 = d3 - 87;
        }

        let n4: i32 = d4 - 48;
        if (n4 > 9) {
          n4 = d4 - 55;
          if (n4 > 15) n4 = d4 - 87;
        }

        if (n1 >= 0 && n1 <= 15 && n2 >= 0 && n2 <= 15 && n3 >= 0 && n3 <= 15 && n4 >= 0 && n4 <= 15) {
          i += 5;
          const value: i32 = (n1 << 12) | (n2 << 8) | (n3 << 4) | n4;
          Porffor.wasm.i32.store16(j, value, 0, 4);
        } else {
          Porffor.wasm.i32.store16(j, chr, 0, 4);
        }
      } else if (i + 1 < endPtr) {
        // %XX
        const d1: i32 = Porffor.wasm.i32.load8_u(i, 0, 4);
        const d2: i32 = Porffor.wasm.i32.load8_u(i + 1, 0, 4);

        let n1: i32 = d1 - 48;
        if (n1 > 9) {
          n1 = d1 - 55;
          if (n1 > 15) n1 = d1 - 87;
        }

        let n2: i32 = d2 - 48;
        if (n2 > 9) {
          n2 = d2 - 55;
          if (n2 > 15) n2 = d2 - 87;
        }

        if (n1 >= 0 && n1 <= 15 && n2 >= 0 && n2 <= 15) {
          i += 2;
          const value: i32 = (n1 << 4) | n2;
          Porffor.wasm.i32.store16(j, value, 0, 4);
        } else {
          Porffor.wasm.i32.store16(j, chr, 0, 4);
        }
      } else {
        Porffor.wasm.i32.store16(j, chr, 0, 4);
      }
    } else {
      Porffor.wasm.i32.store16(j, chr, 0, 4);
    }

    j += 2;
  }

  return output;
};

// Modern URI encoding functions
export const encodeURI = (input: any): bytestring => {
  input = __ecma262_ToString(input);
  const len: i32 = input.length;
  let outLength: i32 = 0;

  let i: i32 = Porffor.wasm`local.get ${input}`;

  // Check if input is bytestring or string
  if (Porffor.wasm`local.get ${input+1}` == Porffor.TYPES.bytestring) {
    // Handle bytestring input
    const endPtr: i32 = i + len;

    // First pass: calculate output length
    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

      // Characters that should NOT be encoded for encodeURI
      // uriReserved: ; / ? : @ & = + $ ,
      // uriUnescaped: - _ . ! ~ * ' ( ) plus alphanumeric
      // Also: # (for encodeURI only)
      if ((chr >= 48 && chr <= 57) ||  // 0-9
          (chr >= 65 && chr <= 90) ||  // A-Z
          (chr >= 97 && chr <= 122) || // a-z
          chr == 33 || chr == 35 || chr == 36 || chr == 38 || chr == 39 ||
          chr == 40 || chr == 41 || chr == 42 || chr == 43 || chr == 44 ||
          chr == 45 || chr == 46 || chr == 47 || chr == 58 || chr == 59 ||
          chr == 61 || chr == 63 || chr == 64 ||
          chr == 95 || chr == 126) {
        outLength += 1;
      } else {
        outLength += 3; // %XX
      }
    }

    // Second pass: encode
    let output: bytestring = Porffor.malloc();
    output.length = outLength;

    i = Porffor.wasm`local.get ${input}`;
    let j: i32 = Porffor.wasm`local.get ${output}`;

    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

      if ((chr >= 48 && chr <= 57) ||  // 0-9
          (chr >= 65 && chr <= 90) ||  // A-Z
          (chr >= 97 && chr <= 122) || // a-z
          chr == 33 || chr == 35 || chr == 36 || chr == 38 || chr == 39 ||
          chr == 40 || chr == 41 || chr == 42 || chr == 43 || chr == 44 ||
          chr == 45 || chr == 46 || chr == 47 || chr == 58 || chr == 59 ||
          chr == 61 || chr == 63 || chr == 64 ||
          chr == 95 || chr == 126) {
        Porffor.wasm.i32.store8(j++, chr, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, 37, 0, 4); // %

        let nibble: i32 = chr >> 4;
        if (nibble < 10) {
          Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
        } else {
          Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
        }

        nibble = chr & 0x0F;
        if (nibble < 10) {
          Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
        } else {
          Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
        }
      }
    }

    return output;
  }

  // Handle string input (16-bit characters)
  const endPtr: i32 = i + len * 2;

  // First pass: calculate output length

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    // Characters that should NOT be encoded for encodeURI
    if ((chr >= 48 && chr <= 57) ||  // 0-9
        (chr >= 65 && chr <= 90) ||  // A-Z
        (chr >= 97 && chr <= 122) || // a-z
        chr == 33 || chr == 35 || chr == 36 || chr == 38 || chr == 39 ||
        chr == 40 || chr == 41 || chr == 42 || chr == 43 || chr == 44 ||
        chr == 45 || chr == 46 || chr == 47 || chr == 58 || chr == 59 ||
        chr == 61 || chr == 63 || chr == 64 ||
        chr == 95 || chr == 126) {
      outLength += 1;
    } else if (chr < 128) {
      outLength += 3; // %XX
    } else if (chr < 0x800) {
      outLength += 6; // %XX%XX
    } else if (chr >= 0xD800 && chr <= 0xDBFF) {
      // High surrogate - must be followed by low surrogate
      if (i >= endPtr) {
        throw new URIError('URI malformed');
      }
      const low: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
      if (low < 0xDC00 || low > 0xDFFF) {
        throw new URIError('URI malformed');
      }
      i += 2; // Skip the low surrogate
      outLength += 12; // %XX%XX%XX%XX (4-byte UTF-8)
    } else if (chr >= 0xDC00 && chr <= 0xDFFF) {
      // Lone low surrogate - error
      throw new URIError('URI malformed');
    } else {
      outLength += 9; // %XX%XX%XX
    }
  }

  // Second pass: encode
  let output: bytestring = Porffor.malloc();
  output.length = outLength;

  i = Porffor.wasm`local.get ${input}`;
  let j: i32 = Porffor.wasm`local.get ${output}`;

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    if ((chr >= 48 && chr <= 57) ||  // 0-9
        (chr >= 65 && chr <= 90) ||  // A-Z
        (chr >= 97 && chr <= 122) || // a-z
        chr == 33 || chr == 35 || chr == 36 || chr == 38 || chr == 39 ||
        chr == 40 || chr == 41 || chr == 42 || chr == 43 || chr == 44 ||
        chr == 45 || chr == 46 || chr == 47 || chr == 58 || chr == 59 ||
        chr == 61 || chr == 63 || chr == 64 ||
        chr == 95 || chr == 126) {
      Porffor.wasm.i32.store8(j++, chr, 0, 4);
    } else if (chr < 128) {
      // Single byte UTF-8
      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %

      let nibble: i32 = chr >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      nibble = chr & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    } else if (chr < 0x800) {
      // Two byte UTF-8
      const byte1: i32 = 0xC0 | (chr >> 6);
      const byte2: i32 = 0x80 | (chr & 0x3F);

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      let nibble: i32 = byte1 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte1 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte2 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte2 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    } else if (chr >= 0xD800 && chr <= 0xDBFF) {
      // Surrogate pair - combine with next character
      const low: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
      i += 2;
      // Calculate code point: 0x10000 + (high - 0xD800) * 0x400 + (low - 0xDC00)
      const codePoint: i32 = 0x10000 + ((chr - 0xD800) << 10) + (low - 0xDC00);

      // Four byte UTF-8
      const byte1: i32 = 0xF0 | (codePoint >> 18);
      const byte2: i32 = 0x80 | ((codePoint >> 12) & 0x3F);
      const byte3: i32 = 0x80 | ((codePoint >> 6) & 0x3F);
      const byte4: i32 = 0x80 | (codePoint & 0x3F);

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      let nibble: i32 = byte1 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte1 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte2 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte2 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte3 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte3 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte4 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte4 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    } else if (chr >= 0xDC00 && chr <= 0xDFFF) {
      // Lone low surrogate - already caught in first pass
      throw new URIError('URI malformed');
    } else {
      // Three byte UTF-8
      const byte1: i32 = 0xE0 | (chr >> 12);
      const byte2: i32 = 0x80 | ((chr >> 6) & 0x3F);
      const byte3: i32 = 0x80 | (chr & 0x3F);

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      let nibble: i32 = byte1 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte1 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte2 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte2 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte3 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte3 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    }
  }

  return output;
};

export const encodeURIComponent = (input: any): bytestring => {
  input = __ecma262_ToString(input);
  const len: i32 = input.length;
  let outLength: i32 = 0;

  let i: i32 = Porffor.wasm`local.get ${input}`;

  // Check if input is bytestring or string
  if (Porffor.wasm`local.get ${input+1}` == Porffor.TYPES.bytestring) {
    // Handle bytestring input
    const endPtr: i32 = i + len;

    // First pass: calculate output length
    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

      // Characters that should NOT be encoded for encodeURIComponent
      if ((chr >= 48 && chr <= 57) ||  // 0-9
          (chr >= 65 && chr <= 90) ||  // A-Z
          (chr >= 97 && chr <= 122) || // a-z
          chr == 33 || chr == 39 || chr == 40 || chr == 41 || chr == 42 ||
          chr == 45 || chr == 46 || chr == 95 || chr == 126) {
        outLength += 1;
      } else {
        outLength += 3; // %XX
      }
    }

    // Second pass: encode
    let output: bytestring = Porffor.malloc();
    output.length = outLength;

    i = Porffor.wasm`local.get ${input}`;
    let j: i32 = Porffor.wasm`local.get ${output}`;

    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

      if ((chr >= 48 && chr <= 57) ||  // 0-9
          (chr >= 65 && chr <= 90) ||  // A-Z
          (chr >= 97 && chr <= 122) || // a-z
          chr == 33 || chr == 39 || chr == 40 || chr == 41 || chr == 42 ||
          chr == 45 || chr == 46 || chr == 95 || chr == 126) {
        Porffor.wasm.i32.store8(j++, chr, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, 37, 0, 4); // %

        let nibble: i32 = chr >> 4;
        if (nibble < 10) {
          Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
        } else {
          Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
        }

        nibble = chr & 0x0F;
        if (nibble < 10) {
          Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
        } else {
          Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
        }
      }
    }

    return output;
  }

  // Handle string input (16-bit characters)
  const endPtr: i32 = i + len * 2;

  // First pass: calculate output length

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    // Characters that should NOT be encoded for encodeURIComponent
    if ((chr >= 48 && chr <= 57) ||  // 0-9
        (chr >= 65 && chr <= 90) ||  // A-Z
        (chr >= 97 && chr <= 122) || // a-z
        chr == 33 || chr == 39 || chr == 40 || chr == 41 || chr == 42 ||
        chr == 45 || chr == 46 || chr == 95 || chr == 126) {
      outLength += 1;
    } else if (chr < 128) {
      outLength += 3; // %XX
    } else if (chr < 0x800) {
      outLength += 6; // %XX%XX
    } else if (chr >= 0xD800 && chr <= 0xDBFF) {
      // High surrogate - must be followed by low surrogate
      if (i >= endPtr) {
        throw new URIError('URI malformed');
      }
      const low: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
      if (low < 0xDC00 || low > 0xDFFF) {
        throw new URIError('URI malformed');
      }
      i += 2; // Skip the low surrogate
      outLength += 12; // %XX%XX%XX%XX (4-byte UTF-8)
    } else if (chr >= 0xDC00 && chr <= 0xDFFF) {
      // Lone low surrogate - error
      throw new URIError('URI malformed');
    } else {
      outLength += 9; // %XX%XX%XX
    }
  }

  // Second pass: encode
  let output: bytestring = Porffor.malloc();
  output.length = outLength;

  i = Porffor.wasm`local.get ${input}`;
  let j: i32 = Porffor.wasm`local.get ${output}`;

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
    i += 2;

    if ((chr >= 48 && chr <= 57) ||  // 0-9
        (chr >= 65 && chr <= 90) ||  // A-Z
        (chr >= 97 && chr <= 122) || // a-z
        chr == 33 || chr == 39 || chr == 40 || chr == 41 || chr == 42 ||
        chr == 45 || chr == 46 || chr == 95 || chr == 126) {
      Porffor.wasm.i32.store8(j++, chr, 0, 4);
    } else if (chr < 128) {
      // Single byte UTF-8
      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %

      let nibble: i32 = chr >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      nibble = chr & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    } else if (chr < 0x800) {
      // Two byte UTF-8
      const byte1: i32 = 0xC0 | (chr >> 6);
      const byte2: i32 = 0x80 | (chr & 0x3F);

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      let nibble: i32 = byte1 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte1 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte2 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte2 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    } else if (chr >= 0xD800 && chr <= 0xDBFF) {
      // Surrogate pair - combine with next character
      const low: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
      i += 2;
      // Calculate code point: 0x10000 + (high - 0xD800) * 0x400 + (low - 0xDC00)
      const codePoint: i32 = 0x10000 + ((chr - 0xD800) << 10) + (low - 0xDC00);

      // Four byte UTF-8
      const byte1: i32 = 0xF0 | (codePoint >> 18);
      const byte2: i32 = 0x80 | ((codePoint >> 12) & 0x3F);
      const byte3: i32 = 0x80 | ((codePoint >> 6) & 0x3F);
      const byte4: i32 = 0x80 | (codePoint & 0x3F);

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      let nibble: i32 = byte1 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte1 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte2 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte2 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte3 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte3 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte4 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte4 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    } else if (chr >= 0xDC00 && chr <= 0xDFFF) {
      // Lone low surrogate - already caught in first pass
      throw new URIError('URI malformed');
    } else {
      // Three byte UTF-8
      const byte1: i32 = 0xE0 | (chr >> 12);
      const byte2: i32 = 0x80 | ((chr >> 6) & 0x3F);
      const byte3: i32 = 0x80 | (chr & 0x3F);

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      let nibble: i32 = byte1 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte1 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte2 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte2 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }

      Porffor.wasm.i32.store8(j++, 37, 0, 4); // %
      nibble = byte3 >> 4;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
      nibble = byte3 & 0x0F;
      if (nibble < 10) {
        Porffor.wasm.i32.store8(j++, nibble + 48, 0, 4);
      } else {
        Porffor.wasm.i32.store8(j++, nibble + 55, 0, 4);
      }
    }
  }

  return output;
};

// Helper to check if a byte is a reserved URI character (;/?:@&=+$,#)
export const __Porffor_uri_isReserved = (byte: i32): boolean => {
  return Porffor.fastOr(
    byte == 35,  // #
    byte == 36,  // $
    byte == 38,  // &
    byte == 43,  // +
    byte == 44,  // ,
    byte == 47,  // /
    byte == 58,  // :
    byte == 59,  // ;
    byte == 61,  // =
    byte == 63,  // ?
    byte == 64   // @
  );
};

// Internal decode function with option to preserve reserved characters
export const __Porffor_decodeURI_impl = (input: any, preserveReserved: boolean): string => {
  input = __ecma262_ToString(input);
  const len: i32 = input.length;
  let outLength: i32 = 0;

  let i: i32 = Porffor.wasm`local.get ${input}`;

  // Check if input is string (16-bit) or bytestring (8-bit)
  if (Porffor.wasm`local.get ${input+1}` == Porffor.TYPES.string) {
    // Handle 16-bit string input - iterate through 16-bit chars
    const endPtr: i32 = i + len * 2;

    // First pass: calculate output length
    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
      i += 2;
      if (chr == 37 && i + 4 <= endPtr) { // %
        const h1: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
        const h2: i32 = Porffor.wasm.i32.load16_u(i + 2, 0, 4);

        // Validate hex digits (must be ASCII)
        let n1: i32 = -1;
        if (h1 >= 48 && h1 <= 57) n1 = h1 - 48;
        else if (h1 >= 65 && h1 <= 70) n1 = h1 - 55;
        else if (h1 >= 97 && h1 <= 102) n1 = h1 - 87;

        let n2: i32 = -1;
        if (h2 >= 48 && h2 <= 57) n2 = h2 - 48;
        else if (h2 >= 65 && h2 <= 70) n2 = h2 - 55;
        else if (h2 >= 97 && h2 <= 102) n2 = h2 - 87;

        if (n1 >= 0 && n2 >= 0) {
          i += 4;
          const byte: i32 = (n1 << 4) | n2;
          if ((byte & 0x80) == 0) {
            if (preserveReserved && __Porffor_uri_isReserved(byte)) {
              outLength += 3;
            } else {
              outLength += 1;
            }
          } else if ((byte & 0xE0) == 0xC0) {
            outLength += 1;
          } else if ((byte & 0xF0) == 0xE0) {
            outLength += 1;
          }
        } else {
          outLength += 1;
        }
      } else {
        outLength += 1;
      }
    }

    // Second pass: decode
    let output: string = Porffor.malloc();
    output.length = outLength;

    i = Porffor.wasm`local.get ${input}`;
    let j: i32 = Porffor.wasm`local.get ${output}`;

    while (i < endPtr) {
      const chr: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
      i += 2;

      if (chr == 37) { // %
        if (i + 4 > endPtr) {
          throw new URIError('URI malformed');
        }

        const h1: i32 = Porffor.wasm.i32.load16_u(i, 0, 4);
        const h2: i32 = Porffor.wasm.i32.load16_u(i + 2, 0, 4);

        let n1: i32 = -1;
        if (h1 >= 48 && h1 <= 57) n1 = h1 - 48;
        else if (h1 >= 65 && h1 <= 70) n1 = h1 - 55;
        else if (h1 >= 97 && h1 <= 102) n1 = h1 - 87;

        let n2: i32 = -1;
        if (h2 >= 48 && h2 <= 57) n2 = h2 - 48;
        else if (h2 >= 65 && h2 <= 70) n2 = h2 - 55;
        else if (h2 >= 97 && h2 <= 102) n2 = h2 - 87;

        if (n1 < 0 || n2 < 0) {
          throw new URIError('URI malformed');
        }

        i += 4;
        const byte1: i32 = (n1 << 4) | n2;

        if ((byte1 & 0x80) == 0) {
          if (preserveReserved && __Porffor_uri_isReserved(byte1)) {
            Porffor.wasm.i32.store16(j, 37, 0, 4);
            Porffor.wasm.i32.store16(j + 2, h1, 0, 4);
            Porffor.wasm.i32.store16(j + 4, h2, 0, 4);
            j += 6;
          } else {
            Porffor.wasm.i32.store16(j, byte1, 0, 4);
            j += 2;
          }
        } else if ((byte1 & 0xE0) == 0xC0 && i + 5 < endPtr && Porffor.wasm.i32.load16_u(i, 0, 4) == 37) {
          const h3: i32 = Porffor.wasm.i32.load16_u(i + 2, 0, 4);
          const h4: i32 = Porffor.wasm.i32.load16_u(i + 4, 0, 4);

          let n3: i32 = -1;
          if (h3 >= 48 && h3 <= 57) n3 = h3 - 48;
          else if (h3 >= 65 && h3 <= 70) n3 = h3 - 55;
          else if (h3 >= 97 && h3 <= 102) n3 = h3 - 87;

          let n4: i32 = -1;
          if (h4 >= 48 && h4 <= 57) n4 = h4 - 48;
          else if (h4 >= 65 && h4 <= 70) n4 = h4 - 55;
          else if (h4 >= 97 && h4 <= 102) n4 = h4 - 87;

          if (n3 < 0 || n4 < 0) {
            throw new URIError('URI malformed');
          }

          i += 6;
          const byte2: i32 = (n3 << 4) | n4;

          if ((byte2 & 0xC0) != 0x80) {
            throw new URIError('URI malformed');
          }

          const codepoint: i32 = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F);
          if (codepoint < 0x80) {
            throw new URIError('URI malformed');
          }

          Porffor.wasm.i32.store16(j, codepoint, 0, 4);
          j += 2;
        } else if ((byte1 & 0xF0) == 0xE0 && i + 11 < endPtr && Porffor.wasm.i32.load16_u(i, 0, 4) == 37 && Porffor.wasm.i32.load16_u(i + 6, 0, 4) == 37) {
          const h3: i32 = Porffor.wasm.i32.load16_u(i + 2, 0, 4);
          const h4: i32 = Porffor.wasm.i32.load16_u(i + 4, 0, 4);
          const h5: i32 = Porffor.wasm.i32.load16_u(i + 8, 0, 4);
          const h6: i32 = Porffor.wasm.i32.load16_u(i + 10, 0, 4);

          let n3: i32 = -1;
          if (h3 >= 48 && h3 <= 57) n3 = h3 - 48;
          else if (h3 >= 65 && h3 <= 70) n3 = h3 - 55;
          else if (h3 >= 97 && h3 <= 102) n3 = h3 - 87;

          let n4: i32 = -1;
          if (h4 >= 48 && h4 <= 57) n4 = h4 - 48;
          else if (h4 >= 65 && h4 <= 70) n4 = h4 - 55;
          else if (h4 >= 97 && h4 <= 102) n4 = h4 - 87;

          let n5: i32 = -1;
          if (h5 >= 48 && h5 <= 57) n5 = h5 - 48;
          else if (h5 >= 65 && h5 <= 70) n5 = h5 - 55;
          else if (h5 >= 97 && h5 <= 102) n5 = h5 - 87;

          let n6: i32 = -1;
          if (h6 >= 48 && h6 <= 57) n6 = h6 - 48;
          else if (h6 >= 65 && h6 <= 70) n6 = h6 - 55;
          else if (h6 >= 97 && h6 <= 102) n6 = h6 - 87;

          if (n3 < 0 || n4 < 0 || n5 < 0 || n6 < 0) {
            throw new URIError('URI malformed');
          }

          i += 12;
          const byte2: i32 = (n3 << 4) | n4;
          const byte3: i32 = (n5 << 4) | n6;

          if ((byte2 & 0xC0) != 0x80 || (byte3 & 0xC0) != 0x80) {
            throw new URIError('URI malformed');
          }

          const codepoint: i32 = ((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F);
          if (codepoint < 0x800) {
            throw new URIError('URI malformed');
          }
          if (codepoint >= 0xD800 && codepoint <= 0xDFFF) {
            throw new URIError('URI malformed');
          }

          Porffor.wasm.i32.store16(j, codepoint, 0, 4);
          j += 2;
        } else {
          throw new URIError('URI malformed');
        }
      } else {
        // Non-% character - copy directly
        Porffor.wasm.i32.store16(j, chr, 0, 4);
        j += 2;
      }
    }

    return output;
  }

  // Handle bytestring input (8-bit characters)
  const endPtr: i32 = i + len;

  // First pass: calculate output length
  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);
    if (chr == 37 && i + 1 < endPtr) { // %
      const h1: i32 = Porffor.wasm.i32.load8_u(i, 0, 4);
      const h2: i32 = Porffor.wasm.i32.load8_u(i + 1, 0, 4);

      // Properly validate hex digits
      let n1: i32 = -1;
      if (h1 >= 48 && h1 <= 57) n1 = h1 - 48;        // '0'-'9'
      else if (h1 >= 65 && h1 <= 70) n1 = h1 - 55;   // 'A'-'F'
      else if (h1 >= 97 && h1 <= 102) n1 = h1 - 87;  // 'a'-'f'

      let n2: i32 = -1;
      if (h2 >= 48 && h2 <= 57) n2 = h2 - 48;        // '0'-'9'
      else if (h2 >= 65 && h2 <= 70) n2 = h2 - 55;   // 'A'-'F'
      else if (h2 >= 97 && h2 <= 102) n2 = h2 - 87;  // 'a'-'f'

      if (n1 >= 0 && n2 >= 0) {
        i += 2;
        const byte: i32 = (n1 << 4) | n2;
        // Skip continuation bytes
        if ((byte & 0x80) == 0) {
          // Check if byte is a reserved character for decodeURI
          if (preserveReserved && __Porffor_uri_isReserved(byte)) {
            outLength += 3; // Keep %XX as-is
          } else {
            outLength += 1;
          }
        } else if ((byte & 0xE0) == 0xC0) {
          outLength += 1;
        } else if ((byte & 0xF0) == 0xE0) {
          outLength += 1;
        }
      } else {
        outLength += 1;
      }
    } else {
      outLength += 1;
    }
  }

  // Second pass: decode
  let output: string = Porffor.malloc();
  output.length = outLength;

  i = Porffor.wasm`local.get ${input}`;
  let j: i32 = Porffor.wasm`local.get ${output}`;

  while (i < endPtr) {
    const chr: i32 = Porffor.wasm.i32.load8_u(i++, 0, 4);

    if (chr == 37) { // %
      // Per spec: if k + 2 >= length, throw URIError
      if (i + 1 >= endPtr) {
        throw new URIError('URI malformed');
      }

      const h1: i32 = Porffor.wasm.i32.load8_u(i, 0, 4);
      const h2: i32 = Porffor.wasm.i32.load8_u(i + 1, 0, 4);

      // Properly validate hex digits
      let n1: i32 = -1;
      if (h1 >= 48 && h1 <= 57) n1 = h1 - 48;        // '0'-'9'
      else if (h1 >= 65 && h1 <= 70) n1 = h1 - 55;   // 'A'-'F'
      else if (h1 >= 97 && h1 <= 102) n1 = h1 - 87;  // 'a'-'f'

      let n2: i32 = -1;
      if (h2 >= 48 && h2 <= 57) n2 = h2 - 48;        // '0'-'9'
      else if (h2 >= 65 && h2 <= 70) n2 = h2 - 55;   // 'A'-'F'
      else if (h2 >= 97 && h2 <= 102) n2 = h2 - 87;  // 'a'-'f'

      if (n1 < 0 || n2 < 0) {
        // Invalid hex sequence - throw URIError per spec
        throw new URIError('URI malformed');
      }

      i += 2;
      const byte1: i32 = (n1 << 4) | n2;

      if ((byte1 & 0x80) == 0) {
        // Single byte - check if reserved character for decodeURI
        if (preserveReserved && __Porffor_uri_isReserved(byte1)) {
          // Keep %XX as-is for reserved characters
          Porffor.wasm.i32.store16(j, 37, 0, 4);     // %
          Porffor.wasm.i32.store16(j + 2, h1, 0, 4); // first hex digit
          Porffor.wasm.i32.store16(j + 4, h2, 0, 4); // second hex digit
          j += 6;
        } else {
          Porffor.wasm.i32.store16(j, byte1, 0, 4);
          j += 2;
        }
      } else if ((byte1 & 0xE0) == 0xC0 && i + 2 < endPtr && Porffor.wasm.i32.load8_u(i, 0, 4) == 37) {
        // Two byte UTF-8
        const h3: i32 = Porffor.wasm.i32.load8_u(i + 1, 0, 4);
        const h4: i32 = Porffor.wasm.i32.load8_u(i + 2, 0, 4);

        let n3: i32 = -1;
        if (h3 >= 48 && h3 <= 57) n3 = h3 - 48;
        else if (h3 >= 65 && h3 <= 70) n3 = h3 - 55;
        else if (h3 >= 97 && h3 <= 102) n3 = h3 - 87;

        let n4: i32 = -1;
        if (h4 >= 48 && h4 <= 57) n4 = h4 - 48;
        else if (h4 >= 65 && h4 <= 70) n4 = h4 - 55;
        else if (h4 >= 97 && h4 <= 102) n4 = h4 - 87;

        if (n3 < 0 || n4 < 0) {
          throw new URIError('URI malformed');
        }

        i += 3;
        const byte2: i32 = (n3 << 4) | n4;

        // Validate continuation byte (must be 10xxxxxx)
        if ((byte2 & 0xC0) != 0x80) {
          throw new URIError('URI malformed');
        }

        const codepoint: i32 = ((byte1 & 0x1F) << 6) | (byte2 & 0x3F);

        // Reject overlong encoding (codepoint must be >= 0x80 for 2-byte)
        if (codepoint < 0x80) {
          throw new URIError('URI malformed');
        }

        Porffor.wasm.i32.store16(j, codepoint, 0, 4);
        j += 2;
      } else if ((byte1 & 0xF0) == 0xE0 && i + 5 < endPtr && Porffor.wasm.i32.load8_u(i, 0, 4) == 37 && Porffor.wasm.i32.load8_u(i + 3, 0, 4) == 37) {
        // Three byte UTF-8
        const h3: i32 = Porffor.wasm.i32.load8_u(i + 1, 0, 4);
        const h4: i32 = Porffor.wasm.i32.load8_u(i + 2, 0, 4);
        const h5: i32 = Porffor.wasm.i32.load8_u(i + 4, 0, 4);
        const h6: i32 = Porffor.wasm.i32.load8_u(i + 5, 0, 4);

        let n3: i32 = -1;
        if (h3 >= 48 && h3 <= 57) n3 = h3 - 48;
        else if (h3 >= 65 && h3 <= 70) n3 = h3 - 55;
        else if (h3 >= 97 && h3 <= 102) n3 = h3 - 87;

        let n4: i32 = -1;
        if (h4 >= 48 && h4 <= 57) n4 = h4 - 48;
        else if (h4 >= 65 && h4 <= 70) n4 = h4 - 55;
        else if (h4 >= 97 && h4 <= 102) n4 = h4 - 87;

        let n5: i32 = -1;
        if (h5 >= 48 && h5 <= 57) n5 = h5 - 48;
        else if (h5 >= 65 && h5 <= 70) n5 = h5 - 55;
        else if (h5 >= 97 && h5 <= 102) n5 = h5 - 87;

        let n6: i32 = -1;
        if (h6 >= 48 && h6 <= 57) n6 = h6 - 48;
        else if (h6 >= 65 && h6 <= 70) n6 = h6 - 55;
        else if (h6 >= 97 && h6 <= 102) n6 = h6 - 87;

        if (n3 < 0 || n4 < 0 || n5 < 0 || n6 < 0) {
          throw new URIError('URI malformed');
        }

        i += 6;
        const byte2: i32 = (n3 << 4) | n4;
        const byte3: i32 = (n5 << 4) | n6;

        // Validate continuation bytes (must be 10xxxxxx)
        if ((byte2 & 0xC0) != 0x80 || (byte3 & 0xC0) != 0x80) {
          throw new URIError('URI malformed');
        }

        const codepoint: i32 = ((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F);

        // Reject overlong encoding (codepoint must be >= 0x800 for 3-byte)
        if (codepoint < 0x800) {
          throw new URIError('URI malformed');
        }

        // Reject surrogate code points (U+D800-U+DFFF)
        if (codepoint >= 0xD800 && codepoint <= 0xDFFF) {
          throw new URIError('URI malformed');
        }

        Porffor.wasm.i32.store16(j, codepoint, 0, 4);
        j += 2;
      } else {
        // Invalid UTF-8 sequence
        throw new URIError('URI malformed');
      }
    } else {
      Porffor.wasm.i32.store16(j, chr, 0, 4);
      j += 2;
    }
  }

  return output;
};

export const decodeURI = (input: any): string => {
  return __Porffor_decodeURI_impl(input, true); // preserve reserved characters
};

export const decodeURIComponent = (input: any): string => {
  return __Porffor_decodeURI_impl(input, false); // decode all characters
};