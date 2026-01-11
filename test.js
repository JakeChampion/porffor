// Test Math.hypot with multiple arguments
console.log('Math.hypot():', Math.hypot());                     // Should be 0
console.log('Math.hypot(3, 4):', Math.hypot(3, 4));             // Should be 5
console.log('Math.hypot(3, 4, 5):', Math.hypot(3, 4, 5));       // Should be ~7.07
console.log('Math.hypot(5, 12):', Math.hypot(5, 12));           // Should be 13
console.log('Math.hypot(Infinity, 1):', Math.hypot(Infinity, 1)); // Should be Infinity
console.log('Math.hypot(NaN, 1):', Math.hypot(NaN, 1));         // Should be NaN
console.log('Math.hypot(Infinity, NaN):', Math.hypot(Infinity, NaN)); // Should be Infinity

// Test with objects that have valueOf
var obj = { valueOf: function() { throw new Error("test"); } };
try {
  Math.hypot(1, 2, obj);
  console.log("No error thrown");
} catch (e) {
  console.log("Error:", e.message);
}
