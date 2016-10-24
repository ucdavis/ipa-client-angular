/**
 * Returns a string in the form 5th"
 * Expects an Integer
 */

reportApp.filter("termsInYear", this.termsInYear = function () {
	return function (arr, field) {
		return arr.filter(function (termCode) { return Math.floor(termCode / 100) == field; });
	};
});