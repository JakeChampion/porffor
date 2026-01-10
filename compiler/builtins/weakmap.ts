import type {} from './porffor.d.ts';

export const __WeakMap_prototype_has = (_this: WeakMap, key: any) => {
  return __Map_prototype_has(_this as Map, key);
};

export const __WeakMap_prototype_get = (_this: WeakMap, key: any) => {
  return __Map_prototype_get(_this as Map, key);
};

export const __WeakMap_prototype_set = (_this: WeakMap, key: any, value: any) => {
  if (!Porffor.object.isObjectOrSymbol(key)) throw new TypeError('WeakMap key must be an object or symbol');
  if (Porffor.type(key) == Porffor.TYPES.symbol && Symbol.keyFor(key) !== undefined)
    throw new TypeError('WeakMap key must not be a registered symbol');

  __Map_prototype_set(_this as Map, key, value);
  return _this;
};

export const __WeakMap_prototype_delete = (_this: WeakMap, key: any) => {
  return __Map_prototype_delete(_this as Map, key);
};

export const WeakMap = function (iterable: any): WeakMap {
  if (!new.target) throw new TypeError("Constructor WeakMap requires 'new'");

  const out: WeakMap = Porffor.malloc(8);

  const keys: any[] = Porffor.malloc();
  const vals: any[] = Porffor.malloc();
  Porffor.wasm.i32.store(out, keys, 0, 0);
  Porffor.wasm.i32.store(out, vals, 0, 4);

  if (iterable != null) {
    // Note: Spec requires checking if "set" is callable (7a, 7c), but we skip this check
    // because property lookup on builtin objects returns undefined due to architectural
    // limitations. We call __WeakMap_prototype_set directly which always works.
    for (const x of iterable) {
      if (!Porffor.object.isObject(x)) throw new TypeError('Iterator contains non-object');
      __WeakMap_prototype_set(out, x[0], x[1]);
    }
  }

  return out;
};

export const __WeakMap_prototype_toString = (_this: WeakMap) => '[object WeakMap]';
export const __WeakMap_prototype_toLocaleString = (_this: WeakMap) => __WeakMap_prototype_toString(_this);

// https://github.com/tc39/proposal-upsert
export const __WeakMap_prototype_getOrInsert = (_this: WeakMap, key: any, value: any) => {
  // Key must be able to be held weakly (object or unregistered symbol)
  // CanBeHeldWeakly returns false for primitives that aren't symbols
  // and for registered symbols (in the global symbol registry)
  if (!Porffor.object.isObjectOrSymbol(key))
    throw new TypeError('WeakMap key must be an object or symbol');

  // Check if it's a registered symbol (Symbol.keyFor returns a string for registered symbols)
  if (Porffor.type(key) == Porffor.TYPES.symbol && Symbol.keyFor(key) !== undefined)
    throw new TypeError('WeakMap key must not be a registered symbol');

  if (!__WeakMap_prototype_has(_this, key)) {
    __WeakMap_prototype_set(_this, key, value);
  }

  return __WeakMap_prototype_get(_this, key);
};

export const __WeakMap_prototype_getOrInsertComputed = (_this: WeakMap, key: any, callbackFn: any) => {
  // Key must be able to be held weakly (object or unregistered symbol)
  // CanBeHeldWeakly returns false for primitives that aren't symbols
  // and for registered symbols (in the global symbol registry)
  if (!Porffor.object.isObjectOrSymbol(key))
    throw new TypeError('WeakMap key must be an object or symbol');

  // Check if it's a registered symbol (Symbol.keyFor returns a string for registered symbols)
  if (Porffor.type(key) == Porffor.TYPES.symbol && Symbol.keyFor(key) !== undefined)
    throw new TypeError('WeakMap key must not be a registered symbol');

  // callbackFn must be callable
  if (typeof callbackFn !== 'function')
    throw new TypeError('callbackFn must be a function');

  if (!__WeakMap_prototype_has(_this, key)) {
    // Call(callbackfn, undefined, « key ») per spec
    const value: any = callbackFn.call(undefined, key);
    __WeakMap_prototype_set(_this, key, value);
  }

  return __WeakMap_prototype_get(_this, key);
};