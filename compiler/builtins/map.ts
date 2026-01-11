import type {} from './porffor.d.ts';

// SameValueZero comparison (used by Set and Map)
// Like === but NaN === NaN is true, and +0 === -0 is true
export const __Porffor_map_sameValueZero = (x: any, y: any): boolean => {
  if (x === y) return true;
  // NaN !== NaN, but SameValueZero(NaN, NaN) should be true
  if (Number.isNaN(x) && Number.isNaN(y)) return true;
  return false;
};

export const __Map_prototype_size$get = (_this: Map) => {
  return Porffor.wasm.i32.load(Porffor.wasm.i32.load(_this, 0, 0), 0, 0);
};

export const __Map_prototype_has = (_this: Map, key: any) => {
  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  for (const x of keys) {
    if (__Porffor_map_sameValueZero(x, key)) return true;
  }

  return false;
};

export const __Map_prototype_get = (_this: Map, key: any) => {
  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  const vals: any[] = Porffor.wasm.i32.load(_this, 0, 4);

  const size: i32 = Porffor.wasm.i32.load(keys, 0, 0);
  for (let i: i32 = 0; i < size; i++) {
    if (__Porffor_map_sameValueZero(keys[i], key)) return vals[i];
  }

  return undefined;
};

export const __Map_prototype_set = (_this: Map, key: any, value: any) => {
  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  const vals: any[] = Porffor.wasm.i32.load(_this, 0, 4);

  const size: i32 = keys.length;
  for (let i: i32 = 0; i < size; i++) {
    if (__Porffor_map_sameValueZero(keys[i], key)) {
      vals[i] = value;
      return _this;
    }
  }

  // add key if non-existent
  // increment size by 1
  keys.length = size + 1;

  // write new key and value at end
  keys[size] = key;
  vals[size] = value;

  return _this;
};

export const __Map_prototype_delete = (_this: Map, key: any) => {
  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  const vals: any[] = Porffor.wasm.i32.load(_this, 0, 4);

  const size: i32 = keys.length;
  for (let i: i32 = 0; i < size; i++) {
    if (__Porffor_map_sameValueZero(keys[i], key)) {
      Porffor.array.fastRemove(keys, i, size);
      Porffor.array.fastRemove(vals, i, size);
      return true;
    }
  }

  return false;
};

export const __Map_prototype_clear = (_this: Map) => {
  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  keys.length = 0;

  const vals: any[] = Porffor.wasm.i32.load(_this, 0, 4);
  vals.length = 0;
};

export const __Map_prototype_forEach = (_this: Map, callbackFn: any, thisArg: any = undefined) => {
  if (typeof callbackFn !== 'function') throw new TypeError('callbackFn must be a function');

  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  const vals: any[] = Porffor.wasm.i32.load(_this, 0, 4);

  // Use dynamic size check to handle elements added during iteration
  // The spec says: "New values added after the call to forEach begins are visited"
  let i: i32 = 0;
  while (i < Porffor.wasm.i32.load(keys, 0, 0)) {
    callbackFn.call(thisArg, vals[i], keys[i], _this);
    i++;
  }
};

export const Map = function (iterable: any): Map {
  if (!new.target) throw new TypeError("Constructor Map requires 'new'");

  const out: Map = Porffor.malloc(8);

  const keys: any[] = Porffor.malloc();
  const vals: any[] = Porffor.malloc();
  Porffor.wasm.i32.store(out, keys, 0, 0);
  Porffor.wasm.i32.store(out, vals, 0, 4);

  if (iterable != null) {
    // Note: Spec requires checking if "set" is callable (7a, 7c), but we skip this check
    // because property lookup on builtin objects returns undefined due to architectural
    // limitations. We call __Map_prototype_set directly which always works.
    for (const x of iterable) {
      if (!Porffor.object.isObject(x)) throw new TypeError('Iterator contains non-object');
      __Map_prototype_set(out, x[0], x[1]);
    }
  }

  return out;
};

// Map.groupBy ( items, callbackfn )
// https://tc39.es/ecma262/#sec-map.groupby
export const __Map_groupBy = (items: any, callbackFn: any): Map => {
  if (Porffor.type(callbackFn) != Porffor.TYPES.function) throw new TypeError('callbackFn is not a function');

  const out: Map = new Map();

  let i: i32 = 0;
  for (const x of items) {
    const key: any = callbackFn(x, i++);
    if (!__Map_prototype_has(out, key)) {
      const arr: any[] = Porffor.malloc();
      __Map_prototype_set(out, key, arr);
    }

    Porffor.array.fastPush(__Map_prototype_get(out, key), x);
  }

  return out;
};

export const __Map_prototype_keys = (_this: Map) => {
  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  const out: any[] = Porffor.malloc();

  for (const x of keys) {
    Porffor.array.fastPush(out, x);
  }

  return out;
};

export const __Map_prototype_values = (_this: Map) => {
  const size: i32 = Porffor.wasm.i32.load(Porffor.wasm.i32.load(_this, 0, 0), 0, 0);
  const vals: any[] = Porffor.wasm.i32.load(_this, 0, 4);
  const out: any[] = Porffor.malloc();

  for (let i: i32 = 0; i < size; i++) {
    Porffor.array.fastPush(out, vals[i]);
  }

  return out;
};

export const __Map_prototype_entries = (_this: Map) => {
  const keys: any[] = Porffor.wasm.i32.load(_this, 0, 0);
  const vals: any[] = Porffor.wasm.i32.load(_this, 0, 4);
  const size: i32 = Porffor.wasm.i32.load(keys, 0, 0);
  const out: any[] = Porffor.malloc();

  for (let i: i32 = 0; i < size; i++) {
    const entry: any[] = Porffor.malloc();
    entry[0] = keys[i];
    entry[1] = vals[i];
    entry.length = 2;
    Porffor.array.fastPush(out, entry);
  }

  return out;
};

export const __Map_prototype_toString = (_this: Map) => '[object Map]';
export const __Map_prototype_toLocaleString = (_this: Map) => __Map_prototype_toString(_this);

// https://github.com/tc39/proposal-upsert
export const __Map_prototype_getOrInsert = (_this: Map, key: any, value: any) => {
  if (!__Map_prototype_has(_this, key)) {
    __Map_prototype_set(_this, key, value);
  }

  return __Map_prototype_get(_this, key);
};

export const __Map_prototype_getOrInsertComputed = (_this: Map, key: any, callbackFn: any) => {
  if (typeof callbackFn !== 'function') throw new TypeError('callbackFn must be a function');

  // CanonicalizeKeyedCollectionKey: -0 becomes +0
  if (key === 0 && 1 / key === -Infinity) key = 0;

  if (!__Map_prototype_has(_this, key)) {
    __Map_prototype_set(_this, key, callbackFn(key));
  }

  return __Map_prototype_get(_this, key);
};