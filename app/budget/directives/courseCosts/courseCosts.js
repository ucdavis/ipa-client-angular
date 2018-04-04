budgetApp.directive("courseCosts", this.courseCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCosts.html',
		replace: true,
		scope: {
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
				sectionGroup = scope.enforceNumericParams(sectionGroup);
				budgetActions.overrideSectionGroup(sectionGroup, property);
			};

			// Will ensure certain properties are numbers, if they exist on the object.
			scope.enforceNumericParams = function(obj) {
				var propertiesShouldBeNumber = [
					"overrideTeachingAssistantAppointments",
					"overrideSectionCount",
					"overrideReaderAppointments",
					"overrideTotalSeats"
				];

				propertiesShouldBeNumber.forEach(function(property) {
					if (obj[property] != null) {
						obj[property] = parseFloat(obj[property]);
					}
				});

				return obj;
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

				budgetActions.overrideSectionGroup(sectionGroup, property, isReversion = true);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		} // end link
	};
});
