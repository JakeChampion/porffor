/// sta.js
var $DONOTEVALUATE = () => {
  throw 'Test262: This statement should not be evaluated.';
};

var $262 = {};
$262.gc = function() {};
$262.destroy = function() {};
$262.detachArrayBuffer = function(buffer) { return Porffor.arraybuffer.detach(buffer); };
$262.createRealm = function() { return { global: {} }; };
$262.agent = {};

/// assert.js
var assert = mustBeTrue => {
  if (mustBeTrue === true) {
    return;
  }

  throw new Test262Error('assert failed');
};
assert; // idk why exactly but this fixes many tests by forcing indirect ref

var __assert_throws = (expectedErrorConstructor, func) => {
  if (typeof func !== 'function') {
    throw new Test262Error('assert.throws invoked with a non-function value');
  }

  try {
    func();
  } catch (thrown) {
    if (thrown === null || typeof thrown !== 'object') {
      throw new Test262Error('assert.throws failed: thrown value was not an object');
    }
    if (thrown.constructor !== expectedErrorConstructor) {
      throw new Test262Error('assert.throws failed: expected ' + expectedErrorConstructor.name + ' but got ' + thrown.constructor.name);
    }
    return;
  }

  throw new Test262Error('assert.throws failed: no exception was thrown');
};

var __assert__isSameValue = (a, b) => {
  if (a === b) {
    // Handle +/-0 vs. -/+0
    return a !== 0 || 1 / a === 1 / b;
  }

  // Handle NaN vs. NaN
  return a !== a && b !== b;
};

var __assert__toString = value => {
  if (value === 0 && 1 / value === -Infinity) return '-0';
  // avoid calling toString on objects that might cause issues
  if (typeof value === 'object' && value !== null) return '[object]';
  if (typeof value === 'function') return '[function]';
  return '' + value;
};

var __assert_sameValue = (actual, expected) => {
  if (assert._isSameValue(actual, expected)) {
    return;
  }

  throw new Test262Error('Expected SameValue(«' + assert._toString(actual) + '», «' + assert._toString(expected) + '») to be true');
};

var __assert_notSameValue = (actual, unexpected) => {
  if (!assert._isSameValue(actual, unexpected)) {
    return;
  }

  throw new Test262Error('Expected SameValue(«' + assert._toString(actual) + '», «' + assert._toString(unexpected) + '») to be false');
};

/// compareArray.js
// hack: this has to be before the actual function decl (which is invalid)
var __compareArray_isSameValue = (a, b) => {
  if (a === 0 && b === 0) return 1 / a === 1 / b;
  if (a !== a && b !== b) return true;

  return a === b;
};

var compareArray = (a, b) => {
  // if either are nullish
  if (a == null || b == null) return false;

  if (b.length !== a.length) {
    return false;
  }

  for (var i = 0; i < a.length; i++) {
    if (!compareArray.isSameValue(b[i], a[i])) {
      return false;
    }
  }

  return true;
};

var __compareArray_format = arrayLike => {
  var out = '[';
  for (var i = 0; i < arrayLike.length; i++) {
    if (i > 0) out += ', ';
    var val = arrayLike[i];
    if (typeof val === 'symbol') {
      out += val.toString();
    } else {
      out += val;
    }
  }
  return out + ']';
};

var __assert_compareArray = (actual, expected, message) => {
  message = message === undefined ? '' : message;

  // Check for primitive arguments
  if (actual === null || (typeof actual !== 'object' && typeof actual !== 'function')) {
    throw new Test262Error("Actual argument [" + actual + "] shouldn't be primitive. " + message);
  }
  if (expected === null || (typeof expected !== 'object' && typeof expected !== 'function')) {
    throw new Test262Error("Expected argument [" + expected + "] shouldn't be primitive. " + message);
  }

  if (compareArray(actual, expected)) return;

  var format = compareArray.format;
  throw new Test262Error('Actual ' + format(actual) + ' and expected ' + format(expected) + ' should have the same contents. ' + message);
};

/// isConstructor.js
var isConstructor = f => {
  if (typeof f !== "function") {
    throw new Test262Error("isConstructor invoked with a non-function value");
  }

  return ecma262.IsConstructor(f);
};

/// assertRelativeDateMs.js
function assertRelativeDateMs(date, expectedMs) {
  var actualMs = date.valueOf();
  var localOffset = date.getTimezoneOffset() * 60000;

  if (actualMs - localOffset !== expectedMs) {
    throw new Test262Error('assertRelativeDateMs failed');
  }
}

/// decimalToHexString.js
function decimalToHexString(n) {
  var hex = "0123456789ABCDEF";
  n >>>= 0;
  var s = "";
  while (n) {
    s = hex[n & 0xf] + s;
    n >>>= 4;
  }
  return s.padStart(4, '0');
}

function decimalToPercentHexString(n) {
  var hex = "0123456789ABCDEF";
  return "%" + hex[(n >> 4) & 0xf] + hex[n & 0xf];
}

/// tcoHelper.js
var $MAX_ITERATIONS = 100000;

/// dateConstants.js
var date_1899_end = -2208988800001;
var date_1900_start = -2208988800000;
var date_1969_end = -1;
var date_1970_start = 0;
var date_1999_end = 946684799999;
var date_2000_start = 946684800000;
var date_2099_end = 4102444799999;
var date_2100_start = 4102444800000;

var start_of_time = -8.64e15;
var end_of_time = 8.64e15;

/// nans.js
var NaNs = [
  NaN,
  Number.NaN,
  NaN * 0,
  0/0,
  Infinity/Infinity,
  -(0/0)
];

/// testTypedArray.js
// Get the %TypedArray% intrinsic (shared prototype of all TypedArray constructors)
var TypedArray = Object.getPrototypeOf(Int8Array);

var floatArrayConstructors = [
  Float64Array,
  Float32Array
];

var nonClampedIntArrayConstructors = [
  Int32Array,
  Int16Array,
  Int8Array,
  Uint32Array,
  Uint16Array,
  Uint8Array
];

var intArrayConstructors = [
  Int32Array,
  Int16Array,
  Int8Array,
  Uint32Array,
  Uint16Array,
  Uint8Array,
  Uint8ClampedArray
];

var typedArrayConstructors = [
  Float64Array,
  Float32Array,
  Int32Array,
  Int16Array,
  Int8Array,
  Uint32Array,
  Uint16Array,
  Uint8Array,
  Uint8ClampedArray
];

function testWithTypedArrayConstructors(f, selected) {
  var constructors = selected || typedArrayConstructors;
  for (var i = 0; i < constructors.length; ++i) {
    f(constructors[i]);
  }
}

var nonAtomicsFriendlyTypedArrayConstructors = [
  Float64Array,
  Float32Array,
  Uint8ClampedArray
];

function testWithNonAtomicsFriendlyTypedArrayConstructors(f) {
  testWithTypedArrayConstructors(f, nonAtomicsFriendlyTypedArrayConstructors);
}

function testWithAtomicsFriendlyTypedArrayConstructors(f) {
  testWithTypedArrayConstructors(f, [
    Int32Array,
    Int16Array,
    Int8Array,
    Uint32Array,
    Uint16Array,
    Uint8Array,
  ]);
}

var __values, __expected, __fn, __ta, __taName;
function testTypedArrayConversions(byteConversionValues, fn) {
  __values = byteConversionValues.values;
  __expected = byteConversionValues.expected;
  __fn = fn;

  testWithTypedArrayConstructors(function(TA) {
    __ta = TA;
    __taName = TA.name.slice(0, -5);

    return __values.forEach(function(value, index) {
      var exp = __expected[__taName][index];
      var initial = 0;
      if (exp === 0) {
        initial = 1;
      }
      __fn(__ta, value, exp, initial);
    });
  });
}

function isFloatTypedArrayConstructor(arg) {
  return floatArrayConstructors.indexOf(arg) !== -1;
}

function floatTypedArrayConstructorPrecision(FA) {
  if (FA === Float32Array) {
    return "single";
  } else if (FA === Float64Array) {
    return "double";
  }
}

/// testBigIntTypedArray.js
// hack: we do not actually have an underlying TypedArray so just use Int8Array
var TypedArray = Int8Array;

function testWithBigIntTypedArrayConstructors(f, selected) {
  const constructors = selected || [
    BigInt64Array,
    BigUint64Array
  ];

  for (let i = 0; i < constructors.length; i++) {
    f(constructors[i]);
  }
}

/// resizableArrayBufferUtils.js
const builtinCtors = [
  Uint8Array,
  Int8Array,
  Uint16Array,
  Int16Array,
  Uint32Array,
  Int32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray,
  BigUint64Array,
  BigInt64Array
];

const floatCtors = [
  Float32Array,
  Float64Array
];

const ctors = builtinCtors;

function CreateResizableArrayBuffer(byteLength, maxByteLength) {
  return new ArrayBuffer(byteLength, { maxByteLength });
}

function Convert(item) {
  if (typeof item == 'bigint') {
    return Number(item);
  }

  return item;
}

function ToNumbers(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    result.push(Convert(item));
  }
  return result;
}

function MayNeedBigInt(ta, n) {
  assert.sameValue(typeof n, 'number');
  if (ta instanceof BigInt64Array || ta instanceof BigUint64Array) {
    return BigInt(n);
  }
  return n;
}

function CreateRabForTest(ctor) {
  const rab = CreateResizableArrayBuffer(4 * ctor.BYTES_PER_ELEMENT, 8 * ctor.BYTES_PER_ELEMENT);
  // Write some data into the array.
  const taWrite = new ctor(rab);
  for (let i = 0; i < 4; ++i) {
    taWrite[i] = MayNeedBigInt(taWrite, 2 * i);
  }
  return rab;
}

function CollectValuesAndResize(n, values, rab, resizeAfter, resizeTo) {
  if (typeof n == 'bigint') {
    values.push(Number(n));
  } else {
    values.push(n);
  }
  if (values.length == resizeAfter) {
    rab.resize(resizeTo);
  }
  return true;
}

function TestIterationAndResize(iterable, expected, rab, resizeAfter, newByteLength) {
  let values = [];
  let resized = false;
  var arrayValues = false;

  for (let value of iterable) {
    if (Array.isArray(value)) {
      arrayValues = true;
      values.push([
        value[0],
        Number(value[1])
      ]);
    } else {
      values.push(Number(value));
    }

    if (!resized && values.length == resizeAfter) {
      rab.resize(newByteLength);
      resized = true;
    }
  }

  if (!arrayValues) {
      assert.compareArray([].concat(values), expected, "TestIterationAndResize: list of iterated values");
  } else {
    for (let i = 0; i < expected.length; i++) {
      assert.compareArray(values[i], expected[i], "TestIterationAndResize: list of iterated lists of values");
    }
  }

  assert(resized, "TestIterationAndResize: resize condition should have been hit");
}

/// propertyHelper.js
function isConfigurable(obj, propName) {
  if (Object.hasOwn(obj, propName)) return Object.getOwnPropertyDescriptor(obj, propName).configurable;
  return true;
}

function isEnumerable(obj, propName) {
  return Object.hasOwn(obj, propName) && Object.getOwnPropertyDescriptor(obj, propName).enumerable;
}

function isSameValue(a, b) {
  if (a === 0 && b === 0) return 1 / a === 1 / b;
  if (a !== a && b !== b) return true;

  return a === b;
}

function isWritable(obj, propName, verifyProp, value) {
  if (Object.hasOwn(obj, propName) && Object.getOwnPropertyDescriptor(obj, propName).writable != null) return Object.getOwnPropertyDescriptor(obj, propName).writable;
  if (!Object.hasOwn(obj, propName) && Object.isExtensible(obj)) return true;

  var unlikelyValue = Array.isArray(obj) && propName === "length" ?
    Math.pow(2, 32) - 1 :
    "unlikelyValue";
  var newValue = value || unlikelyValue;
  var hadValue = Object.hasOwn(obj, propName);
  var oldValue = obj[propName];
  var writeSucceeded;

  try {
    obj[propName] = newValue;
  } catch {}

  writeSucceeded = isSameValue(obj[verifyProp || propName], newValue);

  if (writeSucceeded) {
    if (hadValue) {
      obj[propName] = oldValue;
    } else {
      delete obj[propName];
    }
  }

  return writeSucceeded;
}

function verifyProperty(obj, propName, desc, options) {
  // Validate required arguments
  if (arguments.length < 3) {
    throw new Test262Error('verifyProperty requires at least 3 arguments: obj, propName, and descriptor');
  }

  var originalDesc = Object.getOwnPropertyDescriptor(obj, propName);

  if (desc === undefined) {
    if (originalDesc !== undefined) {
      throw new Test262Error('verifyProperty: expected undefined descriptor');
    }

    return true;
  }

  if (typeof desc !== 'object' || desc === null) {
    throw new Test262Error('verifyProperty: desc must be an object');
  }

  if (!Object.hasOwn(obj, propName)) throw new Test262Error('verifyProperty: obj should have own property');

  if (Object.hasOwn(desc, 'value')) {
    const v = desc.value;
    if (!isSameValue(originalDesc.value, v)) {
      throw new Test262Error("obj['" + propName + "'] descriptor value should be " + v + "; obj['" + propName + "'] value should be " + v);
    }
  }

  if (Object.hasOwn(desc, 'enumerable')) {
    if (desc.enumerable !== originalDesc.enumerable ||
        desc.enumerable !== isEnumerable(obj, propName)) {
      throw new Test262Error('enumerable fail');
    }
  }

  if (Object.hasOwn(desc, 'writable')) {
    if (desc.writable !== originalDesc.writable ||
        desc.writable !== isWritable(obj, propName)) {
      throw new Test262Error('writable fail');
    }
  }

  if (Object.hasOwn(desc, 'configurable')) {
    if (desc.configurable !== originalDesc.configurable ||
        desc.configurable !== isConfigurable(obj, propName)) {
      throw new Test262Error('configurable fail');
    }
  }

  // delete the property (if configurable), then restore if requested
  if (originalDesc.configurable) {
    delete obj[propName];

    if (options && options.restore) {
      Object.defineProperty(obj, propName, originalDesc);
    }
  }

  return true;
}

function verifyEqualTo(obj, propName, value) {
  if (!isSameValue(obj[propName], value)) {
    throw new Test262Error('propertyHelper verifyEqualTo failed');
  }
}

function verifyWritable(obj, propName, verifyProp, value) {
  if (!verifyProp) {
    if (!Object.getOwnPropertyDescriptor(obj, propName).writable)
      throw new Test262Error('propertyHelper verifyWritable failed');
  }

  if (!isWritable(obj, propName, verifyProp, value)) {
    throw new Test262Error('propertyHelper verifyWritable failed');
  }
}

function verifyNotWritable(obj, propName, verifyProp, value) {
  if (!verifyProp) {
    if (Object.getOwnPropertyDescriptor(obj, propName).writable)
      throw new Test262Error('propertyHelper verifyNotWritable failed');
  }

  if (isWritable(obj, propName, verifyProp)) {
    throw new Test262Error('propertyHelper verifyNotWritable failed');
  }
}

function verifyEnumerable(obj, propName) {
  if (!isEnumerable(obj, propName)) {
    throw new Test262Error('propertyHelper verifyEnumerable failed');
  }
}

function verifyNotEnumerable(obj, propName) {
  if (isEnumerable(obj, propName)) {
    throw new Test262Error('propertyHelper verifyNotEnumerable failed');
  }
}

function verifyConfigurable(obj, propName) {
  if (!isConfigurable(obj, propName)) {
    throw new Test262Error('propertyHelper verifyConfigurable failed');
  }
}

function verifyNotConfigurable(obj, propName) {
  if (isConfigurable(obj, propName)) {
    throw new Test262Error('propertyHelper verifyNotConfigurable failed');
  }
}

function verifyCallableProperty(obj, propName, functionName, functionLength, desc, options) {
  var value = obj[propName];

  assert.sameValue(typeof value, "function",
    "obj['" + String(propName) + "'] descriptor should be a function");

  if (desc === undefined) {
    desc = {
      writable: true,
      enumerable: false,
      configurable: true,
      value: value
    };
  } else if (!Object.hasOwn(desc, "value") && !Object.hasOwn(desc, "get")) {
    desc.value = value;
  }

  verifyProperty(obj, propName, desc, options);

  if (functionName === undefined) {
    if (typeof propName === "symbol") {
      functionName = "[" + propName.description + "]";
    } else {
      functionName = propName;
    }
  }

  verifyProperty(value, "name", {
    value: functionName,
    writable: false,
    enumerable: false,
    configurable: desc.configurable
  }, options);

  verifyProperty(value, "length", {
    value: functionLength,
    writable: false,
    enumerable: false,
    configurable: desc.configurable
  }, options);
}

var verifyPrimordialCallableProperty = verifyCallableProperty;
var verifyPrimordialProperty = verifyProperty;

/// promiseHelper.js
function checkSequence(arr) {
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    if (x !== (i + 1)) {
      throw new Test262Error('promiseHelper checkSequence failed');
    }
  }

  return true;
}

function checkSettledPromises(settleds, expected) {
  assert.sameValue(Array.isArray(settleds), true);
  assert.sameValue(settleds.length, expected.length);

  for (let i = 0; i < settleds.length; i++) {
    const settled = settleds[i];
    const expected = expected[i];

    assert.sameValue(Object.hasOwn(settled, 'status'), true);
    assert.sameValue(settled.status, expected.status);

    if (settled.status === 'fulfilled') {
      assert.sameValue(Object.hasOwn(settled, 'value'), true);
      assert.sameValue(Object.hasOwn(settled, 'reason'), false);
      assert.sameValue(settled.value, expected.value);
    } else {
      assert.sameValue(settled.status, 'rejected');
      assert.sameValue(Object.hasOwn(settled, 'value'), false);
      assert.sameValue(Object.hasOwn(settled, 'reason'), true);
      assert.sameValue(settled.reason, expected.reason);
    }
  }
}

/// detachArrayBuffer.js
function $DETACHBUFFER(buffer) {
  if (typeof $262 !== 'undefined' && typeof $262.detachArrayBuffer === 'function') {
    $262.detachArrayBuffer(buffer);
  } else {
    Porffor.arraybuffer.detach(buffer);
  }
}

/// fnGlobalObject.js
function fnGlobalObject() {
  return globalThis;
}

/// doneprintHandle.js
function $DONE(error) {
  if (error) {
    Porffor.printStatic('Test262:AsyncTestFailure:Error: unknown');
  } else {
    Porffor.printStatic('Test262:AsyncTestComplete');
  }
}

/// byteConversionValues.js
var byteConversionValues = {
  values: [
    127,         // 2 ** 7 - 1
    128,         // 2 ** 7
    32767,       // 2 ** 15 - 1
    32768,       // 2 ** 15
    2147483647,  // 2 ** 31 - 1
    2147483648,  // 2 ** 31
    255,         // 2 ** 8 - 1
    256,         // 2 ** 8
    65535,       // 2 ** 16 - 1
    65536,       // 2 ** 16
    4294967295,  // 2 ** 32 - 1
    4294967296,  // 2 ** 32
    9007199254740991, // 2 ** 53 - 1
    9007199254740992, // 2 ** 53
    1.1,
    0.1,
    0.5,
    0.50000001,
    0.6,
    0.7,
    undefined,
    -1,
    -0,
    -0.1,
    -1.1,
    NaN,
    -127,        // - ( 2 ** 7 - 1 )
    -128,        // - ( 2 ** 7 )
    -32767,      // - ( 2 ** 15 - 1 )
    -32768,      // - ( 2 ** 15 )
    -2147483647, // - ( 2 ** 31 - 1 )
    -2147483648, // - ( 2 ** 31 )
    -255,        // - ( 2 ** 8 - 1 )
    -256,        // - ( 2 ** 8 )
    -65535,      // - ( 2 ** 16 - 1 )
    -65536,      // - ( 2 ** 16 )
    -4294967295, // - ( 2 ** 32 - 1 )
    -4294967296, // - ( 2 ** 32 )
    Infinity,
    -Infinity,
    0,
    2049,                         // an integer which rounds down under ties-to-even when cast to float16
    2051,                         // an integer which rounds up under ties-to-even when cast to float16
    0.00006103515625,             // smallest normal float16
    0.00006097555160522461,       // largest subnormal float16
    5.960464477539063e-8,         // smallest float16
    2.9802322387695312e-8,        // largest double which rounds to 0 when cast to float16
    2.980232238769532e-8,         // smallest double which does not round to 0 when cast to float16
    8.940696716308594e-8,         // a double which rounds up to a subnormal under ties-to-even when cast to float16
    1.4901161193847656e-7,        // a double which rounds down to a subnormal under ties-to-even when cast to float16
    1.490116119384766e-7,         // the next double above the one on the previous line one
    65504,                        // max finite float16
    65520,                        // smallest double which rounds to infinity when cast to float16
    65519.99999999999,            // largest double which does not round to infinity when cast to float16
    0.000061005353927612305,      // smallest double which rounds to a non-subnormal when cast to float16
    0.0000610053539276123         // largest double which rounds to a subnormal when cast to float16
  ],

  expected: {
    Int8: [
      127,  // 127
      -128, // 128
      -1,   // 32767
      0,    // 32768
      -1,   // 2147483647
      0,    // 2147483648
      -1,   // 255
      0,    // 256
      -1,   // 65535
      0,    // 65536
      -1,   // 4294967295
      0,    // 4294967296
      -1,   // 9007199254740991
      0,    // 9007199254740992
      1,    // 1.1
      0,    // 0.1
      0,    // 0.5
      0,    // 0.50000001,
      0,    // 0.6
      0,    // 0.7
      0,    // undefined
      -1,   // -1
      0,    // -0
      0,    // -0.1
      -1,   // -1.1
      0,    // NaN
      -127, // -127
      -128, // -128
      1,    // -32767
      0,    // -32768
      1,    // -2147483647
      0,    // -2147483648
      1,    // -255
      0,    // -256
      1,    // -65535
      0,    // -65536
      1,    // -4294967295
      0,    // -4294967296
      0,    // Infinity
      0,    // -Infinity
      0,    // 0
      1,    // 2049
      3,    // 2051
      0,    // 0.00006103515625
      0,    // 0.00006097555160522461
      0,    // 5.960464477539063e-8
      0,    // 2.9802322387695312e-8
      0,    // 2.980232238769532e-8
      0,    // 8.940696716308594e-8
      0,    // 1.4901161193847656e-7
      0,    // 1.490116119384766e-7
      -32,  // 65504
      -16,  // 65520
      -17,  // 65519.99999999999
      0,    // 0.000061005353927612305
      0     // 0.0000610053539276123
    ],
    Uint8: [
      127, // 127
      128, // 128
      255, // 32767
      0,   // 32768
      255, // 2147483647
      0,   // 2147483648
      255, // 255
      0,   // 256
      255, // 65535
      0,   // 65536
      255, // 4294967295
      0,   // 4294967296
      255, // 9007199254740991
      0,   // 9007199254740992
      1,   // 1.1
      0,   // 0.1
      0,   // 0.5
      0,   // 0.50000001,
      0,   // 0.6
      0,   // 0.7
      0,   // undefined
      255, // -1
      0,   // -0
      0,   // -0.1
      255, // -1.1
      0,   // NaN
      129, // -127
      128, // -128
      1,   // -32767
      0,   // -32768
      1,   // -2147483647
      0,   // -2147483648
      1,   // -255
      0,   // -256
      1,   // -65535
      0,   // -65536
      1,   // -4294967295
      0,   // -4294967296
      0,   // Infinity
      0,   // -Infinity
      0,   // 0
      1,   // 2049
      3,   // 2051
      0,   // 0.00006103515625
      0,   // 0.00006097555160522461
      0,   // 5.960464477539063e-8
      0,   // 2.9802322387695312e-8
      0,   // 2.980232238769532e-8
      0,   // 8.940696716308594e-8
      0,   // 1.4901161193847656e-7
      0,   // 1.490116119384766e-7
      224, // 65504
      240, // 65520
      239, // 65519.99999999999
      0,   // 0.000061005353927612305
      0    // 0.0000610053539276123
    ],
    Uint8Clamped: [
      127, // 127
      128, // 128
      255, // 32767
      255, // 32768
      255, // 2147483647
      255, // 2147483648
      255, // 255
      255, // 256
      255, // 65535
      255, // 65536
      255, // 4294967295
      255, // 4294967296
      255, // 9007199254740991
      255, // 9007199254740992
      1,   // 1.1,
      0,   // 0.1
      0,   // 0.5
      1,   // 0.50000001,
      1,   // 0.6
      1,   // 0.7
      0,   // undefined
      0,   // -1
      0,   // -0
      0,   // -0.1
      0,   // -1.1
      0,   // NaN
      0,   // -127
      0,   // -128
      0,   // -32767
      0,   // -32768
      0,   // -2147483647
      0,   // -2147483648
      0,   // -255
      0,   // -256
      0,   // -65535
      0,   // -65536
      0,   // -4294967295
      0,   // -4294967296
      255, // Infinity
      0,   // -Infinity
      0,   // 0
      255, // 2049
      255, // 2051
      0,   // 0.00006103515625
      0,   // 0.00006097555160522461
      0,   // 5.960464477539063e-8
      0,   // 2.9802322387695312e-8
      0,   // 2.980232238769532e-8
      0,   // 8.940696716308594e-8
      0,   // 1.4901161193847656e-7
      0,   // 1.490116119384766e-7
      255, // 65504
      255, // 65520
      255, // 65519.99999999999
      0,   // 0.000061005353927612305
      0    // 0.0000610053539276123
    ],
    Int16: [
      127,    // 127
      128,    // 128
      32767,  // 32767
      -32768, // 32768
      -1,     // 2147483647
      0,      // 2147483648
      255,    // 255
      256,    // 256
      -1,     // 65535
      0,      // 65536
      -1,     // 4294967295
      0,      // 4294967296
      -1,     // 9007199254740991
      0,      // 9007199254740992
      1,      // 1.1
      0,      // 0.1
      0,      // 0.5
      0,      // 0.50000001,
      0,      // 0.6
      0,      // 0.7
      0,      // undefined
      -1,     // -1
      0,      // -0
      0,      // -0.1
      -1,     // -1.1
      0,      // NaN
      -127,   // -127
      -128,   // -128
      -32767, // -32767
      -32768, // -32768
      1,      // -2147483647
      0,      // -2147483648
      -255,   // -255
      -256,   // -256
      1,      // -65535
      0,      // -65536
      1,      // -4294967295
      0,      // -4294967296
      0,      // Infinity
      0,      // -Infinity
      0,      // 0
      2049,   // 2049
      2051,   // 2051
      0,      // 0.00006103515625
      0,      // 0.00006097555160522461
      0,      // 5.960464477539063e-8
      0,      // 2.9802322387695312e-8
      0,      // 2.980232238769532e-8
      0,      // 8.940696716308594e-8
      0,      // 1.4901161193847656e-7
      0,      // 1.490116119384766e-7
      -32,    // 65504
      -16,    // 65520
      -17,    // 65519.99999999999
      0,      // 0.000061005353927612305
      0       // 0.0000610053539276123
    ],
    Uint16: [
      127,   // 127
      128,   // 128
      32767, // 32767
      32768, // 32768
      65535, // 2147483647
      0,     // 2147483648
      255,   // 255
      256,   // 256
      65535, // 65535
      0,     // 65536
      65535, // 4294967295
      0,     // 4294967296
      65535, // 9007199254740991
      0,     // 9007199254740992
      1,     // 1.1
      0,     // 0.1
      0,     // 0.5
      0,     // 0.50000001,
      0,     // 0.6
      0,     // 0.7
      0,     // undefined
      65535, // -1
      0,     // -0
      0,     // -0.1
      65535, // -1.1
      0,     // NaN
      65409, // -127
      65408, // -128
      32769, // -32767
      32768, // -32768
      1,     // -2147483647
      0,     // -2147483648
      65281, // -255
      65280, // -256
      1,     // -65535
      0,     // -65536
      1,     // -4294967295
      0,     // -4294967296
      0,     // Infinity
      0,     // -Infinity
      0,     // 0
      2049,  // 2049
      2051,  // 2051
      0,     // 0.00006103515625
      0,     // 0.00006097555160522461
      0,     // 5.960464477539063e-8
      0,     // 2.9802322387695312e-8
      0,     // 2.980232238769532e-8
      0,     // 8.940696716308594e-8
      0,     // 1.4901161193847656e-7
      0,     // 1.490116119384766e-7
      65504, // 65504
      65520, // 65520
      65519, // 65519.99999999999
      0,     // 0.000061005353927612305
      0      // 0.0000610053539276123
    ],
    Int32: [
      127,         // 127
      128,         // 128
      32767,       // 32767
      32768,       // 32768
      2147483647,  // 2147483647
      -2147483648, // 2147483648
      255,         // 255
      256,         // 256
      65535,       // 65535
      65536,       // 65536
      -1,          // 4294967295
      0,           // 4294967296
      -1,          // 9007199254740991
      0,           // 9007199254740992
      1,           // 1.1
      0,           // 0.1
      0,           // 0.5
      0,           // 0.50000001,
      0,           // 0.6
      0,           // 0.7
      0,           // undefined
      -1,          // -1
      0,           // -0
      0,           // -0.1
      -1,          // -1.1
      0,           // NaN
      -127,        // -127
      -128,        // -128
      -32767,      // -32767
      -32768,      // -32768
      -2147483647, // -2147483647
      -2147483648, // -2147483648
      -255,        // -255
      -256,        // -256
      -65535,      // -65535
      -65536,      // -65536
      1,           // -4294967295
      0,           // -4294967296
      0,           // Infinity
      0,           // -Infinity
      0,           // 0
      2049,        // 2049
      2051,        // 2051
      0,           // 0.00006103515625
      0,           // 0.00006097555160522461
      0,           // 5.960464477539063e-8
      0,           // 2.9802322387695312e-8
      0,           // 2.980232238769532e-8
      0,           // 8.940696716308594e-8
      0,           // 1.4901161193847656e-7
      0,           // 1.490116119384766e-7
      65504,       // 65504
      65520,       // 65520
      65519,       // 65519.99999999999
      0,           // 0.000061005353927612305
      0            // 0.0000610053539276123
    ],
    Uint32: [
      127,        // 127
      128,        // 128
      32767,      // 32767
      32768,      // 32768
      2147483647, // 2147483647
      2147483648, // 2147483648
      255,        // 255
      256,        // 256
      65535,      // 65535
      65536,      // 65536
      4294967295, // 4294967295
      0,          // 4294967296
      4294967295, // 9007199254740991
      0,          // 9007199254740992
      1,          // 1.1
      0,          // 0.1
      0,          // 0.5
      0,          // 0.50000001,
      0,          // 0.6
      0,          // 0.7
      0,          // undefined
      4294967295, // -1
      0,          // -0
      0,          // -0.1
      4294967295, // -1.1
      0,          // NaN
      4294967169, // -127
      4294967168, // -128
      4294934529, // -32767
      4294934528, // -32768
      2147483649, // -2147483647
      2147483648, // -2147483648
      4294967041, // -255
      4294967040, // -256
      4294901761, // -65535
      4294901760, // -65536
      1,          // -4294967295
      0,          // -4294967296
      0,          // Infinity
      0,          // -Infinity
      0,          // 0
      2049,       // 2049
      2051,       // 2051
      0,          // 0.00006103515625
      0,          // 0.00006097555160522461
      0,          // 5.960464477539063e-8
      0,          // 2.9802322387695312e-8
      0,          // 2.980232238769532e-8
      0,          // 8.940696716308594e-8
      0,          // 1.4901161193847656e-7
      0,          // 1.490116119384766e-7
      65504,      // 65504
      65520,      // 65520
      65519,      // 65519.99999999999
      0,          // 0.000061005353927612305
      0           // 0.0000610053539276123
    ],
    Float16: [
      127,                    // 127
      128,                    // 128
      32768,                  // 32767
      32768,                  // 32768
      Infinity,               // 2147483647
      Infinity,               // 2147483648
      255,                    // 255
      256,                    // 256
      Infinity,               // 65535
      Infinity,               // 65536
      Infinity,               // 4294967295
      Infinity,               // 4294967296
      Infinity,               // 9007199254740991
      Infinity,               // 9007199254740992
      1.099609375,            // 1.1
      0.0999755859375,        // 0.1
      0.5,                    // 0.5
      0.5,                    // 0.50000001,
      0.60009765625,          // 0.6
      0.7001953125,           // 0.7
      NaN,                    // undefined
      -1,                     // -1
      -0,                     // -0
      -0.0999755859375,       // -0.1
      -1.099609375,           // -1.1
      NaN,                    // NaN
      -127,                   // -127
      -128,                   // -128
      -32768,                 // -32767
      -32768,                 // -32768
      -Infinity,              // -2147483647
      -Infinity,              // -2147483648
      -255,                   // -255
      -256,                   // -256
      -Infinity,              // -65535
      -Infinity,              // -65536
      -Infinity,              // -4294967295
      -Infinity,              // -4294967296
      Infinity,               // Infinity
      -Infinity,              // -Infinity
      0,                      // 0
      2048,                   // 2049
      2052,                   // 2051
      0.00006103515625,       // 0.00006103515625
      0.00006097555160522461, // 0.00006097555160522461
      5.960464477539063e-8,   // 5.960464477539063e-8
      0,                      // 2.9802322387695312e-8
      5.960464477539063e-8,   // 2.980232238769532e-8
      1.1920928955078125e-7,  // 8.940696716308594e-8
      1.1920928955078125e-7,  // 1.4901161193847656e-7
      1.7881393432617188e-7,  // 1.490116119384766e-7
      65504,                  // 65504
      Infinity,               // 65520
      65504,                  // 65519.99999999999
      0.00006103515625,       // 0.000061005353927612305
      0.00006097555160522461  // 0.0000610053539276123
    ],
    Float32: [
      127,                     // 127
      128,                     // 128
      32767,                   // 32767
      32768,                   // 32768
      2147483648,              // 2147483647
      2147483648,              // 2147483648
      255,                     // 255
      256,                     // 256
      65535,                   // 65535
      65536,                   // 65536
      4294967296,              // 4294967295
      4294967296,              // 4294967296
      9007199254740992,        // 9007199254740991
      9007199254740992,        // 9007199254740992
      1.100000023841858,       // 1.1
      0.10000000149011612,     // 0.1
      0.5,                     // 0.5
      0.5,                     // 0.50000001,
      0.6000000238418579,      // 0.6
      0.699999988079071,       // 0.7
      NaN,                     // undefined
      -1,                      // -1
      -0,                      // -0
      -0.10000000149011612,    // -0.1
      -1.100000023841858,      // -1.1
      NaN,                     // NaN
      -127,                    // -127
      -128,                    // -128
      -32767,                  // -32767
      -32768,                  // -32768
      -2147483648,             // -2147483647
      -2147483648,             // -2147483648
      -255,                    // -255
      -256,                    // -256
      -65535,                  // -65535
      -65536,                  // -65536
      -4294967296,             // -4294967295
      -4294967296,             // -4294967296
      Infinity,                // Infinity
      -Infinity,               // -Infinity
      0,                       // 0
      2049,                    // 2049
      2051,                    // 2051
      0.00006103515625,        // 0.00006103515625
      0.00006097555160522461,  // 0.00006097555160522461
      5.960464477539063e-8,    // 5.960464477539063e-8
      2.9802322387695312e-8,   // 2.9802322387695312e-8
      2.9802322387695312e-8,   // 2.980232238769532e-8
      8.940696716308594e-8,    // 8.940696716308594e-8
      1.4901161193847656e-7,   // 1.4901161193847656e-7
      1.4901161193847656e-7,   // 1.490116119384766e-7
      65504,                   // 65504
      65520,                   // 65520
      65520,                   // 65519.99999999999
      0.000061005353927612305, // 0.000061005353927612305
      0.000061005353927612305  // 0.0000610053539276123
    ],
    Float64: [
      127,         // 127
      128,         // 128
      32767,       // 32767
      32768,       // 32768
      2147483647,  // 2147483647
      2147483648,  // 2147483648
      255,         // 255
      256,         // 256
      65535,       // 65535
      65536,       // 65536
      4294967295,  // 4294967295
      4294967296,  // 4294967296
      9007199254740991, // 9007199254740991
      9007199254740992, // 9007199254740992
      1.1,         // 1.1
      0.1,         // 0.1
      0.5,         // 0.5
      0.50000001,  // 0.50000001,
      0.6,         // 0.6
      0.7,         // 0.7
      NaN,         // undefined
      -1,          // -1
      -0,          // -0
      -0.1,        // -0.1
      -1.1,        // -1.1
      NaN,         // NaN
      -127,        // -127
      -128,        // -128
      -32767,      // -32767
      -32768,      // -32768
      -2147483647, // -2147483647
      -2147483648, // -2147483648
      -255,        // -255
      -256,        // -256
      -65535,      // -65535
      -65536,      // -65536
      -4294967295, // -4294967295
      -4294967296, // -4294967296
      Infinity,    // Infinity
      -Infinity,   // -Infinity
      0,           // 0
      2049,                    // 2049
      2051,                    // 2051
      0.00006103515625,        // 0.00006103515625
      0.00006097555160522461,  // 0.00006097555160522461
      5.960464477539063e-8,    // 5.960464477539063e-8
      2.9802322387695312e-8,   // 2.9802322387695312e-8
      2.980232238769532e-8,    // 2.980232238769532e-8
      8.940696716308594e-8,    // 8.940696716308594e-8
      1.4901161193847656e-7,   // 1.4901161193847656e-7
      1.490116119384766e-7,    // 1.490116119384766e-7
      65504,                   // 65504
      65520,                   // 65520
      65519.99999999999,       // 65519.99999999999
      0.000061005353927612305, // 0.000061005353927612305
      0.0000610053539276123    // 0.0000610053539276123
    ]
  }
};

/// deepEqual.js
var EQUAL = 1;
var NOT_EQUAL = -1;
var UNKNOWN = 0;

function setCache(cache, left, right, result) {
  var otherCache;

  otherCache = cache.get(left);
  if (!otherCache) cache.set(left, otherCache = new Map());
  otherCache.set(right, result);

  otherCache = cache.get(right);
  if (!otherCache) cache.set(right, otherCache = new Map());
  otherCache.set(left, result);
}

function getCache(cache, left, right) {
  var otherCache;
  var result;

  otherCache = cache.get(left);
  result = otherCache && otherCache.get(right);
  if (result) return result;

  otherCache = cache.get(right);
  result = otherCache && otherCache.get(left);
  if (result) return result;

  return UNKNOWN;
}

function cacheComparison(a, b, compare, cache) {
  var result = compare(a, b, cache);
  if (cache && (result === EQUAL || result === NOT_EQUAL)) {
    setCache(cache, a, b, result);
  }
  return result;
}

function isBoxed(value) {
  return value instanceof String
    || value instanceof Number
    || value instanceof Boolean
    || value instanceof Symbol
    || value instanceof BigInt;
}

function fail() {
  return NOT_EQUAL;
}

function compareIf(a, b, test, compare, cache) {
  return !test(a)
    ? !test(b) ? UNKNOWN : NOT_EQUAL
    : !test(b) ? NOT_EQUAL : cacheComparison(a, b, compare, cache);
}

function compareEquality(a, b, cache) {
  return compareIf(a, b, isOptional, compareOptionality)
    || compareIf(a, b, isPrimitiveEquatable, comparePrimitiveEquality)
    || compareIf(a, b, isObjectEquatable, compareObjectEquality, cache)
    || NOT_EQUAL;
}

function tryCompareStrictEquality(a, b) {
  return a === b ? EQUAL : UNKNOWN;
}

function tryCompareTypeOfEquality(a, b) {
  return typeof a !== typeof b ? NOT_EQUAL : UNKNOWN;
}

function tryCompareToStringTagEquality(a, b) {
  var aTag = Symbol.toStringTag in a ? a[Symbol.toStringTag] : undefined;
  var bTag = Symbol.toStringTag in b ? b[Symbol.toStringTag] : undefined;
  return aTag !== bTag ? NOT_EQUAL : UNKNOWN;
}

function isOptional(value) {
  return value === undefined
    || value === null;
}

function compareOptionality(a, b) {
  return tryCompareStrictEquality(a, b)
    || NOT_EQUAL;
}

function isPrimitiveEquatable(value) {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'bigint':
      return true;
    default:
      return isBoxed(value);
  }
}

function comparePrimitiveEquality(a, b) {
  if (isBoxed(a)) a = a.valueOf();
  if (isBoxed(b)) b = b.valueOf();

  return tryCompareStrictEquality(a, b)
    || tryCompareTypeOfEquality(a, b)
    || compareIf(a, b, isNaNEquatable, compareNaNEquality)
    || NOT_EQUAL;
}

function isNaNEquatable(value) {
  return typeof value === 'number';
}

function compareNaNEquality(a, b) {
  return isNaN(a) && isNaN(b) ? EQUAL : NOT_EQUAL;
}

function isObjectEquatable(value) {
  return typeof value === 'object';
}

function compareObjectEquality(a, b, cache) {
  if (!cache) cache = new Map();

  return getCache(cache, a, b)
    || setCache(cache, a, b, EQUAL) // consider equal for now
    || cacheComparison(a, b, tryCompareStrictEquality, cache)
    || cacheComparison(a, b, tryCompareToStringTagEquality, cache)
    || compareIf(a, b, isValueOfEquatable, compareValueOfEquality)
    || compareIf(a, b, isToStringEquatable, compareToStringEquality)
    || compareIf(a, b, isArrayLikeEquatable, compareArrayLikeEquality, cache)
    || compareIf(a, b, isStructurallyEquatable, compareStructuralEquality, cache)
    || compareIf(a, b, isIterableEquatable, compareIterableEquality, cache)
    || cacheComparison(a, b, fail, cache);
}

function isValueOfEquatable(value) {
  return value instanceof Date;
}

function compareValueOfEquality(a, b) {
  return compareIf(a.valueOf(), b.valueOf(), isPrimitiveEquatable, comparePrimitiveEquality)
    || NOT_EQUAL;
}

function isToStringEquatable(value) {
  return value instanceof RegExp;
}

function compareToStringEquality(a, b) {
  return compareIf(a.toString(), b.toString(), isPrimitiveEquatable, comparePrimitiveEquality)
    || NOT_EQUAL;
}

function isArrayLikeEquatable(value) {
  return Array.isArray(value)
    || value instanceof Uint8Array
    || value instanceof Uint8ClampedArray
    || value instanceof Uint16Array
    || value instanceof Uint32Array
    || value instanceof Int8Array
    || value instanceof Int16Array
    || value instanceof Int32Array
    || value instanceof Float32Array
    || value instanceof Float64Array;
}

function compareArrayLikeEquality(a, b, cache) {
  if (a.length !== b.length) return NOT_EQUAL;
  for (var i = 0; i < a.length; i++) {
    if (compareEquality(a[i], b[i], cache) === NOT_EQUAL) {
      return NOT_EQUAL;
    }
  }
  return EQUAL;
}

function isStructurallyEquatable(value) {
  return !(value instanceof Promise // only comparable by reference
    || value instanceof WeakMap // only comparable by reference
    || value instanceof WeakSet // only comparable by reference
    || value instanceof Map // comparable via @@iterator
    || value instanceof Set); // comparable via @@iterator
}

function compareStructuralEquality(a, b, cache) {
  var aKeys = [];
  for (var key in a) aKeys.push(key);

  var bKeys = [];
  for (var key in b) bKeys.push(key);

  if (aKeys.length !== bKeys.length) {
    return NOT_EQUAL;
  }

  aKeys.sort();
  bKeys.sort();

  for (var i = 0; i < aKeys.length; i++) {
    var aKey = aKeys[i];
    var bKey = bKeys[i];
    if (compareEquality(aKey, bKey, cache) === NOT_EQUAL) {
      return NOT_EQUAL;
    }
    if (compareEquality(a[aKey], b[bKey], cache) === NOT_EQUAL) {
      return NOT_EQUAL;
    }
  }

  return EQUAL;
}

// hack: do iterables via for..of
function isIterableEquatable(value) {
  try {
    for (const _ of value) { break; }
    return true;
  } catch {
    return false;
  }
}

function compareIterableEquality(a, b, cache) {
  let aValues = [];
  for (const x of a) aValues.push(x);

  let bValues = [];
  for (const x of b) bValues.push(x);

  return compareArrayLikeEquality(aValues, bValues, cache);
}

var __assert_deepEqual__compare = (a, b) => {
  return compareEquality(a, b) === EQUAL;
};

var __assert_deepEqual = (actual, expected) => {
  if (!assert.deepEqual._compare(actual, expected)) {
    throw new Test262Error('assert.deepEqual failed');
  }
};

/// asyncHelpers.js
const asyncTest = testFunc => {
  if (typeof $DONE !== "function") {
    throw new Test262Error("asyncTest called without async flag");
  }

  if (typeof testFunc !== "function") {
    $DONE(new Test262Error("asyncTest called with non-function argument"));
    return;
  }

  try {
    testFunc().then(() => {
      $DONE();
    }, error => {
      $DONE(error);
    });
  } catch (syncError) {
    $DONE(syncError);
  }
};

var __assert_throwsAsync = (expectedErrorConstructor, func) => {
  // Wrap in Promise so validation errors become rejections (matching original behavior)
  return new Promise(resolve => {
    if (typeof expectedErrorConstructor !== 'function') {
      throw new Test262Error('assert.throwsAsync called with an argument that is not an error constructor');
    }
    if (typeof func !== 'function') {
      throw new Test262Error('assert.throwsAsync called with an argument that is not a function');
    }

    var expectedName = expectedErrorConstructor.name;
    var expectation = 'Expected a ' + expectedName + ' to be thrown asynchronously';

    var res;
    try {
      res = func();
    } catch {
      throw new Test262Error(expectation + ' but the function threw synchronously');
    }

    // Note: We don't check typeof res.then !== 'function' because in Porffor
    // typeof for builtin object methods returns 'undefined' even though calling works.
    // The try-catch around res.then() below will catch non-thenables.
    if (res === null || typeof res !== 'object') {
      throw new Test262Error(expectation + ' but result was not a thenable');
    }

    var onResFulfilled, onResRejected;
    var resSettlementP = new Promise((onFulfilled, onRejected) => {
      onResFulfilled = onFulfilled;
      onResRejected = onRejected;
    });

    try {
      res.then(onResFulfilled, onResRejected);
    } catch {
      throw new Test262Error(expectation + ' but .then threw synchronously');
    }

    resolve(resSettlementP.then(
      () => {
        throw new Test262Error(expectation + ' but no exception was thrown at all');
      },
      thrown => {
        if (thrown === null || typeof thrown !== 'object') {
          throw new Test262Error(expectation + ' but thrown value was not an object');
        }
        if (thrown.constructor !== expectedErrorConstructor) {
          var actualName = thrown.constructor.name;
          if (expectedName === actualName) {
            throw new Test262Error(expectation + ' but got a different error constructor with the same name');
          }
          throw new Test262Error(expectation + ' but got a ' + actualName);
        }
      }
    ));
  });
};

/// nativeFunctionMatcher.js
// Matches various forms of native function source
const validateNativeFunctionSource = source => {
  // Check for "native code" somewhere inside brackets (allows spaces like [ native code ])
  // Search all bracket pairs from right to left to find the innermost native code marker
  let foundNativeCode = false;
  let searchStart = source.length;
  while (searchStart > 0) {
    const closeIdx = source.lastIndexOf(']', searchStart - 1);
    if (closeIdx === -1) break;

    // Find matching open bracket, accounting for nesting
    let depth = 1;
    let openIdx = closeIdx - 1;
    while (openIdx >= 0 && depth > 0) {
      if (source[openIdx] === ']') depth++;
      else if (source[openIdx] === '[') depth--;
      openIdx--;
    }
    openIdx++; // adjust to point at the '['

    if (depth === 0) {
      const inside = source.slice(openIdx + 1, closeIdx);
      if (inside.includes('native') && inside.includes('code')) {
        foundNativeCode = true;
        break;
      }
    }
    searchStart = openIdx;
  }

  if (!foundNativeCode) {
    throw new Test262Error('validateNativeFunctionSource failed: no [native code]');
  }
  if (!source.includes('function')) {
    throw new Test262Error('validateNativeFunctionSource failed: no function keyword');
  }

  // Check if it starts with a line comment (entire string would be a comment)
  let i = 0;
  // Skip whitespace at start
  while (i < source.length && (source[i] === ' ' || source[i] === '\t' || source[i] === '\n' || source[i] === '\r')) {
    i++;
  }
  // Check for line comment at start
  if (source[i] === '/' && source[i + 1] === '/') {
    throw new Test262Error('validateNativeFunctionSource failed: starts with line comment');
  }

  // Check for unclosed block comment in the entire source
  let commentIdx = 0;
  while (true) {
    const openComment = source.indexOf('/*', commentIdx);
    if (openComment === -1) break;
    const closeComment = source.indexOf('*/', openComment + 2);
    if (closeComment === -1) {
      throw new Test262Error('validateNativeFunctionSource failed: unclosed block comment');
    }
    commentIdx = closeComment + 2;
  }

  // Check for unmatched brackets and parens in the function header
  // Find "function" keyword position to start our header analysis
  const funcIdx = source.indexOf('function');
  if (funcIdx === -1) {
    throw new Test262Error('validateNativeFunctionSource failed: no function keyword');
  }

  // Find the opening brace of the outer function body
  // Track parens and braces to handle nested functions in default params
  let parenDepth = 0;
  let braceDepth = 0;
  let foundFirstParen = false;
  let outerBraceIdx = -1;

  for (let j = funcIdx; j < source.length; j++) {
    const c = source[j];
    if (c === '(') {
      parenDepth++;
      foundFirstParen = true;
    } else if (c === ')') {
      parenDepth--;
      if (parenDepth < 0) {
        throw new Test262Error('validateNativeFunctionSource failed: unmatched )');
      }
    } else if (c === '{') {
      if (foundFirstParen && parenDepth === 0) {
        outerBraceIdx = j;
        break;
      }
      // Entering a nested block (like a function body in default params)
      // If we hit { without params being closed, that's an error
      if (!foundFirstParen) {
        throw new Test262Error('validateNativeFunctionSource failed: unmatched (');
      }
      braceDepth++;
    } else if (c === '}') {
      braceDepth--;
    }
  }

  // If we never found the outer brace, parens weren't balanced
  if (outerBraceIdx === -1 && foundFirstParen && parenDepth !== 0) {
    throw new Test262Error('validateNativeFunctionSource failed: unmatched (');
  }

  // If we found an outer brace, check bracket matching in the function name area
  // The function name area is between "function" and the first "(" that's NOT inside brackets
  if (outerBraceIdx !== -1) {
    // Find the first ( after funcIdx that's at bracket depth 0
    let firstOuterParenIdx = -1;
    let bracketDepth = 0;
    let inString = false;
    let stringChar = '';
    for (let j = funcIdx + 8; j < source.length; j++) {
      const c = source[j];
      if (inString) {
        if (c === stringChar) inString = false;
      } else if (c === '"' || c === "'") {
        inString = true;
        stringChar = c;
      } else if (c === '[') {
        bracketDepth++;
      } else if (c === ']') {
        bracketDepth--;
        if (bracketDepth < 0) {
          throw new Test262Error('validateNativeFunctionSource failed: unmatched ]');
        }
      } else if (c === '(' && bracketDepth === 0) {
        firstOuterParenIdx = j;
        break;
      }
    }

    // If we exited without finding a paren and bracket depth != 0, there's an unmatched [
    if (firstOuterParenIdx === -1 && bracketDepth !== 0) {
      throw new Test262Error('validateNativeFunctionSource failed: unmatched [');
    }
  }
};

const assertToStringOrNativeFunction = function(fn, expected) {
  const actual = fn.toString();
  try {
    assert.sameValue(actual, expected);
  } catch {
    assertNativeFunction(fn, expected);
  }
};

const assertNativeFunction = function(fn, special) {
  const actual = fn.toString();
  try {
    validateNativeFunctionSource(actual);
  } catch {
    throw new Test262Error('assertNativeFunction failed');
  }
};

/// compareIterator.js
var __assert_compareIterator = (iter, validators) => {
  var i, result;
  for (i = 0; i < validators.length; i++) {
    result = iter.next();
    assert(!result.done);
    validators[i](result.value);
  }

  result = iter.next();
  assert(result.done);
  assert.sameValue(result.value, undefined);
};

/// regExpUtils.js
function buildString(args) {
  const loneCodePoints = args.loneCodePoints;
  const ranges = args.ranges;
  let result = String.fromCodePoint(...loneCodePoints);
  for (let i = 0; i < ranges.length; i++) {
    let range = ranges[i];
    let start = range[0];
    let end = range[1];
    for (let codePoint = start; codePoint <= end; codePoint++) {
      result += String.fromCodePoint(codePoint);
    }
  }
  return result;
}

// function printCodePoint(codePoint) {
//   const hex = codePoint
//     .toString(16)
//     .toUpperCase()
//     .padStart(6, "0");
//   return `U+${hex}`;
// }

// function printStringCodePoints(string) {
//   const buf = [];
//   for (let symbol of string) {
//     let formatted = printCodePoint(symbol.codePointAt(0));
//     buf.push(formatted);
//   }
//   return buf.join(' ');
// }

function testPropertyEscapes(regExp, string, expression) {
  if (!regExp.test(string)) {
    for (let symbol of string) {
      // let formatted = printCodePoint(symbol.codePointAt(0));
      assert(
        regExp.test(symbol),
        // `\`${ expression }\` should match ${ formatted } (\`${ symbol }\`)`
      );
    }
  }
}

function testPropertyOfStrings(args) {
  // Use member expressions rather than destructuring `args` for improved
  // compatibility with engines that only implement assignment patterns
  // partially or not at all.
  const regExp = args.regExp;
  const expression = args.expression;
  const matchStrings = args.matchStrings;
  const nonMatchStrings = args.nonMatchStrings;
  const allStrings = matchStrings.join('');
  if (!regExp.test(allStrings)) {
    for (let string of matchStrings) {
      assert(
        regExp.test(string),
        // `\`${ expression }\` should match ${ string } (${ printStringCodePoints(string) })`
      );
    }
  }

  if (!nonMatchStrings) return;

  const allNonMatchStrings = nonMatchStrings.join('');
  if (regExp.test(allNonMatchStrings)) {
    for (let string of nonMatchStrings) {
      assert(
        !regExp.test(string),
        // `\`${ expression }\` should not match ${ string } (${ printStringCodePoints(string) })`
      );
    }
  }
}

// The exact same logic can be used to test extended character classes
// as enabled through the RegExp `v` flag. This is useful to test not
// just standalone properties of strings, but also string literals, and
// set operations.
const testExtendedCharacterClass = testPropertyOfStrings;

// Returns a function that validates a RegExp match result.
//
// Example:
//
//    var validate = matchValidator(['b'], 1, 'abc');
//    validate(/b/.exec('abc'));
//
function matchValidator(expectedEntries, expectedIndex, expectedInput) {
  return function(match) {
    assert.compareArray(match, expectedEntries, 'Match entries');
    assert.sameValue(match.index, expectedIndex, 'Match index');
    assert.sameValue(match.input, expectedInput, 'Match input');
  }
}

/// sm/non262.js
function print() {}
function printBugNumber() {}
function inSection() {}
function printStatus() {}
function writeHeaderToLog() {}

function assertThrownErrorContains(f) {
  try {
    f();
  } catch {
    return;
  }

  throw new Test262Error("Expected error no exception thrown");
}

function assertThrowsInstanceOfWithMessageCheck(f, ctor) {
  try {
    f();
  } catch (exc) {
    if (exc instanceof ctor) return;
  }

  throw new Error('assertThrowsInstanceOfWithMessageCheck failed');
};

function assertEq(a, b) {
  assert.sameValue(a, b);
}
function reportCompare(a, b) {
  assert.sameValue(a, b);
}

function reportMatch(expectedRegExp, actual) {
  assert.sameValue(typeof actual, "string");
  assert.notSameValue(expectedRegExp.exec(actual), null);
}

function createExternalArrayBuffer(size) {
  return new ArrayBuffer(size);
}

function enableGeckoProfilingWithSlowAssertions() {}
function enableGeckoProfiling() {}
function disableGeckoProfiling() {}

/// sm/non262-shell.js
function deepEqual(a, b) {
  if (typeof a != typeof b)
    return false;

  if (typeof a == 'object') {
    var props = {};
    for (var prop in a) {
      if (!deepEqual(a[prop], b[prop]))
        return false;
      props[prop] = true;
    }

    for (var prop in b)
      if (!props[prop])
        return false;

    return a.length == b.length;
  }

  if (a === b) {
    return a !== 0 || 1/a === 1/b;
  }

  return a !== a && b !== b;
}

function assertThrowsValue(f, val) {
  var fullmsg;
  try {
    f();
  } catch (exc) {
    if ((exc === val) === (val === val) && (val !== 0 || 1 / exc === 1 / val))
      return;
  }

  throw new Error('assertThrowsValue failed');
};

function assertThrowsInstanceOf(f, ctor) {
  assertThrowsInstanceOfWithMessageCheck(f, ctor);
};

function assertThrowsInstanceOfWithMessage(f, ctor) {
  assertThrowsInstanceOfWithMessageCheck(f, ctor);
}

function assertThrowsInstanceOfWithMessageContains(f, ctor) {
  assertThrowsInstanceOfWithMessageCheck(f, ctor);
}

/// wellKnownIntrinsicObjects.js
// Static implementation since Porffor can't use new Function()
var WellKnownIntrinsicObjects = [];

// Helper to safely add intrinsics
function __addIntrinsic(name, getter) {
  var value;
  try { value = getter(); } catch {}
  WellKnownIntrinsicObjects.push({ name: name, value: value });
}

// Basic constructors and objects
__addIntrinsic('%AggregateError%', () => AggregateError);
__addIntrinsic('%Array%', () => Array);
__addIntrinsic('%ArrayBuffer%', () => ArrayBuffer);
__addIntrinsic('%ArrayIteratorPrototype%', () => Object.getPrototypeOf([][Symbol.iterator]()));
__addIntrinsic('%AsyncFromSyncIteratorPrototype%', () => undefined);
__addIntrinsic('%AsyncFunction%', () => (async function() {}).constructor);
__addIntrinsic('%AsyncGeneratorFunction%', () => (async function* () {}).constructor);
__addIntrinsic('%AsyncGeneratorPrototype%', () => Object.getPrototypeOf(async function* () {}).prototype);
__addIntrinsic('%AsyncIteratorPrototype%', () => Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype));
__addIntrinsic('%Atomics%', () => Atomics);
__addIntrinsic('%BigInt%', () => BigInt);
__addIntrinsic('%BigInt64Array%', () => BigInt64Array);
__addIntrinsic('%BigUint64Array%', () => BigUint64Array);
__addIntrinsic('%Boolean%', () => Boolean);
__addIntrinsic('%DataView%', () => DataView);
__addIntrinsic('%Date%', () => Date);
__addIntrinsic('%decodeURI%', () => decodeURI);
__addIntrinsic('%decodeURIComponent%', () => decodeURIComponent);
__addIntrinsic('%encodeURI%', () => encodeURI);
__addIntrinsic('%encodeURIComponent%', () => encodeURIComponent);
__addIntrinsic('%Error%', () => Error);
__addIntrinsic('%eval%', () => eval);
__addIntrinsic('%EvalError%', () => EvalError);
__addIntrinsic('%FinalizationRegistry%', () => FinalizationRegistry);
__addIntrinsic('%Float32Array%', () => Float32Array);
__addIntrinsic('%Float64Array%', () => Float64Array);
__addIntrinsic('%ForInIteratorPrototype%', () => undefined);
__addIntrinsic('%Function%', () => Function);
__addIntrinsic('%GeneratorFunction%', () => (function* () {}).constructor);
__addIntrinsic('%GeneratorPrototype%', () => Object.getPrototypeOf(function* () {}).prototype);
__addIntrinsic('%Int8Array%', () => Int8Array);
__addIntrinsic('%Int16Array%', () => Int16Array);
__addIntrinsic('%Int32Array%', () => Int32Array);
__addIntrinsic('%isFinite%', () => isFinite);
__addIntrinsic('%isNaN%', () => isNaN);
__addIntrinsic('%JSON%', () => JSON);
__addIntrinsic('%Map%', () => Map);
__addIntrinsic('%MapIteratorPrototype%', () => Object.getPrototypeOf(new Map()[Symbol.iterator]()));
__addIntrinsic('%Math%', () => Math);
__addIntrinsic('%Number%', () => Number);
__addIntrinsic('%Object%', () => Object);
__addIntrinsic('%parseFloat%', () => parseFloat);
__addIntrinsic('%parseInt%', () => parseInt);
__addIntrinsic('%Promise%', () => Promise);
__addIntrinsic('%Proxy%', () => Proxy);
__addIntrinsic('%RangeError%', () => RangeError);
__addIntrinsic('%ReferenceError%', () => ReferenceError);
__addIntrinsic('%Reflect%', () => Reflect);
__addIntrinsic('%RegExp%', () => RegExp);
__addIntrinsic('%Set%', () => Set);
__addIntrinsic('%SetIteratorPrototype%', () => Object.getPrototypeOf(new Set()[Symbol.iterator]()));
__addIntrinsic('%SharedArrayBuffer%', () => SharedArrayBuffer);
__addIntrinsic('%String%', () => String);
__addIntrinsic('%StringIteratorPrototype%', () => Object.getPrototypeOf(''[Symbol.iterator]()));
__addIntrinsic('%Symbol%', () => Symbol);
__addIntrinsic('%SyntaxError%', () => SyntaxError);
__addIntrinsic('%TypedArray%', () => Object.getPrototypeOf(Uint8Array));
__addIntrinsic('%TypeError%', () => TypeError);
__addIntrinsic('%Uint8Array%', () => Uint8Array);
__addIntrinsic('%Uint8ClampedArray%', () => Uint8ClampedArray);
__addIntrinsic('%Uint16Array%', () => Uint16Array);
__addIntrinsic('%Uint32Array%', () => Uint32Array);
__addIntrinsic('%URIError%', () => URIError);
__addIntrinsic('%WeakMap%', () => WeakMap);
__addIntrinsic('%WeakRef%', () => WeakRef);
__addIntrinsic('%WeakSet%', () => WeakSet);
__addIntrinsic('%escape%', () => escape);
__addIntrinsic('%unescape%', () => unescape);

function getWellKnownIntrinsicObject(key) {
  for (var i = 0; i < WellKnownIntrinsicObjects.length; i++) {
    if (WellKnownIntrinsicObjects[i].name === key) {
      var value = WellKnownIntrinsicObjects[i].value;
      if (value !== undefined) return value;
      throw new Test262Error('this implementation could not obtain ' + key);
    }
  }
  throw new Test262Error('unknown well-known intrinsic ' + key);
}

/// iteratorZipUtils.js
// Assert |result| is an object created by CreateIteratorResultObject.
function assertIteratorResult(result, value, done, label) {
  assert.sameValue(
    Object.getPrototypeOf(result),
    Object.prototype,
    label + ": [[Prototype]] of iterator result is Object.prototype"
  );

  assert(Object.isExtensible(result), label + ": iterator result is extensible");

  var ownKeys = Reflect.ownKeys(result);
  assert.compareArray(ownKeys, ["value", "done"], label + ": iterator result properties");

  verifyProperty(result, "value", {
    value: value,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  verifyProperty(result, "done", {
    value: done,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

// Assert |array| is a packed array with default property attributes.
function assertIsPackedArray(array, label) {
  assert(Array.isArray(array), label + ": array is an array exotic object");

  assert.sameValue(
    Object.getPrototypeOf(array),
    Array.prototype,
    label + ": [[Prototype]] of array is Array.prototype"
  );

  assert(Object.isExtensible(array), label + ": array is extensible");

  // Ensure "length" property has its default property attributes.
  verifyProperty(array, "length", {
    writable: true,
    enumerable: false,
    configurable: false,
  });

  // Ensure no holes and all elements have the default property attributes.
  for (var i = 0; i < array.length; i++) {
    verifyProperty(array, i, {
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}

// Assert |object| is an extensible null-prototype object with default property attributes.
function _assertIsNullProtoMutableObject(object, label) {
  assert.sameValue(
    Object.getPrototypeOf(object),
    null,
    label + ": [[Prototype]] of object is null"
  );

  assert(Object.isExtensible(object), label + ": object is extensible");

  // Ensure all properties have the default property attributes.
  var keys = Object.getOwnPropertyNames(object);
  for (var i = 0; i < keys.length; i++) {
    verifyProperty(object, keys[i], {
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}

// Assert that the `zipped` iterator yields the first `count` outputs of Iterator.zip.
// Assumes `inputs` is an array of arrays, each with length >= `count`.
// Advances `zipped` by `count` steps.
function assertZipped(zipped, inputs, count, label) {
  // Last returned elements array.
  var last = null;

  for (var i = 0; i < count; i++) {
    var itemLabel = label + ", step " + i;

    var result = zipped.next();
    var value = result.value;

    // Test IteratorResult structure.
    assertIteratorResult(result, value, false, itemLabel);

    // Ensure value is a new array.
    assert.notSameValue(value, last, itemLabel + ": returns a new array");
    last = value;

    // Ensure all array elements have the expected value.
    var expected = inputs.map(function (array) {
      return array[i];
    });
    assert.compareArray(value, expected, itemLabel + ": values");

    // Ensure value is a packed array with default data properties.
    assertIsPackedArray(value, itemLabel);
  }
}

// Assert that the `zipped` iterator yields the first `count` outputs of Iterator.zipKeyed.
// Assumes `inputs` is an object whose values are arrays, each with length >= `count`.
// Advances `zipped` by `count` steps.
function assertZippedKeyed(zipped, inputs, count, label) {
  // Last returned elements array.
  var last = null;

  var expectedKeys = Object.keys(inputs);

  for (var i = 0; i < count; i++) {
    var itemLabel = label + ", step " + i;

    var result = zipped.next();
    var value = result.value;

    // Test IteratorResult structure.
    assertIteratorResult(result, value, false, itemLabel);

    // Ensure resulting object is a new object.
    assert.notSameValue(value, last, itemLabel + ": returns a new object");
    last = value;

    // Ensure resulting object has the expected keys and values.
    assert.compareArray(Reflect.ownKeys(value), expectedKeys, itemLabel + ": result object keys");

    var expectedValues = Object.values(inputs).map(function (array) {
      return array[i];
    });
    assert.compareArray(Object.values(value), expectedValues, itemLabel + ": result object values");

    // Ensure resulting object is a null-prototype mutable object with default data properties.
    _assertIsNullProtoMutableObject(value, itemLabel);
  }
}

function forEachSequenceCombination(callback) {
  function test(inputs) {
    if (inputs.length === 0) {
      callback(inputs, "inputs = []", 0, 0);
      return;
    }

    var lengths = inputs.map(function(array) {
      return array.length;
    });

    var min = Math.min.apply(null, lengths);
    var max = Math.max.apply(null, lengths);

    var inputsLabel = "inputs = " + JSON.stringify(inputs);

    callback(inputs, inputsLabel, min, max);
  }

  // Return all prefixes of the string |s| as an array.
  function prefixes(s) {
    var result = [];
    for (var i = 0; i <= s.length; ++i) {
      result.push(s.slice(0, i));
    }
    return result;
  }

  // Zip an empty iterable.
  test([]);

  // Zip a single iterator.
  var prefixes1 = prefixes("abcd");
  for (var i1 = 0; i1 < prefixes1.length; i1++) {
    test([prefixes1[i1].split("")]);
  }

  // Zip two iterators.
  var prefixes2 = prefixes("efgh");
  for (var i1 = 0; i1 < prefixes1.length; i1++) {
    for (var i2 = 0; i2 < prefixes2.length; i2++) {
      test([prefixes1[i1].split(""), prefixes2[i2].split("")]);
    }
  }

  // Zip three iterators.
  var prefixes3 = prefixes("ijkl");
  for (var i1 = 0; i1 < prefixes1.length; i1++) {
    for (var i2 = 0; i2 < prefixes2.length; i2++) {
      for (var i3 = 0; i3 < prefixes3.length; i3++) {
        test([prefixes1[i1].split(""), prefixes2[i2].split(""), prefixes3[i3].split("")]);
      }
    }
  }
}

function forEachSequenceCombinationKeyed(callback) {
  return forEachSequenceCombination(function(inputs, inputsLabel, min, max) {
    var object = {};
    for (var i = 0; i < inputs.length; ++i) {
      object["prop_" + i] = inputs[i];
    }
    inputsLabel = "inputs = " + JSON.stringify(object);
    callback(object, inputsLabel, min, max);
  });
}