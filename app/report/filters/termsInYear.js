/**
 * Returns a string in the form 5th"
 * Expects an Integer
 */

reportApp.filter("termsInYear", this.termsInYear = function () {
	return function (arr, field) {
		if (arr instanceof Array) {
			return arr.filter(function (termCode) { return termCode.toString().substr(0, 4) == field; });
		}
	};
});