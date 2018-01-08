supportAssignmentApp.directive("assignCourse", this.assignCourse = function (supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'assignCourse.html',
		replace: true,
		scope: {
			supportStaff: '<',
			assignmentOptions: '<',
			viewType: '<'
		},
		link: function (scope, element, attrs) {
			scope.expanded = false;

			scope.closeDropdown = function() {
				scope.expanded = false;
			};

			scope.toggleDropdown = function() {
				scope.expanded = !scope.expanded;
			};

			scope.assignToSupportStaff = function(assignmentOption) {
				var type = scope.viewType == "Readers" ? "reader" : "teachingAssistant";

				if (assignmentOption.sectionGroupId && assignmentOption.sectionGroupId > 0) {
					supportActions.assignStaffToSectionGroup(assignmentOption.sectionGroupId, scope.supportStaff.id, type);
				} else if (assignmentOption.sectionId && assignmentOption.sectionId > 0) {
					supportActions.assignStaffToSection(assignmentOption.sectionId, scope.supportStaff.id, type);
				}

				scope.closeDropdown();
			};
		}
	};
});
