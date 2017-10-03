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
			var self = this;
			if (scenarioId == null) { scenarioId = 0;}

			budgetService.createBudgetScenario(newBudgetScenario, budgetId, scenarioId).then(function (results) {
				var action = {
					type: CREATE_BUDGET_SCENARIO,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Created budget scenario", type: "SUCCESS" });
				budgetReducers.reduce(action);
				self.selectBudgetScenario(results.budgetScenario.id);
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
		updateInstructorCost: function (instructorCostDto) {
			var instructorCost = Object.assign({}, instructorCostDto);

			// InstructorCosts in the front end are blended instructor + instructorCosts
			instructorCost.id = instructorCost.instructorCostId;
			// Ensure cost is passed as a number
			instructorCost.cost = parseFloat(instructorCost.cost);

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

			// Close modal
			this.toggleAddLineItemModal();

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
				$rootScope.$emit('toast', { message: "Updated course", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateBudget: function (budget) {
			// Update UI
			this.toggleSupportCostModal();

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
		createSectionGroupCostComment: function (comment, sectionGroupCost, currentUserLoginId) {
			var sectionGroupCostComment = {};
			sectionGroupCostComment.comment = comment;
			sectionGroupCostComment.loginId = currentUserLoginId;
			sectionGroupCostComment.sectionGroupCostId = parseInt(sectionGroupCost.id);

			budgetService.createSectionGroupCostComment(sectionGroupCostComment).then(function (newSectionGroupCostComment) {
				var action = {
					type: CREATE_SECTION_GROUP_COST_COMMENT,
					payload: {
						sectionGroupCostComment: newSectionGroupCostComment
					}
				};
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createLineItemComment: function (comment, lineItem, currentUserLoginId) {
			var lineItemComment = {};
			lineItemComment.comment = comment;
			lineItemComment.loginId = currentUserLoginId;
			lineItemComment.lineItemId = parseInt(lineItem.id);

			budgetService.createLineItemComment(lineItemComment).then(function (newLineItemComment) {
				var action = {
					type: CREATE_LINE_ITEM_COMMENT,
					payload: {
						lineItemComment: newLineItemComment
					}
				};
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
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
		openAddCourseCommentsModal: function(course) {
			var action = {
				type: OPEN_ADD_COURSE_COMMENT_MODAL,
				payload: {
					course: course
				}
			};

			budgetReducers.reduce(action);
		},
		openAddLineItemCommentsModal: function(lineItem) {
			var action = {
				type: OPEN_ADD_LINE_ITEM_COMMENT_MODAL,
				payload: {
					lineItem: lineItem
				}
			};

			budgetReducers.reduce(action);
		},
		closeAddCourseCommentsModal: function() {
			var action = {
				type: OPEN_ADD_COURSE_COMMENT_MODAL,
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
		},
		toggleSelectLineItem: function(lineItem) {
			budgetReducers.reduce({
				type: TOGGLE_SELECT_LINE_ITEM,
				payload: {
					lineItem: lineItem
				}
			});
		},
		selectAllLineItems: function(lineItems) {
			budgetReducers.reduce({
				type: SELECT_ALL_LINE_ITEMS,
				payload: {
					lineItems: lineItems
				}
			});
		},
		deselectAllLineItems: function() {
			budgetReducers.reduce({
				type: DESELECT_ALL_LINE_ITEMS,
				payload: {}
			});
		},
		deleteLineItems: function(lineItems) {
			budgetService.deleteLineItems(lineItems).then(function (results) {
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
				budgetReducers.reduce({
					type: DELETE_LINE_ITEMS,
					payload: {
						lineItems: lineItems
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
	};
});