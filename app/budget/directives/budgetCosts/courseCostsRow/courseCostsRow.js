import './courseCostsRow.css';

let courseCostsRow = function ($rootScope, BudgetActions) {
	return {
		restrict: 'A',
		template: require('./courseCostsRow.html'),
		replace: true,
		scope: {
			sectionGroup: '<'
		},
		link: function (scope, element, attrs) {
			scope.overrideSectionGroup = function(sectionGroup, property) {
				sectionGroup = scope.enforceNumericParams(sectionGroup);
				BudgetActions.overrideSectionGroup(sectionGroup, property);
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

				BudgetActions.overrideSectionGroup(sectionGroup, property, true);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		} // end link
	};
};

export default courseCostsRow;
