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
  if (t == Porffor.TYPES.array || t == Porffor.TYPES.string || t == Porffor.TYPES.bytestring || t == Porffor.TYPES.stringobject) {
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
  if (t == Porffor.TYPES.string || t == Porffor.TYPES.bytestring || t == Porffor.TYPES.stringobject) {
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


// ============================================================================
// TakeIterator - lazy iterator that yields first N items from source
// Storage: [0] = source iterator, [1] = remaining count, [2] = executing flag
// ============================================================================

export const __Porffor_TakeIterator = (storage: any[]): __Porffor_TakeIterator => {
  return storage as __Porffor_TakeIterator;
};

export const __Porffor_TakeIterator_prototype_next = (storage: any[]): object => {
  // Check if already executing - if so, throw TypeError
  if (storage[2]) {
    throw new TypeError('Generator is already executing');
  }

  let remaining: i32 = storage[1];
  const result: object = {};

  if (remaining <= 0) {
    result.value = undefined;
    result.done = true;
    return result;
  }

  // Mark as executing
  storage[2] = true;

  const source: any = storage[0];

  // For object sources, get and call next method directly
  let sourceResult: any;
  if (Porffor.type(source) == Porffor.TYPES.object) {
    const nextMethod: any = source.next;
    sourceResult = nextMethod.call(source);
  } else {
    sourceResult = source.next();
  }

  // Clear executing flag
  storage[2] = false;

  if (sourceResult.done) {
    result.value = undefined;
    result.done = true;
    storage[1] = 0;
    return result;
  }

  result.value = sourceResult.value;
  result.done = false;
  storage[1] = remaining - 1;

  return result;
};

export const __Porffor_TakeIterator_prototype_return = (storage: any[], value: any): object => {
  // Forward to underlying iterator's return if it exists
  const source: any = storage[0];
  if (source != null) {
    if (Porffor.type(source) == Porffor.TYPES.object) {
      const returnMethod: any = source.return;
      if (returnMethod != null) {
        returnMethod.call(source, value);
      }
    } else if (source.return != null) {
      source.return(value);
    }
  }

  storage[1] = 0; // Mark as exhausted
  const result: object = {};
  result.value = value;
  result.done = true;
  return result;
};

export const __Porffor_TakeIterator_prototype_Symbol_iterator$get = (storage: any[]) => {
  return storage as __Porffor_TakeIterator;
};

export const __Porffor_TakeIterator_prototype_Symbol_toStringTag$get = () => {
  return 'Iterator';
};


// ============================================================================
// DropIterator - lazy iterator that skips first N items from source
// Storage: [0] = source iterator, [1] = remaining to drop, [2] = executing flag
// ============================================================================

export const __Porffor_DropIterator = (storage: any[]): __Porffor_DropIterator => {
  return storage as __Porffor_DropIterator;
};

export const __Porffor_DropIterator_prototype_next = (storage: any[]): object => {
  // Check if already executing - if so, throw TypeError
  if (storage[2]) {
    throw new TypeError('Generator is already executing');
  }

  // Mark as executing
  storage[2] = true;

  let toDrop: i32 = storage[1];
  const source: any = storage[0];

  // For object sources, get next method directly
  let nextMethod: any;
  if (Porffor.type(source) == Porffor.TYPES.object) {
    nextMethod = source.next;
  }

  // Drop items if needed
  while (toDrop > 0) {
    let dropResult: any;
    if (nextMethod != null) {
      dropResult = nextMethod.call(source);
    } else {
      dropResult = source.next();
    }
    if (dropResult.done) {
      storage[1] = 0;
      storage[2] = false;
      const result: object = {};
      result.value = undefined;
      result.done = true;
      return result;
    }
    toDrop--;
    storage[1] = toDrop;
  }

  // Get next item from source
  let sourceResult: any;
  if (nextMethod != null) {
    sourceResult = nextMethod.call(source);
  } else {
    sourceResult = source.next();
  }

  // Clear executing flag before returning
  storage[2] = false;

  const result: object = {};
  if (sourceResult.done) {
    result.value = undefined;
    result.done = true;
    return result;
  }

  result.value = sourceResult.value;
  result.done = false;
  return result;
};

export const __Porffor_DropIterator_prototype_return = (storage: any[], value: any): object => {
  // Forward to underlying iterator's return if it exists
  const source: any = storage[0];
  if (source != null) {
    if (Porffor.type(source) == Porffor.TYPES.object) {
      const returnMethod: any = source.return;
      if (returnMethod != null) {
        returnMethod.call(source, value);
      }
    } else if (source.return != null) {
      source.return(value);
    }
  }

  storage[1] = 0;
  const result: object = {};
  result.value = value;
  result.done = true;
  return result;
};

export const __Porffor_DropIterator_prototype_Symbol_iterator$get = (storage: any[]) => {
  return storage as __Porffor_DropIterator;
};

export const __Porffor_DropIterator_prototype_Symbol_toStringTag$get = () => {
  return 'Iterator';
};


// ============================================================================
// MapIterator - lazy iterator that transforms items via mapper function
// Storage: [0] = source iterator, [1] = mapper function, [2] = executing flag
// ============================================================================

export const __Porffor_MapIterator = (storage: any[]): __Porffor_MapIterator => {
  return storage as __Porffor_MapIterator;
};

export const __Porffor_MapIterator_prototype_next = (storage: any[]): object => {
  // Check if already executing - if so, throw TypeError
  if (storage[2]) {
    throw new TypeError('Generator is already executing');
  }

  // Mark as executing
  storage[2] = true;

  const source: any = storage[0];
  const mapper: Function = storage[1];

  // For object sources, get and call next method directly
  let sourceResult: any;
  if (Porffor.type(source) == Porffor.TYPES.object) {
    const nextMethod: any = source.next;
    sourceResult = nextMethod.call(source);
  } else {
    sourceResult = source.next();
  }

  // Clear executing flag
  storage[2] = false;

  const result: object = {};
  if (sourceResult.done) {
    result.value = undefined;
    result.done = true;
    return result;
  }

  result.value = mapper(sourceResult.value);
  result.done = false;
  return result;
};

export const __Porffor_MapIterator_prototype_return = (storage: any[], value: any): object => {
  // Forward to underlying iterator's return if it exists
  const source: any = storage[0];
  if (source != null) {
    if (Porffor.type(source) == Porffor.TYPES.object) {
      const returnMethod: any = source.return;
      if (returnMethod != null) {
        returnMethod.call(source, value);
      }
    } else if (source.return != null) {
      source.return(value);
    }
  }

  const result: object = {};
  result.value = value;
  result.done = true;
  return result;
};

export const __Porffor_MapIterator_prototype_Symbol_iterator$get = (storage: any[]) => {
  return storage as __Porffor_MapIterator;
};

export const __Porffor_MapIterator_prototype_Symbol_toStringTag$get = () => {
  return 'Iterator';
};


// ============================================================================
// FilterIterator - lazy iterator that yields only items matching predicate
// Storage: [0] = source iterator, [1] = predicate function, [2] = executing flag
// ============================================================================

export const __Porffor_FilterIterator = (storage: any[]): __Porffor_FilterIterator => {
  return storage as __Porffor_FilterIterator;
};

export const __Porffor_FilterIterator_prototype_next = (storage: any[]): object => {
  // Check if already executing - if so, throw TypeError
  if (storage[2]) {
    throw new TypeError('Generator is already executing');
  }

  // Mark as executing
  storage[2] = true;

  const source: any = storage[0];
  const predicate: Function = storage[1];

  // For object sources, we need to get and call next method directly
  // to handle plain iterator objects and user-defined classes
  let nextMethod: any;
  if (Porffor.type(source) == Porffor.TYPES.object) {
    nextMethod = source.next;
  }

  while (true) {
    let sourceResult: any;
    if (nextMethod != null) {
      sourceResult = nextMethod.call(source);
    } else {
      sourceResult = source.next();
    }

    if (sourceResult.done) {
      storage[2] = false;
      const result: object = {};
      result.value = undefined;
      result.done = true;
      return result;
    }

    if (predicate(sourceResult.value)) {
      storage[2] = false;
      const result: object = {};
      result.value = sourceResult.value;
      result.done = false;
      return result;
    }
  }
};

export const __Porffor_FilterIterator_prototype_return = (storage: any[], value: any): object => {
  // Forward to underlying iterator's return if it exists
  const source: any = storage[0];
  if (source != null) {
    if (Porffor.type(source) == Porffor.TYPES.object) {
      const returnMethod: any = source.return;
      if (returnMethod != null) {
        returnMethod.call(source, value);
      }
    } else if (source.return != null) {
      source.return(value);
    }
  }

  const result: object = {};
  result.value = value;
  result.done = true;
  return result;
};

export const __Porffor_FilterIterator_prototype_Symbol_iterator$get = (storage: any[]) => {
  return storage as __Porffor_FilterIterator;
};

export const __Porffor_FilterIterator_prototype_Symbol_toStringTag$get = () => {
  return 'Iterator';
};


// ============================================================================
// ConcatIterator - lazy iterator that concatenates multiple iterables
// Storage: [0] = array of iterables, [1] = current iterable index, [2] = current iterator, [3] = current iterator's next method
// ============================================================================

export const __Porffor_ConcatIterator = (storage: any[]): __Porffor_ConcatIterator => {
  return storage as __Porffor_ConcatIterator;
};

export const __Porffor_ConcatIterator_prototype_next = (storage: any[]) => {
  const iterables: any[] = storage[0];
  const methods: any[] = storage[1];
  let iterableIndex: i32 = storage[2];
  let currentIterator: any = storage[3];
  let currentNext: any = storage[4];
  const numIterables: i32 = iterables.length;

  // Create result object once, outside the loop
  const result: object = {};

  while (iterableIndex < numIterables) {
    // If we don't have a current iterator, get one from the current iterable
    if (currentIterator === undefined || currentIterator === null) {
      const iterable: any = iterables[iterableIndex];
      const storedMethod: any = methods[iterableIndex];

      if (storedMethod !== null && storedMethod !== undefined) {
        // Object with stored Symbol.iterator method (per spec, don't re-access Symbol.iterator)
        currentIterator = storedMethod.call(iterable);
        currentNext = currentIterator.next;
        storage[3] = currentIterator;
        storage[4] = currentNext;
      } else {
        // For arrays, strings, and other native iterables - use Iterator.from
        const wrapper: any = __Iterator_from(iterable);
        currentIterator = wrapper;
        currentNext = null;
        storage[3] = currentIterator;
        storage[4] = currentNext;
      }
    }

    // Get next value from current iterator
    let sourceResult: any;
    if (currentNext !== null && currentNext !== undefined) {
      // Object iterator with next method
      sourceResult = currentNext.call(currentIterator);
    } else {
      // WrapperIterator or similar - use .next()
      sourceResult = currentIterator.next();
    }

    if (!sourceResult.done) {
      // Return a fresh result object (per spec requirement)
      result.value = sourceResult.value;
      result.done = false;
      return result;
    }

    // Current iterator is exhausted, move to next iterable
    iterableIndex++;
    storage[2] = iterableIndex;
    currentIterator = null;
    currentNext = null;
    storage[3] = currentIterator;
    storage[4] = currentNext;
  }

  // All iterables exhausted
  result.value = undefined;
  result.done = true;
  return result;
};

export const __Porffor_ConcatIterator_prototype_return = (storage: any[], value: any): object => {
  const result: object = {};
  result.value = value;
  result.done = true;
  return result;
};

export const __Porffor_ConcatIterator_prototype_Symbol_iterator$get = (storage: any[]) => {
  return storage as __Porffor_ConcatIterator;
};

export const __Porffor_ConcatIterator_prototype_Symbol_toStringTag$get = () => {
  return 'Iterator';
};


// Iterator constructor - abstract, cannot be directly constructed but can be subclassed
export const Iterator = function (): void {
  // Allow subclass construction (new.target !== Iterator)
  // Throw only for direct construction (new.target === Iterator)
  if (new.target === Iterator) {
    throw new TypeError('Abstract class Iterator not directly constructable');
  }
};

// Iterator.from - creates an iterator from an iterable or iterator-like
export const __Iterator_from = (obj: any): __Porffor_WrapperIterator => {
  const t: i32 = Porffor.type(obj);

  // Check if it's a known indexable iterable type (not generators)
  if (t == Porffor.TYPES.array ||
      t == Porffor.TYPES.string ||
      t == Porffor.TYPES.bytestring ||
      t == Porffor.TYPES.stringobject ||
      t == Porffor.TYPES.set ||
      (t >= Porffor.TYPES.uint8clampedarray && t <= Porffor.TYPES.float64array)) {
    const storage: any[] = __Porffor_WrapperIterator_create(obj);
    return __Porffor_WrapperIterator(storage);
  }

  // Generators need to be eagerly consumed into an array
  // since WrapperIterator uses index-based iteration
  if (t == Porffor.TYPES.__porffor_generator) {
    const result: any[] = Porffor.malloc();
    for (const x of obj) {
      result.push(x);
    }
    const storage: any[] = __Porffor_WrapperIterator_create(result);
    return __Porffor_WrapperIterator(storage);
  }

  // If it's already a WrapperIterator, return as-is
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return obj;
  }

  // Check if object has Symbol.iterator or is iterator-like with next() method
  if (t == Porffor.TYPES.object) {
    // First check for Symbol.iterator (iterable protocol)
    const iteratorMethod: any = obj[Symbol.iterator];
    if (Porffor.type(iteratorMethod) == Porffor.TYPES.function) {
      // Call Symbol.iterator to get the iterator
      const iter: any = iteratorMethod.call(obj);
      // Eagerly consume the iterator into an array (since WrapperIterator uses index-based iteration)
      const result: any[] = Porffor.malloc();
      for (const x of iter) {
        result.push(x);
      }
      const storage: any[] = __Porffor_WrapperIterator_create(result);
      return __Porffor_WrapperIterator(storage);
    }

    // Fall back to iterator-like object with next() method
    const next: any = obj.next;
    if (typeof next === 'function') {
      // Eagerly consume the iterator into an array
      const result: any[] = Porffor.malloc();
      let iterResult: any = next.call(obj);
      while (!iterResult.done) {
        result.push(iterResult.value);
        iterResult = next.call(obj);
      }
      const storage: any[] = __Porffor_WrapperIterator_create(result);
      return __Porffor_WrapperIterator(storage);
    }
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
  const result: any[] = Porffor.malloc();
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

  const result: any[] = Porffor.malloc();
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
  const n: i32 = Math.trunc(+limit);
  if (n < 0) {
    throw new RangeError('Iterator.prototype.take requires a non-negative number');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: any[] = Porffor.malloc();
  const endIndex: i32 = index + n < length ? index + n : length;
  for (let i: i32 = index; i < endIndex; i++) {
    result.push(__Porffor_iterator_getElement(iterable, i));
  }

  storage[1] = endIndex;

  const newStorage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(newStorage);
};

export const __Porffor_WrapperIterator_prototype_drop = (storage: any[], count: any) => {
  const n: i32 = Math.trunc(+count);
  if (n < 0) {
    throw new RangeError('Iterator.prototype.drop requires a non-negative number');
  }

  const iterable: any = storage[0];
  let index: i32 = storage[1];
  const length: i32 = __Porffor_iterator_getLength(iterable);

  const result: any[] = Porffor.malloc();
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

  const result: any[] = Porffor.malloc();
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

  const result: any[] = Porffor.malloc();
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

// Iterator.concat - concatenates multiple iterables into one lazy iterator
export const __Iterator_concat = (...iterables: any[]): __Porffor_ConcatIterator => {
  // Validate all arguments are iterable before creating the iterator
  // Per spec, we store the iterator method for objects (to not re-access Symbol.iterator later)
  const numIterables: i32 = iterables.length;
  const methods: any[] = Porffor.malloc();
  methods.length = numIterables;
  for (let idx: i32 = 0; idx < numIterables; idx++) {
    const iterable: any = iterables[idx];
    const t: i32 = Porffor.type(iterable);

    // Check that it's an iterable type
    if (t == Porffor.TYPES.object) {
      const iteratorMethod: any = iterable[Symbol.iterator];
      if (typeof iteratorMethod !== 'function') {
        throw new TypeError('Iterator.concat requires iterable arguments');
      }
      // Store the method per spec step 2d
      methods[idx] = iteratorMethod;
    } else if (t == Porffor.TYPES.array ||
               t == Porffor.TYPES.string ||
               t == Porffor.TYPES.bytestring ||
               t == Porffor.TYPES.set ||
               t == Porffor.TYPES.__porffor_generator ||
               t == Porffor.TYPES.__porffor_wrapperiterator ||
               t == Porffor.TYPES.__porffor_takeiterator ||
               t == Porffor.TYPES.__porffor_dropiterator ||
               t == Porffor.TYPES.__porffor_mapiterator ||
               t == Porffor.TYPES.__porffor_filteriterator ||
               (t >= Porffor.TYPES.uint8clampedarray && t <= Porffor.TYPES.float64array)) {
      // Native iterables don't need stored method
      methods[idx] = null;
    } else {
      throw new TypeError('Iterator.concat requires iterable arguments');
    }
  }

  // Create lazy ConcatIterator
  // Storage: [0] = iterables array, [1] = methods array, [2] = current index, [3] = current iterator, [4] = current next method
  // Note: Array literals don't work correctly in builtins for storing arbitrary values
  const storage: any[] = Porffor.malloc();
  storage.length = 5;
  storage[0] = iterables;
  storage[1] = methods;
  storage[2] = 0;
  storage[3] = null;
  storage[4] = null;
  return __Porffor_ConcatIterator(storage);
};

// Helper to get iterator from an object's Symbol.iterator
// Returns the iterator (could be a generator or other iterator type)
// Does NOT iterate - just gets the iterator, letting codegen handle iteration based on type
export const __Porffor_object_getIterator = (obj: any): any => {
  // Get Symbol.iterator method from object
  const iteratorMethod: any = obj[Symbol.iterator];
  if (iteratorMethod === undefined) {
    throw new TypeError('Object is not iterable (no Symbol.iterator method)');
  }

  // Call the iterator method to get the iterator
  // Note: We call with undefined as this because Porffor has a bug where
  // generator functions called as methods don't advance their state properly
  // when 'this' is an object. Most iterators don't use 'this' anyway.
  return iteratorMethod();
};

// Helper to convert any iterable to an array
export const __Porffor_iterableToArray = (iterable: any): any[] => {
  const t: i32 = Porffor.type(iterable);

  if (t == Porffor.TYPES.array) {
    // Already an array, return copy
    const arr: any[] = iterable as any[];
    const result: any[] = Porffor.malloc();
    const len: i32 = arr.length;
    for (let i: i32 = 0; i < len; i++) {
      result.push(arr[i]);
    }
    return result;
  }

  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_toArray(iterable as any[]);
  }

  if (t == Porffor.TYPES.string ||
      t == Porffor.TYPES.bytestring ||
      t == Porffor.TYPES.set ||
      (t >= Porffor.TYPES.uint8clampedarray && t <= Porffor.TYPES.float64array)) {
    const result: any[] = Porffor.malloc();
    const length: i32 = __Porffor_iterator_getLength(iterable);
    for (let i: i32 = 0; i < length; i++) {
      result.push(__Porffor_iterator_getElement(iterable, i));
    }
    return result;
  }

  // Generators need to be consumed using for..of
  if (t == Porffor.TYPES.__porffor_generator) {
    const result: any[] = Porffor.malloc();
    for (const x of iterable) {
      result.push(x);
    }
    return result;
  }

  // Handle objects with Symbol.iterator explicitly
  // This is needed because precompiled code doesn't include object handling in for..of
  if (t == Porffor.TYPES.object) {
    const iteratorMethod: any = iterable[Symbol.iterator];
    if (Porffor.type(iteratorMethod) == Porffor.TYPES.function) {
      // Get the iterator and use for..of on it (not on the original object)
      const iterator: any = iteratorMethod.call(iterable);
      const result: any[] = Porffor.malloc();
      for (const x of iterator) {
        result.push(x);
      }
      // Dummy reference to ensure __Porffor_object_getIterator is compiled
      // This function is needed for runtime for..of on objects in user code
      if (false) __Porffor_object_getIterator(iterable);
      return result;
    }
  }

  throw new TypeError('Value is not iterable');
};

// Iterator.zip - zips multiple iterables together
// options has default value so length property is 1
export const __Iterator_zip = (iterables: any[], options: any = undefined): __Porffor_WrapperIterator => {
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

  // Convert all iterables to arrays and get their lengths
  const arrays: any[] = [];
  const lengths: any[] = [];
  for (let i: i32 = 0; i < numIterables; i++) {
    const arr: any[] = __Porffor_iterableToArray(iterablesArr[i]);
    arrays.push(arr);
    lengths.push(arr.length);
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
  const result: any[] = Porffor.malloc();
  for (let j: i32 = 0; j < resultLength; j++) {
    const tuple: any[] = Porffor.malloc();
    for (let i: i32 = 0; i < numIterables; i++) {
      if (j < lengths[i]) {
        const arr: any[] = arrays[i];
        tuple.push(arr[j]);
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
// options has default value so length property is 1
export const __Iterator_zipKeyed = (iterables: any, options: any = undefined): __Porffor_WrapperIterator => {
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

  // Convert all iterables to arrays and get their lengths
  const arrays: any[] = [];
  const lengths: any[] = [];
  for (let i: i32 = 0; i < numKeys; i++) {
    const key: any = keys[i];
    const iter: any = iterables[key];
    const arr: any[] = __Porffor_iterableToArray(iter);
    arrays.push(arr);
    lengths.push(arr.length);
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
  const result: any[] = Porffor.malloc();
  for (let j: i32 = 0; j < resultLength; j++) {
    const obj: object = {};
    for (let i: i32 = 0; i < numKeys; i++) {
      const key: any = keys[i];
      if (j < lengths[i]) {
        const arr: any[] = arrays[i];
        obj[key] = arr[j];
      } else {
        obj[key] = undefined;
      }
    }
    result.push(obj);
  }

  const storage: any[] = __Porffor_WrapperIterator_create(result);
  return __Porffor_WrapperIterator(storage);
};

// Helper to convert iterator-like to WrapperIterator
export const __Iterator_toWrapperIterator = (it: any): any[] => {
  const t: i32 = Porffor.type(it);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return it as any[];
  }
  // Convert generator or other iterator-like to WrapperIterator
  const wrapper: __Porffor_WrapperIterator = __Iterator_from(it);
  return wrapper as any[];
};

// Iterator.prototype methods
// These are the spec-compliant Iterator.prototype methods that work on any iterator

export const __Iterator_prototype_map = (_this: any, mapper: any) => {
  if (_this == null) throw new TypeError('Iterator.prototype.map called on null or undefined');
  if (typeof mapper !== 'function') {
    throw new TypeError('Iterator.prototype.map requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator ||
      t == Porffor.TYPES.__porffor_generator ||
      t == Porffor.TYPES.__porffor_takeiterator ||
      t == Porffor.TYPES.__porffor_dropiterator ||
      t == Porffor.TYPES.__porffor_mapiterator ||
      t == Porffor.TYPES.__porffor_filteriterator ||
      t == Porffor.TYPES.__porffor_concatiterator ||
      t == Porffor.TYPES.object) {
    // Create lazy MapIterator wrapping the source directly
    // Use Porffor.malloc() for dynamic allocation (static array literals reuse same memory)
    // Storage: [0] = source, [1] = mapper, [2] = executing flag
    const storage: any[] = Porffor.malloc();
    storage[0] = _this;
    storage[1] = mapper;
    storage[2] = false;
    storage.length = 3;
    return __Porffor_MapIterator(storage);
  }

  throw new TypeError('Iterator.prototype.map called on non-iterator');
};

export const __Iterator_prototype_filter = (_this: any, predicate: any) => {
  if (_this == null) throw new TypeError('Iterator.prototype.filter called on null or undefined');
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.filter requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator ||
      t == Porffor.TYPES.__porffor_generator ||
      t == Porffor.TYPES.__porffor_takeiterator ||
      t == Porffor.TYPES.__porffor_dropiterator ||
      t == Porffor.TYPES.__porffor_mapiterator ||
      t == Porffor.TYPES.__porffor_filteriterator ||
      t == Porffor.TYPES.__porffor_concatiterator ||
      t == Porffor.TYPES.object) {
    // Create lazy FilterIterator wrapping the source directly
    // Use Porffor.malloc() for dynamic allocation (static array literals reuse same memory)
    // Storage: [0] = source, [1] = predicate, [2] = executing flag
    const storage: any[] = Porffor.malloc();
    storage[0] = _this;
    storage[1] = predicate;
    storage[2] = false;
    storage.length = 3;
    return __Porffor_FilterIterator(storage);
  }

  throw new TypeError('Iterator.prototype.filter called on non-iterator');
};

export const __Iterator_prototype_take = (_this: any, limit: any) => {
  if (_this == null) throw new TypeError('Iterator.prototype.take called on null or undefined');
  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator ||
      t == Porffor.TYPES.__porffor_generator ||
      t == Porffor.TYPES.__porffor_takeiterator ||
      t == Porffor.TYPES.__porffor_dropiterator ||
      t == Porffor.TYPES.__porffor_mapiterator ||
      t == Porffor.TYPES.__porffor_filteriterator ||
      t == Porffor.TYPES.__porffor_concatiterator ||
      t == Porffor.TYPES.object) {
    // Create lazy TakeIterator wrapping the source directly
    // Use Porffor.malloc() for dynamic allocation (static array literals reuse same memory)
    // Storage: [0] = source, [1] = limit, [2] = executing flag
    const storage: any[] = Porffor.malloc();
    storage[0] = _this;
    storage[1] = limit;
    storage[2] = false;
    storage.length = 3;
    return __Porffor_TakeIterator(storage);
  }

  throw new TypeError('Iterator.prototype.take called on non-iterator');
};

export const __Iterator_prototype_drop = (_this: any, count: any) => {
  if (_this == null) throw new TypeError('Iterator.prototype.drop called on null or undefined');
  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator ||
      t == Porffor.TYPES.__porffor_generator ||
      t == Porffor.TYPES.__porffor_takeiterator ||
      t == Porffor.TYPES.__porffor_dropiterator ||
      t == Porffor.TYPES.__porffor_mapiterator ||
      t == Porffor.TYPES.__porffor_filteriterator ||
      t == Porffor.TYPES.__porffor_concatiterator ||
      t == Porffor.TYPES.object) {
    // Create lazy DropIterator wrapping the source directly
    // Use Porffor.malloc() for dynamic allocation (static array literals reuse same memory)
    // Storage: [0] = source, [1] = count, [2] = executing flag
    const storage: any[] = Porffor.malloc();
    storage[0] = _this;
    storage[1] = count;
    storage[2] = false;
    storage.length = 3;
    return __Porffor_DropIterator(storage);
  }

  throw new TypeError('Iterator.prototype.drop called on non-iterator');
};

export const __Iterator_prototype_flatMap = (_this: __Porffor_WrapperIterator, mapper: any) => {
  if (typeof mapper !== 'function') {
    throw new TypeError('Iterator.prototype.flatMap requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_flatMap(_this as any[], mapper);
  }
  if (t == Porffor.TYPES.__porffor_generator) {
    const wrapper: any[] = __Iterator_toWrapperIterator(_this);
    return __Porffor_WrapperIterator_prototype_flatMap(wrapper, mapper);
  }

  throw new TypeError('Iterator.prototype.flatMap called on non-iterator');
};

export const __Iterator_prototype_reduce = (_this: __Porffor_WrapperIterator, reducer: any, initialValue: any) => {
  if (typeof reducer !== 'function') {
    throw new TypeError('Iterator.prototype.reduce requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_reduce(_this as any[], reducer, initialValue);
  }
  if (t == Porffor.TYPES.__porffor_generator) {
    const wrapper: any[] = __Iterator_toWrapperIterator(_this);
    return __Porffor_WrapperIterator_prototype_reduce(wrapper, reducer, initialValue);
  }
  // Handle plain objects with next method (iterator protocol)
  if (t == Porffor.TYPES.object) {
    const nextMethod: any = _this.next;
    if (nextMethod == null) {
      throw new TypeError('Iterator.prototype.reduce called on non-iterator');
    }
    let accumulator: any = initialValue;
    let index: i32 = 0;
    let hasInitial: boolean = Porffor.type(initialValue) != Porffor.TYPES.undefined;
    while (true) {
      const result: any = nextMethod.call(_this);
      if (result.done) break;
      const value: any = result.value;
      if (!hasInitial) {
        accumulator = value;
        hasInitial = true;
      } else {
        accumulator = reducer(accumulator, value, index);
      }
      index++;
    }
    if (!hasInitial) {
      throw new TypeError('Reduce of empty iterator with no initial value');
    }
    return accumulator;
  }

  throw new TypeError('Iterator.prototype.reduce called on non-iterator');
};

export const __Iterator_prototype_toArray = (_this: any) => {
  if (_this == null) throw new TypeError('Iterator.prototype.toArray called on null or undefined');
  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_toArray(_this as any[]);
  }
  if (t == Porffor.TYPES.__porffor_generator) {
    const wrapper: any[] = __Iterator_toWrapperIterator(_this);
    return __Porffor_WrapperIterator_prototype_toArray(wrapper);
  }
  // Handle lazy iterator types by consuming them - call type-specific _prototype_next
  if (t == Porffor.TYPES.__porffor_takeiterator) {
    const out: any[] = Porffor.malloc();
    let len: i32 = 0;
    while (true) {
      const result: any = __Porffor_TakeIterator_prototype_next(_this as any[]);
      if (result.done) break;
      out[len++] = result.value;
    }
    out.length = len;
    return out;
  }
  if (t == Porffor.TYPES.__porffor_dropiterator) {
    const out: any[] = Porffor.malloc();
    let len: i32 = 0;
    while (true) {
      const result: any = __Porffor_DropIterator_prototype_next(_this as any[]);
      if (result.done) break;
      out[len++] = result.value;
    }
    out.length = len;
    return out;
  }
  if (t == Porffor.TYPES.__porffor_mapiterator) {
    const out: any[] = Porffor.malloc();
    let len: i32 = 0;
    while (true) {
      const result: any = __Porffor_MapIterator_prototype_next(_this as any[]);
      if (result.done) break;
      out[len++] = result.value;
    }
    out.length = len;
    return out;
  }
  if (t == Porffor.TYPES.__porffor_filteriterator) {
    const out: any[] = Porffor.malloc();
    let len: i32 = 0;
    while (true) {
      const result: any = __Porffor_FilterIterator_prototype_next(_this as any[]);
      if (result.done) break;
      out[len++] = result.value;
    }
    out.length = len;
    return out;
  }
  if (t == Porffor.TYPES.__porffor_concatiterator) {
    const out: any[] = Porffor.malloc();
    let len: i32 = 0;
    while (true) {
      const result: any = __Porffor_ConcatIterator_prototype_next(_this as any[]);
      if (result.done) break;
      out[len++] = result.value;
    }
    out.length = len;
    return out;
  }
  // Handle plain objects with next method (iterator protocol)
  if (t == Porffor.TYPES.object) {
    const nextMethod: any = _this.next;
    if (nextMethod == null) {
      throw new TypeError('Iterator.prototype.toArray called on non-iterator');
    }
    const out: any[] = Porffor.malloc();
    let len: i32 = 0;
    while (true) {
      const result: any = nextMethod.call(_this);
      if (result.done) break;
      out[len++] = result.value;
    }
    out.length = len;
    return out;
  }

  throw new TypeError('Iterator.prototype.toArray called on non-iterator');
};

export const __Iterator_prototype_forEach = (_this: __Porffor_WrapperIterator, callback: any) => {
  if (typeof callback !== 'function') {
    throw new TypeError('Iterator.prototype.forEach requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_forEach(_this as any[], callback);
  }
  if (t == Porffor.TYPES.__porffor_generator) {
    const wrapper: any[] = __Iterator_toWrapperIterator(_this);
    return __Porffor_WrapperIterator_prototype_forEach(wrapper, callback);
  }
  // Handle plain objects with next method (iterator protocol)
  if (t == Porffor.TYPES.object) {
    const nextMethod: any = _this.next;
    if (nextMethod == null) {
      throw new TypeError('Iterator.prototype.forEach called on non-iterator');
    }
    let index: i32 = 0;
    while (true) {
      const result: any = nextMethod.call(_this);
      if (result.done) break;
      callback(result.value, index++);
    }
    return undefined;
  }

  throw new TypeError('Iterator.prototype.forEach called on non-iterator');
};

export const __Iterator_prototype_some = (_this: __Porffor_WrapperIterator, predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.some requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_some(_this as any[], predicate);
  }
  if (t == Porffor.TYPES.__porffor_generator) {
    const wrapper: any[] = __Iterator_toWrapperIterator(_this);
    return __Porffor_WrapperIterator_prototype_some(wrapper, predicate);
  }
  // Handle plain objects with next method (iterator protocol)
  if (t == Porffor.TYPES.object) {
    const nextMethod: any = _this.next;
    if (nextMethod == null) {
      throw new TypeError('Iterator.prototype.some called on non-iterator');
    }
    let index: i32 = 0;
    while (true) {
      const result: any = nextMethod.call(_this);
      if (result.done) break;
      if (predicate(result.value, index++)) return true;
    }
    return false;
  }

  throw new TypeError('Iterator.prototype.some called on non-iterator');
};

export const __Iterator_prototype_every = (_this: __Porffor_WrapperIterator, predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.every requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_every(_this as any[], predicate);
  }
  if (t == Porffor.TYPES.__porffor_generator) {
    const wrapper: any[] = __Iterator_toWrapperIterator(_this);
    return __Porffor_WrapperIterator_prototype_every(wrapper, predicate);
  }
  // Handle plain objects with next method (iterator protocol)
  if (t == Porffor.TYPES.object) {
    const nextMethod: any = _this.next;
    if (nextMethod == null) {
      throw new TypeError('Iterator.prototype.every called on non-iterator');
    }
    let index: i32 = 0;
    while (true) {
      const result: any = nextMethod.call(_this);
      if (result.done) break;
      if (!predicate(result.value, index++)) return false;
    }
    return true;
  }

  throw new TypeError('Iterator.prototype.every called on non-iterator');
};

export const __Iterator_prototype_find = (_this: __Porffor_WrapperIterator, predicate: any) => {
  if (typeof predicate !== 'function') {
    throw new TypeError('Iterator.prototype.find requires a callable');
  }

  const t: i32 = Porffor.type(_this);
  if (t == Porffor.TYPES.__porffor_wrapperiterator) {
    return __Porffor_WrapperIterator_prototype_find(_this as any[], predicate);
  }
  if (t == Porffor.TYPES.__porffor_generator) {
    const wrapper: any[] = __Iterator_toWrapperIterator(_this);
    return __Porffor_WrapperIterator_prototype_find(wrapper, predicate);
  }
  // Handle plain objects with next method (iterator protocol)
  if (t == Porffor.TYPES.object) {
    const nextMethod: any = _this.next;
    if (nextMethod == null) {
      throw new TypeError('Iterator.prototype.find called on non-iterator');
    }
    let index: i32 = 0;
    while (true) {
      const result: any = nextMethod.call(_this);
      if (result.done) break;
      const value: any = result.value;
      if (predicate(value, index++)) return value;
    }
    return undefined;
  }

  throw new TypeError('Iterator.prototype.find called on non-iterator');
};

// Symbol.iterator - returns self
export const __Iterator_prototype_Symbol_iterator$get = (_this: __Porffor_WrapperIterator) => {
  return _this;
};

// Symbol.toStringTag
export const __Iterator_prototype_Symbol_toStringTag$get = () => {
  return 'Iterator';
};
