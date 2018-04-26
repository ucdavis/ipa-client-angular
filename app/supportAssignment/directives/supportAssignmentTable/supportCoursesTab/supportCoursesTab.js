let supportCoursesTab = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./supportCoursesTab.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.radioNames = ["Teaching Assistants", "Readers"];

			scope.setViewType = function(type) {
				SupportActions.setViewType(type);
			};

			scope.deleteAssignment = function(supportAssignment) {
				SupportActions.deleteAssignment(supportAssignment);
			};

			scope.assignStaffToSectionGroup = function(supportStaffId, sectionGroup) {
				var type = scope.state.ui.viewType == "Readers" ? "reader" : "teachingAssistant";
				SupportActions.assignStaffToSectionGroup(sectionGroup.id, supportStaffId, type);
			};

			scope.assignStaffToSection = function(supportStaffId, section) {
				var type = scope.state.ui.viewType == "Readers" ? "reader" : "teachingAssistant";
				SupportActions.assignStaffToSection(section.id, supportStaffId, type);
			};

			scope.isNumber = function(number) {
				return isNumber(number);
			};
		}
	};
};

export default supportCoursesTab;
