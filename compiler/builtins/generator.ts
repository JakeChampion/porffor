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
// - offset 76-79: reserved (alignment padding)
// - offset 80+: stored parameters

export const __Porffor_Generator = (values: any[]): __Porffor_Generator => {
  return values as __Porffor_Generator;
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

export const __Porffor_Generator_prototype_next = (gen: any[], inputValue: any) => {
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

export const __Porffor_Generator_prototype_return = (gen: any[], value: any) => {
  // Mark as done and store return value
  Porffor.wasm.i32.store(gen, 1, 0, 28); // done = 1

  const obj: object = {};
  obj.value = value;
  obj.done = true;
  return obj;
};

export const __Porffor_Generator_prototype_throw = (gen: any[], value: any) => {
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
