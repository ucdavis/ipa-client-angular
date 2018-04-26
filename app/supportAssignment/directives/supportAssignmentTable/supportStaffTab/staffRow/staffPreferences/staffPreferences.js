let staffPreferences = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		template: require('./staffPreferences.html'),
		replace: true,
		scope: {
			state: '<',
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			scope.deleteAssignment = function(supportAssignment) {
				supportActions.deleteAssignment(supportAssignment);
			};
		}
	};
};

export default staffPreferences;
