# Porffor Project Notes

Porffor is a JavaScript to WebAssembly AOT (Ahead-of-Time) compiler.

## Key Commands

### Running JavaScript
```bash
# Run JS file or inline code
./porf <file.js>
echo 'console.log("hi")' | ./porf
```

### Precompiling Builtins
After modifying any file in `compiler/builtins/`, run:
```bash
./porf precompile
```
This regenerates `compiler/builtins_precompiled.js`.

### Test262 Suite

```bash
# Run all tests (takes ~1 minute)
node test262/index.js

# Run specific test directory
node test262/index.js built-ins/Set/prototype/union

# Run single test file (automatically adds --log-errors)
node test262/index.js built-ins/Set/prototype/union/allows-set-like-object.js

# Quick result-only output (no progress bar)
node test262/index.js --minimal

# Log errors for debugging (single-threaded)
node test262/index.js --log-errors built-ins/Set

# Track error types
node test262/index.js --errors

# Don't update results.json
node test262/index.js --dont-write-results

# Specify thread count for faster runs
node test262/index.js --threads=12
```

The results are saved to `test262/results.json` after full runs.

## Project Structure

- `compiler/codegen.js` - Main code generation
- `compiler/builtins/` - Built-in JS implementations (Set, Map, Array, etc.)
- `compiler/builtins/*.ts` - TypeScript files for builtins using Porffor-specific types
- `test262/` - Test262 conformance suite runner
- `test262/harness.js` - Test harness with helper functions

## Builtin Implementation Notes

### Porffor-Specific APIs
```typescript
// Type checking
Porffor.type(x) == Porffor.TYPES.set

// Memory allocation
const arr: any[] = Porffor.malloc();

// Direct WebAssembly operations
Porffor.wasm.i32.load(_this, 0, 0)
Porffor.wasm.i32.store(_this, value, 0, 0)

// Object checks
Porffor.object.isObject(obj)
```

### Important Quirks
- `typeof builtinObj.method` returns `undefined` even when the method works when called
- For built-in types, check `Porffor.type(x)` instead of relying on property access
- Array literals in builtins may not store functions correctly; use `Porffor.malloc()` with individual assignments instead
- Generator functions have limited support - prefer returning arrays when possible

### CRITICAL: Never Use `_this: any` in Prototype Methods

**DO NOT** change prototype method parameters from specific types to `any`. For example:
```typescript
// WRONG - causes non-deterministic precompile
export const __Error_prototype_toString = (_this: any) => { ... }

// CORRECT - use the specific type
export const __Error_prototype_toString = (_this: Error) => { ... }
```

Using `_this: any` in prototype methods causes the precompile to become non-deterministic, alternating between different function counts on each run. This happens because Porffor generates type-specific variants for `any` parameters based on what types it sees during compilation, and the precompiled output affects subsequent compilations in a feedback loop.

If you need a prototype method to work with objects passed via `.call()`, find an alternative approach that doesn't involve changing `_this` to `any`. The spec compliance can sometimes be sacrificed to maintain build determinism.

### Pattern for Set-like Objects (ES2024)
When implementing methods that accept "set-like" objects:
1. Add a fast path for native Set: `if (Porffor.type(other) == Porffor.TYPES.set)`
2. Fall back to GetSetRecord for set-like objects with size/has/keys properties

## Test Result Icons
- 🤠 pass
- ❌ fail (Test262Error)
- 💀 runtime error
- 🏗️ wasm compile error
- 💥 compile error
- ⏰ timeout

## Important: File Writing
NEVER use `cat` with heredocs or redirects to write files. Always use the Write tool instead.

## Important: Reading Files
NEVER use `cat` to read files. Always use the Read tool instead.
