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

// Validate that a value is an async generator object
// Returns true if valid, false otherwise (for async methods that need to reject)
export const __Porffor_AsyncGenerator_validate = (gen: any): boolean => {
  // 1. If generator is not an object, invalid
  if (!Porffor.object.isObjectOrSymbol(gen)) {
    return false;
  }
  // 2. If generator does not have [[AsyncGeneratorState]] internal slot, invalid
  if (Porffor.type(gen) != Porffor.TYPES.__porffor_asyncgenerator) {
    return false;
  }
  return true;
};

// Async Generator Request Queue
// Per ES spec 27.6.3.2, async generators have a request queue for handling
// next/return/throw calls while the generator is executing
// Queue entries: [gen, promise, inputValue, inputType, completionType]
// completionType: 0 = next, 1 = return, 2 = throw
const __Porffor_AsyncGenerator_queue: any[] = [];

// Enqueue a request when generator is executing
// Returns a pending promise that will be resolved/rejected when the request is processed
export const __Porffor_AsyncGenerator_enqueue = (gen: any, inputValue: any, completionType: i32): any => {
  // Create a pending promise using the internal promise creation function
  const promise: any = __Porffor_promise_create();

  // Create queue entry
  const entry: any[] = Porffor.malloc();
  entry[0] = gen;
  entry[1] = promise;
  entry[2] = inputValue;
  entry[3] = Porffor.type(inputValue);
  entry[4] = completionType;
  entry.length = 5;

  // Add to queue
  Porffor.array.fastPush(__Porffor_AsyncGenerator_queue, entry);

  return promise;
};

// Get and remove the next queued request for this generator
// Returns the queue entry array, or undefined if no queued requests
export const __Porffor_AsyncGenerator_dequeue = (gen: any): any => {
  const len: i32 = __Porffor_AsyncGenerator_queue.length;
  for (let i: i32 = 0; i < len; i++) {
    const entry: any[] = __Porffor_AsyncGenerator_queue[i];
    if (entry[0] === gen) {
      // Remove from queue by shifting remaining elements
      for (let j: i32 = i; j < len - 1; j++) {
        __Porffor_AsyncGenerator_queue[j] = __Porffor_AsyncGenerator_queue[j + 1];
      }
      __Porffor_AsyncGenerator_queue.length = len - 1;
      return entry;
    }
  }
  return undefined;
};

// Fulfill a queued promise with {value, done} result
export const __Porffor_AsyncGenerator_fulfillQueue = (promise: any, value: any, done: boolean): void => {
  const result: object = {};
  result.value = value;
  result.done = done;
  // Use the internal fulfillment function
  __ecma262_FulfillPromise(promise, result);
};

// Process queued requests for an async generator
// This is called after the generator yields or completes
// It uses the microtask queue to schedule processing of the next request
export const __Porffor_AsyncGenerator_processQueue = (gen: any): void => {
  // Check if there are queued requests
  const entry: any = __Porffor_AsyncGenerator_dequeue(gen);
  if (entry == undefined) return;

  // Extract request info
  const promise: any = entry[1];
  const inputValue: any = entry[2];
  const inputType: i32 = entry[3];
  const completionType: i32 = entry[4];

  // Set the input value type
  Porffor.wasm`
local.get ${inputType}
i32.to_u
local.set ${inputValue+1}`;

  // Check if generator is done
  const isDone: i32 = Porffor.wasm.i32.load(gen, 0, 28);
  if (isDone != 0) {
    // Generator is done, resolve with {value: undefined, done: true}
    __Porffor_AsyncGenerator_fulfillQueue(promise, undefined, true);
    // Process any remaining queued requests
    __Porffor_AsyncGenerator_processQueue(gen);
    return;
  }

  // Store input value for next generator step
  Porffor.wasm.f64.store(gen, inputValue, 0, 32);
  Porffor.wasm.i32.store(gen, Porffor.type(inputValue), 0, 40);

  // Schedule the generator resumption via microtask
  // The next() call on the generator will be handled by codegen
  // For now, we can't directly call the generator step function from builtins
  // So we use promise.then to schedule the next step

  // Since we can't call the generator step directly, we'll mark that there's
  // a pending request and let the next external next() call process it
  // This is a simplification - proper implementation would use call_indirect

  // For now, just fulfill with the current state (which might be stale)
  // TODO: This needs proper generator resumption
  const value: any = Porffor.wasm.f64.load(gen, 0, 16);
  const valueType: i32 = Porffor.wasm.i32.load(gen, 0, 24);
  Porffor.wasm`
local.get ${valueType}
i32.to_u
local.set ${value+1}`;

  __Porffor_AsyncGenerator_fulfillQueue(promise, value, false);

  // Process any remaining queued requests
  __Porffor_AsyncGenerator_processQueue(gen);
};

export const __Porffor_AsyncGenerator_prototype_next = async (gen: any, inputValue: any) => {
  // Validate that gen is an async generator - if not, reject with TypeError
  // Inline the validation to avoid function call issues in async context
  if (!Porffor.object.isObjectOrSymbol(gen) || Porffor.type(gen) != Porffor.TYPES.__porffor_asyncgenerator) {
    throw new TypeError('AsyncGenerator method called on incompatible receiver');
  }

  // This is called after call_indirect has been done by codegen.js
  // Just read the values from the generator object and return result wrapped in Promise
  const obj: object = {};

  // Read yielded value from generator object (same layout as sync generators)
  // Generator memory layout:
  // - offset 16-23: yielded value (f64)
  // - offset 24-27: yielded value type (i32)
  // - offset 28-31: done flag (i32)
  const value: any = Porffor.wasm.f64.load(gen, 0, 16);
  const valueType: i32 = Porffor.wasm.i32.load(gen, 0, 24);
  const isDone: i32 = Porffor.wasm.i32.load(gen, 0, 28);

  // Set the type of value using inline wasm to preserve exact type
  Porffor.wasm`
local.get ${valueType}
i32.to_u
local.set ${value+1}`;

  // Assign value directly (like sync generators) - don't await primitive yields
  obj.value = value;
  obj.done = isDone != 0;

  // Process any queued requests after this yield
  __Porffor_AsyncGenerator_processQueue(gen);

  return obj;
};

export const __Porffor_AsyncGenerator_prototype_return = async (gen: any, value: any) => {
  // Validate that gen is an async generator
  if (!Porffor.object.isObjectOrSymbol(gen) || Porffor.type(gen) != Porffor.TYPES.__porffor_asyncgenerator) {
    throw new TypeError('AsyncGenerator method called on incompatible receiver');
  }

  // Mark generator as done
  Porffor.wasm.i32.store(gen, 1, 0, 28); // done = 1

  // Note: Per spec, should unwrap promise values (AsyncGeneratorResolve steps 6-10)
  // but Porffor's await doesn't properly wait for pending promises yet
  const obj: object = {};
  obj.value = value;
  obj.done = true;
  return obj;
};

export const __Porffor_AsyncGenerator_prototype_throw = async (gen: any, value: any) => {
  // Validate that gen is an async generator
  if (!Porffor.object.isObjectOrSymbol(gen) || Porffor.type(gen) != Porffor.TYPES.__porffor_asyncgenerator) {
    throw new TypeError('AsyncGenerator method called on incompatible receiver');
  }

  // Mark generator as done
  Porffor.wasm.i32.store(gen, 1, 0, 28); // done = 1
  throw value;
};

// Iterator.prototype methods for generators
// Use lazy iterator types directly to support infinite generators

export const __Porffor_Generator_prototype_map = (_this: any, mapper: any) => {
  if (typeof mapper !== 'function') {
    throw new TypeError('Iterator.prototype.map requires a callable');
  }
  // Create lazy MapIterator wrapping the generator directly
  // Storage: [0] = source, [1] = mapper, [2] = executing flag, [3] = cached next (unused for generators), [4] = counter, [5] = closed
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = mapper;
  storage[2] = false; // executing flag
  storage[4] = 0; // counter
  storage.length = 6;
  return storage as __Porffor_MapIterator;
};

export const __Porffor_Generator_prototype_filter = (_this: any, predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.filter requires a callable');
  }
  // Create lazy FilterIterator wrapping the generator directly
  // Storage: [0] = source, [1] = predicate, [2] = executing flag, [3] = cached next (unused for generators), [4] = counter, [5] = closed
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = predicate;
  storage[2] = false; // executing flag
  storage[4] = 0; // counter
  storage.length = 6;
  return storage as __Porffor_FilterIterator;
};

export const __Porffor_Generator_prototype_take = (_this: any, limit: any) => {
  // Per spec: ToNumber then ToIntegerOrInfinity, throw RangeError if NaN or negative
  const numLimit: number = +limit;
  if (Number.isNaN(numLimit)) throw new RangeError('Iterator.prototype.take requires a non-negative number');
  const intLimit: i32 = Math.trunc(numLimit);
  if (intLimit < 0) throw new RangeError('Iterator.prototype.take requires a non-negative number');

  // Create lazy TakeIterator wrapping the generator directly
  // Storage: [0] = source, [1] = remaining, [2] = executing flag, [3] = closed
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = intLimit;
  storage[2] = false; // executing flag
  storage.length = 4;
  return storage as __Porffor_TakeIterator;
};

export const __Porffor_Generator_prototype_drop = (_this: any, count: any) => {
  // Per spec: ToNumber then ToIntegerOrInfinity, throw RangeError if NaN or negative
  const numCount: number = +count;
  if (Number.isNaN(numCount)) throw new RangeError('Iterator.prototype.drop requires a non-negative number');
  const intCount: i32 = Math.trunc(numCount);
  if (intCount < 0) throw new RangeError('Iterator.prototype.drop requires a non-negative number');

  // Create lazy DropIterator wrapping the generator directly
  // Storage: [0] = source, [1] = remaining, [2] = executing flag, [3] = closed
  const storage: any[] = Porffor.malloc();
  storage[0] = _this;
  storage[1] = intCount;
  storage[2] = false; // executing flag
  storage.length = 4;
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
