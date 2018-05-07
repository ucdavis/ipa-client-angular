let supportSummary = function () {
	return {
		restrict: 'E',
		template: require('./supportSummary.html'),
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
};

export default supportSummary;
