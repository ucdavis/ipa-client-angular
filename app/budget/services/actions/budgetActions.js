class BudgetActions {
	constructor ($rootScope, $window, $route, BudgetService, BudgetReducers, TermService, BudgetCalculations, ActionTypes, Roles, ScheduleCostCalculations, UserService, BudgetExcelService, DwService) {
		return {
			getInitialState: function () {
				var self = this;
				var selectedBudgets = JSON.parse(localStorage.getItem('selectedBudgets')) || {};
				var selectedTerm = localStorage.getItem('selectedTerm');
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var selectedBudgetScenarioId = selectedBudgets[year];

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
							results.budgetScenarios.forEach(function(budgetScenario) {
								if (budgetScenario.fromLiveData) {
									selectedBudgetScenarioId = budgetScenario.id;
								}
							});

							selectedBudgetScenarioId = parseInt(results.budgetScenarios[0].id);
							selectedBudgets[year] = selectedBudgetScenarioId;
							localStorage.setItem('selectedBudgets', JSON.stringify(selectedBudgets));
						}
					}

					var sectionGroupCosts = results.sectionGroupCosts;
					var terms = ["05", "07", "10", "01", "03"]; // TODO: get terms from selectedBudgetScenario?

					var subjectCode = results.courses[0].subjectCode;
					var termCodes = terms.map(function(term) {
						if (term == "01" || term == "03") {
							return (parseInt(year) + 1) + term;
						}
						return year + term;
					});

					termCodes.forEach(function(termCode) {
						DwService.getDwCensusData(subjectCode, null, termCode).then(function(census) {
							// match courseNumber and TermCode and inject currentEnrollment number
							census.forEach(function(courseCensus) {
								sectionGroupCosts.forEach(function(sectionGroupCost) {
									if (sectionGroupCost.courseNumber == courseCensus.courseNumber && sectionGroupCost.termCode == courseCensus.termCode && sectionGroupCost.sequencePattern == courseCensus.sequenceNumber) {
										sectionGroupCost.currentEnrollment = courseCensus.currentEnrolledCount;

										console.log(sectionGroupCost);
									}
								});
							});

							console.table(sectionGroupCosts);
						}).catch(function(e) {
							// handle error
						});
					});


							// debugger;

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
					self.selectBudgetScenario(selectedBudgetScenarioId);

					// Perform follow up calculations
					BudgetCalculations.calculateInstructors();
					BudgetCalculations.calculateLineItems();
					BudgetCalculations.calculateInstructorTypeCosts();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load initial budget state.", type: "ERROR" });
				});
			},
			updateBudgetScenario: function (budgetScenario) {
				BudgetService.updateBudgetScenario(budgetScenario).then(function (results) {
					window.ipa_analyze_event('budget', 'budget scenario updated');

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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update budget scenario.", type: "ERROR" });
				});
			},
			createBudgetScenario: function (newBudgetScenario, budgetId, scenarioId) {
				var self = this;
				if (scenarioId == null) { scenarioId = 0;}
	
				BudgetService.createBudgetScenario(newBudgetScenario, budgetId, scenarioId).then(function (results) {
					window.ipa_analyze_event('budget', 'budget scenario created');

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

				}, function () {
					$rootScope.$emit('toast', { message: "Could not create budget scenario.", type: "ERROR" });
				});
			},
			deleteBudgetScenario: function (budgetScenarioId) {
				var self = this;

				BudgetService.deleteBudgetScenario(budgetScenarioId).then(function (budgetScenarioId) {
					window.ipa_analyze_event('budget', 'budget scenario deleted');

					var action = {
						type: ActionTypes.DELETE_BUDGET_SCENARIO,
						payload: {
							budgetScenarioId: budgetScenarioId
						}
					};

					$rootScope.$emit('toast', { message: "Deleted budget scenario", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					self.selectBudgetScenario();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not delete budget scenario.", type: "ERROR" });
				});
			},
			updateInstructorCost: function (instructorCostDto) {
				var self = this;
				var instructorCost = Object.assign({}, instructorCostDto);

				// Ensure cost is passed as a number
				instructorCost.cost = parseFloat(instructorCost.cost);

				BudgetService.updateInstructorCost(instructorCost).then(function (newInstructorCost) {
					window.ipa_analyze_event('budget', 'instructor cost updated');

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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update instructor cost.", type: "ERROR" });
				});
			},
			createInstructorCost: function (instructorCostDto) {
				var instructorCost = Object.assign({}, instructorCostDto);
	
				// Ensure cost is passed as a number
				instructorCost.cost = parseFloat(instructorCost.cost);
	
				BudgetService.createInstructorCost(instructorCost).then(function (newInstructorCost) {
					window.ipa_analyze_event('budget', 'instructor cost created');

					var action = {
						type: ActionTypes.CREATE_INSTRUCTOR_COST,
						payload: {
							instructorCost: newInstructorCost
						}
					};
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateInstructorTypeCosts();
					BudgetCalculations.calculateInstructors();
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					$rootScope.$emit('toast', { message: "Updated instructor cost", type: "SUCCESS" });
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update instructor cost.", type: "ERROR" });
				});
			},
			createLineItem: function (newLineItem, budgetScenarioId, message) {
				var self = this;
				// Ensure amount is properly formatted as a float
				newLineItem.amount = newLineItem.amount ? parseFloat(newLineItem.amount) : null;
	
				BudgetService.createLineItem(newLineItem, budgetScenarioId).then(function (newLineItem) {
					window.ipa_analyze_event('budget', 'line item created');

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
				}, function () {
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
					window.ipa_analyze_event('budget', 'line item updated');

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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not save line item.", type: "ERROR" });
				});
			},
			deleteLineItem: function(lineItem) {
				// If the lineItem is based on a teachingAssignment, do not delete it, instead mark it as hidden
				if (lineItem.teachingAssignmentId > 0) {
					lineItem.hidden = true;
					this.updateLineItem(lineItem);
					return;
				}

				BudgetService.deleteLineItem(lineItem).then(function (lineItemId) {
					window.ipa_analyze_event('budget', 'line item deleted');

					var action = {
						type: ActionTypes.DELETE_LINE_ITEM,
						payload: {
							lineItemId: lineItemId
						}
					};

					$rootScope.$emit('toast', { message: "Deleted line item", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateLineItems();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not delete line item.", type: "ERROR" });
				});
			},

			/**
			 * Updates existing sectionGroupCost. Happens when TA count, reader count,
			 * instructor assignment, cost override, etc. are touched.
			 * 
			 * @param {*} sectionGroupCost 
			 */
			updateSectionGroupCost: function (sectionGroupCost) {
				BudgetService.updateSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
					window.ipa_analyze_event('budget', 'section group cost updated');

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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
				});
			},
			createSectionGroupCost: function (sectionGroupCost) {
				let term = BudgetReducers._state.ui.termNav.activeTerm;
				let year = BudgetReducers._state.ui.year;

				// When SectionGroupCost is not associated with a scheduled course, it will already have its effectiveTermCode
				if (!sectionGroupCost.effectiveTermCode) {
					var sectionGroup = BudgetReducers._state.sectionGroups.list[sectionGroupCost.sectionGroupId];
					var course = BudgetReducers._state.courses.list[sectionGroup.courseId];
					sectionGroupCost.effectiveTermCode = course.effectiveTermCode;
					sectionGroupCost.unitsHigh = course.unitsHigh;
					sectionGroupCost.unitsLow = course.unitsLow;
					sectionGroupCost.taCount = sectionGroup.teachingAssistantAppointments;
					sectionGroupCost.readerCount = sectionGroup.readerAppointments;
				}

				sectionGroupCost.termCode = TermService.termToTermCode(term, year);
				sectionGroupCost.budgetScenarioId = BudgetReducers._state.ui.selectedBudgetScenarioId;

				BudgetService.createSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
					window.ipa_analyze_event('budget', 'section group cost created');

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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not add course.", type: "ERROR" });
				});
			},
			asignInstructorType: function(instructorCost) {
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
				}, function () {
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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update instructor type.", type: "ERROR" });
				});
			},
			_updateInstructorTypeCost: function (newInstructorTypeCost) {
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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update instructor type.", type: "ERROR" });
				});
			},
			updateBudget: function (budget) {
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
				}, function () {
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
					}, function () {
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
					}, function () {
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
					}, function () {
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
				}, function () {
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
					}, function () {
						$rootScope.$emit('toast', { message: "Could not save line item.", type: "ERROR" });
					});
				} else {
					self._createLineItemComment(comment, lineItem, currentUserLoginId);
				}
			},
			_createLineItemComment: function (comment, lineItem, currentUserLoginId) {
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
				}, function () {
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
				var fromLiveData = false;

				// If scenarioId was not provided, attempt to use currently selected scenario
				if (selectedScenarioId == null) {

					BudgetReducers._state.budgetScenarios.ids.forEach(function(budgetScenarioId) {
						var budgetScenario = BudgetReducers._state.budgetScenarios.list[budgetScenarioId];

						if (budgetScenario.fromLiveData) {
							selectedScenarioId = budgetScenario.id;
							fromLiveData = true;
						}
					});
				} else {
					var budgetScenario = BudgetReducers._state.budgetScenarios.list[selectedScenarioId];
					fromLiveData = budgetScenario.fromLiveData;
				}

				var year = BudgetReducers._state.ui.year;
				var selectedBudgets = JSON.parse(localStorage.getItem('selectedBudgets')) || {};
				selectedBudgets[year] = selectedScenarioId;
				localStorage.setItem('selectedBudgets', JSON.stringify(selectedBudgets));

				var action = {
					type: ActionTypes.SELECT_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: selectedScenarioId,
						fromLiveData: fromLiveData
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
				BudgetService.deleteLineItems(budgetScenario, lineItemIds).then(function () {
					$rootScope.$emit('toast', { message: "Deleted line items", type: "SUCCESS" });
					BudgetReducers.reduce({
						type: ActionTypes.DELETE_LINE_ITEMS,
						payload: {
							lineItemIds: lineItemIds
						}
					});
					BudgetCalculations.calculateLineItems();
				}, function () {
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
			downloadBudgetExcel: function(viewState) {
				BudgetExcelService.generateDownload(viewState);
			},
			_getInstructorType: function(instructor) {
				var users = BudgetReducers._state.users;
				var userRoles = BudgetReducers._state.userRoles;
				var instructorTypes = BudgetReducers._state.instructorTypes;

				var user = UserService.getUserByInstructor(instructor, users);

        if (!user) { return null; }

				var userRoleId = userRoles.ids.find(id => (userRoles.list[id].roleId == Roles.instructor && userRoles.list[id].userId == user.id));

				if (!userRoleId) { return null; }

				var userRole = userRoles.list[userRoleId];
				var instructorType = instructorTypes.list[userRole.instructorTypeId];

				return instructorType;
			},
			updateCourseTag: function (tag) {
				var tags = BudgetReducers._state.ui.filters.tags;

				tags.forEach(function(slotTag) {
					if (slotTag.id == tag.id) {
						slotTag.selected = tag.selected;
					}
				});

				BudgetReducers.reduce({
					type: ActionTypes.UPDATE_COURSE_TAGS,
					payload: {
						tags: tags
					}
				});
				BudgetCalculations.calculateSectionGroups();
			}
		};
	}
}

BudgetActions.$inject = ['$rootScope', '$window', '$route', 'BudgetService', 'BudgetReducers', 'TermService', 'BudgetCalculations', 'ActionTypes', 'Roles', 'ScheduleCostCalculations', 'UserService', 'BudgetExcelService', 'DwService'];

export default BudgetActions;