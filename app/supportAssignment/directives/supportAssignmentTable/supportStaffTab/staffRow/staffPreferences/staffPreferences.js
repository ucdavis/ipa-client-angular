import './staffPreferences.css';

let staffPreferences = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./staffPreferences.html'),
		replace: true,
		scope: {
			state: '<',
			supportStaff: '<'
		},
		link: function (scope) {
			scope.deleteAssignment = function(supportAssignment) {
				SupportActions.deleteAssignment(supportAssignment);
			};

			scope.assignToSupportStaff = function(assignmentOption) {
				var type = scope.state.ui.viewType == "Readers" ? "reader" : "teachingAssistant";

				if (assignmentOption.sectionGroupId && assignmentOption.sectionGroupId > 0) {
					SupportActions.assignStaffToSectionGroup(assignmentOption.sectionGroupId, scope.supportStaff.id, type);
				} else if (assignmentOption.sectionId && assignmentOption.sectionId > 0) {
					SupportActions.assignStaffToSection(assignmentOption.sectionId, scope.supportStaff.id, type);
				}
			};
		}
	};
};

export default staffPreferences;
