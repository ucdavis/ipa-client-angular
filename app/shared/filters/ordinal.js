/**
 * Returns a string in the form 5th"
 * Expects an Integer
 */

sharedApp.filter("ordinal", this.ordinal = function() {
	return function (number) {
		if (number && isNumber(number)) {
			return toOrdinalSuffix(number);
		}
	};
});