let assignCourse = function (SupportActions) {
	return {
		restrict: 'E',
		template: require('./assignCourse.html'),
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
					SupportActions.assignStaffToSectionGroup(assignmentOption.sectionGroupId, scope.supportStaff.id, type);
				} else if (assignmentOption.sectionId && assignmentOption.sectionId > 0) {
					SupportActions.assignStaffToSection(assignmentOption.sectionId, scope.supportStaff.id, type);
				}

				scope.closeDropdown();
			};
		}
	};
};

export default assignCourse;
