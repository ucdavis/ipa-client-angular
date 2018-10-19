class BudgetActions {
	constructor ($rootScope, $window, $route, BudgetService, BudgetReducers, TermService, BudgetCalculations, ActionTypes, Roles, ScheduleCostCalculations) {
		return {
			getInitialState: function () {
				var self = this;
				var selectedBudgetScenarioId = parseInt(localStorage.getItem('selectedBudgetScenarioId')) || null;
				var selectedTerm = localStorage.getItem('selectedTerm');
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;

				BudgetService.getInitialState(workgroupId, year).then(function (results) {

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

					BudgetReducers.reduce({
						type: ActionTypes.INIT_STATE,
						payload: results,
						year: year,
						workgroupId: workgroupId,
						selectedBudgetScenarioId: selectedBudgetScenarioId,
						selectedTerm: selectedTerm
					});

					// Ensure budgetScenario is properly set
					self.attachInstructorTypesToInstructors();
					self.selectBudgetScenario();

					// Perform follow up calculations
					BudgetCalculations.calculateInstructors();
					BudgetCalculations.calculateLineItems();
					BudgetCalculations.calculateInstructorTypeCosts();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load initial budget state.", type: "ERROR" });
				});
			},
			updateBudgetScenario: function (budgetScenario) {
				var self = this;

				BudgetService.updateBudgetScenario(budgetScenario).then(function (results) {
					$rootScope.$emit('toast', { message: "Updated budget scenario", type: "SUCCESS" });

					BudgetReducers.reduce({
						type: ActionTypes.UPDATE_BUDGET_SCENARIO,
						payload: {
							budgetScenario: results
						}
					});
					BudgetCalculations.calculateScenarioTerms();
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateLineItems();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update budget scenario.", type: "ERROR" });
				});
			},
			createBudgetScenario: function (newBudgetScenario, budgetId, scenarioId) {
				var self = this;
				if (scenarioId == null) { scenarioId = 0;}
	
				BudgetService.createBudgetScenario(newBudgetScenario, budgetId, scenarioId).then(function (results) {
					var action = {
						type: ActionTypes.CREATE_BUDGET_SCENARIO,
						payload: results
					};
					$rootScope.$emit('toast', { message: "Created budget scenario", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					self.selectBudgetScenario(results.budgetScenario.id);
					self.attachInstructorTypesToInstructors();

					// Perform follow up calculations
					BudgetCalculations.calculateInstructors();
					BudgetCalculations.calculateLineItems();
					BudgetCalculations.calculateInstructorTypeCosts();

				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create budget scenario.", type: "ERROR" });
				});
			},
			deleteBudgetScenario: function (budgetScenarioId) {
				var self = this;

				BudgetService.deleteBudgetScenario(budgetScenarioId).then(function (budgetScenarioId) {
					var action = {
						type: ActionTypes.DELETE_BUDGET_SCENARIO,
						payload: {
							budgetScenarioId: budgetScenarioId
						}
					};

					$rootScope.$emit('toast', { message: "Deleted budget scenario", type: "SUCCESS" });
					BudgetReducers.reduce(action);
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

				BudgetService.updateInstructorCost(instructorCost).then(function (newInstructorCost) {
					var action = {
						type: ActionTypes.UPDATE_INSTRUCTOR_COST,
						payload: {
							instructorCost: newInstructorCost
						}
					};
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateInstructorTypeCosts();
					BudgetCalculations.calculateInstructors();
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();

					self.asignInstructorType(newInstructorCost);
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
	
				BudgetService.createInstructorCost(instructorCost).then(function (newInstructorCost) {
					var action = {
						type: ActionTypes.CREATE_INSTRUCTOR_COST,
						payload: {
							instructorCost: newInstructorCost
						}
					};
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					$rootScope.$emit('toast', { message: "Updated instructor cost", type: "SUCCESS" });
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update instructor cost.", type: "ERROR" });
				});
			},
			createLineItem: function (newLineItem, budgetScenarioId, message) {
				var self = this;
				// Ensure amount is properly formatted as a float
				newLineItem.amount = newLineItem.amount ? parseFloat(newLineItem.amount) : null;
	
				BudgetService.createLineItem(newLineItem, budgetScenarioId).then(function (newLineItem) {
					var action = {
						type: ActionTypes.CREATE_LINE_ITEM,
						payload: newLineItem
					};
					$rootScope.$emit('toast', { message: message || "Created line item", type: "SUCCESS" });
					BudgetReducers.reduce(action);
	
					// Close modal
					self.closeAddLineItemModal();
					BudgetCalculations.calculateLineItems();
					BudgetCalculations.calculateTotalCost();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create line item.", type: "ERROR" });
				});
			},
			updateLineItem: function (lineItem) {
				var self = this;
	
				// Create instead of update if appropriate
				if (lineItem.id == null || lineItem.id == 0) {
					this.createLineItem(lineItem, lineItem.budgetScenarioId);
					return;
				}
	
				// Ensure amount is properly formatted as a float
				lineItem.amount = parseFloat(lineItem.amount);
	
				BudgetService.updateLineItem(lineItem, lineItem.budgetScenarioId).then(function (results) {
					var action = {
						type: ActionTypes.UPDATE_LINE_ITEM,
						payload: results
					};
					$rootScope.$emit('toast', { message: "Saved line item", type: "SUCCESS" });
					BudgetReducers.reduce(action);
	
					// Close modal
					self.closeAddLineItemModal();
					BudgetCalculations.calculateLineItems();
					BudgetCalculations.calculateTotalCost();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not save line item.", type: "ERROR" });
				});
			},
			deleteLineItem: function(lineItem) {
				var self = this;

				// If the lineItem is based on a teachingAssignment, do not delete it, instead mark it as hidden
				if (lineItem.teachingAssignmentId > 0) {
					lineItem.hidden = true;
					this.updateLineItem(lineItem);
					return;
				}

				BudgetService.deleteLineItem(lineItem).then(function (lineItemId) {
					var action = {
						type: ActionTypes.DELETE_LINE_ITEM,
						payload: {
							lineItemId: lineItemId
						}
					};

					$rootScope.$emit('toast', { message: "Deleted line item", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateLineItems();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete line item.", type: "ERROR" });
				});
			},
			updateSectionGroupCost: function (sectionGroupCost) {
				var self = this;
				BudgetService.updateSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
					var action = {
						type: ActionTypes.UPDATE_SECTION_GROUP_COST,
						payload: {
							sectionGroupCost: newSectionGroupCost
						}
					};
					$rootScope.$emit('toast', { message: "Updated course", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					BudgetCalculations.calculateCourseList();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
				});
			},
			createSectionGroupCost: function (sectionGroupCost) {
				var self = this;

				let term = BudgetReducers._state.ui.termNav.activeTerm;
				let year = BudgetReducers._state.ui.year;
				var sectionGroup = BudgetReducers._state.sectionGroups.list[sectionGroupCost.sectionGroupId];
				var course = BudgetReducers._state.courses.list[sectionGroup.courseId];

				sectionGroupCost.termCode = TermService.termToTermCode(term, year);
				sectionGroupCost.budgetScenarioId = BudgetReducers._state.ui.selectedBudgetScenarioId;
				sectionGroupCost.effectiveTermCode = course.effectiveTermCode;

				BudgetService.createSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
					var action = {
						type: ActionTypes.CREATE_SECTION_GROUP_COST,
						payload: {
							sectionGroupCost: newSectionGroupCost
						}
					};
					$rootScope.$emit('toast', { message: "Added course", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					BudgetCalculations.calculateCourseList();
					ScheduleCostCalculations.calculateScheduleCosts();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not add course.", type: "ERROR" });
				});
			},
			asignInstructorType: function(instructorCost) {
				var self = this;

				BudgetService.updateInstructorCost(instructorCost).then(function (newInstructorCost) {
					var action = {
						type: ActionTypes.UPDATE_INSTRUCTOR_COST,
						payload: {
							instructorCost: newInstructorCost
						}
					};
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					BudgetCalculations.calculateInstructors();
					BudgetCalculations.calculateInstructorTypeCosts();
					$rootScope.$emit('toast', { message: "Assigned instructor type", type: "SUCCESS" });
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not assign instructor type.", type: "ERROR" });
				});
			},
			createOrUpdateInstructorTypeCosts: function (instructorTypeCost) {
				if (instructorTypeCost.id > 0) {
					this._updateInstructorTypeCost(instructorTypeCost);
				} else {
					this._createInstructorTypeCost(instructorTypeCost);
				}
			},
			_createInstructorTypeCost: function (instructorTypeCostDTO) {
				var self = this;
				instructorTypeCostDTO.cost = parseFloat(instructorTypeCostDTO.cost);

				BudgetService.createInstructorTypeCost(instructorTypeCostDTO).then(function (instructorTypeCost) {
					BudgetReducers.reduce({
						type: ActionTypes.CREATE_INSTRUCTOR_TYPE_COST,
						payload: {
							instructorTypeCost: instructorTypeCost
						}
					});

					$rootScope.$emit('toast', { message: "Updated instructor type", type: "SUCCESS" });
					BudgetCalculations.calculateInstructorTypeCosts();
					BudgetCalculations.calculateSectionGroups();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update instructor type.", type: "ERROR" });
				});
			},
			_updateInstructorTypeCost: function (newInstructorTypeCost) {
				var self = this;
				newInstructorTypeCost.cost = parseFloat(newInstructorTypeCost.cost);
	
				BudgetService.updateInstructorTypeCost(newInstructorTypeCost).then(function (instructorTypeCost) {
					BudgetReducers.reduce({
						type: ActionTypes.UPDATE_INSTRUCTOR_TYPE_COST,
						payload: {
							instructorTypeCost: instructorTypeCost
						}
					});
	
					$rootScope.$emit('toast', { message: "Updated instructor type", type: "SUCCESS" });
					BudgetCalculations.calculateInstructorTypeCosts();
					BudgetCalculations.calculateInstructors();
					BudgetCalculations.calculateSectionGroups();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update instructor type.", type: "ERROR" });
				});
			},
			updateBudget: function (budget) {
				var self = this;
	
				BudgetService.updateBudget(budget).then(function (budget) {
					var action = {
						type: ActionTypes.UPDATE_BUDGET,
						payload: {
							budget: budget
						}
					};
					$rootScope.$emit('toast', { message: "Updated costs", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update costs.", type: "ERROR" });
				});
			},
			setOriginalInstructorFromSectionGroup: function (sectionGroup, originalInstructorId) {
				var self = this;
				var sectionGroupCost = sectionGroup.sectionGroupCost;

				// Create sectionGroupCost if necessary
				if (sectionGroupCost == false || sectionGroupCost == null) {
					var sectionGroupCostDTO = {
						sectionGroupId: sectionGroup.id,
						budgetScenarioId: BudgetReducers._state.ui.selectedBudgetScenarioId,
						originalInstructorId: originalInstructorId
					};
	
					BudgetService.createSectionGroupCost(sectionGroupCostDTO).then(function (newSectionGroupCost) {
						BudgetReducers.reduce({
							type: ActionTypes.CREATE_SECTION_GROUP_COST,
							payload: {
								sectionGroupCost: newSectionGroupCost
							}
						});
	
						self.updateSectionGroupCost(newSectionGroupCost);
						$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
					}, function (err) {
						$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
					});
				} else {
					sectionGroupCost.originalInstructorId = originalInstructorId;
					self.updateSectionGroupCost(sectionGroupCost);
				}
			},
			setInstructorTypeFromSectionGroup: function (sectionGroup, instructorType) {
				var self = this;
				var sectionGroupCost = sectionGroup.sectionGroupCost;
	
				// Instructor being assigned matches schedule data, so we should nullify the override
				if (sectionGroup.assignedInstructorTypeIds.indexOf(instructorType.id) > -1) {
					if (sectionGroupCost != false) {
						sectionGroupCost.instructorTypeId = null;
						sectionGroupCost.instructorId = null;
						self.updateSectionGroupCost(sectionGroupCost);
						return;
					}
				}
	
				// Create sectionGroupCost if necessary
				if (sectionGroupCost == false || sectionGroupCost == null) {
					var sectionGroupCostDTO = {
						sectionGroupId: sectionGroup.id,
						budgetScenarioId: BudgetReducers._state.ui.selectedBudgetScenarioId,
						instructorTypeId: instructorType.id,
						instructorId: null
					};
	
					BudgetService.createSectionGroupCost(sectionGroupCostDTO).then(function (newSectionGroupCost) {
						BudgetReducers.reduce({
							type: ActionTypes.CREATE_SECTION_GROUP_COST,
							payload: {
								sectionGroupCost: newSectionGroupCost
							}
						});
						self.updateSectionGroupCost(newSectionGroupCost);
						$rootScope.$emit('toast', { message: "Assigned instructor type", type: "SUCCESS" });
					}, function (err) {
						$rootScope.$emit('toast', { message: "Could not assign instructor type.", type: "ERROR" });
					});
				} else {
					sectionGroupCost.instructorTypeId = instructorType.id;
					sectionGroupCost.instructorId = null;
					self.updateSectionGroupCost(sectionGroupCost);
				}
			},
			setInstructorFromSectionGroup: function (sectionGroup, instructor) {
				var self = this;
				var sectionGroupCost = sectionGroup.sectionGroupCost;
	
				// Instructor being assigned matches schedule data, so we should nullify the override
				if (sectionGroup.assignedInstructorIds.indexOf(instructor.id) > -1) {
					if (sectionGroupCost != false) {
						sectionGroupCost.instructorId = null;
						sectionGroupCost.instructorTypeId = null;
						self.updateSectionGroupCost(sectionGroupCost);
						return;
					}
				}
	
				// Create sectionGroupCost if necessary
				if (sectionGroupCost == false || sectionGroupCost == null) {
					var sectionGroupCostDTO = {
						sectionGroupId: sectionGroup.id,
						budgetScenarioId: BudgetReducers._state.ui.selectedBudgetScenarioId,
						instructorId: instructor.id,
						instructorTypeId: null
					};
	
					BudgetService.createSectionGroupCost(sectionGroupCostDTO).then(function (newSectionGroupCost) {
						BudgetReducers.reduce({
							type: ActionTypes.CREATE_SECTION_GROUP_COST,
							payload: {
								sectionGroupCost: newSectionGroupCost
							}
						});
						self.updateSectionGroupCost(newSectionGroupCost);
						$rootScope.$emit('toast', { message: "Assigned instructor", type: "SUCCESS" });
					}, function (err) {
						$rootScope.$emit('toast', { message: "Could not assign instructor.", type: "ERROR" });
					});
				} else {
					sectionGroupCost.instructorId = instructor.id;
					sectionGroupCost.instructorTypeId = null;
					self.updateSectionGroupCost(sectionGroupCost);
				}
			},
			// Will also create sectionGroupCost if it does not already exist.
			createSectionGroupCostCommentFromSectionGroup: function (comment, sectionGroupCost, currentUserLoginId) {	
				var self = this;
				var sectionGroupCostComment = {};
				sectionGroupCostComment.comment = comment;
				sectionGroupCostComment.loginId = currentUserLoginId;
				sectionGroupCostComment.sectionGroupCostId = parseInt(sectionGroupCost.id);
	
				BudgetService.createSectionGroupCostComment(sectionGroupCostComment).then(function (newSectionGroupCostComment) {
					BudgetReducers.reduce({
						type: ActionTypes.CREATE_SECTION_GROUP_COST_COMMENT,
						payload: {
							sectionGroupCostComment: newSectionGroupCostComment
						}
					});
					$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
					BudgetCalculations.calculateSectionGroups();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
				});
			},
			// Will create the lineItem if necessary
			createLineItemComment: function(comment, lineItem, currentUserLoginId) {
				var self = this;
	
				// Create lineItem if necessary
				if (lineItem.id == null || lineItem.id <= 0) {
					var budgetScenarioId = BudgetReducers._state.ui.selectedBudgetScenarioId;
	
					BudgetService.createLineItem(lineItem, budgetScenarioId).then(function (newLineItem) {
						lineItem.id = newLineItem.id;
	
						BudgetReducers.reduce({
							type: ActionTypes.CREATE_LINE_ITEM,
							payload: lineItem
						});
						BudgetCalculations.calculateLineItems();
						BudgetCalculations.calculateTotalCost();
	
						$rootScope.$emit('toast', { message: "Saved line item", type: "SUCCESS" });
						self._createLineItemComment(comment, lineItem, currentUserLoginId);
					}, function (err) {
						$rootScope.$emit('toast', { message: "Could not save line item.", type: "ERROR" });
					});
				} else {
					self._createLineItemComment(comment, lineItem, currentUserLoginId);
				}
			},
			_createLineItemComment: function (comment, lineItem, currentUserLoginId) {
				var self = this;
	
				var lineItemComment = {};
				lineItemComment.comment = comment;
				lineItemComment.loginId = currentUserLoginId;
				lineItemComment.lineItemId = parseInt(lineItem.id);
	
				BudgetService.createLineItemComment(lineItemComment).then(function (newLineItemComment) {
					var action = {
						type: ActionTypes.CREATE_LINE_ITEM_COMMENT,
						payload: {
							lineItemComment: newLineItemComment
						}
					};
					$rootScope.$emit('toast', { message: "Saved comment", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateLineItems();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not save comment.", type: "ERROR" });
				});
			},
			setRoute: function(selectedRoute) {
				BudgetReducers.reduce({
					type: ActionTypes.SET_ROUTE,
					payload: {
						selectedRoute: selectedRoute
					}
				});
			},
			closeAddLineItemModal: function() {
				var action = {
					type: ActionTypes.CLOSE_ADD_LINE_ITEM_MODAL,
					payload: {}
				};
	
				BudgetReducers.reduce(action);
			},
			openAddLineItemModal: function(lineItemToEdit) {
				var action = {
					type: ActionTypes.OPEN_ADD_LINE_ITEM_MODAL,
					payload: {
						lineItemToEdit: lineItemToEdit
					}
				};
	
				BudgetReducers.reduce(action);
			},
			openAddCourseModal: function () {
				BudgetReducers.reduce({
					type: ActionTypes.OPEN_ADD_COURSE_MODAL,
					payload: {}
				});
			},
			closeBudgetConfigModal: function() {
				BudgetReducers.reduce({
					type: ActionTypes.CLOSE_BUDGET_CONFIG_MODAL,
					payload: {}
				});
			},
			openBudgetConfigModal: function() {
				BudgetReducers.reduce({
					type: ActionTypes.OPEN_BUDGET_CONFIG_MODAL,
					payload: {}
				});
			},
			toggleAddBudgetScenarioModal: function() {
				var action = {
					type: ActionTypes.TOGGLE_ADD_BUDGET_SCENARIO_MODAL,
					payload: {}
				};
	
				BudgetReducers.reduce(action);
			},
			openAddCourseCommentsModal: function(sectionGroupCost) {
				var action = {
					type: ActionTypes.OPEN_ADD_COURSE_COMMENT_MODAL,
					payload: {
						sectionGroupCost: sectionGroupCost
					}
				};
	
				BudgetReducers.reduce(action);
			},
			openAddLineItemCommentsModal: function(lineItem) {
				var action = {
					type: ActionTypes.OPEN_ADD_LINE_ITEM_COMMENT_MODAL,
					payload: {
						lineItem: lineItem
					}
				};
	
				BudgetReducers.reduce(action);
			},
			closeAddCourseCommentsModal: function() {
				var action = {
					type: ActionTypes.OPEN_ADD_COURSE_COMMENT_MODAL,
					payload: {}
				};
	
				BudgetReducers.reduce(action);
			},
			selectBudgetScenario: function(selectedScenarioId) {
				// If scenarioId was not provided, attempt to use currently selected scenario
				if (selectedScenarioId == null) {
					selectedScenarioId = angular.copy(BudgetReducers._state.ui.selectedBudgetScenarioId);
	
					// If a scenario was not already selected, default to first scenario
					if (selectedScenarioId == null) {
						selectedScenarioId = BudgetReducers._state.budgetScenarios.ids[0];
					}
				}
	
				localStorage.setItem('selectedBudgetScenarioId', selectedScenarioId);
	
				var action = {
					type: ActionTypes.SELECT_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: selectedScenarioId
					}
				};
	
				BudgetReducers.reduce(action);
				BudgetCalculations.calculateScenarioTerms();
				BudgetCalculations.calculateLineItems();
				ScheduleCostCalculations.calculateScheduleCosts();
				BudgetCalculations.calculateSectionGroups();
				BudgetCalculations.calculateTotalCost();
				BudgetCalculations.calculateCourseList();
			},
			selectTerm: function(termTab) {
				BudgetReducers.reduce({
					type: ActionTypes.SELECT_TERM,
					payload: {
						term: TermService.getTermFromDescription(termTab),
						activeTermTab: termTab
					}
				});

				BudgetCalculations.calculateCourseList();
			},
			selectFundsNav: function(tab) {
				BudgetReducers.reduce({
					type: ActionTypes.SELECT_FUNDS_NAV,
					payload: {
						activeTab: tab
					}
				});
			},
			toggleSelectLineItem: function(lineItem) {
				BudgetReducers.reduce({
					type: ActionTypes.TOGGLE_SELECT_LINE_ITEM,
					payload: {
						lineItem: lineItem
					}
				});
			},
			selectAllLineItems: function(lineItems) {
				BudgetReducers.reduce({
					type: ActionTypes.SELECT_ALL_LINE_ITEMS,
					payload: {
						lineItems: lineItems
					}
				});
			},
			deselectAllLineItems: function() {
				BudgetReducers.reduce({
					type: ActionTypes.DESELECT_ALL_LINE_ITEMS,
					payload: {}
				});
			},
			deleteLineItems: function(budgetScenario, lineItemIds) {
				var self = this;
	
				BudgetService.deleteLineItems(budgetScenario, lineItemIds).then(function (results) {
					$rootScope.$emit('toast', { message: "Deleted line items", type: "SUCCESS" });
					BudgetReducers.reduce({
						type: ActionTypes.DELETE_LINE_ITEMS,
						payload: {
							lineItemIds: lineItemIds
						}
					});
					BudgetCalculations.calculateLineItems();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete line items.", type: "ERROR" });
				});
			},
			toggleLineItemFilter: function(filter) {
				var actionType = null;
	
				if (filter.type == "showHidden") {
					actionType = ActionTypes.TOGGLE_FILTER_LINE_ITEM_SHOW_HIDDEN;
				}
	
				// No matching filter found
				if (actionType == null) { return; }
	
				BudgetReducers.reduce({
					type: actionType,
					payload: {}
				});
	
				BudgetCalculations.calculateLineItems();
				BudgetCalculations.calculateTotalCost();
			},
			toggleCourseListFilter: function(filter) {
				var actionType = null;

				if (filter.type == "showHidden") {
					actionType = ActionTypes.TOGGLE_FILTER_SHOW_HIDDEN_COURSES;
				}

				// No matching filter found
				if (actionType == null) { return; }

				BudgetReducers.reduce({
					type: actionType,
					payload: {}
				});

				BudgetCalculations.calculateCourseList();
			},
			attachInstructorTypesToInstructors: function () {
				var self = this;
				var activeInstructors = BudgetReducers._state.activeInstructors;
				var assignedInstructors = BudgetReducers._state.assignedInstructors;

				activeInstructors.ids.forEach(function(instructorId) {
					var instructor = activeInstructors.list[instructorId];
					var instructorType = self._getInstructorType(instructor);

					instructor.instructorTypeDescription = instructorType ? instructorType.description : null;
					instructor.instructorType = instructorType;
				});

				assignedInstructors.ids.forEach(function(instructorId) {
					var instructor = assignedInstructors.list[instructorId];
					var instructorType = self._getInstructorType(instructor);

					instructor.instructorTypeDescription = instructorType ? instructorType.description : null;
					instructor.instructorType = instructorType;
				});
			},
			_getInstructorType: function(instructor) {
				var users = BudgetReducers._state.users;
				var userRoles = BudgetReducers._state.userRoles;
				var instructorTypes = BudgetReducers._state.instructorTypes;

				var user = users.byLoginId[instructor.loginId.toLowerCase()];
				var userRoleId = userRoles.ids.find(id => (userRoles.list[id].roleId == Roles.instructor && userRoles.list[id].userId == user.id));

				if (!userRoleId) { return null; }

				var userRole = userRoles.list[userRoleId];
				var instructorType = instructorTypes.list[userRole.instructorTypeId];

				return instructorType;
			}
		};
	}
}

BudgetActions.$inject = ['$rootScope', '$window', '$route', 'BudgetService', 'BudgetReducers', 'TermService', 'BudgetCalculations', 'ActionTypes', 'Roles', 'ScheduleCostCalculations'];

export default BudgetActions;