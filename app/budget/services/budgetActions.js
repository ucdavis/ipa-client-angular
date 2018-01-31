budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers, termService) {
	return {
		getInitialState: function (workgroupId, year, selectedBudgetScenarioId, selectedTerm) {
			var self = this;

			budgetService.getInitialState(workgroupId, year).then(function (results) {
				// Set a default active budget scenario if one was not set in local storage
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
				self.calculateSelectedScenario();
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
				self.calculateScenarioTerms();
				self.calculateSectionGroups();
				self.calculateScenarioLineItems();
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
				self.calculateSelectedScenario();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete budget scenario.", type: "ERROR" });
			});
		},
		updateInstructorCost: function (instructorCostDto) {
			var self = this;
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
				self.calculateSectionGroups();
				self.calculateTotalCost();
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
				self.calculateScenarioLineItems();
				self.calculateTotalCost();
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
				self.calculateScenarioLineItems();
				self.calculateTotalCost();
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
				self.calculateScenarioLineItems();
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
				self.calculateSectionGroups();
				self.calculateTotalCost();
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
				self.calculateSectionGroups();
				self.calculateTotalCost();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
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
				self.calculateSectionGroups();
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
				self.calculateScenarioLineItems();
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
		selectBudgetScenario: function(budgetScenarioId) {
			localStorage.setItem('selectedBudgetScenarioId', budgetScenarioId);

			var action = {
				type: SELECT_BUDGET_SCENARIO,
				payload: {
					budgetScenarioId: budgetScenarioId
				}
			};

			budgetReducers.reduce(action);
			this.calculateScenarioTerms();
			this.calculateScenarioLineItems();
			this.calculateSectionGroups();
			this.calculateTotalCost();
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
				self.calculateScenarioLineItems();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not delete line items.", type: "ERROR" });
			});
		},
		calculateSelectedScenario: function() {
			var selectedScenarioId = angular.copy(budgetReducers._state.ui.selectedBudgetScenarioId);

			// If a scenario is not already selected, default to first scenario
			if (selectedScenarioId == false || selectedScenarioId == null || selectedScenarioId == "undefined") {
				selectedScenarioId = budgetReducers._state.budgetScenarios.ids[0];
			}

			this.selectBudgetScenario(selectedScenarioId);
		},
		calculateScenarioTerms: function() {
			var allTermTabs = [];
			var activeTermTab = null;

			var selectedBudgetScenario = budgetReducers._state.budgetScenarios.list[budgetReducers._state.ui.selectedBudgetScenarioId];

			selectedBudgetScenario.terms.forEach(function(term) {
				allTermTabs.push(termService.getShortTermName(term));
				activeTermTab = activeTermTab || termService.getShortTermName(term);
			});

			budgetReducers.reduce({
				type: CALCULATE_SCENARIO_TERMS,
				payload: {
					allTermTabs: allTermTabs,
					activeTermTab: activeTermTab,
					activeTerm: termService.getTermFromDescription(activeTermTab),
					selectedScenarioTerms: selectedBudgetScenario.terms
				}
			});
		},
		calculateScenarioLineItems: function() {
			var selectedBudgetScenario = budgetReducers._state.budgetScenarios.list[budgetReducers._state.ui.selectedBudgetScenarioId];

			// Add lineItems
			selectedBudgetScenario.lineItems = [];

			budgetReducers._state.lineItems.ids.forEach( function (lineItemId) {
				var lineItem = budgetReducers._state.lineItems.list[lineItemId];

				// Ensure lineItem belongs to selected budget scenario
				if (lineItem.budgetScenarioId != selectedBudgetScenario.id) {
					return;
				}

				// Set lineItemComments on lineItems
				lineItem.comments = [];

				budgetReducers._state.lineItemComments.ids.forEach(function(commentId) {
					var comment = budgetReducers._state.lineItemComments.list[commentId];

					if (comment.lineItemId == lineItem.id) {
						lineItem.comments.push(comment);
					}
				});

				// Sort sectionGroupCostComments
				var reverseOrder = true;
				lineItem.comments =_array_sortByProperty(lineItem.comments, "lastModifiedOn", reverseOrder);

				// Add lineItemCategory description
				lineItem.categoryDescription = budgetReducers._state.lineItemCategories.list[lineItem.lineItemCategoryId].description;

				selectedBudgetScenario.lineItems.push(lineItem);

				// Set 'lastModifiedBy'
				// Expected formats are 'system' or 'user:bobsmith'
				// Will convert 'user:bobsmith' to 'Smith, Bob'
				if (lineItem.lastModifiedBy) {
					var split = lineItem.lastModifiedBy.split(":");
					if (split.length > 0 && split[0] == "user") {
						var loginId = split[1];

						budgetReducers._state.users.ids.forEach(function(userId) {
							var user = budgetReducers._state.users.list[userId];
							if (user.loginId == loginId) {
								lineItem.lastModifiedBy = user.firstName + " " + user.lastName;
							}
						});
					}
				}
			});
		},
		calculateSectionGroups: function() {
			var self = this;

			var selectedBudgetScenario = budgetReducers._state.budgetScenarios.list[budgetReducers._state.ui.selectedBudgetScenarioId];
			var sectionGroups = budgetReducers._state.scheduleSectionGroups;
			var activeTerms = selectedBudgetScenario.terms;

			// A 'sectionGroupContainer' contains all sectionGroups for that term/subjectCode/courseNumber
			var calculatedSectionGroups = {
				terms: selectedBudgetScenario.terms,
				byTerm: {}
			};

			activeTerms.forEach(function(term) {
				calculatedSectionGroups.byTerm[term] = [];
			});

			sectionGroups.uniqueKeys.forEach(function(uniqueKey) {
				var sectionGroup = sectionGroups.list[uniqueKey];
				var shortTerm = sectionGroup.termCode.slice(-2);

				// Ensure sectionGroup belongs to an active term in this scenario
				if (selectedBudgetScenario.terms.indexOf(shortTerm) == -1) {
					return;
				}

				self.calculateSectionGroupFinancialCosts(sectionGroup);

				// Find the sectionGroupCost for this sectionGroupCost/Scenario combo
				sectionGroup.sectionGroupCost = null;
				var sectionGroupCostIds = budgetReducers._state.sectionGroupCosts.bySectionGroupId[sectionGroup.id] || [];

				sectionGroupCostIds.forEach(function(sectionGroupCostId) {
					var sectionGroupCost = budgetReducers._state.sectionGroupCosts.list[sectionGroupCostId];

					if (sectionGroupCost.budgetScenarioId == selectedBudgetScenario.id) {
						sectionGroup.sectionGroupCost = sectionGroupCost;
					}
				});

				self.calculateSectionGroupOverrides(sectionGroup);

				// Generate container if one does not already exist
				var container = self.calculateSectionGroupContainer(sectionGroup, calculatedSectionGroups.byTerm[shortTerm]);
				container.sectionGroups.push(sectionGroup);
			});

			activeTerms.forEach(function(term) {
				calculatedSectionGroups.byTerm[term] = _array_sortByProperty(calculatedSectionGroups.byTerm[term], "uniqueKey");
			});

			budgetReducers.reduce({
				type: CALCULATE_SECTION_GROUPS,
				payload: {
					calculatedSectionGroups: calculatedSectionGroups
				}
			});

			this.calculateTotalCost();
		},
		// Calculate sectionGroup costs
		calculateSectionGroupFinancialCosts: function(sectionGroup) {
			var budget = budgetReducers._state.budget;

			// Course Costs
			if (sectionGroup.readerAppointments == null || sectionGroup.readerAppointments == undefined) {
				sectionGroup.readerCost = 0;
			} else {
				sectionGroup.readerCost = sectionGroup.readerAppointments * budget.readerCost;
			}
			if (sectionGroup.teachingAssistantAppointments == null || sectionGroup.teachingAssistantAppointments == undefined) {
				sectionGroup.taCost = 0;
			} else {
				sectionGroup.taCost = sectionGroup.teachingAssistantAppointments * budget.taCost;
			}

			sectionGroup.courseCostSubTotal = sectionGroup.taCost + sectionGroup.readerCost;

			// Instructor Costs
			sectionGroup.instructorCostSubTotal = 0;

			sectionGroup.assignedInstructorIds.forEach(function(instructorId) {
				var instructor = budgetReducers._state.instructors.list[instructorId];
				var instructorCost = budgetReducers._state.instructorCosts.list[instructor.instructorCostId];

				if ( !(instructorCost) || !(instructorCost.cost) ) {
					return;
				}

				sectionGroup.instructorCostSubTotal += instructorCost.cost;
			});

			sectionGroup.totalCost = sectionGroup.courseCostSubTotal + sectionGroup.instructorCostSubTotal;
		},
		calculateTotalCost: function() {
			var courseCosts = 0;
			var lineItemFunds = 0;
			var terms = budgetReducers._state.calculatedSectionGroups.terms;
			var sectionGroups = budgetReducers._state.calculatedSectionGroups.byTerm;

			// Add sectionGroup costs
			terms.forEach(function(term) {
				sectionGroups[term].forEach(function(course) {
					course.sectionGroups.forEach(function(sectionGroup) {
						courseCosts += sectionGroup.totalCost;
					});
				});
			});

			// Add line item costs
			budgetReducers._state.lineItems.ids.forEach(function(lineItemId) {
				var amount = budgetReducers._state.lineItems.list[lineItemId].amount;
				lineItemFunds += amount;
			});

			var totalCost = lineItemFunds - courseCosts;

			budgetReducers.reduce({
				type: CALCULATE_TOTAL_COST,
				payload: {
					totalCost: totalCost,
					budgetScenarioId: budgetReducers._state.ui.selectedBudgetScenarioId
				}
			});
		},
		// Find or create a sectionGroupContainer for this sectionGroup
		calculateSectionGroupContainer: function(sectionGroup, containers) {
			var course = budgetReducers._state.courses.list[sectionGroup.courseId];
			var uniqueKey = course.subjectCode + course.courseNumber;

			newContainer = {
				subjectCode: course.subjectCode,
				courseNumber: course.courseNumber,
				title: course.title,
				uniqueKey: course.subjectCode + course.courseNumber,
				sectionGroups: []
			};

			var properties = ["uniqueKey"];
			var container = _array_find_by_properties(containers, properties, newContainer);

			if(container == false || container == undefined) {
				containers.push(newContainer);
				container = newContainer;
			}

			return container;
		},
		calculateSectionGroupOverrides: function(sectionGroup) {
			// Generate totalSeats override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.enrollment) {
				sectionGroup.overrideTotalSeats = angular.copy(sectionGroup.sectionGroupCost.enrollment);
			} else {
				sectionGroup.overrideTotalSeats = angular.copy(sectionGroup.totalSeats);
			}

			// Generate sections override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.sectionCount) {
				sectionGroup.overrideSectionCount = angular.copy(sectionGroup.sectionGroupCost.sectionCount);
			} else {
				sectionGroup.overrideSectionCount = angular.copy(sectionGroup.sectionCount);
			}

			// Generate TAs override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.taCount) {
				sectionGroup.overrideTeachingAssistantAppointments = angular.copy(sectionGroup.sectionGroupCost.taCount);
			} else {
				sectionGroup.overrideTeachingAssistantAppointments = angular.copy(sectionGroup.teachingAssistantAppointments);
			}

			// Generate Readers override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.readerCount) {
				sectionGroup.overrideReaderAppointments = angular.copy(sectionGroup.sectionGroupCost.readerCount);
			} else {
				sectionGroup.overrideReaderAppointments = angular.copy(sectionGroup.readerAppointments);
			}
		}
	};
});