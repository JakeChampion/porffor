import type {} from './porffor.d.ts';

// todo: support receiver
export const __Reflect_get = (target: any, prop: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  return target[prop];
};

// todo: support receiver
export const __Reflect_set = (target: any, prop: any, value: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  try {
    target[prop] = value;
    return true;
  } catch {
    return false;
  }
};

export const __Reflect_has = (target: any, prop: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  return prop in target;
};

export const __Reflect_defineProperty = (target: any, prop: any, descriptor: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');
  if (!Porffor.object.isObject(descriptor)) throw new TypeError('Descriptor is a non-object');

  try {
    Object.defineProperty(target, prop, descriptor);
    return true;
  } catch {
    return false;
  }
};

export const __Reflect_deleteProperty = (target: any, prop: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  return delete target[prop];
};

export const __Reflect_getOwnPropertyDescriptor = (target: any, prop: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  return Object.getOwnPropertyDescriptor(target, prop);
};

export const __Reflect_isExtensible = (target: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  return Object.isExtensible(target);
};

export const __Reflect_preventExtensions = (target: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  try {
    Object.preventExtensions(target);
    return true;
  } catch {
    return false;
  }
};

export const __Reflect_getPrototypeOf = (target: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  return Object.getPrototypeOf(target);
};

export const __Reflect_setPrototypeOf = (target: any, proto: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');
  if (!Porffor.object.isObjectOrNull(proto)) throw new TypeError('Prototype should be an object or null');

  // Get current prototype
  const currentProto: any = Porffor.object.getPrototypeWithHidden(target, Porffor.type(target));

  // If proto is the same as current prototype, return true (no change needed)
  if (proto === currentProto) return true;

  // Check if target is extensible - if not extensible and proto is different, return false
  if (Porffor.object.isInextensible(target)) return false;

  // Check for circular prototype chain: walk up proto's chain to see if we encounter target
  if (proto != null) {
    let p: any = proto;
    while (p != null) {
      if (p === target) return false; // Would create a cycle
      p = Porffor.object.getPrototypeWithHidden(p, Porffor.type(p));
    }
  }

  // Set the prototype
  Porffor.object.setPrototype(target, proto);
  return true;
};

export const __Reflect_ownKeys = (target: any) => {
  if (!Porffor.object.isObject(target)) throw new TypeError('Target is a non-object');

  const out: any[] = Porffor.malloc();

  target = __Porffor_object_underlying(target);
  if (Porffor.type(target) == Porffor.TYPES.object) {
    let ptr: i32 = Porffor.wasm`local.get ${target}` + 8;
    const endPtr: i32 = ptr + Porffor.wasm.i32.load16_u(target, 0, 0) * 18;

    let i: i32 = 0;
    for (; ptr < endPtr; ptr += 18) {
      let key: any;
      Porffor.wasm`local raw i32
local msb i32
local.get ${ptr}
i32.to_u
i32.load 0 4
local.set raw

local.get raw
i32.const 30
i32.shr_u
local.tee msb
if 127
  i32.const 5 ;; symbol
  i32.const 67 ;; string
  local.get msb
  i32.const 3
  i32.eq
  select
  local.set ${key+1}

  local.get raw
  i32.const 1073741823
  i32.and ;; unset 2 MSBs
else
  i32.const 195
  local.set ${key+1}

  local.get raw
end
i32.from_u
local.set ${key}`;

      out[i++] = key;
    }

    out.length = i;
  }

  return out;
};


export const __Reflect_apply = (target: any, thisArgument: any, argumentsList: any) => {
  // CreateListFromArrayLike: If Type(argumentsList) is not Object, throw a TypeError
  if (!Porffor.object.isObject(argumentsList)) throw new TypeError('CreateListFromArrayLike called on non-object');

  // Convert array-like to array using CreateListFromArrayLike logic
  // This handles objects with length property that aren't iterable
  // Use push instead of index assignment because assigning undefined doesn't grow array
  const args: any[] = [];
  const len: i32 = argumentsList.length ?? 0;
  for (let i: i32 = 0; i < len; i++) {
    args.push(argumentsList[i]);
  }
  return Porffor.call(target, args, thisArgument, null);
};

export const __Reflect_construct = (target: any, argumentsList: any, newTarget: any = undefined) => {
  // 1. If IsConstructor(target) is false, throw a TypeError exception.
  if (!ecma262.IsConstructor(target)) throw new TypeError('Reflect.construct: target is not a constructor');

  // 2. If newTarget is not present, let newTarget be target.
  if (newTarget === undefined) newTarget = target;
  // 3. Else, if IsConstructor(newTarget) is false, throw a TypeError exception.
  else if (!ecma262.IsConstructor(newTarget)) throw new TypeError('Reflect.construct: newTarget is not a constructor');

  // CreateListFromArrayLike: If Type(argumentsList) is not Object, throw a TypeError
  if (!Porffor.object.isObject(argumentsList)) throw new TypeError('CreateListFromArrayLike called on non-object');

  // Convert array-like to array using CreateListFromArrayLike logic
  const args: any[] = [];
  const len: i32 = argumentsList.length ?? 0;
  for (let i: i32 = 0; i < len; i++) {
    args.push(argumentsList[i]);
  }
  return Porffor.call(target, args, null, newTarget);
};