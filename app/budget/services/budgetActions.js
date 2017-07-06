budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers) {
	return {
		getInitialState: function (workgroupId, year) {
			budgetService.getInitialState(workgroupId, year).then(function (results) {
				var action = {
					type: INIT_STATE,
					payload: results,
					year: year,
					workgroupId: workgroupId
				};

				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createBudgetScenario: function (newBudgetScenario, budgetId) {
			budgetService.createBudgetScenario(newBudgetScenario, budgetId).then(function (results) {
				var action = {
					type: CREATE_BUDGET_SCENARIO,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Created budget scenario", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteBudgetScenario: function (budgetScenarioId) {
			budgetService.deleteBudgetScenario(budgetScenarioId).then(function (budgetScenarioId) {
				var action = {
					type: DELETE_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: budgetScenarioId
					}
				};

				$rootScope.$emit('toast', { message: "Deleted budget scenario", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		toggleLineItemSection: function () {
			var action = {
				type: TOGGLE_LINE_ITEM_SECTION,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		toggleLineItem: function(lineItem) {
			var action = {
				type: TOGGLE_LINE_ITEM,
				payload: {lineItemId: lineItem.id}
			};

			budgetReducers.reduce(action);
		}
	};
});