/**
 * Returns a string in the form 5th"
 * Expects an Integer
 */

reportApp.filter("termUniqueYears", this.termUniqueYears = function () {
	return function (arr, field) {
		return _.uniq(arr, function (termCode) { return Math.floor(termCode / 100); })
			.map(function (termCode) { return Math.floor(termCode / 100); });
	};
});