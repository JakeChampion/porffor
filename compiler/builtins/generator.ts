import type {} from './porffor.d.ts';

export const __Porffor_Generator = (values: any[]): __Porffor_Generator => {
  return values as __Porffor_Generator;
};

export const __Porffor_Generator_yield = (vals: any[], value: any): void => {
  Porffor.array.fastPush(vals, value);
};

export const __Porffor_Generator_return = (vals: any[], value: any): __Porffor_Generator => {
  // Push return value to the end (preserving yields)
  // Note: Per spec, return values should have done=true, but that requires tracking separately
  Porffor.array.fastPush(vals, value);
  return vals as __Porffor_Generator;
};

export const __Porffor_Generator_prototype_next = (vals: any[]) => {
  const obj: object = {};

  // check if already exhausted before shifting
  if (vals.length == 0) {
    obj.value = undefined;
    obj.done = true;
  } else {
    obj.value = vals.shift();
    obj.done = false;
  }

  return obj;
};

export const __Porffor_Generator_prototype_return = (vals: any[], value: any) => {
  vals.length = 1;
  vals[0] = value;

  return __Porffor_Generator_prototype_next(vals);
};

export const __Porffor_Generator_prototype_throw = (vals: any[], value: any) => {
  vals.length = 0;
  throw value;
};


export const __Porffor_AsyncGenerator = (values: any[]): __Porffor_AsyncGenerator => {
  return values as __Porffor_AsyncGenerator;
};

export const __Porffor_AsyncGenerator_yield = (vals: any[], value: any): void => {
  Porffor.array.fastPush(vals, value);
};

export const __Porffor_AsyncGenerator_return = (vals: any[], value: any): __Porffor_AsyncGenerator => {
  // Push return value to the end (preserving yields)
  // Note: Per spec, return values should have done=true, but that requires tracking separately
  Porffor.array.fastPush(vals, value);
  return vals as __Porffor_AsyncGenerator;
};

export const __Porffor_AsyncGenerator_prototype_next = async (vals: any[]) => {
  const obj: object = {};

  // check if already exhausted before shifting
  if (vals.length == 0) {
    obj.value = undefined;
    obj.done = true;
  } else {
    obj.value = await vals.shift();
    obj.done = false;
  }

  return obj;
};

export const __Porffor_AsyncGenerator_prototype_return = async (vals: any[], value: any) => {
  vals.length = 1;
  vals[0] = await value;

  return await __Porffor_AsyncGenerator_prototype_next(vals);
};

export const __Porffor_AsyncGenerator_prototype_throw = async (vals: any[], value: any) => {
  vals.length = 0;
  throw await value;
};