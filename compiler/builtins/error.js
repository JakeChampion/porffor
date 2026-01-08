export default () => {
  let out = '';

  const errors = [];
  const error = name => {
    errors.push(name);
    out += `export const ${name} = function (message: any, options: any): ${name} {
  if (message === undefined) message = '';
    else message = ecma262.ToString(message);

  const obj: ${name} = Porffor.malloc(8);
  Porffor.wasm.i32.store(obj, message, 0, 0);
  Porffor.wasm.i32.store8(obj, Porffor.type(message), 0, 4);

  // InstallErrorCause: if options is an object with "cause" property, set it
  if (Porffor.object.isObject(options) && 'cause' in options) {
    Object.defineProperty(obj, 'cause', {
      value: options.cause,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  return obj;
};

export const __${name}_prototype_constructor$get = (_this: ${name}) => {
  return ${name};
};

export const __${name}_prototype_name$get = (_this: ${name}) => {
  return '${name}';
};

export const __${name}_prototype_message$get = (_this: ${name}) => {
  Porffor.wasm\`
local.get \${_this}
i32.trunc_sat_f64_u
i32.load 0 0
f64.convert_i32_u

local.get \${_this}
i32.trunc_sat_f64_u
i32.load8_u 0 4
return\`;
};

export const __${name}_prototype_toString = (_this: ${name}) => {
  const name: any = _this.name;
  const message: any = _this.message;
  if (message.length == 0) {
    return name;
  }

  return name + ': ' + message;
};\n`;
  };

  error('Error');
  // AggregateError has a different signature: (errors, message, options)
  errors.push('AggregateError');
  out += `export const AggregateError = function (errorsArg: any, message: any, options: any): AggregateError {
  if (message === undefined) message = '';
    else message = ecma262.ToString(message);

  const obj: AggregateError = Porffor.malloc(8);
  Porffor.wasm.i32.store(obj, message, 0, 0);
  Porffor.wasm.i32.store8(obj, Porffor.type(message), 0, 4);

  // Store errors as own property
  obj.errors = Array.from(errorsArg);

  // InstallErrorCause: if options is an object with "cause" property, set it
  if (Porffor.object.isObject(options) && 'cause' in options) {
    Object.defineProperty(obj, 'cause', {
      value: options.cause,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  return obj;
};

export const __AggregateError_prototype_constructor$get = (_this: AggregateError) => {
  return AggregateError;
};

export const __AggregateError_prototype_name$get = (_this: AggregateError) => {
  return 'AggregateError';
};

export const __AggregateError_prototype_message$get = (_this: AggregateError) => {
  Porffor.wasm\`
local.get \${_this}
i32.trunc_sat_f64_u
i32.load 0 0
f64.convert_i32_u

local.get \${_this}
i32.trunc_sat_f64_u
i32.load8_u 0 4
return\`;
};

export const __AggregateError_prototype_toString = (_this: AggregateError) => {
  const name: any = _this.name;
  const message: any = _this.message;
  if (message.length == 0) {
    return name;
  }

  return name + ': ' + message;
};\n`;
  error('TypeError');
  error('ReferenceError');
  error('SyntaxError');
  error('RangeError');
  error('EvalError');
  error('URIError');

  // SuppressedError has a different signature: (error, suppressed, message)
  errors.push('SuppressedError');
  out += `export const SuppressedError = function (errorArg: any, suppressed: any, message: any): SuppressedError {
  if (message === undefined) message = '';
    else message = ecma262.ToString(message);

  const obj: SuppressedError = Porffor.malloc(8);
  Porffor.wasm.i32.store(obj, message, 0, 0);
  Porffor.wasm.i32.store8(obj, Porffor.type(message), 0, 4);

  // Store error and suppressed as own properties
  obj.error = errorArg;
  obj.suppressed = suppressed;

  return obj;
};

export const __SuppressedError_prototype_constructor$get = (_this: SuppressedError) => {
  return SuppressedError;
};

export const __SuppressedError_prototype_name$get = (_this: SuppressedError) => {
  return 'SuppressedError';
};

export const __SuppressedError_prototype_message$get = (_this: SuppressedError) => {
  Porffor.wasm\`
local.get \${_this}
i32.trunc_sat_f64_u
i32.load 0 0
f64.convert_i32_u

local.get \${_this}
i32.trunc_sat_f64_u
i32.load8_u 0 4
return\`;
};

export const __SuppressedError_prototype_toString = (_this: SuppressedError) => {
  const name: any = _this.name;
  const message: any = _this.message;
  if (message.length == 0) {
    return name;
  }

  return name + ': ' + message;
};\n`;

  error('Test262Error');

  out += `
export const __Test262Error_thrower = message => {
  throw new Test262Error(message);
};

export const __Error_isError = (x: unknown): boolean => Porffor.fastAnd(Porffor.type(x) >= Porffor.TYPES.error, Porffor.type(x) <= Porffor.TYPES.test262error);`;

  return out;
};