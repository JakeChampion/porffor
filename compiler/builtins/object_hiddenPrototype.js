export default ({ TYPES, TYPE_NAMES }) => {
  let out = `// @porf --valtype=i32
export const __Porffor_object_getHiddenPrototype = (trueType: i32): any => {
  if (Porffor.comptime.flag\`hasFunc.#get___String_prototype\`) {
    if (Porffor.fastOr(
      (trueType | 0b10000000) == Porffor.TYPES.bytestring,
      trueType == Porffor.TYPES.stringobject
    )) return __String_prototype;
  }

  if (Porffor.comptime.flag\`hasFunc.#get___Number_prototype\`) {
    if (Porffor.fastOr(
      trueType == Porffor.TYPES.number,
      trueType == Porffor.TYPES.numberobject
    )) return __Number_prototype;
  }

  if (Porffor.comptime.flag\`hasFunc.#get___Boolean_prototype\`) {
    if (Porffor.fastOr(
      trueType == Porffor.TYPES.boolean,
      trueType == Porffor.TYPES.booleanobject
    )) return __Boolean_prototype;
  }

  if (Porffor.comptime.flag\`hasFunc.#get___Porffor_Generator_prototype\`) {
    if (trueType == Porffor.TYPES.__porffor_generator) return __Porffor_Generator_prototype;
  }

  if (Porffor.comptime.flag\`hasFunc.#get___Porffor_AsyncGenerator_prototype\`) {
    if (trueType == Porffor.TYPES.__porffor_asyncgenerator) return __Porffor_AsyncGenerator_prototype;
  }`;

  for (const x in TYPES) {
    if (['object', 'undefined', 'string', 'bytestring', 'stringobject', 'number', 'numberobject', 'boolean', 'booleanobject', '__porffor_generator', '__porffor_asyncgenerator'].includes(x)) continue;

    const name = TYPE_NAMES[TYPES[x]];
    if (!name) continue; // Skip types without names

    // For internal types starting with __, the prototype is __Name_prototype, not ____Name_prototype
    // Also the getter function is #get_<prototype_name>, so we need to adjust accordingly
    const protoName = name.startsWith('__') ? `${name}_prototype` : `__${name}_prototype`;
    const getFuncName = name.startsWith('__') ? `#get_${name}_prototype` : `#get___${name}_prototype`;
    out += `
  if (Porffor.comptime.flag\`hasFunc.${getFuncName}\`) {
    if (trueType == Porffor.TYPES.${x}) return ${protoName};
  }`;
  }

  // if (trueType == Porffor.TYPES.function) return __Function_prototype;
  out += `
  return __Object_prototype;
};`;

  return out;
};