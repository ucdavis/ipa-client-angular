budgetApp.directive("courseCosts", this.courseCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCosts.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			instructors: '<',
			termNav: '<',
			calculatedSectionGroups: '<'
		},
		link: function (scope, element, attrs) {
			scope.setActiveTerm = function(activeTermTab) {
				budgetActions.selectTerm(activeTermTab);
			};

			scope.openAddCourseCommentsModal = function(sectionGroup) {
				budgetActions.openAddCourseCommentsModal(sectionGroup);
			};

			scope.overrideSectionGroup = function(sectionGroup, property) {
				budgetActions.overrideSectionGroup(sectionGroup, property);
			};

			// Reverts the specified override value
			scope.revertOverride = function(sectionGroup, property) {
				if (property == "seats") {
					sectionGroup.overrideTotalSeats = null;
				} else if (property == "sectionCount") {
					sectionGroup.overrideSectionCount = null;
				} else if (property == "teachingAssistantAppointments") {
					sectionGroup.overrideTeachingAssistantAppointments = null;
				} else if (property == "readerAppointments") {
					sectionGroup.overrideReaderAppointments = null;
				}

				budgetActions.overrideSectionGroup(sectionGroup, property);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		} // end link
	};
});
