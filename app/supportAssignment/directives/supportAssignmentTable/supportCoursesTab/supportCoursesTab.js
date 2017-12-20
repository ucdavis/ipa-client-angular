supportAssignmentApp.directive("supportCoursesTab", this.supportCoursesTab = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportCoursesTab.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.radioNames = ["Teaching Assistants", "Readers"];

			scope.setViewType = function(type) {
				supportActions.setViewType(type);
			};

			scope.assignStaffToSectionGroup = function(supportStaff, sectionGroup) {
				studentActions.assignStaffToSectionGroup(sectionGroup, staff);
			};
		}
	};
});
