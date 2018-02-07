budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers, termService, budgetCalculations) {
	return {
		getInitialState: function (workgroupId, year, selectedBudgetScenarioId, selectedTerm) {
			var self = this;

			budgetService.getInitialState(workgroupId, year).then(function (results) {

				// BudgetScenario was set in localStorage, need to sanity check
				if (selectedBudgetScenarioId) {
					var scenarioFound = false;
					results.budgetScenarios.forEach(function(budgetScenario) {
						if (budgetScenario.id == selectedBudgetScenarioId) {
							scenarioFound = true;
						}
					});

					if (scenarioFound == false) {
						selectedBudgetScenarioId = null;
					}
				}

				// BudgetScenario was not set in localStorage, or it didn't correspond to an existing scenario
				if (!selectedBudgetScenarioId) {
					if (results.budgetScenarios && results.budgetScenarios.length > 0) {
						selectedBudgetScenarioId = parseInt(results.budgetScenarios[0].id);
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
				budgetCalculations.calculateInstructorTypes();
				budgetCalculations.calculateInstructors();
				self.selectBudgetScenario();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load initial budget state.", type: "ERROR" });
			});
		},
		// Compares sectionGroup values, the updated override value, and the sectionGroupCost to determine what action to take.
		// Will potentially create, delete, or update a sectionGroupCost
		overrideSectionGroup: function (sectionGroup, property) {
			var oldValue = null;
			var newValue = null;
			var savedOverride = null;

			var newSectionGroupCost = {
				sectionGroupId: sectionGroup.id,
				budgetScenarioId: budgetReducers._state.ui.selectedBudgetScenarioId
			};

			if (property == "seats") {
				savedOverride = sectionGroup.sectionGroupCost ? sectionGroup.sectionGroupCost.enrollment : null;
				oldValue = savedOverride || sectionGroup.totalSeats;
				newValue = sectionGroup.overrideTotalSeats;

				newSectionGroupCost.enrollment = sectionGroup.overrideTotalSeats;
			}

			else if (property == "sectionCount") {
				savedOverride = sectionGroup.sectionGroupCost ? sectionGroup.sectionGroupCost.sectionCount : null;
				oldValue = savedOverride || sectionGroup.sectionCount;
				newValue = sectionGroup.overrideSectionCount;
				newSectionGroupCost.sectionCount = sectionGroup.overrideSectionCount;
			}

			else if (property == "teachingAssistantAppointments") {
				savedOverride = sectionGroup.sectionGroupCost ? sectionGroup.sectionGroupCost.taCount : null;
				oldValue = savedOverride || sectionGroup.teachingAssistantAppointments;
				newValue = sectionGroup.overrideTeachingAssistantAppointments;
				newSectionGroupCost.taCount = sectionGroup.overrideTeachingAssistantAppointments;
			}

			else if (property == "readerAppointments") {
				savedOverride = sectionGroup.sectionGroupCost ? sectionGroup.sectionGroupCost.readerCount : null;
				oldValue = savedOverride || sectionGroup.readerAppointments;
				newValue = sectionGroup.overrideReaderAppointments;
				newSectionGroupCost.readerCount = sectionGroup.overrideReaderAppointments;
			}

			var isOverriden = oldValue != newValue;
			var wasOverriden = !!(savedOverride);

			if (isOverriden) {
				// Create or update sectionGroupCost
				if (sectionGroup.sectionGroupCost) {
					sectionGroup.sectionGroupCost = this.applyOverrideToProperty(sectionGroup.sectionGroupCost, newValue, property);
					this.updateSectionGroupCost(sectionGroup.sectionGroupCost);
				} else {
					newSectionGroupCost = this.applyOverrideToProperty(newSectionGroupCost, newValue, property);
					this.createSectionGroupCost(newSectionGroupCost);
				}
			}

			if (isOverriden == false && wasOverriden) {
				// Update sectionGroupCost
				this.updateSectionGroupCost(sectionGroup.sectionGroupCost);
			}

			if (isOverriden == false && wasOverriden == false) {
				// Do nothing
				return;
			}
		},
		applyOverrideToProperty: function (sectionGroupCost, value, property) {
			if (property == "seats") {
				sectionGroupCost.enrollment = value;
			} else if (property == "sectionCount") {
				sectionGroupCost.sectionCount = value;
			} else if (property == "teachingAssistantAppointments") {
				sectionGroupCost.taCount = value;
			} else if (property == "readerAppointments") {
				sectionGroupCost.readerCount = value;
			}

			return sectionGroupCost;
		},
		updateBudgetScenario: function (budgetScenario) {
			var self = this;

			budgetService.updateBudgetScenario(budgetScenario).then(function (results) {
				$rootScope.$emit('toast', { message: "Updated budget scenario", type: "SUCCESS" });

				budgetReducers.reduce({
					type: UPDATE_BUDGET_SCENARIO,
					payload: {
						budgetScenario: results
					}
				});
				budgetCalculations.calculateScenarioTerms();
				budgetCalculations.calculateSectionGroups();
				budgetCalculations.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update budget scenario.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not create budget scenario.", type: "ERROR" });
			});
		},
		deleteBudgetScenario: function (budgetScenarioId) {
			var self = this;

			budgetService.deleteBudgetScenario(budgetScenarioId).then(function (budgetScenarioId) {
				var action = {
					type: DELETE_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: budgetScenarioId
					}
				};

				$rootScope.$emit('toast', { message: "Deleted budget scenario", type: "SUCCESS" });
				budgetReducers.reduce(action);
				self.selectBudgetScenario();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete budget scenario.", type: "ERROR" });
			});
		},
		updateInstructorCost: function (instructorCostDto) {
			var self = this;
			var instructorCost = Object.assign({}, instructorCostDto);

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
				budgetCalculations.calculateSectionGroups();
				budgetCalculations.calculateTotalCost();
				$rootScope.$emit('toast', { message: "Updated instructor cost", type: "SUCCESS" });
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor cost.", type: "ERROR" });
			});
		},
		createInstructorCost: function (instructorCostDto) {
			var self = this;
			var instructorCost = Object.assign({}, instructorCostDto);

			// Ensure cost is passed as a number
			instructorCost.cost = parseFloat(instructorCost.cost);

			budgetService.createInstructorCost(instructorCost).then(function (newInstructorCost) {
				var action = {
					type: CREATE_INSTRUCTOR_COST,
					payload: {
						instructorCost: newInstructorCost
					}
				};
				budgetReducers.reduce(action);
				budgetCalculations.calculateSectionGroups();
				budgetCalculations.calculateTotalCost();
				$rootScope.$emit('toast', { message: "Updated instructor cost", type: "SUCCESS" });
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
				budgetCalculations.calculateScenarioLineItems();
				budgetCalculations.calculateTotalCost();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not create line item.", type: "ERROR" });
			});
		},
		updateLineItem: function (lineItem) {
			var self = this;
			// Ensure amount is properly formatted as a float
			lineItem.amount = parseFloat(lineItem.amount);

			budgetService.updateLineItem(lineItem, lineItem.budgetScenarioId).then(function (results) {
				var action = {
					type: UPDATE_LINE_ITEM,
					payload: results
				};
				$rootScope.$emit('toast', { message: "Saved line item", type: "SUCCESS" });
				budgetReducers.reduce(action);

				// Close modal
				self.closeAddLineItemModal();
				budgetCalculations.calculateScenarioLineItems();
				budgetCalculations.calculateTotalCost();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not save line item.", type: "ERROR" });
			});
		},
		deleteLineItem: function(lineItem) {
			var self = this;

			budgetService.deleteLineItem(lineItem).then(function (lineItemId) {
				var action = {
					type: DELETE_LINE_ITEM,
					payload: {
						lineItemId: lineItemId
					}
				};

				$rootScope.$emit('toast', { message: "Deleted line item", type: "SUCCESS" });
				budgetReducers.reduce(action);
				budgetCalculations.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete line item.", type: "ERROR" });
			});
		},
		updateSectionGroupCost: function (sectionGroupCost) {
			var self = this;

			budgetService.updateSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
				var action = {
					type: UPDATE_SECTION_GROUP_COST,
					payload: {
						sectionGroupCost: newSectionGroupCost
					}
				};
				$rootScope.$emit('toast', { message: "Updated course", type: "SUCCESS" });
				budgetReducers.reduce(action);
				budgetCalculations.calculateSectionGroups();
				budgetCalculations.calculateTotalCost();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
			});
		},
		createSectionGroupCost: function (sectionGroupCost) {
			var self = this;

			budgetService.createSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
				var action = {
					type: CREATE_SECTION_GROUP_COST,
					payload: {
						sectionGroupCost: newSectionGroupCost
					}
				};
				$rootScope.$emit('toast', { message: "Updated course", type: "SUCCESS" });
				budgetReducers.reduce(action);
				budgetCalculations.calculateSectionGroups();
				budgetCalculations.calculateTotalCost();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
			});
		},
		createInstructorType: function (instructorTypeDTO) {
			var self = this;
			instructorTypeDTO.cost = parseFloat(instructorTypeDTO.cost);

			budgetService.createInstructorType(instructorTypeDTO).then(function (instructorType) {
				budgetReducers.reduce({
					type: CREATE_INSTRUCTOR_TYPE,
					payload: {
						instructorType: instructorType
					}
				});

				$rootScope.$emit('toast', { message: "Updated instructor type", type: "SUCCESS" });
				budgetCalculations.calculateInstructorTypes();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor type.", type: "ERROR" });
			});
		},
		deleteInstructorType: function (instructorTypeId) {
			var self = this;

			budgetService.deleteInstructorType(instructorTypeId).then(function (instructorTypeId) {
				budgetReducers.reduce({
					type: DELETE_INSTRUCTOR_TYPE,
					payload: {
						instructorTypeId: instructorTypeId
					}
				});

				$rootScope.$emit('toast', { message: "Deleted instructor type", type: "SUCCESS" });
				budgetCalculations.calculateInstructorTypes();
				budgetCalculations.calculateInstructors();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete instructor type.", type: "ERROR" });
			});
		},
		updateInstructorType: function (newInstructorType) {
			var self = this;
			newInstructorType.cost = parseFloat(newInstructorType.cost);

			budgetService.updateInstructorType(newInstructorType).then(function (instructorType) {
				budgetReducers.reduce({
					type: UPDATE_INSTRUCTOR_TYPE,
					payload: {
						instructorType: instructorType
					}
				});

				$rootScope.$emit('toast', { message: "Updated instructor type", type: "SUCCESS" });
				budgetCalculations.calculateInstructorTypes();
				budgetCalculations.calculateInstructors();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor type.", type: "ERROR" });
			});
		},
		updateBudget: function (budget) {
			var self = this;

			budgetService.updateBudget(budget).then(function (budget) {
				var action = {
					type: UPDATE_BUDGET,
					payload: {
						budget: budget
					}
				};
				$rootScope.$emit('toast', { message: "Updated costs", type: "SUCCESS" });
				budgetReducers.reduce(action);
				budgetCalculations.calculateSectionGroups();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update costs.", type: "ERROR" });
			});
		},
		// Will also create sectionGroupCost if it does not already exist.
		createSectionGroupCostCommentFromSectionGroup: function (comment, sectionGroup, currentUserLoginId) {
			var self = this;
			var sectionGroupCost = sectionGroup.sectionGroupCost;

			// Create sectionGroupCost if necessary
			if (sectionGroupCost == false || sectionGroupCost == null) {
				var sectionGroupCostDTO = {
					sectionGroupId: sectionGroup.id,
					budgetScenarioId: budgetReducers._state.ui.selectedBudgetScenarioId
				};

				budgetService.createSectionGroupCost(sectionGroupCostDTO).then(function (newSectionGroupCost) {
					budgetReducers.reduce({
						type: CREATE_SECTION_GROUP_COST,
						payload: {
							sectionGroupCost: newSectionGroupCost
						}
					});
					$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
					self.createSectionGroupCostComment(comment, newSectionGroupCost, currentUserLoginId);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
				});
			} else {
				self.createSectionGroupCostComment(comment, sectionGroupCost, currentUserLoginId);
			}
		},
		createSectionGroupCostComment: function (comment, sectionGroupCost, currentUserLoginId) {
			var self = this;
			var sectionGroupCostComment = {};
			sectionGroupCostComment.comment = comment;
			sectionGroupCostComment.loginId = currentUserLoginId;
			sectionGroupCostComment.sectionGroupCostId = parseInt(sectionGroupCost.id);

			budgetService.createSectionGroupCostComment(sectionGroupCostComment).then(function (newSectionGroupCostComment) {
				budgetReducers.reduce({
					type: CREATE_SECTION_GROUP_COST_COMMENT,
					payload: {
						sectionGroupCostComment: newSectionGroupCostComment
					}
				});
				$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
				budgetCalculations.calculateSectionGroups();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
			});
		},
		createLineItemComment: function (comment, lineItem, currentUserLoginId) {
			var self = this;

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
				budgetCalculations.calculateScenarioLineItems();
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
		openAddCourseCommentsModal: function(sectionGroup) {
			var action = {
				type: OPEN_ADD_COURSE_COMMENT_MODAL,
				payload: {
					sectionGroup: sectionGroup
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
		selectBudgetScenario: function(selectedScenarioId) {
			// If one was not provided, continue to use currently set scenario
			if (selectedScenarioId == false || selectedScenarioId == null) {
				selectedScenarioId = angular.copy(budgetReducers._state.ui.selectedBudgetScenarioId);
			} else if (selectedScenarioId == false || selectedScenarioId == null || selectedScenarioId == "undefined") {
				// If a scenario was not already selected, default to first scenario
				selectedScenarioId = budgetReducers._state.budgetScenarios.ids[0];
			}

			localStorage.setItem('selectedBudgetScenarioId', selectedScenarioId);

			var action = {
				type: SELECT_BUDGET_SCENARIO,
				payload: {
					budgetScenarioId: selectedScenarioId
				}
			};

			budgetReducers.reduce(action);
			budgetCalculations.calculateScenarioTerms();
			budgetCalculations.calculateScenarioLineItems();
			budgetCalculations.calculateSectionGroups();
			budgetCalculations.calculateTotalCost();
		},
		selectTerm: function(termTab) {
			budgetReducers.reduce({
				type: SELECT_TERM,
				payload: {
					term: termService.getTermFromDescription(termTab),
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
			var self = this;

			budgetService.deleteLineItems(budgetScenario, lineItemIds).then(function (results) {
				$rootScope.$emit('toast', { message: "Deleted line items", type: "SUCCESS" });
				budgetReducers.reduce({
					type: DELETE_LINE_ITEMS,
					payload: {
						lineItemIds: lineItemIds
					}
				});
				budgetCalculations.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete line items.", type: "ERROR" });
			});
		}
	};
});