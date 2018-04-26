let supportAssignmentToolbar = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./supportAssignmentToolbar.html'),
		replace: true,
		scope: {},
		link: function (scope, element, attrs) {
			// intentionally empty
		}
	};
};

export default supportAssignmentToolbar;
