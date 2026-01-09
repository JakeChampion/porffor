# Test262 Failure Analysis

**Current Status**: 30,553 / 51,946 passing (58.82%)

## Failure Categories by Complexity

### 1. TRIVIAL - Missing Static Methods/Properties (Est. +50-100 tests each)

These are methods that don't exist yet but have straightforward implementations.

#### Math.sumPrecise (3 tests remaining)
```
built-ins/Math/sumPrecise/* - 7/10 passing (70%)
```
Status: Partially implemented. Remaining failures likely edge cases.

#### ~~Symbol.toStringTag missing on some prototypes~~ ✅ DONE
~~WeakSet/WeakMap prototype Symbol.toStringTag~~ - 100% passing

#### ~~WeakMap.prototype.getOrInsert / getOrInsertComputed~~ ✅ MOSTLY DONE
```
built-ins/WeakMap/prototype/getOrInsert/* - 17/17 passing (100%)
built-ins/WeakMap/prototype/getOrInsertComputed/* - 20/22 passing (90.91%)
```
Status: getOrInsert is complete. getOrInsertComputed has 2 remaining failures:
- `check-callback-fn-args.js` - Compiler bug: `arguments` object doesn't work correctly in callbacks from precompiled builtins (rest params work fine)
- `getOrInsertComputed.js` - Property descriptor test

---

### 2. EASY - Missing Error Handling (~100-200 tests)

**Pattern**: `assert.throws failed: no exception was thrown` (16 occurrences in sample)

These tests expect exceptions that aren't being thrown.

#### Constructor validation (PARTIALLY BLOCKED)
Some constructor validation requires runtime prototype lookup (e.g., `Get(set, "add")`) which
Porffor resolves at precompile time. Tests that override `WeakSet.prototype.add = null` won't work.

**Fixed**:
- WeakSet.prototype.add: registered symbol check ✅ (77/85 tests passing)
- WeakMap getOrInsert: registered symbol check ✅ (17/17 tests passing)

**Blocked** (requires compiler changes for runtime prototype lookup):
- WeakSet/WeakMap constructors: `add`/`set` method validation when overridden

#### Method argument validation
- Missing `IsCallable` checks on callbacks
- Missing type checks on arguments

**Fix approach**: Add validation at start of methods:
```typescript
if (typeof callback !== 'function') throw new TypeError('...');
```

---

### 3. EASY-MEDIUM - Property Descriptor Issues (~50 tests)

**Pattern**: `verifyProperty: obj should have own property`

Methods exist but have wrong property descriptors (writable, enumerable, configurable).

**Example failures**:
```
built-ins/Math/prop-desc.js
```

**Fix approach**: Ensure methods are defined with correct descriptors.

---

### 4. MEDIUM - Iterator Protocol Issues (~100 tests)

**Pattern**: `Tried for..of on non-iterable type` (8 occurrences)

Generator functions don't iterate properly in Porffor.

**Affected areas**:
- Set methods with set-like objects using generators for keys()
- Any API expecting iterable with generator implementation

**Root cause**: Generator support is incomplete.

---

### 5. MEDIUM - Algorithm Optimization (~20 tests)

**Pattern**: Tests checking the *order* of operations

```
Set.prototype.intersection should not invoke .has on its argument when this.size > other.size
Set.prototype.difference should not call its argument's keys iterator when this.size <= arg.size
Set.prototype.isSupersetOf should not call its argument's keys iterator when this.size <= arg.size
```

**Fix approach**: Add size comparison optimization per spec:
```typescript
// In intersection:
const thisSize = _this.size;
const otherSize = record[0]; // from GetSetRecord
if (thisSize <= otherSize) {
  // iterate this, check has on other
} else {
  // iterate other.keys(), check has on this
}
```

---

### 6. MEDIUM-HARD - Subclass Support (~50 tests)

**Pattern**: `Set.prototype.X expects 'this' to be a Set`

Current implementation uses strict type checking which rejects subclasses.

**Affected tests**:
```
built-ins/Set/prototype/*/subclass*.js (across all Set methods)
```

**Fix approach**: Use prototype chain checking instead of exact type match:
```typescript
// Instead of:
if (Porffor.type(other) != Porffor.TYPES.set) throw ...
// Use:
if (!(_this instanceof Set)) throw ...
```

---

### 7. HARD - Large Missing APIs

#### Temporal API (5,492 tests - 4,286 + 1,206 intl)
Entire API not implemented. Would be a major project.

#### Iterator Helpers (373 tests - 1.88% passing)
`Iterator.prototype.map`, `.filter`, `.take`, etc.
Status: Only 7/373 passing. Most tests crash (326 💀).

#### Proxy (311 tests)
Proxy implementation is incomplete.

#### Intl APIs (~1,000+ tests)
NumberFormat, DateTimeFormat, Locale, etc.

---

### 8. COMPILER BUGS - Type Tracking Issues

#### ecma262.ToString type not preserved through function returns (~50+ tests)

**Pattern**: String methods fail when argument needs ToString conversion

**Affected methods**:
- `String.prototype.indexOf(Infinity)` returns -1 instead of correct index
- `String.prototype.includes(Infinity)` returns false instead of true
- `String.prototype.startsWith(Infinity)` returns false instead of true
- Similar issues with `NaN`, `-Infinity`, and other non-string inputs

**Root cause**: When `ecma262.ToString()` is called on a number and returns a bytestring (e.g., `'Infinity'`), the type tag is not correctly propagated back to the caller. The variable's type slot (`local+1`) still contains the original type (number) instead of the new type (bytestring).

**Example**:
```typescript
// In indexOf:
searchString = ecma262.ToString(searchString);  // Returns 'Infinity' as bytestring
// But Porffor.wasm`local.get ${searchString+1}` still returns TYPES.number
// So the type check fails and search doesn't work
```

**Workaround attempted**: Using `Porffor.type()` instead of direct wasm local.get, but this also fails.

**Fix required**: Compiler-level fix to ensure function return types are properly stored in the type slot when reassigning variables.

**Affected test files**:
```
built-ins/String/prototype/indexOf/searchstring-tostring.js
built-ins/String/prototype/includes/*
built-ins/String/prototype/startsWith/*
```

---

## Recommended Priority Order

### Phase 1: Quick Wins (Est. +200-300 tests)
1. ~~Add `Math.sumPrecise`~~ - Partially done (70%), fix remaining edge cases
2. ~~Add `Symbol.toStringTag` to WeakMap/WeakSet prototypes~~ ✅ DONE
3. ~~Add `WeakMap.prototype.getOrInsert` and `getOrInsertComputed`~~ - Mostly done (89.74%), fix remaining edge cases
4. Add missing error throwing in constructors

### Phase 2: Medium Effort (Est. +100-200 tests)
5. Fix Set method size optimization algorithms
6. Add missing property descriptors
7. Improve constructor iterable handling

### Phase 3: Larger Changes (Est. +100-500 tests)
8. Improve generator iteration support
9. Add subclass support to Set/Map methods
10. Iterator helpers implementation

### Phase 4: Major Features (Est. +1000+ tests)
11. Complete Proxy implementation
12. Intl APIs
13. Temporal API

---

## Specific Test Files by Category

### Missing Methods (Trivial) - Mostly Done
```
built-ins/Math/sumPrecise/*.js - 70% passing, 3 remaining (complex algorithm issues)
built-ins/WeakMap/prototype/getOrInsert/*.js - 100% passing ✅
built-ins/WeakMap/prototype/getOrInsertComputed/*.js - 90.91% passing (2 remaining: compiler bug + property descriptors)
```

### Missing Error Handling (Easy)
```
built-ins/WeakSet/add-not-callable-throws.js
built-ins/WeakSet/get-add-method-failure.js
built-ins/WeakMap/set-not-callable-throws.js
built-ins/WeakMap/get-set-method-failure.js
```

### Iterator Issues (Medium)
```
built-ins/Set/prototype/*/set-like-class-*.js
built-ins/Set/prototype/*/allows-set-like-*.js
```

### Subclass Issues (Medium-Hard)
```
built-ins/Set/prototype/*/subclass*.js
built-ins/Map/prototype/*/subclass*.js
```

---

## Error Pattern Summary

From `--errors` flag analysis:

| Count | Error Pattern | Category |
|-------|--------------|----------|
| 23 | `undefined is not a function` | Missing methods |
| 17 | `Cannot read property of undefined` | Missing properties |
| 16 | `no exception was thrown` | Missing validation |
| 15 | `expected Test262Error but got TypeError` | Wrong error type |
| 8 | `Tried for..of on non-iterable type` | Generator issues |
| 5 | `Expected SameValue(«0», «1»)` | Logic errors |
| 4 | `isConstructor invoked with non-function` | Constructor issues |
