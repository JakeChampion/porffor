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

// Called by return statement in generator - pushes final value with done marker
// We use a special object to mark this as the final value
export const __Porffor_Generator_return = (gen: any[], value: any): void => {
  // For eager evaluation, we need to mark the generator as done
  // We'll push a special sentinel and the value
  // Actually, for simplicity, just clear and set length to a negative (impossible) value
  // which next() can check

  // Clear remaining yields and push the return value
  gen.length = 0;
  // Store return value at index 0 with a marker at index 1
  gen[0] = value;
  gen[1] = 1; // done marker
};

export const __Porffor_AsyncGenerator_return = (gen: any[], value: any): void => {
  gen.length = 0;
  gen[0] = value;
  gen[1] = 1; // done marker
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
