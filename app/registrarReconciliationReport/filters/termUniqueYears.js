/**
 * Returns a array of unique years
 * Expects an array of termCodes
 */

registrarReconciliationReportApp.filter("termUniqueYears", this.termUniqueYears = function () {
	return function (arr, field) {
		if (arr instanceof Array) {
			return _.uniq(arr, function (termCode) { return Math.floor(Number(termCode) / 100); })
				.map(function (termCode) { return Math.floor(termCode / 100); });
		}
	};
});
