read test262/index - notice that it writes to test262/results.json - I wonder what ones we can fix, a test fail, a compileError or a test timeout...

./porf precompile

node test262/index.js --threads=8

node --experimental-strip-types ./test262/index.js --log-errors "built-ins/Math/clz32/int32bit.js" 2>&1 | grep -E "🤠|❌|passed"


view the staged changes and suggest a commit message

## Commit (message) style

You should ideally have one commit per notable change (using amend/force push). Commit messages should be like `${file}: ${description}`. Don't be afraid to use long titles if needed, but try and be short if possible. Bonus points for detail in commit description. ~~Gold star for jokes in description too.~~

Examples:
```
builtins/date: impl toJSON
builtins/date: fix ToIntegerOrInfinity returning -0
codegen: fix inline wasm for unreachable
builtins/array: wip toReversed
builtins/tostring_number: impl radix
```

# Porffor - Codebase Overview

## 1. What is this project?

**Porffor** is an experimental **ahead-of-time (AOT) optimizing JavaScript/TypeScript compiler** that compiles to WebAssembly (Wasm), C, or native binaries. Key characteristics:

- **100% AOT compiled** - no JIT or interpreter; all compilation happens before execution
- **Zero runtime overhead** - minimal preluded code, small memory footprint
- **Multiple output targets**: WebAssembly, C source code, native binaries (via C)
- **Research project** - experimental, not production-ready

---

## 2. Directory Structure

```
porffor/
├── compiler/                 # Core compiler implementation
│   ├── builtins/            # 32 TypeScript files with JS standard library
│   ├── codegen.js           # Core Wasm code generation (7320 lines - largest)
│   ├── index.js             # Compiler orchestration
│   ├── wrap.js              # Main entry point & Wasm instantiation
│   ├── assemble.js          # Wasm binary assembly
│   ├── opt.js               # Wasm bytecode optimizer
│   ├── 2c.js                # Wasm-to-C transpiler
│   ├── cyclone.js           # Partial constant evaluator
│   ├── builtins.js          # Builtin function definitions
│   └── builtins_precompiled.js # Generated from builtins/
│
├── runtime/                 # CLI and runtime tools
│   ├── index.js             # Main CLI entry point
│   ├── repl.js              # REPL implementation
│   └── profile.js, debug.js # Development tools
│
├── test262/                 # ECMAScript test suite runner
│   ├── index.js             # Parallel test runner
│   └── harness.js           # Test utilities
│
└── bench/                   # Benchmarks
```

---

## 3. Main Components

| Component | File | Purpose |
|-----------|------|---------|
| **Parser** | `compiler/parse.js` | Supports Acorn, Babel, Meriyah, Hermes, OXC parsers |
| **Code Generator** | `compiler/codegen.js` | AST → Wasm IR (the heart of the compiler) |
| **Optimizer** | `compiler/opt.js` | Wasm bytecode optimization passes |
| **Assembler** | `compiler/assemble.js` | Wasm IR → binary Wasm module |
| **2C Transpiler** | `compiler/2c.js` | Wasm → C for native compilation |
| **Builtins** | `compiler/builtins/` | JS standard library in TypeScript |
| **Type System** | `compiler/types.js` | Type definitions and tagging |

---

## 4. Languages Used

- **JavaScript (ES2022+)**: Core compiler, runtime, CLI
- **TypeScript**: All builtin implementations in `compiler/builtins/`
- **WebAssembly**: Primary compilation target
- **C**: Secondary target via `2c.js`

---

## 5. How It Works (High Level)

```
JavaScript Source
       ↓
   [Parser] → AST
       ↓
  [Codegen] → Wasm IR
       ↓
 [Optimizer] → Optimized IR
       ↓
 [Assembler] → Binary Wasm
       ↓
   ┌─────────────────┐
   │  Output Target  │
   ├─────────────────┤
   │ • Wasm module   │
   │ • C source      │
   │ • Native binary │
   └─────────────────┘
```

### Key Architectural Decisions

- **Tagged values**: Each value is a pair (value, type_tag) enabling dynamic typing in static Wasm
- **ByteString optimization**: ASCII strings use 1 byte/char instead of 2
- **Linear memory model**: Direct memory layout with i32 pointers
- **Tree-shaking**: Removes unused imported functions

---

## 6. Key Entry Points

| Purpose | File |
|---------|------|
| **CLI** | `runtime/index.js` |
| **Compiler API** | `compiler/wrap.js` |
| **Compilation Pipeline** | `compiler/index.js` |
| **Code Generation** | `compiler/codegen.js` |

### CLI Commands

- `porf run file.js` - Compile and execute
- `porf compile file.js` - Compile to Wasm
- `porf native file.js` - Compile to native binary
- `porf c file.js` - Compile to C source

---

## 7. Design Philosophy

1. **Minimal runtime** - No VM loop, no interpreter overhead
2. **Compile-time decisions** - Maximum work done at compile time
3. **Wasm-first** - Built specifically for Wasm constraints (no GC proposal dependency)
4. **Self-contained** - Entire compiler written in JavaScript

---

## 8. Compilation Pipeline Details

### Phases

1. **Parse** (`parse.js`): JavaScript source → AST using configurable parser
2. **Semantic Analysis** (`semantic.js`): Variable scoping and naming
3. **Code Generation** (`codegen.js`): AST → Wasm IR (intermediate representation)
4. **Optimization** (`opt.js`): Basic (-O1) and advanced (-O2) optimizations
5. **Cyclone** (`cyclone.js`): Partial constant evaluation (experimental)
6. **Assembly** (`assemble.js`): Wasm IR → binary Wasm module
7. **2C** (`2c.js`): Optional Wasm → C transpilation for native binaries

### Memory Model

- **Linear Memory**: Wasm memory pages (65536 bytes each)
- **Pointers**: i32 indices into linear memory
- **String Types**:
  - Regular strings: UTF-16 (2 bytes per character)
  - ByteStrings: ASCII/Latin-1 (1 byte per character) for optimization

### Type System

Values are pairs: `(actual_value, type_tag)`
- Type tags (8 bits) allow dynamic typing in static Wasm
- Enables JavaScript's dynamic dispatch and `typeof` checks

---

## 9. Builtins

The `compiler/builtins/` directory contains TypeScript implementations of the JavaScript standard library:

- **Array operations** (`array.ts`)
- **String handling** (`string_f64.ts`, bytestring support)
- **Object manipulation** (`object.ts`, `_internal_object.ts`)
- **Math operations** (`math.ts`)
- **Date/Time** (`date.ts`)
- **Regular expressions** (`regexp.ts`)
- **Collections** (`map.ts`, `set.ts`)
- **JSON** (`json.ts`)
- **Promise/async** (`promise.ts`, `generator.ts`)
- **Console I/O** (`console.ts`)

These are precompiled into `builtins_precompiled.js` using `precompile.js`.

---

## 10. Testing

- **Test262**: ECMAScript conformance test suite in `test262/`
- **Parallel runner**: `test262/index.js`
- **Results tracking**: `test262/results.json`

---

## 11. Limitations

Intentional design constraints:

- No `eval()` or `Function()` (incompatible with AOT)
- Limited async/Promise support
- No dynamic class loading
- Limited reflection capabilities

---

## 12. Wasm Proposals Used

- **Multi-value** (required) - functions returning multiple values
- **Non-trapping float-to-int conversions** (required)
- **Bulk memory operations** (optional)
- **Exception handling** (optional)
- **Tail calls** (opt-in)
