let instructorSummary = function () {
	return {
		restrict: 'E',
		template: require('./instructorSummary.html'),
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
};

export default instructorSummary;
