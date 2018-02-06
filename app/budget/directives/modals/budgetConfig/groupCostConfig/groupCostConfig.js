budgetApp.directive("groupCostConfig", this.groupCostConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'groupCostConfig.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.newInstructorType = {
				budgetId: scope.state.budget.id,
				cost: 0,
				description: null,
				validationError: null
			};

			scope.updateBudget = function (budget) {
				budgetActions.updateBudget(scope.state.budget);
			};

			scope.updateInstructorType = function(instructorType) {
				budgetActions.updateInstructorType(instructorType);
			};

			// Double check that name is unique and not null before saving, otherwise generate validation error
			scope.updateInstructorTypeIfValid = function(instructorType) {
				if (scope.isDescriptionUnique(instructorType.description, instructorType.id) == false) {
					instructorType.validationError = "Description must be unique";
					return;
				}

				if ( !(instructorType.description) || instructorType.description.length == 0) {
					instructorType.validationError = "Must provide a description";
					return;
				}

				budgetActions.updateInstructorType(instructorType);
			};

			scope.deleteInstructorType = function(instructorType) {
				budgetActions.deleteInstructorType(instructorType.id);
			};

			scope.createInstructorType = function() {
				var instructorTypeDTO = {
					budgetId: angular.copy(scope.newInstructorType.budgetId),
					cost: angular.copy(scope.newInstructorType.cost),
					description: angular.copy(scope.newInstructorType.description),
				};

				budgetActions.createInstructorType(instructorTypeDTO);

				scope.newInstructorType.cost = 0;
				scope.newInstructorType.description = null;
				scope.newInstructorType.validationError = null;
			};

			scope.isNewInstructorTypeValid = function() {
				if ( !(scope.newInstructorType.description) || scope.newInstructorType.description.length == 0) {
					scope.newInstructorType.validationError = "Must provide a description";
					return false;
				}

				if (scope.isDescriptionUnique(scope.newInstructorType.description) == false) {
					scope.newInstructorType.validationError = "Description must be unique";
					return false;
				}

				return true;
			};

			// Returns true if instructorType name is unique within instructorTypes for this budget
			// If id is provided for existing instructorTypes, will avoid checking against itself
			scope.isDescriptionUnique = function(description, instructorTypeId) {
				var isUnique = true;

				scope.state.calculatedInstructorTypes.forEach(function(instructorType) {
					// Avoid comparing against self
					if (instructorTypeId && instructorTypeId == instructorType.id) {
						return;
					}

					if (instructorType.description == description) {
						isUnique = false;
					}
				});

				return isUnique;
			};
		}
	};
});
