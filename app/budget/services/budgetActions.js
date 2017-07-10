budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers) {
	return {
		getInitialState: function (workgroupId, year, activeBudgetScenarioId) {
			budgetService.getInitialState(workgroupId, year).then(function (results) {

				// Set a default active budget scenario if one was not set in local storage
				if (!activeBudgetScenarioId) {
					if (results.budgetScenarios && results.budgetScenarios.length > 0) {
						activeBudgetScenarioId = results.budgetScenarios[0].id;
						localStorage.setItem('activeBudgetScenarioId', activeBudgetScenarioId);
					}
				}

				var action = {
					type: INIT_STATE,
					payload: results,
					year: year,
					workgroupId: workgroupId,
					activeBudgetScenarioId: activeBudgetScenarioId
				};

				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createBudgetScenario: function (newBudgetScenario, budgetId, scenarioId) {
			if (scenarioId == null) { scenarioId = 0;}

			budgetService.createBudgetScenario(newBudgetScenario, budgetId, scenarioId).then(function (results) {
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
		createLineItem: function (newLineItem, budgetScenarioId) {
			budgetService.createLineItem(newLineItem, budgetScenarioId).then(function (results) {
				var action = {
					type: CREATE_LINE_ITEM,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Created line item", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateLineItem: function (lineItem) {
			budgetService.updateLineItem(lineItem, lineItem.budgetScenarioId).then(function (results) {
				var action = {
					type: UPDATE_LINE_ITEM,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Saved line item", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteLineItem: function(lineItem) {
			budgetService.deleteLineItem(lineItem).then(function (lineItemId) {
				var action = {
					type: DELETE_LINE_ITEM,
					payload: {
						lineItemId: lineItemId
					}
				};

				$rootScope.$emit('toast', { message: "Deleted line item", type: "SUCCESS" });
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
		},
		toggleLineItemDetail: function(lineItemId, property) {
			var action = {
				type: TOGGLE_LINE_ITEM_DETAIL,
				payload: {
					lineItemId: lineItemId,
					property: property
				}
			};

			budgetReducers.reduce(action);
		},
		selectBudgetScenario: function(budgetScenarioId) {
			localStorage.setItem('activeBudgetScenarioId', budgetScenarioId);

			var action = {
				type: SELECT_BUDGET_SCENARIO,
				payload: {
					budgetScenarioId: budgetScenarioId
				}
			};

			budgetReducers.reduce(action);
		},
	};
});