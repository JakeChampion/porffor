// Test non-array-index property assignment
var x = [];
x[4294967296] = 1;  // 2^32, not a valid array index
console.log("x[0]:", x[0]);
console.log("x[4294967296]:", x["4294967296"]);
console.log("x.length:", x.length);

var z = [];
z[1.1] = 1;
console.log("z[1]:", z[1]);
console.log("z['1.1']:", z["1.1"]);
