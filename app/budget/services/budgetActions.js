budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers) {
	return {
		getInitialState: function (workgroupId, year, selectedBudgetScenarioId, selectedTerm) {
			budgetService.getInitialState(workgroupId, year).then(function (results) {

				// Set a default active budget scenario if one was not set in local storage
				if (!selectedBudgetScenarioId) {
					if (results.budgetScenarios && results.budgetScenarios.length > 0) {
						selectedBudgetScenarioId = results.budgetScenarios[0].id;
						localStorage.setItem('selectedBudgetScenarioId', selectedBudgetScenarioId);
					}
				}

				var action = {
					type: INIT_STATE,
					payload: results,
					year: year,
					workgroupId: workgroupId,
					selectedBudgetScenarioId: selectedBudgetScenarioId,
					selectedTerm: selectedTerm
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
		updateInstructorCost: function (instructorCost) {
			budgetService.updateInstructorCost(instructorCost).then(function (newInstructorCost) {
				var action = {
					type: UPDATE_INSTRUCTOR_COST,
					payload: {
						instructorCost: newInstructorCost
					}
				};
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createLineItem: function (newLineItem, budgetScenarioId) {
			// Ensure amount is properly formatted as a float
			newLineItem.amount = parseFloat(newLineItem.amount);

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
			// Ensure amount is properly formatted as a float
			lineItem.amount = parseFloat(lineItem.amount);

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
		updateSectionGroupCost: function (sectionGroupCost) {
			budgetService.updateSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
				var action = {
					type: UPDATE_SECTION_GROUP_COST,
					payload: {
						sectionGroupCost: newSectionGroupCost
					}
				};
				$rootScope.$emit('toast', { message: "Saved line item", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateBudget: function (budget) {
			budgetService.updateBudget(budget).then(function (budget) {
				var action = {
					type: UPDATE_BUDGET,
					payload: {
						budget: budget
					}
				};
				$rootScope.$emit('toast', { message: "Updated costs", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		toggleAddLineItemModal: function() {
			var action = {
				type: TOGGLE_ADD_LINE_ITEM_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		toggleAddBudgetScenarioModal: function() {
			var action = {
				type: TOGGLE_ADD_BUDGET_SCENARIO_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		toggleSupportCostModal: function() {
			var action = {
				type: TOGGLE_SUPPORT_COST_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
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
		toggleCourseCostsSection: function() {
			var action = {
				type: TOGGLE_COURSE_COST_SECTION,
				payload: {}
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
		toggleSectionGroupCostDetail: function(sectionGroupCostId, property) {
			var action = {
				type: TOGGLE_SECTION_GROUP_COST_DETAIL,
				payload: {
					sectionGroupCostId: sectionGroupCostId,
					property: property
				}
			};

			budgetReducers.reduce(action);
		},
		selectBudgetScenario: function(budgetScenarioId) {
			localStorage.setItem('selectedBudgetScenarioId', budgetScenarioId);

			var action = {
				type: SELECT_BUDGET_SCENARIO,
				payload: {
					budgetScenarioId: budgetScenarioId
				}
			};

			budgetReducers.reduce(action);
		},
		selectTerm: function(term) {
			var action = {
				type: SELECT_TERM,
				payload: {
					term: term
				}
			};

			budgetReducers.reduce(action);
		}
	};
});