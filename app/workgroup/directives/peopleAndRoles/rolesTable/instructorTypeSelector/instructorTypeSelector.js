let instructorTypeSelector = function (WorkgroupActionCreators) {
	return {
		restrict: 'E',
		template: require('./instructorTypeSelector.html'),
		replace: true,
		scope: {
			instructorTypes: '<',
			userRole: '<'
		},
		link: function(scope) {
			scope.setInstructorType = function(instructorType) {
				WorkgroupActionCreators.setInstructorType(instructorType, scope.userRole);
			};
		}
	};
};

export default instructorTypeSelector;
