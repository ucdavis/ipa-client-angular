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
				var activeTab = localStorage.getItem('activeTab');

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
						} else {
							selectedBudgetScenarioId = parseInt(results.budgetScenarios[0].id);
						}

						selectedBudgets[year] = selectedBudgetScenarioId;
						localStorage.setItem('selectedBudgets', JSON.stringify(selectedBudgets));
					}

					if (results.sectionGroupCosts.length > 0) {
						let budgetScenario = results.budgetScenarios.find(scenario => scenario.id === selectedBudgetScenarioId);
						var sectionGroupCosts = results.sectionGroupCosts;
						let activeTerms = budgetScenario.terms;
						let scenarioSubjectCodes = [...new Set(results.sectionGroupCosts.map(sgc => sgc.subjectCode))];

						let activeTermCodes = activeTerms.map(function(term) {
							return TermService.termToTermCode(term, year);
						});

						scenarioSubjectCodes.forEach(function(subjectCode) {
							activeTermCodes.forEach(function(termCode) {
								DwService.getDwCensusData(subjectCode, null, termCode).then(function(censuses) {
									// match courseNumber and TermCode and inject currentEnrollment number
									censuses.forEach(function(courseCensus) {
										sectionGroupCosts.forEach(function(sectionGroupCost) {
											const censusSequencePattern = isNaN(Number(courseCensus.sequenceNumber)) ? courseCensus.sequenceNumber.charAt(0) : courseCensus.sequenceNumber;
											const sectionGroupCostKey = `${sectionGroupCost.subjectCode}-${sectionGroupCost.courseNumber}-${sectionGroupCost.termCode}-${sectionGroupCost.sequencePattern}`;
											const courseCensusKey = `${courseCensus.subjectCode}-${courseCensus.courseNumber}-${courseCensus.termCode}-${censusSequencePattern}`;

											if (sectionGroupCostKey === courseCensusKey) {
												sectionGroupCost.currentEnrollment ?
													(sectionGroupCost.currentEnrollment += courseCensus.currentEnrolledCount) :
													sectionGroupCost.currentEnrollment = courseCensus.currentEnrolledCount;
											}
										});
									});
								}, function() {
									$rootScope.$emit('toast', { message: "Could not load enrollment data.", type: "ERROR" });
								});
							});
						});
					}

					// Generate department subject codes and account numbers for use as filters
					var subjectCodeFilters = [];
					results.courses.forEach(function(course) {
						if (!subjectCodeFilters.includes(course.subjectCode)) {
							subjectCodeFilters.push(course.subjectCode);
						}
					});

					var accountNumberFilters = [];
					results.lineItems.forEach(function(lineItem) {
						if (lineItem.accountNumber && !accountNumberFilters.includes(lineItem.accountNumber)) {
							accountNumberFilters.push(lineItem.accountNumber);
						}
					});

					BudgetReducers.reduce({
						type: ActionTypes.INIT_STATE,
						payload: results,
						year: year,
						workgroupId: workgroupId,
						selectedBudgetScenarioId: selectedBudgetScenarioId,
						selectedTerm: selectedTerm,
						activeTab: activeTab,
						filters: {subjectCodes: subjectCodeFilters, accountNumbers: accountNumberFilters}
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
			syncBudgetScenario: function () {
				const scenarioTrackedChanges = BudgetReducers._state.calculatedScheduleCosts.trackedChanges;
				const scenarioSectionGroupCosts = BudgetReducers._state.calculatedScheduleCosts.sectionGroupCosts;

				scenarioSectionGroupCosts.forEach( sectionGroupCost => {
					if (sectionGroupCost.sectionGroup){
						var sectionGroupCostInstructors = (BudgetReducers._state.sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCost.id] || []);
						var currentInstructorIds = sectionGroupCostInstructors.map(function(instructor){
							return instructor.instructorId;
						});

						var currentTypeIdsCount = {};
						for (var sectionGroupCostInstructor of sectionGroupCostInstructors){
							if (!sectionGroupCostInstructor.instructorId){
								if (currentTypeIdsCount[sectionGroupCostInstructor.instructorTypeId]){
									currentTypeIdsCount[sectionGroupCostInstructor.instructorTypeId] += 1;
								} else {
									currentTypeIdsCount[sectionGroupCostInstructor.instructorTypeId] = 1;
								}
							}
						}

						const instructors = sectionGroupCost.sectionGroup.assignedInstructors.map(function(liveDataInstructor){
							return {
								instructorId: liveDataInstructor.id,
								instructorTypeId: liveDataInstructor.instructorTypeId,
								sectionGroupCostId: sectionGroupCost.id
							};
						}).filter(instructor => (!currentInstructorIds.includes(instructor.instructorId) && (instructor.instructorId ? true : !currentTypeIdsCount[instructor.instructorTypeId] || currentTypeIdsCount[instructor.instructorTypeId]-- < 1)));
						if (instructors.length > 0){
							this.createSectionGroupCostInstructors(instructors);
						}
					}
				});

				scenarioTrackedChanges.forEach(change => {
					let sectionGroupCost = scenarioSectionGroupCosts.find(sectionGroupCost => change.sectionGroupCostId === sectionGroupCost.id);
					let originalSectionGroupCost = JSON.parse(JSON.stringify(sectionGroupCost)); // to revert in case of failure

					switch (change.action) {
						case "syncInstructor":
							sectionGroupCost.instructorId = sectionGroupCost.sectionGroup.assignedInstructor ? sectionGroupCost.sectionGroup.assignedInstructor.id : null;
							sectionGroupCost.instructorTypeId = sectionGroupCost.sectionGroup.assignedInstructorType ? sectionGroupCost.sectionGroup.assignedInstructorType.id : null;
							break;
						case "syncEnrollment":
							sectionGroupCost.enrollment = sectionGroupCost.sectionGroup.totalSeats;
							break;
						case "syncSectionCount":
							sectionGroupCost.sectionCount = sectionGroupCost.sectionGroup.sectionCount;
							break;
						case "syncTaCount":
							sectionGroupCost.taCount = sectionGroupCost.sectionGroup.teachingAssistantAppointments;
							break;
						case "syncReaderCount":
							sectionGroupCost.readerCount = sectionGroupCost.sectionGroup.readerAppointments;
							break;
						default:
							return;
					}

					BudgetService.updateSectionGroupCost(sectionGroupCost).then(function (newSectionGroupCost) {
						BudgetReducers.reduce({
							type: ActionTypes.UPDATE_SECTION_GROUP_COST,
							payload: {
								sectionGroupCost: newSectionGroupCost
							}
						});

						BudgetCalculations.calculateSectionGroups();
						BudgetCalculations.calculateTotalCost();
						BudgetCalculations.calculateCourseList();

						$rootScope.$emit('toast', { message: "Updated course(s)", type: "SUCCESS" });
					}, function() {
						BudgetReducers.reduce({
							type: ActionTypes.UPDATE_SECTION_GROUP_COST,
							payload: {
								sectionGroupCost: originalSectionGroupCost
							}
						});

						BudgetReducers.reduce({
							type: ActionTypes.UPDATE_SYNC_STATUS,
							payload: {
								updateFailure: change
							}
						});

						BudgetCalculations.calculateSectionGroups();
						BudgetCalculations.calculateTotalCost();
						BudgetCalculations.calculateCourseList();

						$rootScope.$emit('toast', { message: "Could not update course(s)", type: "ERROR" });
					});
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
			createBudgetRequestScenario: function (selectedBudgetScenario) {
				let self = this;
				BudgetService.createBudgetRequestScenario(selectedBudgetScenario).then(
					function (results) {
						window.ipa_analyze_event('budget', 'budget request scenario created');

						let action = {
							type: ActionTypes.CREATE_BUDGET_SCENARIO,
							payload: results
						};

						$rootScope.$emit('toast', { message: "Created budget request", type: "SUCCESS" });
						BudgetReducers.reduce(action);
						self.selectBudgetScenario(results.budgetScenario.id);
						self.attachInstructorTypesToInstructors();

						// Perform follow up calculations
						BudgetCalculations.calculateInstructors();
						BudgetCalculations.calculateLineItems();
						BudgetCalculations.calculateInstructorTypeCosts();

				}, function () {
					$rootScope.$emit('toast', { message: "Could not create budget request.", type: "ERROR" });
				});
			},
			approveBudgetRequestScenario: function (selectedBudgetScenario) {
				let self = this;
				BudgetService.approveBudgetRequestScenario(selectedBudgetScenario).then(
					function (response) {
						let action = {
							type: ActionTypes.APPROVE_BUDGET_REQUEST,
							payload: response
						};

						$rootScope.$emit('toast', { message: "Approved budget request", type: "SUCCESS" });
						BudgetReducers.reduce(action);
						self.selectBudgetScenario(response.id);
						self.attachInstructorTypesToInstructors();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not approve budget request.", type: "ERROR" });
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
				newLineItem.termCode = newLineItem.termCode ? TermService.termToTermCode(newLineItem.termCode, BudgetReducers._state.ui.year) : null;

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
				lineItem.termCode = lineItem.termCode ? TermService.termToTermCode(lineItem.termCode, BudgetReducers._state.ui.year) : null;

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
					BudgetCalculations.calculateTotalCost();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not delete line item.", type: "ERROR" });
				});
			},
			createExpenseItem: function (newExpenseItem, budgetScenarioId, message) {
				var self = this;
				var year = BudgetReducers._state.ui.year;
				// Ensure amount is properly formatted as a float
				newExpenseItem.amount = newExpenseItem.amount ? parseFloat(newExpenseItem.amount) : null;
				// Append proper year to term
				newExpenseItem.termCode = newExpenseItem.termCode ? TermService.termToTermCode(newExpenseItem.termCode, year) : null;

				BudgetService.createExpenseItem(newExpenseItem, budgetScenarioId).then(function (newExpenseItem) {
					window.ipa_analyze_event('budget', 'expense item');

					var action = {
						type: ActionTypes.CREATE_EXPENSE_ITEM,
						payload: newExpenseItem
					};
					$rootScope.$emit('toast', { message: message || "Created expense", type: "SUCCESS" });
					BudgetReducers.reduce(action);

					// Close modal
					self.closeAddExpenseItemModal();
					BudgetCalculations.calculateTotalCost();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not create expense.", type: "ERROR" });
				});
			},
			updateExpenseItem: function (expenseItem) {
				var self = this;

				// Create instead of update if appropriate
				if (expenseItem.id == null || expenseItem.id == 0) {
					this.createExpenseItem(expenseItem, expenseItem.budgetScenarioId);
					return;
				}

				var year = BudgetReducers._state.ui.year;
				// Ensure amount is properly formatted as a float
				expenseItem.amount = expenseItem.amount ? parseFloat(expenseItem.amount) : null;
				// Append proper year to term if needed
				if (expenseItem.termCode && expenseItem.termCode.length < 6) {
					expenseItem.termCode = TermService.termToTermCode(expenseItem.termCode, year);
				}


				BudgetService.updateExpenseItem(expenseItem, expenseItem.budgetScenarioId).then(function (results) {
					window.ipa_analyze_event('budget', 'expense item');

					var action = {
						type: ActionTypes.UPDATE_EXPENSE_ITEM,
						payload: results
					};
					$rootScope.$emit('toast', { message: "Saved expense", type: "SUCCESS" });
					BudgetReducers.reduce(action);

					// Close modal
					self.closeAddExpenseItemModal();
					BudgetCalculations.calculateTotalCost();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not save expense.", type: "ERROR" });
				});
			},
			deleteExpenseItem: function(expenseItem) {
				// If the expenseItem is based on a teachingAssignment, do not delete it, instead mark it as hidden
				if (expenseItem.teachingAssignmentId > 0) {
					expenseItem.hidden = true;
					this.updateExpenseItem(expenseItem);
					return;
				}

				BudgetService.deleteExpenseItem(expenseItem).then(function (expenseItemId) {
					window.ipa_analyze_event('budget', 'expense deleted');

					var action = {
						type: ActionTypes.DELETE_EXPENSE_ITEM,
						payload: {
							expenseItemId: expenseItemId
						}
					};

					$rootScope.$emit('toast', { message: "Deleted expense", type: "SUCCESS" });
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateTotalCost();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not delete expense.", type: "ERROR" });
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
			createSectionGroupCostInstructors: function (sectionGroupCostInstructors, isLiveData) {
				var sectionGroupCostId = sectionGroupCostInstructors[0].sectionGroupCostId;
				BudgetService.createSectionGroupCostInstructors(sectionGroupCostId, sectionGroupCostInstructors).then(function (newSectionGroupCostInstructors) {
					var action = {
						type: ActionTypes.CREATE_SECTION_GROUP_COST_INSTRUCTOR,
						payload: {
							sectionGroupCostInstructors: newSectionGroupCostInstructors
						}
					};
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					ScheduleCostCalculations.calculateScheduleCosts();
					var instructorMsg = sectionGroupCostInstructors.length > 1 ? 'instructors' : 'instructor';
					if (isLiveData){
						$rootScope.$emit('toast', { message: `Updated additional ${instructorMsg}.`, type: "SUCCESS" });
					} else {
						$rootScope.$emit('toast', { message: `Created additional ${instructorMsg}.`, type: "SUCCESS" });
					}
				}, function () {
					var instructorMsg = sectionGroupCostInstructors.length > 1 ? 'instructors' : 'instructor';
					if (isLiveData){
						$rootScope.$emit('toast', { message: `Failed to update additional ${instructorMsg}.`, type: "ERROR" });
					} else {
						$rootScope.$emit('toast', { message: `Failed to create additional ${instructorMsg}.`, type: "ERROR" });
					}
				});
			},
			updateSectionGroupCostInstructor: function (sectionGroupCostInstructor) {
				BudgetService.updateSectionGroupCostInstructor(sectionGroupCostInstructor.sectionGroupCostId, sectionGroupCostInstructor).then(function (newSectionGroupCostInstructor) {
					var action = {
						type: ActionTypes.UPDATE_SECTION_GROUP_COST_INSTRUCTOR,
						payload: {
							sectionGroupCostInstructor: newSectionGroupCostInstructor
						}
					};
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					ScheduleCostCalculations.calculateScheduleCosts();
					$rootScope.$emit('toast', { message: "Updated instructor cost.", type: "SUCCESS" });
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update instructor cost.", type: "ERROR" });
				});
			},
			deleteSectionGroupCostInstructor: function (sectionGroupCostInstructor){
				BudgetService.deleteSectionGroupCostInstructor(sectionGroupCostInstructor).then(function (removedSectionGroupCostInstructorId) {
					var action = {
						type: ActionTypes.DELETE_SECTION_GROUP_COST_INSTRUCTOR,
						payload: {
							removedSectionGroupCostInstructorId: removedSectionGroupCostInstructorId,
							sectionGroupCostId: sectionGroupCostInstructor.sectionGroupCostId
						}
					};
					BudgetReducers.reduce(action);
					BudgetCalculations.calculateSectionGroups();
					BudgetCalculations.calculateTotalCost();
					ScheduleCostCalculations.calculateScheduleCosts();
					$rootScope.$emit('toast', { message: "Deleted instructor.", type: "SUCCESS" });
				}, function () {
					$rootScope.$emit('toast', { message: "Could not delete instructor.", type: "ERROR" });
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
			closeAddExpenseItemModal: function() {
				var action = {
					type: ActionTypes.CLOSE_ADD_EXPENSE_ITEM_MODAL,
					payload: {}
				};

				BudgetReducers.reduce(action);
			},
			openAddExpenseItemModal: function(expenseItemToEdit) {
				var action = {
					type: ActionTypes.OPEN_ADD_EXPENSE_ITEM_MODAL,
					payload: {
						expenseItemToEdit: expenseItemToEdit
					}
				};
				BudgetReducers.reduce(action);
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
			toggleBudgetScenarioModal: function() {
				var action = {
					type: ActionTypes.TOGGLE_DOWNLOAD_BUDGET_SCENARIOS,
					payload: {}
				};

				BudgetReducers.reduce(action);
			},
			selectBudgetScenario: function(selectedScenarioId) {
				var fromLiveData = false;
				let isBudgetRequest = false;
				let isApproved = false;

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
					isBudgetRequest = budgetScenario.isBudgetRequest;
					isApproved = budgetScenario.isApproved;
				}

				var year = BudgetReducers._state.ui.year;
				var selectedBudgets = JSON.parse(localStorage.getItem('selectedBudgets')) || {};
				selectedBudgets[year] = selectedScenarioId;
				localStorage.setItem('selectedBudgets', JSON.stringify(selectedBudgets));

				var action = {
					type: ActionTypes.SELECT_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: selectedScenarioId,
						fromLiveData: fromLiveData,
						isBudgetRequest: isBudgetRequest,
						isApproved: isApproved
					}
				};

				BudgetReducers.reduce(action);
				BudgetCalculations.calculateScenarioTerms();
				BudgetCalculations.calculateInstructors();
				BudgetCalculations.calculateLineItems();
				BudgetCalculations.calculateInstructorTypeCosts();
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
			toggleSelectExpenseItem: function(expenseItem) {
				BudgetReducers.reduce({
					type: ActionTypes.TOGGLE_SELECT_EXPENSE_ITEM,
					payload: {
						expenseItem: expenseItem
					}
				});
			},
			selectAllExpenseItems: function(expenseItems) {
				BudgetReducers.reduce({
					type: ActionTypes.SELECT_ALL_EXPENSE_ITEMS,
					payload: {
						expenseItems: expenseItems
					}
				});
			},
			deselectAllExpenseItems: function() {
				BudgetReducers.reduce({
					type: ActionTypes.DESELECT_ALL_EXPENSE_ITEMS,
					payload: {}
				});
			},
			deleteExpenses: function(budgetScenario, expenseItemIds) {
				BudgetService.deleteExpenseItems(budgetScenario, expenseItemIds).then(function () {
					$rootScope.$emit('toast', { message: "Deleted expense items", type: "SUCCESS" });
					BudgetReducers.reduce({
						type: ActionTypes.DELETE_EXPENSE_ITEMS,
						payload: {
							expenseItemIds: expenseItemIds
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not delete expense items.", type: "ERROR" });
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
			lockLineItem: function(lineItem) {
				const lockedLineItem = {...lineItem, isLocked: true};
				
				BudgetService.updateLineItem(lockedLineItem, lineItem.budgetScenarioId).then(function (results) {
					$rootScope.$emit('toast', { message: "Locked line item", type: "SUCCESS" });
					BudgetReducers.reduce({
						type: ActionTypes.UPDATE_LINE_ITEM,
						payload: results
					});
					BudgetCalculations.calculateLineItems();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not lock line item.", type: "ERROR" });
				});
			},
			lockLineItems: function(budgetScenario, lineItemIds) {
				BudgetService.updateLineItems(budgetScenario, lineItemIds).then(function (results) {
					$rootScope.$emit('toast', { message: "Locked line items", type: "SUCCESS" });
					BudgetReducers.reduce({
						type: ActionTypes.UPDATE_LINE_ITEMS,
						payload: results
					});
					BudgetCalculations.calculateLineItems();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not lock line items.", type: "ERROR" });
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
			updateFilter: function (filter) {
				var filters = BudgetReducers._state.ui.filters.list;

				if (filter.id == null) {
					// not a tag
					var selectedFilter = filters.find(function(slotFilter) {
						return slotFilter.description == filter.description;
					});

					selectedFilter.selected = filter.selected;
				} else {
					filters.forEach(function(slotFilter) {
						if (slotFilter.id == filter.id) {
							slotFilter.selected = filter.selected;
						}
					});
				}

				BudgetReducers.reduce({
					type: ActionTypes.UPDATE_FILTERS,
					payload: {
						filters: filters
					}
				});
				BudgetCalculations.calculateLineItems();
				BudgetCalculations.calculateSectionGroups();
			}
		};
	}
}

BudgetActions.$inject = ['$rootScope', '$window', '$route', 'BudgetService', 'BudgetReducers', 'TermService', 'BudgetCalculations', 'ActionTypes', 'Roles', 'ScheduleCostCalculations', 'UserService', 'BudgetExcelService', 'DwService'];

export default BudgetActions;
