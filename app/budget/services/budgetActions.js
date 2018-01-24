budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers) {
	return {
		getInitialState: function (workgroupId, year, selectedBudgetScenarioId, selectedTerm) {
			var self = this;

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
				self.calculateSelectedScenario();
				self.calculateScenarioTerms();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load initial budget state.", type: "ERROR" });
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
				self.calculateScenarioTerms();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not create budget scenario.", type: "ERROR" });
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
				self.calculateSelectedScenario();
				self.calculateScenarioTerms();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete budget scenario.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not update instructor cost.", type: "ERROR" });
			});
		},
		createLineItem: function (newLineItem, budgetScenarioId) {
			var self = this;
			// Ensure amount is properly formatted as a float
			newLineItem.amount = parseFloat(newLineItem.amount);

			budgetService.createLineItem(newLineItem, budgetScenarioId).then(function (results) {
				var action = {
					type: CREATE_LINE_ITEM,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Created line item", type: "SUCCESS" });
				budgetReducers.reduce(action);

				// Close modal
				self.closeAddLineItemModal();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not create line item.", type: "ERROR" });
			});
		},
		editLineItem: function (updatedLineItem, budgetScenarioId) {
			var self = this;
			// Ensure amount is properly formatted as a float
			updatedLineItem.amount = parseFloat(updatedLineItem.amount);

			budgetService.updateLineItem(updatedLineItem, budgetScenarioId).then(function (results) {
				var action = {
					type: UPDATE_LINE_ITEM,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Updated line item", type: "SUCCESS" });
				budgetReducers.reduce(action);

				// Close modal
				self.closeAddLineItemModal();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update line item.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not save line item.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not delete line item.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not update costs.", type: "ERROR" });
			});
		},
		updateBudgetScenario: function (budget) {
			budgetService.updateBudgetScenario(budgetScenario).then(function (budgetScenario) {
				budgetReducers.reduce({
					type: UPDATE_BUDGET_SCENARIO,
					payload: {
						budgetScenario: budgetScenario
					}
				});

				$rootScope.$emit('toast', { message: "Updated costs", type: "SUCCESS" });
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update costs.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
			});
		},
		setRoute: function(selectedRoute) {
			budgetReducers.reduce({
				type: SET_ROUTE,
				payload: {
					selectedRoute: selectedRoute
				}
			});
		},
		closeAddLineItemModal: function() {
			var action = {
				type: CLOSE_ADD_LINE_ITEM_MODAL,
				payload: {}
			};

			budgetReducers.reduce(action);
		},
		openAddLineItemModal: function(lineItemToEdit) {
			var action = {
				type: OPEN_ADD_LINE_ITEM_MODAL,
				payload: {
					lineItemToEdit: lineItemToEdit
				}
			};

			budgetReducers.reduce(action);
		},
		closeBudgetConfigModal: function() {
			budgetReducers.reduce({
				type: CLOSE_BUDGET_CONFIG_MODAL,
				payload: {}
			});
		},
		openBudgetConfigModal: function() {
			budgetReducers.reduce({
				type: OPEN_BUDGET_CONFIG_MODAL,
				payload: {}
			});
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
		selectBudgetScenario: function(budgetScenarioId) {
			localStorage.setItem('selectedBudgetScenarioId', budgetScenarioId);

			var action = {
				type: SELECT_BUDGET_SCENARIO,
				payload: {
					budgetScenarioId: budgetScenarioId
				}
			};

			budgetReducers.reduce(action);
			self.calculateScenarioTerms();
		},
		selectTerm: function(termTab) {
			var descriptionTerms = {
				'Summer Session 1': '05',
				'Summer Special Session': '06',
				'Summer Session 2': '07',
				'Summer Quarter': '08',
				'Fall Semester': '09',
				'Fall Quarter': '10',
				'Winter Quarter': '01',
				'Spring Semester': '02',
				'Spring Quarter': '03'
			};

			budgetReducers.reduce({
				type: SELECT_TERM,
				payload: {
					term: descriptionTerms[termTab],
					activeTermTab: termTab
				}
			});
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
		deleteLineItems: function(budgetScenario, lineItemIds) {
			budgetService.deleteLineItems(budgetScenario, lineItemIds).then(function (results) {
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
				budgetReducers.reduce({
					type: DELETE_LINE_ITEMS,
					payload: {
						lineItemIds: lineItemIds
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
			});
		},
		calculateSelectedScenario: function() {
			var selectedScenarioId = angular.copy(budgetReducers._state.ui.selectedBudgetScenarioId);

			// If a scenario is not already selected, default to first scenario
			selectedScenarioId == selectedScenarioId || budgetReducers._state.budgetScenarios.ids[0];

			budgetReducers.reduce({
				type: CALCULATE_SELECTED_SCENARIO,
				payload: {
					budgetScenarioId: selectedScenarioId
				}
			});
		},
		calculateScenarioTerms: function() {
			var selectedScenarioTerms = [];
			var allTermTabs = [];
			var activeTermTab = null;

			var termDescriptions = {
				'05': 'Summer Session 1',
				'06': 'Summer Special Session',
				'07': 'Summer Session 2',
				'08': 'Summer Quarter',
				'09': 'Fall Semester',
				'10': 'Fall Quarter',
				'01': 'Winter Quarter',
				'02': 'Spring Semester',
				'03': 'Spring Quarter'
			};
			var sortedTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];

			budgetReducers._state.sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
				var sectionGroupCost = budgetReducers._state.sectionGroupCosts.list[sectionGroupCostId];

				// Skip sectionGroupCost if it doesn't belong to the selected scenario
				if (sectionGroupCost.budgetScenarioId != budgetReducers._state.ui.selectedBudgetScenarioId) {
					return;
				}

				var term = sectionGroupCost.termCode.slice(-2);

				if (selectedScenarioTerms.indexOf(term) == -1) {
					selectedScenarioTerms.push(term);
				}
			});

			sortedTerms.forEach(function(term) {
				if (selectedScenarioTerms.indexOf(term) > -1) {
					allTermTabs.push(termDescriptions[term]);
					activeTermTab = activeTermTab || termDescriptions[term];
				}
			});

			budgetReducers.reduce({
				type: CALCULATE_SCENARIO_TERMS,
				payload: {
					allTermTabs: allTermTabs,
					activeTermTab: activeTermTab,
					selectedScenarioTerms: selectedScenarioTerms
				}
			});
		}
	};
});