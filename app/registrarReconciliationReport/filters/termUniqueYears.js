/**
 * Returns a array of unique years
 * Expects an array of termCodes
 */

registrarReconciliationReportApp.filter("termUniqueYears", this.termUniqueYears = function () { // eslint-disable-line no-undef
	return function (arr) {
		if (arr instanceof Array) {
			return _.uniq(arr, function (termCode) { return Math.floor(Number(termCode) / 100); }) // eslint-disable-line no-undef
				.map(function (termCode) { return Math.floor(termCode / 100); });
		}
	};
});
