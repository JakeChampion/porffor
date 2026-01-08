import type {} from './porffor.d.ts';

// WrapperIterator is stored as an array:
// [0] = iterable
// [1] = current index (as number)

// Create a wrapper iterator from an iterable - takes pre-created storage array
export const __Porffor_WrapperIterator = (storage: any[]): __Porffor_WrapperIterator => {
  return storage as __Porffor_WrapperIterator;
};

// Create wrapper iterator storage array
export const __Porffor_WrapperIterator_create = (iterable: any): any[] => {
  return [iterable, 0];
};

// Get the iterable from a wrapper iterator
export const __Porffor_WrapperIterator_getIterable = (_this: __Porffor_WrapperIterator): any => {
  return (_this as any[])[0];
};

// Get the current index from a wrapper iterator
export const __Porffor_WrapperIterator_getIndex = (_this: __Porffor_WrapperIterator): i32 => {
  return (_this as any[])[1];
};

// Set the index of a wrapper iterator
export const __Porffor_WrapperIterator_setIndex = (_this: __Porffor_WrapperIterator, index: i32): void => {
  (_this as any[])[1] = index;
};

// Helper to get length of an iterable
export const __Porffor_iterator_getLength = (iterable: any): i32 => {
  const t: i32 = Porffor.type(iterable);

  // Arrays, strings, typed arrays have .length
  if (t == Porffor.TYPES.array || t == Porffor.TYPES.string || t == Porffor.TYPES.bytestring) {
    return iterable.length;
  }

  // Sets
  if (t == Porffor.TYPES.set) {
    return iterable.size;
  }

  // Generators - get values array length
  if (t == Porffor.TYPES.__porffor_generator) {
    return (iterable as any[]).length;
  }

  // Typed arrays
  if (t >= Porffor.TYPES.uint8clampedarray && t <= Porffor.TYPES.float64array) {
    return iterable.length;
  }

  return 0;
};

// Helper to get element at index from an iterable
export const __Porffor_iterator_getElement = (iterable: any, index: i32): any => {
  const t: i32 = Porffor.type(iterable);

  // Arrays
  if (t == Porffor.TYPES.array) {
    return (iterable as any[])[index];
  }

  // Strings
  if (t == Porffor.TYPES.string || t == Porffor.TYPES.bytestring) {
    return (iterable as string)[index];
  }

  // Sets - convert to array first (inefficient but works)
  if (t == Porffor.TYPES.set) {
    const arr: any[] = Array.from(iterable as Set);
    return arr[index];
  }

  // Generators
  if (t == Porffor.TYPES.__porffor_generator) {
    return (iterable as any[])[index];
  }

  // Typed arrays
  if (t >= Porffor.TYPES.uint8clampedarray && t <= Porffor.TYPES.float64array) {
    return iterable[index];
  }

  return undefined;
};


export const __Porffor_WrapperIterator_prototype_next = (storage: any[]) => {
  // storage is the WrapperIterator array: [0] = iterable, [1] = index
  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: object = {};

  if (index >= length) {
    result.value = undefined;
    result.done = true;
  } else {
    result.value = __Porffor_iterator_getElement(iterable, index);
    result.done = false;
    storage[1] = index + 1;
  }

  return result;
};

export const __Porffor_WrapperIterator_prototype_return = (storage: any[], value: any) => {
  // Mark iterator as done by setting index past length
  const iterable: any = storage[0];
  const length: i32 = __Porffor_iterator_getLength(iterable);
  storage[1] = length;

  const result: object = {};
  result.value = value;
  result.done = true;
  return result;
};

export const __Porffor_WrapperIterator_prototype_throw = (storage: any[], error: any) => {
  throw error;
};


// Iterator constructor - abstract, cannot be directly constructed
export const Iterator = function (): void {
  throw new TypeError('Abstract class Iterator not directly constructable');
};

// Iterator.from - creates an iterator from an iterable or iterator-like
export const __Iterator_from = (obj: any): __Porffor_WrapperIterator => {
  // If obj is already an iterator (has next method), wrap it? For now, treat everything as iterable
  const t: i32 = Porffor.type(obj);

  // Check if it's iterable
  if (t == Porffor.TYPES.array ||
      t == Porffor.TYPES.string ||
      t == Porffor.TYPES.bytestring ||
      t == Porffor.TYPES.set ||
      t == Porffor.TYPES.__porffor_generator ||
      (t >= Porffor.TYPES.uint8clampedarray && t <= Porffor.TYPES.float64array)) {
    const storage: any[] = __Porffor_WrapperIterator_create(obj);
    return __Porffor_WrapperIterator(storage);
  }

  // If it's already a WrapperIterator, return as-is
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return obj;
  }

  throw new TypeError('Iterator.from requires an iterable or iterator-like object');
};

// WrapperIterator.prototype methods

export const __Porffor_WrapperIterator_prototype_map = (storage: any[], mapper: any) => {
  if (typeof mapper !== 'function') {
    throw new TypeError('Iterator.prototype.map requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  // Collect all mapped values into a new array
  const result: any[] = [];
  for (let i: i32 = index; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    result.push(mapper(value, i));
  }

  // Mark original as exhausted
  storage[1] = length;

  // Return new iterator wrapping the result array
  const newStorage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(newStorage);
};

export const __Porffor_WrapperIterator_prototype_filter = (storage: any[], predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.filter requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: any[] = [];
  for (let i: i32 = index; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    if (predicate(value, i)) {
      result.push(value);
    }
  }

  storage[1] = length;

  const newStorage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(newStorage);
};

export const __Porffor_WrapperIterator_prototype_take = (storage: any[], limit: any) => {
  const n: i32 = Math.trunc(limit);
  if (n < 0) {
    throw new RangeError('Iterator.prototype.take requires a non-negative number');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: any[] = [];
  const endIndex: i32 = index + n < length ? index + n : length;
  for (let i: i32 = index; i < endIndex; i++) {
    result.push(__Porffor_iterator_getElement(iterable, i));
  }

  storage[1] = endIndex;

  const newStorage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(newStorage);
};

export const __Porffor_WrapperIterator_prototype_drop = (storage: any[], count: any) => {
  const n: i32 = Math.trunc(count);
  if (n < 0) {
    throw new RangeError('Iterator.prototype.drop requires a non-negative number');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: any[] = [];
  const newStart: i32 = index + n < length ? index + n : length;
  for (let i: i32 = newStart; i < length; i++) {
    result.push(__Porffor_iterator_getElement(iterable, i));
  }

  storage[1] = length;

  const newStorage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(newStorage);
};

export const __Porffor_WrapperIterator_prototype_flatMap = (storage: any[], mapper: any) => {
  if (typeof mapper !== 'function') {
    throw new TypeError('Iterator.prototype.flatMap requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: any[] = [];
  for (let i: i32 = index; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    const mapped: any = mapper(value, i);

    // If mapped is iterable, flatten one level
    const mt: i32 = Porffor.type(mapped);
    if (mt == Porffor.TYPES.array) {
      for (const item of (mapped as any[])) {
        result.push(item);
      }
    } else {
      result.push(mapped);
    }
  }

  storage[1] = length;

  const newStorage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(newStorage);
};

export const __Porffor_WrapperIterator_prototype_reduce = (storage: any[], reducer: any, initialValue: any) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('Iterator.prototype.reduce requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  let accumulator: any = initialValue;
  let i: i32 = index;

  // If no initial value provided, use first element
  if (Porffor.type(initialValue) == Porffor.TYPES.undefined && i < length) {
    accumulator = __Porffor_iterator_getElement(iterable, i);
    i++;
  }

  for (; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    accumulator = reducer(accumulator, value, i);
  }

  storage[1] = length;

  return accumulator;
};

export const __Porffor_WrapperIterator_prototype_toArray = (storage: any[]) => {
  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: any[] = [];
  for (let i: i32 = index; i < length; i++) {
    result.push(__Porffor_iterator_getElement(iterable, i));
  }

  storage[1] = length;

  return result;
};

export const __Porffor_WrapperIterator_prototype_forEach = (storage: any[], callback: any) => {
  if (typeof callback !== 'function') {
    throw new TypeError('Iterator.prototype.forEach requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  for (let i: i32 = index; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    callback(value, i);
  }

  storage[1] = length;
};

export const __Porffor_WrapperIterator_prototype_some = (storage: any[], predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.some requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  for (let i: i32 = index; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    storage[1] = i + 1;
    if (predicate(value, i)) {
      storage[1] = length;
      return true;
    }
  }

  storage[1] = length;
  return false;
};

export const __Porffor_WrapperIterator_prototype_every = (storage: any[], predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.every requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  for (let i: i32 = index; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    storage[1] = i + 1;
    if (!predicate(value, i)) {
      storage[1] = length;
      return false;
    }
  }

  storage[1] = length;
  return true;
};

export const __Porffor_WrapperIterator_prototype_find = (storage: any[], predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.find requires a callable');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  for (let i: i32 = index; i < length; i++) {
    const value: any = __Porffor_iterator_getElement(iterable, i);
    storage[1] = i + 1;
    if (predicate(value, i)) {
      storage[1] = length;
      return value;
    }
  }

  storage[1] = length;
  return undefined;
};

// Symbol.iterator - returns self
export const __Porffor_WrapperIterator_prototype_Symbol_iterator$get = (storage: any[]) => {
  return storage as __Porffor_WrapperIterator;
};

// Symbol.dispose - exhausts the iterator
export const __Porffor_WrapperIterator_prototype_Symbol_dispose = (storage: any[]) => {
  const iterable: any = storage[0];
  const length: i32 = __Porffor_iterator_getLength(iterable);
  storage[1] = length;
};

// Symbol.toStringTag
export const __Porffor_WrapperIterator_prototype_Symbol_toStringTag$get = () => {
  return 'Iterator';
};

// Iterator.concat - concatenates multiple iterables into one iterator
// NOTE: Has known bug due to Porffor variable capture issue in builtins
export const __Iterator_concat = (...iterables: any[]): __Porffor_WrapperIterator => {
  const result: any[] = [];
  const numIterables: i32 = iterables.length;

  for (let idx: i32 = 0; idx < numIterables; idx++) {
    const iterable: any = iterables[idx];
    const t: i32 = Porffor.type(iterable);

    if (t != Porffor.TYPES.array &&
        t != Porffor.TYPES.string &&
        t != Porffor.TYPES.bytestring &&
        t != Porffor.TYPES.set &&
        t != Porffor.TYPES.__porffor_generator &&
        t != Porffor.TYPES.__porffor_wrapperiterator &&
        !(t >= Porffor.TYPES.uint8clampedarray && t <= Porffor.TYPES.float64array)) {
      throw new TypeError('Iterator.concat requires iterable arguments');
    }

    if (t == Porffor.TYPES.array) {
      const arr: any[] = iterable as any[];
      const arrLen: i32 = arr.length;
      for (let j: i32 = 0; j < arrLen; j++) {
        result.push(arr[j]);
      }
    } else if (t == Porffor.TYPES.__porffor_wrapperiterator) {
      const arr: any[] = __Porffor_WrapperIterator_prototype_toArray(iterable as any[]);
      const arrLen: i32 = arr.length;
      for (let j: i32 = 0; j < arrLen; j++) {
        result.push(arr[j]);
      }
    } else {
      const length: i32 = __Porffor_iterator_getLength(iterable);
      for (let i: i32 = 0; i < length; i++) {
        result.push(__Porffor_iterator_getElement(iterable, i));
      }
    }
  }

  return __Iterator_from(result);
};

// Iterator.zip - zips multiple iterables together
export const __Iterator_zip = (iterables: any[], options: any): __Porffor_WrapperIterator => {
  // Get mode from options (default: 'shortest')
  let mode: string = 'shortest';
  if (options !== undefined && options !== null) {
    if (typeof options.mode === 'string') {
      mode = options.mode;
      if (mode !== 'shortest' && mode !== 'longest' && mode !== 'strict') {
        throw new RangeError("mode must be 'shortest', 'longest', or 'strict'");
      }
    }
  }

  // Validate iterables is an array-like
  const t: i32 = Porffor.type(iterables);
  if (t != Porffor.TYPES.array) {
    throw new TypeError('Iterator.zip requires an array of iterables');
  }

  const iterablesArr: any[] = iterables as any[];
  const numIterables: i32 = iterablesArr.length;

  if (numIterables === 0) {
    // Empty input - return empty iterator
    const storage: any[] = __Porffor_WrapperIterator_create([]);
    return __Porffor_WrapperIterator(storage);
  }

  // Get lengths of all iterables
  const lengths: any[] = [];
  for (let i: i32 = 0; i < numIterables; i++) {
    const iter: any = iterablesArr[i];
    const iterType: i32 = Porffor.type(iter);
    if (iterType != Porffor.TYPES.array &&
        iterType != Porffor.TYPES.string &&
        iterType != Porffor.TYPES.bytestring &&
        iterType != Porffor.TYPES.set &&
        iterType != Porffor.TYPES.__porffor_generator &&
        iterType != Porffor.TYPES.__porffor_wrapperiterator &&
        !(iterType >= Porffor.TYPES.uint8clampedarray && iterType <= Porffor.TYPES.float64array)) {
      throw new TypeError('Iterator.zip requires iterable arguments');
    }
    lengths.push(__Porffor_iterator_getLength(iter));
  }

  // Determine result length based on mode
  let resultLength: i32 = lengths[0];
  if (mode === 'shortest') {
    for (let i: i32 = 1; i < numIterables; i++) {
      if (lengths[i] < resultLength) {
        resultLength = lengths[i];
      }
    }
  } else if (mode === 'longest') {
    for (let i: i32 = 1; i < numIterables; i++) {
      if (lengths[i] > resultLength) {
        resultLength = lengths[i];
      }
    }
  } else if (mode === 'strict') {
    // All must have same length
    for (let i: i32 = 1; i < numIterables; i++) {
      if (lengths[i] !== resultLength) {
        throw new TypeError('Iterator.zip with strict mode requires all iterables to have the same length');
      }
    }
  }

  // Build result array of tuples
  // Note: affected by variable capture bug - values may be corrupted across calls
  const result: any[] = [];
  for (let j: i32 = 0; j < resultLength; j++) {
    const tuple: any[] = [];
    for (let i: i32 = 0; i < numIterables; i++) {
      if (j < lengths[i]) {
        tuple.push(__Porffor_iterator_getElement(iterablesArr[i], j));
      } else {
        tuple.push(undefined);
      }
    }
    result.push(tuple);
  }

  const storage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(storage);
};

// Iterator.zipKeyed - zips iterables into objects with keys
export const __Iterator_zipKeyed = (iterables: any, options: any): __Porffor_WrapperIterator => {
  // Get mode from options (default: 'shortest')
  let mode: string = 'shortest';
  if (options !== undefined && options !== null) {
    if (typeof options.mode === 'string') {
      mode = options.mode;
      if (mode !== 'shortest' && mode !== 'longest' && mode !== 'strict') {
        throw new RangeError("mode must be 'shortest', 'longest', or 'strict'");
      }
    }
  }

  // iterables should be an object with string/symbol keys mapping to iterables
  if (!Porffor.object.isObject(iterables)) {
    throw new TypeError('Iterator.zipKeyed requires an object of iterables');
  }

  // Get keys and corresponding iterables
  const keys: any[] = Object.keys(iterables);
  const numKeys: i32 = keys.length;

  if (numKeys === 0) {
    // Empty input - return empty iterator
    const storage: any[] = __Porffor_WrapperIterator_create([]);
    return __Porffor_WrapperIterator(storage);
  }

  // Get lengths of all iterables
  const lengths: any[] = [];
  const iterablesArr: any[] = [];
  for (let i: i32 = 0; i < numKeys; i++) {
    const key: any = keys[i];
    const iter: any = iterables[key];
    const iterType: i32 = Porffor.type(iter);
    if (iterType != Porffor.TYPES.array &&
        iterType != Porffor.TYPES.string &&
        iterType != Porffor.TYPES.bytestring &&
        iterType != Porffor.TYPES.set &&
        iterType != Porffor.TYPES.__porffor_generator &&
        iterType != Porffor.TYPES.__porffor_wrapperiterator &&
        !(iterType >= Porffor.TYPES.uint8clampedarray && iterType <= Porffor.TYPES.float64array)) {
      throw new TypeError('Iterator.zipKeyed requires iterable values');
    }
    iterablesArr.push(iter);
    lengths.push(__Porffor_iterator_getLength(iter));
  }

  // Determine result length based on mode
  let resultLength: i32 = lengths[0];
  if (mode === 'shortest') {
    for (let i: i32 = 1; i < numKeys; i++) {
      if (lengths[i] < resultLength) {
        resultLength = lengths[i];
      }
    }
  } else if (mode === 'longest') {
    for (let i: i32 = 1; i < numKeys; i++) {
      if (lengths[i] > resultLength) {
        resultLength = lengths[i];
      }
    }
  } else if (mode === 'strict') {
    // All must have same length
    for (let i: i32 = 1; i < numKeys; i++) {
      if (lengths[i] !== resultLength) {
        throw new TypeError('Iterator.zipKeyed with strict mode requires all iterables to have the same length');
      }
    }
  }

  // Build result array of objects
  const result: any[] = [];
  for (let j: i32 = 0; j < resultLength; j++) {
    const obj: object = {};
    for (let i: i32 = 0; i < numKeys; i++) {
      const key: any = keys[i];
      if (j < lengths[i]) {
        obj[key] = __Porffor_iterator_getElement(iterablesArr[i], j);
      } else {
        obj[key] = undefined;
      }
    }
    result.push(obj);
  }

  const storage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(storage);
};
