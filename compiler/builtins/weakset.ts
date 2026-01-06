import type {} from './porffor.d.ts';

export const __WeakSet_prototype_has = (_this: WeakSet, value: any) => {
  return __Set_prototype_has(_this as Set, value);
};

export const __WeakSet_prototype_add = (_this: WeakSet, value: any) => {
  if (!Porffor.object.isObjectOrSymbol(value)) throw new TypeError('Value in WeakSet needs to be an object or symbol');

  // Check if it's a registered symbol (Symbol.keyFor returns a string for registered symbols)
  if (Porffor.type(value) == Porffor.TYPES.symbol && Symbol.keyFor(value) !== undefined)
    throw new TypeError('WeakSet value must not be a registered symbol');

  __Set_prototype_add(_this as Set, value);
  return _this;
};

export const __WeakSet_prototype_delete = (_this: WeakSet, value: any) => {
  return __Set_prototype_delete(_this as Set, value);
};

export const WeakSet = function (iterable: any): WeakSet {
  if (!new.target) throw new TypeError("Constructor WeakSet requires 'new'");

  const out: WeakSet = Porffor.malloc();
  if (iterable != null) for (const x of iterable) {
    __WeakSet_prototype_add(out, x);
  }

  return out;
};

export const __WeakSet_prototype_toString = (_this: WeakSet) => '[object WeakSet]';
export const __WeakSet_prototype_toLocaleString = (_this: WeakSet) => __WeakSet_prototype_toString(_this);