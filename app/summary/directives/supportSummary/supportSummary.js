let supportSummary = function (TermService) {
	return {
		restrict: 'E',
		template: require('./supportSummary.html'),
		replace: true,
		link: function (scope) {
			scope.orderedTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];

			scope.termDescription = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.isReviewOpenForTerm = function(term, reviewBlob) {
				return reviewBlob[parseInt(term) - 1] == "1";
			};
		}
	};
};

export default supportSummary;
