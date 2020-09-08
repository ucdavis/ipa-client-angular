import { toCurrency } from 'shared/helpers/string';

import './courseCostsRow.css';

let courseCostsRow = function ($rootScope, BudgetActions) {
	return {
		restrict: 'A',
		template: require('./courseCostsRow.html'),
		replace: true,
		scope: {
			sectionGroupCost: '<',
			isLiveDataScenario: '<',
			instructorCount: '<',
			divider: '<',
			isSnapshot: '<'
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

			scope.syncInstructor = function() {
				scope.sectionGroupCost.instructorId = scope.sectionGroupCost.sectionGroup.assignedInstructor ? scope.sectionGroupCost.sectionGroup.assignedInstructor.id : null;
				scope.sectionGroupCost.instructorTypeId = scope.sectionGroupCost.sectionGroup.assignedInstructorType ? scope.sectionGroupCost.sectionGroup.assignedInstructorType.id : null;
				BudgetActions.updateSectionGroupCost(scope.sectionGroupCost);
				if (scope.sectionGroupCost.sectionGroup){
					var currentInstructorIds = scope.sectionGroupCost.sectionGroupCostInstructors.map(function(instructor){
						return instructor.instructorId;
					});
					const instructors = scope.sectionGroupCost.sectionGroup.assignedInstructors.map(function(liveDataInstructor){
						return {
							instructorId: liveDataInstructor.id,
							instructorTypeId: liveDataInstructor.instructorTypeId,
							sectionGroupCostId: scope.sectionGroupCost.id
						};
					}).filter(instructor => !currentInstructorIds.includes(instructor.instructorId));
					BudgetActions.createSectionGroupCostInstructors(instructors);
				}
			};
		}
	};
};

export default courseCostsRow;
