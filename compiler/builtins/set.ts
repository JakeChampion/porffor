import type {} from './porffor.d.ts';

// SameValueZero comparison (used by Set and Map)
// Like === but NaN === NaN is true, and +0 === -0 is true
export const __Porffor_set_sameValueZero = (x: any, y: any): boolean => {
  if (x === y) return true;
  // NaN !== NaN, but SameValueZero(NaN, NaN) should be true
  if (Number.isNaN(x) && Number.isNaN(y)) return true;
  return false;
};

export const __Set_prototype_size$get = (_this: Set) => {
  return Porffor.wasm.i32.load(_this, 0, 0);
};

export const __Set_prototype_values = (_this: Set) => {
  // todo: this should return an iterator not array
  const size: number = Porffor.wasm.i32.load(_this, 0, 0);

  const out: any[] = Porffor.malloc();
  for (let i: number = 0; i < size; i++) {
    Porffor.array.fastPush(out, (_this as any[])[i]);
  }

  return out;
};

export const __Set_prototype_keys = (_this: Set) => {
  return __Set_prototype_values(_this);
};

export const __Set_prototype_has = (_this: Set, value: any) => {
  const size: number = Porffor.wasm.i32.load(_this, 0, 0);

  for (let i: number = 0; i < size; i++) {
    if (__Porffor_set_sameValueZero((_this as any[])[i], value)) return true;
  }

  return false;
};

export const __Set_prototype_add = (_this: Set, value: any) => {
  const size: number = Porffor.wasm.i32.load(_this, 0, 0);

  // check if already in set
  for (let i: number = 0; i < size; i++) {
    if (__Porffor_set_sameValueZero((_this as any[])[i], value)) return _this;
  }

  // not, add it
  // increment size by 1
  Porffor.wasm.i32.store(_this, size + 1, 0, 0);

  // write new value at end
  (_this as any[])[size] = value;

  return _this;
};

export const __Set_prototype_delete = (_this: Set, value: any) => {
  // check if already in set
  const size: number = Porffor.wasm.i32.load(_this, 0, 0);
  for (let i: number = 0; i < size; i++) {
    if (__Porffor_set_sameValueZero((_this as any[])[i], value)) {
      // found, delete
      Porffor.array.fastRemove(_this, i, size);
      return true;
    }
  }

  // not, return false
  return false;
};

export const __Set_prototype_clear = (_this: Set) => {
  // just set size to 0
  // do not need to delete any as old will just be overwritten
  Porffor.wasm.i32.store(_this, 0, 0, 0);
};

export const __Set_prototype_forEach = (_this: Set, callbackFn: any, thisArg: any = undefined) => {
  if (typeof callbackFn !== 'function') throw new TypeError('callbackFn must be a function');

  for (const x of _this) {
    callbackFn.call(thisArg, x, x, _this);
  }
};

export const Set = function (iterable: any): Set {
  if (!new.target) throw new TypeError("Constructor Set requires 'new'");

  const out: Set = Porffor.malloc();

  if (iterable != null) {
    // Note: Spec requires checking if "add" is callable (7a, 7c), but we skip this check
    // because property lookup on builtin objects returns undefined due to architectural
    // limitations. We call __Set_prototype_add directly which always works.
    for (const x of iterable) {
      __Set_prototype_add(out, x);
    }
  }

  return out;
};

// GetSetRecord - get size, has, and keys from a set-like object
// https://tc39.es/ecma262/#sec-getsetrecord
export const __Porffor_getSetRecord = (obj: any): any[] => {
  // 1. If obj is not an Object, throw a TypeError exception.
  if (!Porffor.object.isObject(obj)) throw new TypeError('other argument must be an object');

  // 2-4. Get size
  const rawSize: any = obj.size;
  const numSize: number = +rawSize;
  if (Number.isNaN(numSize)) throw new TypeError('size must be a number');
  const intSize: number = ecma262.ToIntegerOrInfinity(numSize);
  if (intSize < 0) throw new RangeError('size must be non-negative');

  // 5-8. Get has method
  const has: any = obj.has;
  if (typeof has !== 'function') throw new TypeError('has must be a function');

  // 9-11. Get keys method
  const keys: any = obj.keys;
  if (typeof keys !== 'function') throw new TypeError('keys must be a function');

  // Return record as array: [size, has, keys, obj]
  const record: any[] = Porffor.malloc();
  record[0] = intSize;
  record[1] = has;
  record[2] = keys;
  record[3] = obj;
  return record;
};

export const __Set_prototype_union = (_this: Set, other: any) => {
  const out: Set = new Set(_this);

  // Fast path for Set
  if (Porffor.type(other) == Porffor.TYPES.set) {
    for (const x of other) {
      out.add(x);
    }
    return out;
  }

  // Fast path for Map
  if (Porffor.type(other) == Porffor.TYPES.map) {
    for (const x of (other as Map).keys()) {
      out.add(x);
    }
    return out;
  }

  // Set-like object path
  const record: any[] = __Porffor_getSetRecord(other);
  const keysMethod: any = record[2];
  const otherObj: any = record[3];

  for (const x of keysMethod.call(otherObj)) {
    out.add(x);
  }

  return out;
};

export const __Set_prototype_intersection = (_this: Set, other: any) => {
  const out: Set = new Set();

  // Fast path for Set
  if (Porffor.type(other) == Porffor.TYPES.set) {
    for (const x of _this) {
      if (other.has(x)) out.add(x);
    }
    return out;
  }

  // Fast path for Map
  if (Porffor.type(other) == Porffor.TYPES.map) {
    for (const x of _this) {
      if ((other as Map).has(x)) out.add(x);
    }
    return out;
  }

  // Set-like object path
  const record: any[] = __Porffor_getSetRecord(other);
  const otherSize: number = record[0];
  const hasMethod: any = record[1];
  const keysMethod: any = record[2];
  const otherObj: any = record[3];

  const thisSize: number = _this.size;

  // Spec optimization: choose smaller set to iterate
  if (thisSize <= otherSize) {
    // this is smaller or equal, iterate this and call has on other
    for (const x of _this) {
      if (hasMethod.call(otherObj, x)) out.add(x);
    }
  } else {
    // other is smaller, iterate other's keys and check has on this
    for (const x of keysMethod.call(otherObj)) {
      if (_this.has(x)) out.add(x);
    }
  }

  return out;
};

export const __Set_prototype_difference = (_this: Set, other: any) => {
  const out: Set = new Set(_this);

  // Fast path for Set
  if (Porffor.type(other) == Porffor.TYPES.set) {
    for (const x of other) {
      out.delete(x);
    }
    return out;
  }

  // Fast path for Map
  if (Porffor.type(other) == Porffor.TYPES.map) {
    for (const x of (other as Map).keys()) {
      out.delete(x);
    }
    return out;
  }

  // Set-like object path
  const record: any[] = __Porffor_getSetRecord(other);
  const keysMethod: any = record[2];
  const otherObj: any = record[3];

  for (const x of keysMethod.call(otherObj)) {
    out.delete(x);
  }

  return out;
};

export const __Set_prototype_symmetricDifference = (_this: Set, other: any) => {
  const out: Set = new Set(_this);

  // Fast path for Set
  if (Porffor.type(other) == Porffor.TYPES.set) {
    for (const x of other) {
      if (_this.has(x)) out.delete(x);
        else out.add(x);
    }
    return out;
  }

  // Fast path for Map
  if (Porffor.type(other) == Porffor.TYPES.map) {
    for (const x of (other as Map).keys()) {
      if (_this.has(x)) out.delete(x);
        else out.add(x);
    }
    return out;
  }

  // Set-like object path
  const record: any[] = __Porffor_getSetRecord(other);
  const keysMethod: any = record[2];
  const otherObj: any = record[3];

  for (const x of keysMethod.call(otherObj)) {
    if (_this.has(x)) out.delete(x);
      else out.add(x);
  }

  return out;
};

export const __Set_prototype_isSubsetOf = (_this: Set, other: any) => {
  // Fast path for Set
  if (Porffor.type(other) == Porffor.TYPES.set) {
    for (const x of _this) {
      if (!other.has(x)) return false;
    }
    return true;
  }

  // Fast path for Map
  if (Porffor.type(other) == Porffor.TYPES.map) {
    for (const x of _this) {
      if (!(other as Map).has(x)) return false;
    }
    return true;
  }

  // Set-like object path
  const record: any[] = __Porffor_getSetRecord(other);
  const hasMethod: any = record[1];
  const otherObj: any = record[3];

  for (const x of _this) {
    if (!hasMethod.call(otherObj, x)) return false;
  }

  return true;
};

export const __Set_prototype_isSupersetOf = (_this: Set, other: any) => {
  // Fast path for Set
  if (Porffor.type(other) == Porffor.TYPES.set) {
    for (const x of other) {
      if (!_this.has(x)) return false;
    }
    return true;
  }

  // Fast path for Map
  if (Porffor.type(other) == Porffor.TYPES.map) {
    for (const x of (other as Map).keys()) {
      if (!_this.has(x)) return false;
    }
    return true;
  }

  // Set-like object path
  const record: any[] = __Porffor_getSetRecord(other);
  const keysMethod: any = record[2];
  const otherObj: any = record[3];

  for (const x of keysMethod.call(otherObj)) {
    if (!_this.has(x)) return false;
  }

  return true;
};

export const __Set_prototype_isDisjointFrom = (_this: Set, other: any) => {
  // Fast path for Set
  if (Porffor.type(other) == Porffor.TYPES.set) {
    for (const x of _this) {
      if (other.has(x)) return false;
    }
    return true;
  }

  // Fast path for Map
  if (Porffor.type(other) == Porffor.TYPES.map) {
    for (const x of _this) {
      if ((other as Map).has(x)) return false;
    }
    return true;
  }

  // Set-like object path
  const record: any[] = __Porffor_getSetRecord(other);
  const hasMethod: any = record[1];
  const otherObj: any = record[3];

  for (const x of _this) {
    if (hasMethod.call(otherObj, x)) return false;
  }

  return true;
};

export const __Set_prototype_toString = (_this: Set) => '[object Set]';
export const __Set_prototype_toLocaleString = (_this: Set) => __Set_prototype_toString(_this);