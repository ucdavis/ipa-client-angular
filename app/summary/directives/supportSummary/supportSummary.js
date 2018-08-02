let supportSummary = function (TermService) {
	return {
		restrict: 'E',
		template: require('./supportSummary.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.orderedTerms = [5, 6, 7, 8, 9, 10, 1, 2, 3];

			scope.termDescription = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.isReviewOpenForTerm = function(term, reviewBlob) {
				return reviewBlob[term - 1] == "1";
			};
		}
	};
};

export default supportSummary;
