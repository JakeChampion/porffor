import type {} from './porffor.d.ts';

// Counter-based state machine generator model:
// Generator memory layout:
// - offset 0-7: state (f64)
// - offset 8-15: indirect index (f64)
// - offset 16-23: yielded value (f64)
// - offset 24-27: yielded value type (i32)
// - offset 28-31: done flag (i32)
// - offset 32-39: input value from next() (f64)
// - offset 40-43: input value type (i32)
// - offset 44-47: return requested flag (i32)
// - offset 48-55: return value (f64)
// - offset 56-59: return value type (i32)
// - offset 60-63: throw requested flag (i32)
// - offset 64-71: throw value (f64)
// - offset 72-75: throw value type (i32)
// - offset 76-79: executing flag (i32) - set while generator body is running
// - offset 80+: stored parameters

export const __Porffor_Generator = (values: any[]): __Porffor_Generator => {
  return values as __Porffor_Generator;
};

// Validate that a value is a generator object per 27.5.3.2 GeneratorValidate
export const __Porffor_Generator_validate = (gen: any): void => {
  // 1. If generator is not an object, throw TypeError
  if (!Porffor.object.isObjectOrSymbol(gen)) {
    throw new TypeError('Generator method called on incompatible receiver');
  }
  // 2. If generator does not have [[GeneratorState]] internal slot, throw TypeError
  // In Porffor, this means checking if it's a generator type
  if (Porffor.type(gen) != Porffor.TYPES.__porffor_generator) {
    throw new TypeError('Generator method called on incompatible receiver');
  }
  // 5. If state is "executing", throw a TypeError exception
  // Check executing flag at offset 76
  const executing: i32 = Porffor.wasm.i32.load(gen, 0, 76);
  if (executing != 0) {
    // Mark generator as completed before throwing
    Porffor.wasm.i32.store(gen, 1, 0, 28); // done = 1
    throw new TypeError('Generator is already executing');
  }
};

// Get the prototype of a generator instance from its generator function's .prototype
export const __Porffor_Generator_getInstancePrototype = (gen: any): any => {
  // Read the function indirect index from generator object offset 8
  const funcIdx: f64 = Porffor.wasm.f64.load(gen, 0, 8);
  // Convert to function type
  let func: any = funcIdx;
  Porffor.wasm`i32.const 6
local.set ${func+1}`; // Set type to function (6)
  // Access the function's .prototype property
  // Per spec 9.1.14: if prototype is not an object, use intrinsic default
  const proto: any = func.prototype;
  if (Porffor.object.isObject(proto)) return proto;
  // Fall back to intrinsic generator prototype via hidden prototype system
  return __Porffor_object_getHiddenPrototype(Porffor.TYPES.__porffor_generator);
};

// Get the prototype of an async generator instance
export const __Porffor_AsyncGenerator_getInstancePrototype = (gen: any): any => {
  const funcIdx: f64 = Porffor.wasm.f64.load(gen, 0, 8);
  let func: any = funcIdx;
  Porffor.wasm`i32.const 6
local.set ${func+1}`;
  // Per spec 9.1.14: if prototype is not an object, use intrinsic default
  const proto: any = func.prototype;
  if (Porffor.object.isObject(proto)) return proto;
  // Fall back to intrinsic async generator prototype via hidden prototype system
  return __Porffor_object_getHiddenPrototype(Porffor.TYPES.__porffor_asyncgenerator);
};

export const __Porffor_Generator_prototype_next = (gen: any[], inputValue: any, _skipValidation: boolean) => {
  // Validate that gen is a generator object (unless called internally with validation skipped)
  if (!_skipValidation) __Porffor_Generator_validate(gen);

  // This is called after call_indirect has been done by codegen.js
  // Just read the values from the generator object and return result
  const obj: object = {};

  // Read yielded value from generator object
  // Generator memory layout:
  // - offset 16-23: yielded value (f64)
  // - offset 24-27: yielded value type (i32)
  // - offset 28-31: done flag (i32)
  const value: any = Porffor.wasm.f64.load(gen, 0, 16);
  const valueType: i32 = Porffor.wasm.i32.load(gen, 0, 24);
  const isDone: i32 = Porffor.wasm.i32.load(gen, 0, 28);

  // Set the type of value using inline wasm to preserve exact type
  // valueType is f64 (JS number) containing i32 value, so convert with i32.to_u
  Porffor.wasm`
local.get ${valueType}
i32.to_u
local.set ${value+1}`;

  obj.value = value;
  obj.done = isDone != 0;

  return obj;
};

export const __Porffor_Generator_prototype_return = (gen: any[], value: any, _skipValidation: boolean) => {
  // Validate that gen is a generator object (unless called internally with validation skipped)
  if (!_skipValidation) __Porffor_Generator_validate(gen);

  // The call_indirect to run finally blocks is done by codegen.js before calling this
  // This builtin just reads the result from the generator object

  // Mark as done if not already
  Porffor.wasm.i32.store(gen, 1, 0, 28); // done = 1

  // Read result from generator object (may have been set by finally handling)
  const obj: object = {};
  const resultValue: any = Porffor.wasm.f64.load(gen, 0, 16);
  const resultType: i32 = Porffor.wasm.i32.load(gen, 0, 24);

  // If result value is 0 and type is 0 (unset), use the passed-in value
  // This handles the case where there's no try-finally
  if (resultType == 0 && resultValue == 0) {
    obj.value = value;
  } else {
    Porffor.wasm`
local.get ${resultType}
i32.to_u
local.set ${resultValue+1}`;
    obj.value = resultValue;
  }

  obj.done = true;
  return obj;
};

export const __Porffor_Generator_prototype_throw = (gen: any[], value: any, _skipValidation: boolean) => {
  // Validate that gen is a generator object (unless called internally with validation skipped)
  if (!_skipValidation) __Porffor_Generator_validate(gen);

  // Check if generator is already done
  const isDone: i32 = Porffor.wasm.i32.load(gen, 0, 28);
  if (isDone != 0) {
    // Generator is already done, just throw the exception
    throw value;
  }

  // Set throw_requested flag and store throw value
  Porffor.wasm.i32.store(gen, 1, 0, 60); // throw_requested = 1
  Porffor.wasm.f64.store(gen, value, 0, 64); // throw value
  Porffor.wasm.i32.store(gen, Porffor.type(value), 0, 72); // throw value type

  // The actual throwing will be done by codegen in the next step call
  // For now, throw immediately - codegen will add proper try/catch handling later
  throw value;
};

// Called by return statement in generator - appends return value with marker
// For eager evaluation: yields are already in the array, append return marker at end
// Layout after return: [yields..., RETURN_MARKER, returnValue]
// We use -1 as RETURN_MARKER since it's unlikely to be a user value
const RETURN_MARKER: f64 = -9007199254740991; // -(2^53 - 1), unlikely user value

export const __Porffor_Generator_return = (gen: any[], value: any): void => {
  // Append return marker and value at the end (after any yields)
  Porffor.array.fastPush(gen, RETURN_MARKER);
  Porffor.array.fastPush(gen, value);
};

export const __Porffor_AsyncGenerator_return = (gen: any[], value: any): void => {
  Porffor.array.fastPush(gen, RETURN_MARKER);
  Porffor.array.fastPush(gen, value);
};


// Async versions
export const __Porffor_AsyncGenerator = (values: any[]): __Porffor_AsyncGenerator => {
  return values as __Porffor_AsyncGenerator;
};

export const __Porffor_AsyncGenerator_prototype_next = async (gen: any[], inputValue: any) => {
  const obj: object = {};

  const len: i32 = gen.length;

  if (len == 0) {
    obj.value = undefined;
    obj.done = true;
    return obj;
  }

  const value: any = gen.shift();

  // Check if this is the return marker
  if (value == RETURN_MARKER) {
    if (gen.length > 0) {
      obj.value = await gen.shift();
    } else {
      obj.value = undefined;
    }
    obj.done = true;
    return obj;
  }

  obj.value = await value;
  obj.done = false;

  return obj;
};

export const __Porffor_AsyncGenerator_prototype_return = async (gen: any[], value: any) => {
  gen.length = 0;

  const obj: object = {};
  obj.value = await value;
  obj.done = true;
  return obj;
};

export const __Porffor_AsyncGenerator_prototype_throw = async (gen: any[], value: any) => {
  gen.length = 0;
  throw await value;
};

// Iterator.prototype methods for generators
// Use lazy iterator types directly to support infinite generators

export const __Porffor_Generator_prototype_map = (_this: any, mapper: any) => {
  if (typeof mapper !== 'function') {
    throw new TypeError('Iterator.prototype.map requires a callable');
  }
  // Create lazy MapIterator wrapping the generator directly
  // Storage: [0] = source, [1] = mapper, [2] = executing flag, [3] = cached next (unused for generators), [4] = counter
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = mapper;
  storage[2] = false; // executing flag
  storage[4] = 0; // counter
  storage.length = 5;
  return storage as __Porffor_MapIterator;
};

export const __Porffor_Generator_prototype_filter = (_this: any, predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.filter requires a callable');
  }
  // Create lazy FilterIterator wrapping the generator directly
  // Storage: [0] = source, [1] = predicate, [2] = executing flag, [3] = cached next (unused for generators), [4] = counter
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = predicate;
  storage[2] = false; // executing flag
  storage[4] = 0; // counter
  storage.length = 5;
  return storage as __Porffor_FilterIterator;
};

export const __Porffor_Generator_prototype_take = (_this: any, limit: any) => {
  // Per spec: ToNumber then ToIntegerOrInfinity, throw RangeError if NaN or negative
  const numLimit: number = +limit;
  if (Number.isNaN(numLimit)) throw new RangeError('Iterator.prototype.take requires a non-negative number');
  const intLimit: i32 = Math.trunc(numLimit);
  if (intLimit < 0) throw new RangeError('Iterator.prototype.take requires a non-negative number');

  // Create lazy TakeIterator wrapping the generator directly
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = intLimit;
  storage[2] = false; // executing flag
  storage.length = 3;
  return storage as __Porffor_TakeIterator;
};

export const __Porffor_Generator_prototype_drop = (_this: any, count: any) => {
  // Per spec: ToNumber then ToIntegerOrInfinity, throw RangeError if NaN or negative
  const numCount: number = +count;
  if (Number.isNaN(numCount)) throw new RangeError('Iterator.prototype.drop requires a non-negative number');
  const intCount: i32 = Math.trunc(numCount);
  if (intCount < 0) throw new RangeError('Iterator.prototype.drop requires a non-negative number');

  // Create lazy DropIterator wrapping the generator directly
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = intCount;
  storage[2] = false; // executing flag
  storage.length = 3;
  return storage as __Porffor_DropIterator;
};

export const __Porffor_Generator_prototype_flatMap = (_this: any, mapper: any) => {
  const wrapper: any = __Iterator_from(_this);
  return __Porffor_WrapperIterator_prototype_flatMap(wrapper, mapper);
};

export const __Porffor_Generator_prototype_reduce = (_this: any, reducer: any, initialValue: any) => {
  const wrapper: any = __Iterator_from(_this);
  return __Porffor_WrapperIterator_prototype_reduce(wrapper, reducer, initialValue);
};

export const __Porffor_Generator_prototype_toArray = (_this: any) => {
  const wrapper: any = __Iterator_from(_this);
  return __Porffor_WrapperIterator_prototype_toArray(wrapper);
};

export const __Porffor_Generator_prototype_forEach = (_this: any, callback: any) => {
  const wrapper: any = __Iterator_from(_this);
  return __Porffor_WrapperIterator_prototype_forEach(wrapper, callback);
};

export const __Porffor_Generator_prototype_some = (_this: any, predicate: any) => {
  const wrapper: any = __Iterator_from(_this);
  return __Porffor_WrapperIterator_prototype_some(wrapper, predicate);
};

export const __Porffor_Generator_prototype_every = (_this: any, predicate: any) => {
  const wrapper: any = __Iterator_from(_this);
  return __Porffor_WrapperIterator_prototype_every(wrapper, predicate);
};

export const __Porffor_Generator_prototype_find = (_this: any, predicate: any) => {
  const wrapper: any = __Iterator_from(_this);
  return __Porffor_WrapperIterator_prototype_find(wrapper, predicate);
};
