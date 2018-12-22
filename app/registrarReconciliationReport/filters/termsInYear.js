/**
 * Returns a filtered array of termCodes with the given year
 * Expects an array of termCodes and a year field
 */

registrarReconciliationReportApp.filter("termsInYear", this.termsInYear = function () { // eslint-disable-line no-undef
	return function (arr, field) {
		if (arr instanceof Array) {
			return arr.filter(function (termCode) { return termCode.toString().substr(0, 4) == field; });
		}
	};
});
