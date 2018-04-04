workgroupApp.directive("instructorTypeSelector", this.instructorTypeSelector = function (workgroupActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'instructorTypeSelector.html',
		replace: true,
		scope: {
			instructorTypes: '<',
			userRole: '<'
		},
		link: function(scope, element, attrs) {
			scope.setInstructorType = function(instructorType) {
				workgroupActionCreators.setInstructorType(instructorType, scope.userRole);
			};
		}
	};
});
