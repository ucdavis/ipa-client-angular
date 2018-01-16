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

			scope.deleteAssignment = function(supportAssignment) {
				supportActions.deleteAssignment(supportAssignment);
			};

			scope.assignStaffToSectionGroup = function(supportStaffId, sectionGroup) {
				var type = scope.state.ui.viewType == "Readers" ? "reader" : "teachingAssistant";
				supportActions.assignStaffToSectionGroup(sectionGroup.id, supportStaffId, type);
			};

			scope.assignStaffToSection = function(supportStaffId, section) {
				var type = scope.state.ui.viewType == "Readers" ? "reader" : "teachingAssistant";
				supportActions.assignStaffToSection(section.id, supportStaffId, type);
			};

			scope.isNumber = function(number) {
				return isNumber(number);
			};
		}
	};
});
