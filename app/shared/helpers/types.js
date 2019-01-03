// Credit: http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
// isNumber ('123'); // true  
// isNumber (5); // true  
// isNumber ('q345'); // false
// isNumber(null); // false
// isNumber(undefined); // false
// isNumber(false); // false
// isNumber('   '); // false
export function isNumber(obj) { return ! isNaN (obj - 0) && obj !== null && obj !== "" && obj !== false; }

export function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}
