# Skipped Test262 Tests

This file documents tests that were examined but skipped during debugging sessions, along with explanations for why they were skipped. This helps avoid re-investigating the same issues.

## Complex/Architectural Issues

### String Comparison Bug with Concatenation
- **Tests affected**: `built-ins/encodeURI/S15.1.3.3_A2.4_T1.js` and related
- **Issue**: `actual === hex4 + hex3 + hex2 + hex1` returns false but `hex4 + hex3 + hex2 + hex1 === actual` returns true. The order of operands matters when comparing a variable against an inline string concatenation where the strings come from function returns.
- **Root cause**: Unknown - likely a bug in Porffor's string comparison code generation when RHS is a complex expression
- **Complexity**: High - requires deep investigation into codegen.js performOp/compareStrings

### String Methods Not Converting `this` to String
- **Tests affected**: `built-ins/String/prototype/trimEnd/this-value-number.js` and similar
- **Issue**: `String.prototype.trimEnd.call(NaN)` returns `0` instead of `'NaN'`
- **Root cause**: String prototype methods don't call ToString on their `this` value before operating
- **Complexity**: High - affects many String.prototype methods

### Abstract Equality with Object Types
- **Tests affected**: `language/expressions/does-not-equals/S11.9.2_A7.2.js` and similar
- **Issue**: `new String("1") != true` returns wrong value. Object-to-primitive coercion not working in equality comparisons.
- **Root cause**: performOp doesn't implement full Abstract Equality Comparison algorithm for objects
- **Complexity**: High - requires implementing ToPrimitive in equality comparisons

### Sparse Array Length
- **Tests affected**: `built-ins/Array/prototype/join/S15.4.4.5_A1.2_T1.js`, `built-ins/Object/assign/target-Array.js` and similar
- **Issue**: `x = []; x[3] = 3;` doesn't update `x.length` to 4
- **Root cause**: Array index assignment doesn't automatically extend length
- **Complexity**: High - fundamental array behavior

### eval() Completion Values
- **Tests affected**: `language/statements/if/cptn-else-true-nrml.js` and similar
- **Issue**: `eval('2; if (true) { 3; } else { }')` returns `undefined` instead of `3`
- **Root cause**: Statement completion values not properly tracked/returned in eval
- **Complexity**: High - requires changes to statement code generation

## Precision Issues

### Number.prototype.toExponential Precision
- **Tests affected**: `built-ins/Number/prototype/toExponential/return-values.js`
- **Issue**: Floating point precision differences in exponential notation
- **Complexity**: Medium - requires careful floating point handling

### Math.sqrt Precision
- **Tests affected**: `built-ins/Math/sqrt/results.js`
- **Issue**: Displayed values look identical but underlying floats differ slightly
- **Complexity**: Medium - floating point precision

## Missing Exception Throws

### Boolean.prototype.toString Type Check
- **Tests affected**: `built-ins/Boolean/prototype/toString/S15.6.4.2_A2_T1.js`
- **Issue**: Should throw TypeError when called on non-Boolean, but doesn't
- **Complexity**: Low-Medium - needs type checking in toString

## Object Coercion Order

### String.prototype.lastIndexOf Coercion Order
- **Tests affected**: `built-ins/String/prototype/lastIndexOf/S15.5.4.8_A4_T1.js`
- **Issue**: Object coercion order incorrect - expects "intointeger" exception order
- **Complexity**: Medium - requires correct ToInteger/ToString ordering

## Arguments Object

### Arguments Not Distinguished from Array
- **Tests affected**: `built-ins/Array/isArray/15.4.3.2-1-13.js`
- **Issue**: `Array.isArray(arguments)` returns true but should return false
- **Root cause**: Porffor implements `arguments` as a regular array, not an Arguments exotic object
- **Complexity**: High - would require adding a new type and updating many places

## Collection Iteration During Modification

### Map/Set forEach Doesn't Handle Deletion During Iteration
- **Tests affected**: `built-ins/Map/prototype/forEach/deleted-values-during-foreach.js` and similar
- **Issue**: Deleting an entry during forEach still visits the deleted entry
- **Root cause**: forEach caches size at start and doesn't check if entries are "empty" (deleted)
- **Spec requirement**: Entries should be marked "empty" on delete, and forEach should skip empty entries
- **Complexity**: Medium-High - requires changing Map/Set internal storage to mark deleted entries

## Generic Method Application

### Array Methods on Non-Array Objects
- **Tests affected**: `built-ins/Array/prototype/sort/S15.4.4.11_A3_T1.js`, `built-ins/Array/prototype/map/15.4.4.19-1-12.js`, `built-ins/Array/prototype/every/15.4.4.16-1-10.js` and many similar
- **Issue**: Array.prototype methods don't work correctly when called on non-array objects (RegExp, Math, generic objects with length property)
- **Root cause**: Array methods assume `this` is an actual array, not a generic array-like object
- **Complexity**: High - requires generic object iteration support for all Array.prototype methods

## Property Access on Arrays

### Array Element Access Bypasses Getters/Setters
- **Tests affected**: `built-ins/Array/prototype/toReversed/get-descending-order.js` and similar
- **Issue**: `Object.defineProperty(arr, 0, { get: ... })` doesn't work - the getter is never called when accessing `arr[0]`
- **Root cause**: Porffor accesses array elements directly from internal storage, bypassing the property descriptor system
- **Complexity**: High - fundamental change to array element access in the compiler

## Primitive Wrapper Object Identity

### new Number/String/Boolean Don't Create Distinct Objects
- **Tests affected**: `built-ins/Object/is/not-same-value-x-y-object.js` and similar
- **Issue**: `new Number(0) === new Number(0)` returns true, but should return false (different objects)
- **Root cause**: `new Number(value)` returns `n as NumberObject` which casts the primitive to a typed value rather than creating a heap-allocated object with distinct identity
- **Complexity**: High - fundamental change to how primitive wrappers work in the type system

## Object Property Storage

### Duplicate Object Keys with String Object Characters
- **Tests affected**: `built-ins/Object/fromEntries/string-entry-object-succeeds.js` and similar
- **Issue**: When using characters from a String object as property keys, objects can have duplicate keys
- **Example**: `var s = Object("ab"); var o = {}; o["a"] = 1; o[s[0]] = 2;` creates an object with two "a" properties
- **Root cause**: The internal string representation from `s[0]` differs from a literal `"a"` string, even though they compare equal with `===`
- **Complexity**: High - fundamental issue in object property key comparison/storage
