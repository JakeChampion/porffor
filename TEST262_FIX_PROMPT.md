# Test262 Failure Fix Task

You are helping fix test262 conformance test failures in Porffor, a JavaScript to WebAssembly AOT compiler.

## Goal
Find and fix test262 failures one at a time. After each fix, find the next failure and continue.

## Key Commands

```bash
# Run all tests (takes ~1 minute)
node test262/index.js

# Run specific test
node test262/index.js built-ins/String/prototype/indexOf/some-test.js

# Run test directory
node test262/index.js built-ins/String/prototype/indexOf

# Precompile after modifying builtins
./porf precompile

# Quick test with porffor
./porf test.js
```

## Finding Failures

Read `test262/results.json` to find failures. The structure is:
- `passes`: array of passing test paths
- `fails`: array of Test262Error failures
- `runtimeErrors`: array of runtime error failures
- `compileErrors`: array of compile error failures
- `wasmErrors`: array of wasm compile error failures
- `timeouts`: array of timeout failures

Filter out tests in `test262/investigated_skips.txt` (gitignored local file for known architectural limitations).

Example script to find actionable failures:
```javascript
const results = require("./test262/results.json");
const fs = require("fs");
const skips = fs.readFileSync("./test262/investigated_skips.txt", "utf8")
  .split("\n")
  .filter(l => l && l[0] !== '#')
  .map(l => l.trim());

const fails = results.fails.filter(t => !skips.some(s => t.includes(s)));
console.log("Actionable failures:", fails.length);
fails.slice(0, 20).forEach(t => console.log(t));
```

## Fixing Process

1. **Pick a failure** - Start with simpler ones (String, Number, Math methods)
2. **Read the test** - Understand what it's testing
3. **Debug** - Write a minimal test case, run with `./porf test.js`
4. **Find the bug** - Check builtins in `compiler/builtins/`
5. **Fix it** - Edit the relevant `.ts` file
6. **Precompile** - Run `./porf precompile`
7. **Verify** - Run the specific test, then broader test suite
8. **Commit** - If fixed, commit with descriptive message

## Common Issues and Fixes

### NaN/Infinity in i32 files
If a bug involves NaN or Infinity being corrupted, the function needs to be in an f64 file:
- `string.ts` has `// @porf --valtype=i32` - NaN/Infinity get truncated
- `string_f64.ts` uses default f64 - can properly handle NaN/Infinity
- Move the function to the f64 file (don't create wrappers)

### Type coercion
- Use `ecma262.ToString()`, `ecma262.ToNumber()`, `ecma262.ToIntegerOrInfinity()`
- Check argument types with `Porffor.type(x) == Porffor.TYPES.xyz`
- Convert bytestring to string: `Porffor.bytestringToString(x)`

### Reading the spec
Test262 tests follow ECMAScript spec exactly. When a test fails:
1. Read the test's `info` comment for spec reference
2. Check if implementation matches spec behavior
3. Pay attention to edge cases (NaN, undefined, negative values)

## When to Skip

Add to `test262/investigated_skips.txt` (create if missing) when:
- Architectural limitation (e.g., prototype chain lookup issues)
- Requires unimplemented feature (e.g., Proxy, certain Symbol behaviors)
- Memory/performance limitation (e.g., large loop timeouts)

Format:
```
# Reason for skip - brief explanation
built-ins/path/to/test.js
```

## Project Structure

- `compiler/builtins/` - Built-in implementations
- `compiler/builtins/*.ts` - TypeScript with Porffor-specific types
- `compiler/codegen.js` - Main code generation
- `test262/` - Test suite and runner
- `test262/results.json` - Test results (updated after full runs)

## Tips

- Focus on one failure at a time
- Write minimal reproduction cases in `/tmp/test.js`
- Check if similar methods have the same bug
- Run `node test262/index.js --log-errors path/to/test.js` for detailed errors
- Commit after each successful fix before moving to the next

## Start

Run this to find the next failure to fix:
```bash
node -e '
const r = require("./test262/results.json");
const fs = require("fs");
let skips = [];
try { skips = fs.readFileSync("./test262/investigated_skips.txt", "utf8").split("\n").filter(l => l && l[0] !== "#"); } catch {}
const fails = r.fails.filter(t => !skips.some(s => t.includes(s)));
console.log("Fails:", fails.length);
fails.slice(0, 10).forEach(t => console.log(t));
'
```

Then pick one and start investigating!
