import type {} from './porffor.d.ts';

// Eager evaluation generator model:
// Generator is an array of yielded values
// Each yield pushes to the array, next() shifts from it

export const __Porffor_Generator = (values: any[]): __Porffor_Generator => {
  return values as __Porffor_Generator;
};

export const __Porffor_Generator_prototype_next = (gen: any[], inputValue: any) => {
  const obj: object = {};

  // Check if there are remaining values
  const len: i32 = gen.length;

  if (len == 0) {
    // No more values - done
    obj.value = undefined;
    obj.done = true;
    return obj;
  }

  // Shift first value from array
  const value: any = gen.shift();

  // Check if this is the return marker (-9007199254740991)
  // If so, the next value is the return value with done=true
  if (value == RETURN_MARKER) {
    // Next value is the return value
    if (gen.length > 0) {
      obj.value = gen.shift();
    } else {
      obj.value = undefined;
    }
    obj.done = true;
    return obj;
  }

  obj.value = value;
  obj.done = false;

  return obj;
};

export const __Porffor_Generator_prototype_return = (gen: any[], value: any) => {
  // Clear any remaining values
  gen.length = 0;

  const obj: object = {};
  obj.value = value;
  obj.done = true;
  return obj;
};

export const __Porffor_Generator_prototype_throw = (gen: any[], value: any) => {
  // Clear any remaining values
  gen.length = 0;
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
