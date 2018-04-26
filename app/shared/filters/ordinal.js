/**
 * Returns a string in the form 5th"
 * Expects an Integer
 */

let ordinal = function() {
	return function (number) {
		if (number && isNumber(number)) {
			return toOrdinalSuffix(number);
		}
	};
};

export default ordinal;