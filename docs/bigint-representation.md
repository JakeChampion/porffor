# BigInt Memory Representation

## Current Implementation

### Inline Values (abs < 2^51)
- Stored directly as f64 value
- No memory allocation needed
- Fast for small values (most common case)

### Memory Format (abs >= 2^51)
- Pointer stored as `ptr + 0x8000000000000` to distinguish from inline values
- Layout:
  - byte 0: sign (0 = positive, 1 = negative)
  - byte 1: unused padding
  - bytes 2-3: length (16-bit digit count)
  - bytes 4+: digits (32-bit each, most significant first)

## Potential Improvements

### 1. Increase Inline Threshold to 2^53
- f64 can represent integers exactly up to 2^53
- Changing threshold from 2^51 to 2^53 would cover more values inline
- Trade-off: narrows the pointer range distinguisher

### 2. Use 64-bit Digits
- Current: base 2^32 digits (i32)
- Alternative: base 2^64 digits (i64)
- Pros: fewer digits, faster arithmetic for very large numbers
- Cons: WASM i64 operations can be slower on some platforms

### 3. Sign-Magnitude vs Two's Complement
- Current: sign-magnitude (separate sign byte + unsigned digits)
- Alternative: two's complement
- Trade-off: sign-magnitude is simpler for multiplication/division

### 4. Digit Order
- Current: most significant first
- Alternative: least significant first
- Pros of LSB first: simpler addition/subtraction (start from index 0)
- Cons: division/comparison need to start from end

### 5. Variable-Length Encoding
- Current: fixed 32-bit digits
- Alternative: use variable-length encoding for smaller allocations
- Pros: saves memory for numbers just above inline threshold
- Cons: more complex, slower

## Recommendations

For Porffor's use case (AOT compiler for WASM):

1. **Keep inline threshold at 2^51** - the current approach works and changing it requires careful pointer arithmetic updates

2. **Keep 32-bit digits** - i32 operations are well-optimized in WASM, and most BigInt values won't be astronomically large

3. **Consider LSB-first ordering** - would simplify the addition code (which currently needs `aLen - i` offset calculations)

4. **The current representation is reasonable** - it matches what V8 and other engines use conceptually
