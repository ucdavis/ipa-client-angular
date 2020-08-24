import { toCurrency } from 'shared/helpers/string';

import './courseCostsRow.css';

let courseCostsRow = function ($rootScope, BudgetActions) {
	return {
		restrict: 'A',
		template: require('./courseCostsRow.html'),
		replace: true,
		scope: {
			sectionGroupCost: '<',
			isLiveDataScenario: '<'
		},
		link: function (scope) {
			scope.updateSectionGroupCost = function (sectionGroupCost) {
				scope.enforceNumericParams(sectionGroupCost);
				BudgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			// Will ensure certain properties are numbers, if they exist on the object.
			scope.enforceNumericParams = function(obj) {
				var propertiesShouldBeNumber = [
					"taCount",
					"sectionCount",
					"readerCount",
					"enrollment"
				];

				propertiesShouldBeNumber.forEach(function(property) {
					if (obj[property] != null) {
						obj[property] = parseFloat(obj[property]);
					}
				});

				return obj;
			};

			scope.syncEnrollment = function (sectionGroupCost) {
				sectionGroupCost.enrollment = sectionGroupCost.sectionGroup.totalSeats;
				scope.updateSectionGroupCost(sectionGroupCost);
			};

			scope.syncSectionCount = function (sectionGroupCost) {
				sectionGroupCost.sectionCount = sectionGroupCost.sectionGroup.sectionCount;
				scope.updateSectionGroupCost(sectionGroupCost);
			};

			scope.syncTaCount = function (sectionGroupCost) {
				sectionGroupCost.taCount = sectionGroupCost.sectionGroup.teachingAssistantAppointments;
				scope.updateSectionGroupCost(sectionGroupCost);
			};

			scope.syncReaderCount = function (sectionGroupCost) {
				sectionGroupCost.readerCount = sectionGroupCost.sectionGroup.readerAppointments;
				scope.updateSectionGroupCost(sectionGroupCost);
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};

			scope.openAddCourseCommentsModal = function(sectionGroupCost) {
				BudgetActions.openAddCourseCommentsModal(sectionGroupCost);
			};
		}
	};
};

export default courseCostsRow;
