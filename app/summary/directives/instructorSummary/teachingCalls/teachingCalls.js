let teachingCalls = function () {
	return {
		restrict: 'E',
		template: require('./teachingCalls.html'),
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
};

export default teachingCalls;
