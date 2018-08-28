import './assignSupportStaff.css';

let assignSupportStaff = function (SupportActions) {
	return {
		restrict: 'E',
		template: require('./assignSupportStaff.html'),
		replace: true,
		scope: {
			assignmentOptions: '<',
			sectionGroup: '<?',
			section: '<?',
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

			scope.triggerSelection = function(preference) {
				if (scope.sectionGroup) {
					scope.assignStaffToSectionGroup(preference.supportStaffId, scope.sectionGroup);
				} else {
					scope.assignStaffToSection(preference.supportStaffId, scope.section);
				}

				scope.closeDropdown();
			};

			scope.assignStaffToSectionGroup = function(supportStaffId, sectionGroup) {
				var type = scope.viewType == "Readers" ? "reader" : "teachingAssistant";
				SupportActions.assignStaffToSectionGroup(sectionGroup.id, supportStaffId, type);
			};

			scope.assignStaffToSection = function(supportStaffId, section) {
				var type = scope.viewType == "Readers" ? "reader" : "teachingAssistant";
				SupportActions.assignStaffToSection(section.id, supportStaffId, type);
			};
		}
	};
};

export default assignSupportStaff;
