let supportCalls = function () {
	return {
		restrict: 'E',
		template: require('./supportCalls.html'),
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
};

export default supportCalls;
