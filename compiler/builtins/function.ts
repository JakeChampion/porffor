import type {} from './porffor.d.ts';

// `eval` is invalid syntax so work around
export const _eval = (source: string) => {
  throw new SyntaxError('Dynamic code evaluation is not supported');
};

export const Function = function (source: string) {
  throw new SyntaxError('Dynamic code evaluation is not supported');
};

export const GeneratorFunction = function (source: string) {
  throw new SyntaxError('Dynamic code evaluation is not supported');
};

export const AsyncGeneratorFunction = function (source: string) {
  throw new SyntaxError('Dynamic code evaluation is not supported');
};

export const __Function_prototype_toString = (_this: Function) => {
  const out: bytestring = Porffor.malloc(256);

  Porffor.bytestring.appendStr(out, 'function ');
  Porffor.bytestring.appendStr(out, __Porffor_funcLut_name(_this));
  Porffor.bytestring.appendStr(out, '() { [native code] }');
  return out;
};

export const __Function_prototype_toLocaleString = (_this: Function) => __Function_prototype_toString(_this);

export const __Function_prototype_apply = (_this: Function, thisArg: any, argsArray: any) => {
  // If argsArray is null or undefined, use empty array
  if (argsArray == null) {
    argsArray = [];
  } else {
    // CreateListFromArrayLike: If Type(argsArray) is not Object, throw a TypeError
    if (!Porffor.object.isObject(argsArray)) throw new TypeError('CreateListFromArrayLike called on non-object');
    argsArray = Array.from(argsArray);
  }
  return Porffor.call(_this, argsArray, thisArg, null);
};

export const __Function_prototype_call = (_this: Function, thisArg: any, ...args: any[]) => {
  return Porffor.call(_this, args, thisArg, null);
};

export const __Function_prototype_bind = (_this: Function, thisArg: any, argsArray: any) => {
  // todo: no good way to bind without dynamic functions or closure yet, just return function
  return _this;
};

// ES Spec: Function.prototype.caller and Function.prototype.arguments are
// poisoned accessors that throw TypeError when accessed (10.2.4)
export const __Function_prototype_caller$get = (_this: Function): any => {
  throw new TypeError("'caller' is restricted and cannot be accessed in this context");
};

export const __Function_prototype_caller$set = (_this: Function, value: any): void => {
  throw new TypeError("'caller' is restricted and cannot be accessed in this context");
};

export const __Function_prototype_arguments$get = (_this: Function): any => {
  throw new TypeError("'arguments' is restricted and cannot be accessed in this context");
};

export const __Function_prototype_arguments$set = (_this: Function, value: any): void => {
  throw new TypeError("'arguments' is restricted and cannot be accessed in this context");
};