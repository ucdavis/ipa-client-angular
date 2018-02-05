budgetApp.service('budgetReducers', function ($rootScope, $log, budgetSelectors) {
	return {
		_state: {},
		budgetScenarioReducers: function (action, budgetScenarios) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					budgetScenarios = {
						ids: [],
						list: {}
					};

					action.payload.budgetScenarios.forEach( function(budgetScenario) {
						budgetScenarios.ids.push(budgetScenario.id);
						budgetScenarios.list[budgetScenario.id] = budgetScenario;
					});
					return budgetScenarios;
				case CREATE_BUDGET_SCENARIO:
					var newBudgetScenario = action.payload.budgetScenario;
					budgetScenarios.ids.push(newBudgetScenario.id);
					budgetScenarios.list[newBudgetScenario.id] = newBudgetScenario;
					return budgetScenarios;
				case UPDATE_BUDGET_SCENARIO:
					var newBudgetScenario = action.payload.budgetScenario;
					budgetScenarios.list[newBudgetScenario.id] = newBudgetScenario;
					return budgetScenarios;
				case CALCULATE_TOTAL_COST:
					var budgetScenarioId = action.payload.budgetScenarioId;
					var budgetScenario = budgetScenarios.list[budgetScenarioId];
					budgetScenario.totalCost = action.payload.totalCost;
					return budgetScenarios;
				case DELETE_BUDGET_SCENARIO:
					var budgetScenarioId = action.payload.budgetScenarioId;
					var index = budgetScenarios.ids.indexOf(budgetScenarioId);
					budgetScenarios.ids.splice(index, 1);
					delete budgetScenarios.list[budgetScenarioId];
					return budgetScenarios;
				default:
					return budgetScenarios;
			}
		},
		instructorTypeReducers: function (action, instructorTypes) {
			switch (action.type) {
				case INIT_STATE:
					instructorTypes = {
						ids: [],
						list: {}
					};

					action.payload.instructorTypes.forEach( function(instructorType) {
						instructorTypes.ids.push(instructorType.id);
						instructorTypes.list[instructorType.id] = instructorType;
					});
					return instructorTypes;
				case CREATE_INSTRUCTOR_TYPE:
					var newInstructorType = action.payload.instructorType;
					instructorTypes.ids.push(newInstructorType.id);
					instructorTypes.list[newInstructorType.id] = newInstructorType;
					return instructorTypes;
				case UPDATE_INSTRUCTOR_TYPE:
					var newInstructorType = action.payload.instructorType;
					instructorTypes.list[newInstructorType.id] = newInstructorType;
					return instructorTypes;
				default:
					return instructorTypes;
			}
		},
		calculatedInstructorTypeReducers: function (action, calculatedInstructorTypes) {
			switch (action.type) {
				case INIT_STATE:
					return [];
				case CALCULATE_INSTRUCTOR_TYPES:
					return action.payload.calculatedInstructorTypes;
				default:
					return calculatedInstructorTypes;
			}
		},
		lineItemReducers: function (action, lineItems) {
			switch (action.type) {
				case INIT_STATE:
					lineItems = {
						ids: [],
						list: {}
					};
					action.payload.lineItems.forEach( function( lineItem) {
						lineItems.ids.push(lineItem.id);
						lineItems.list[lineItem.id] = lineItem;
					});
					return lineItems;
				case CREATE_BUDGET_SCENARIO:
					action.payload.lineItems.forEach( function( lineItem) {
						lineItems.ids.push(lineItem.id);
						lineItems.list[lineItem.id] = lineItem;
					});
					return lineItems;
				case CREATE_LINE_ITEM:
					var newLineItem = action.payload;
					lineItems.ids.push(newLineItem.id);
					lineItems.list[newLineItem.id] = newLineItem;
					return lineItems;
				case UPDATE_LINE_ITEM:
					var updatedLineItem = action.payload;
					lineItems.list[updatedLineItem.id] = updatedLineItem;
					return lineItems;
				case DELETE_LINE_ITEMS:
					action.payload.lineItemIds.forEach(function(lineItemId) {
						var index = lineItems.ids.indexOf(lineItemId);
						if (index > -1) {
							lineItems.ids.splice(index, 1);
							delete lineItems.list[lineItemId];
						}
					});
					return lineItems;
				case DELETE_LINE_ITEM:
					var lineItemId = action.payload.lineItemId;
					var index = lineItems.ids.indexOf(lineItemId);
					lineItems.ids.splice(index, 1);
					delete lineItems.list[lineItemId];
					return lineItems;
				default:
					return lineItems;
			}
		},
		scheduleBudgetReducers: function (action, budget) {
			switch (action.type) {
				case INIT_STATE:
					budget = action.payload.budget;
					return budget;
				case UPDATE_BUDGET:
					budget = action.payload.budget;
				default:
					return budget;
			}
		},
		lineItemCategoryReducers: function (action, lineItemCategories) {
			switch (action.type) {
				case INIT_STATE:
					lineItemCategories = {
						ids: [],
						list: []
					};

					action.payload.lineItemCategories.forEach( function(lineItemCategory) {
						lineItemCategories.ids.push(lineItemCategory.id);
						lineItemCategories.list[lineItemCategory.id] = lineItemCategory;
					});
					return lineItemCategories;
				default:
					return lineItemCategories;
			}
		},
		sectionGroupCostReducers: function (action, sectionGroupCosts) {
			switch (action.type) {
				case INIT_STATE:
					sectionGroupCosts = {
						ids: [],
						list: [],
						bySectionGroupId: {}
					};

					action.payload.sectionGroupCosts.forEach( function(sectionGroupCost) {
						sectionGroupCosts.ids.push(sectionGroupCost.id);
						sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
						sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId] = sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId] || [];
						sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId].push(sectionGroupCost.id);
					});
					return sectionGroupCosts;
				case CREATE_BUDGET_SCENARIO:
					action.payload.sectionGroupCosts.forEach( function(sectionGroupCost) {
						sectionGroupCosts.ids.push(sectionGroupCost.id);
						sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
					});
					return sectionGroupCosts;
				case UPDATE_SECTION_GROUP_COST:
					var sectionGroupCost = action.payload.sectionGroupCost;
					sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
					return sectionGroupCosts;
				case CREATE_SECTION_GROUP_COST:
					var sectionGroupCost = action.payload.sectionGroupCost;
					if (sectionGroupCosts.ids.indexOf(sectionGroupCost.id) == -1) {
						sectionGroupCosts.ids.push(sectionGroupCost.id);
					}
					sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
					sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId] = sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId] || [];
					sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId].push(sectionGroupCost.id);
					return sectionGroupCosts;
				default:
					return sectionGroupCosts;
			}
		},
		instructorReducers: function (action, instructors) {
			switch (action.type) {
				case INIT_STATE:
					instructors = {
						ids: [],
						list: []
					};

					// Create hash for quick lookup
					var instructorCostsByInstructorId = {};
					action.payload.instructorCosts.forEach( function(instructorCost) {
						instructorCostsByInstructorId[instructorCost.instructorId] = instructorCost;
					});

					action.payload.instructors.forEach( function(instructor) {
						var instructorCost = instructorCostsByInstructorId[instructor.id];
						if (instructorCost) {
							instructor.instructorCostId = instructorCost.id;
						}

						instructors.ids.push(instructor.id);
						instructors.list[instructor.id] = instructor;
					});
					return instructors;
				default:
					return instructors;
			}
		},
		instructorCostReducers: function (action, instructorCosts) {
			switch (action.type) {
				case INIT_STATE:
					instructorCosts = {
						ids: [],
						list: []
					};

					action.payload.instructorCosts.forEach( function(instructorCost) {
						instructorCosts.ids.push(instructorCost.id);
						instructorCosts.list[instructorCost.id] = instructorCost;
					});
					return instructorCosts;
				case UPDATE_INSTRUCTOR_COST:
					var instructorCost = action.payload.instructorCost;
					instructorCosts.list[instructorCost.id] = instructorCost;
					return instructorCosts;
				default:
					return instructorCosts;
			}
		},
		courseReducers: function (action, courses) {
			switch (action.type) {

				case INIT_STATE:
					courses = {
						ids: [],
						list: []
					};

					action.payload.courses.forEach( function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});
					return courses;
				default:
					return courses;
			}
		},
		calculatedSectionGroupReducers: function (action, calculatedSectionGroups) {
			switch (action.type) {

				case INIT_STATE:
					calculatedSectionGroups = {
						terms: [],
						byTerm: {}
					};
					return calculatedSectionGroups;
				case CALCULATE_SECTION_GROUPS:
					calculatedSectionGroups = action.payload.calculatedSectionGroups;
					return calculatedSectionGroups;
				default:
					return calculatedSectionGroups;
			}
		},
		userReducers: function (action, users) {
			switch (action.type) {
				case INIT_STATE:
					users = {
						ids: [],
						list: []
					};

					action.payload.users.forEach( function(user) {
						users.ids.push(user.id);
						users.list[user.id] = user;
					});
					return users;
				default:
					return users;
			}
		},
		scheduleSectionGroupReducers: function (action, scheduleSectionGroups) {
			switch (action.type) {
				case INIT_STATE:
					courses = {
						ids: [],
						list: {}
					};
					sectionGroups = {
						ids: [],
						list: {}
					};
					sections = {
						ids: [],
						list: {}
					};
					teachingAssignments = {
						ids: [],
						list: {}
					};
					supportAssignments = {
						ids: [],
						list: {}
					};
					instructors = {
						ids: [],
						list: {}
					};
					action.payload.instructors.forEach( function(instructor) {
						instructors.ids.push(instructor.id);
						instructors.list[instructor.id] = instructor;
					});
					action.payload.courses.forEach( function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});
					action.payload.sectionGroups.forEach( function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});
					action.payload.sections.forEach( function(section) {
						sections.ids.push(section.id);
						sections.list[section.id] = section;
					});
					action.payload.teachingAssignments.forEach( function(teachingAssignment) {
						teachingAssignments.ids.push(teachingAssignment.id);
						teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
					});
					action.payload.supportAssignments.forEach( function(supportAssignment) {
						supportAssignments.ids.push(supportAssignment.id);
						supportAssignments.list[supportAssignment.id] = supportAssignment;
					});

					scheduleSectionGroups = {
						uniqueKeys: [],
						list: []
					};

					sectionGroups.ids.forEach(function(sectionGroupId) {
						var sectionGroup = sectionGroups.list[sectionGroupId];
						var course = courses.list[sectionGroup.courseId];
						var uniqueKey = course.subjectCode + "-" + course.courseNumber + "-" + course.sequencePattern + "-" + sectionGroup.termCode;

						sectionGroup.sectionCount = 0;
						sectionGroup.totalSeats = 0;
						sectionGroup.sequencePattern = course.sequencePattern;
						// calculate sectionCount and totalSeats
						sections.ids.forEach(function(sectionId) {
							var section = sections.list[sectionId];

							if (section.sectionGroupId == sectionGroup.id) {
								sectionGroup.sectionCount++;
								sectionGroup.totalSeats += section.seats;
							}
						});

						sectionGroup.assignedInstructorIds = [];
						sectionGroup.assignedInstructorNames = [];
						// calculate assignedInstructors
						teachingAssignments.ids.forEach(function(instructorId) {
							var teachingAssignment = teachingAssignments.list[instructorId];

							if (teachingAssignment.approved && teachingAssignment.sectionGroupId == sectionGroup.id) {
								sectionGroup.assignedInstructorIds.push(teachingAssignment.instructorId);
								var instructor = instructors.list[teachingAssignment.instructorId];
								var instructorName = instructor.lastName + ", " + instructor.firstName;
								sectionGroup.assignedInstructorNames.push(instructorName);
							}
						});
						// Add to payload
						sectionGroup.uniqueKey = uniqueKey;

						scheduleSectionGroups.uniqueKeys.push(uniqueKey);
						scheduleSectionGroups.list[uniqueKey] = sectionGroup;
					});

					return scheduleSectionGroups;
				default:
					return scheduleSectionGroups;
			}
		},
		sectionGroupCostCommentReducers: function (action, sectionGroupCostComments) {
			switch (action.type) {
				case INIT_STATE:
					sectionGroupCostComments = {
						ids: [],
						list: []
					};

					action.payload.sectionGroupCostComments.forEach( function(sectionGroupCostComment) {
						sectionGroupCostComments.ids.push(sectionGroupCostComment.id);
						sectionGroupCostComments.list[sectionGroupCostComment.id] = sectionGroupCostComment;
					});
					return sectionGroupCostComments;
				case CREATE_BUDGET_SCENARIO:
					action.payload.sectionGroupCostComments.forEach( function(sectionGroupCostComment) {
						sectionGroupCostComments.ids.push(sectionGroupCostComment.id);
						sectionGroupCostComments.list[sectionGroupCostComment.id] = sectionGroupCostComment;
					});
					return sectionGroupCostComments;
				case CREATE_SECTION_GROUP_COST_COMMENT:
					var comment = action.payload.sectionGroupCostComment;
					sectionGroupCostComments.ids.push(comment.id);
					sectionGroupCostComments.list[comment.id] = comment;
					return sectionGroupCostComments;
				default:
					return sectionGroupCostComments;
			}
		},
		lineItemCommentReducers: function (action, lineItemComments) {
			switch (action.type) {
				case INIT_STATE:
					lineItemComments = {
						ids: [],
						list: []
					};

					action.payload.lineItemComments.forEach( function(lineItemComment) {
						lineItemComments.ids.push(lineItemComment.id);
						lineItemComments.list[lineItemComment.id] = lineItemComment;
					});
					return lineItemComments;
				case CREATE_BUDGET_SCENARIO:
					action.payload.lineItemComments.forEach( function(lineItemComment) {
						lineItemComments.ids.push(lineItemComment.id);
						lineItemComments.list[lineItemComment.id] = lineItemComment;
					});
					return lineItemComments;
				case CREATE_LINE_ITEM_COMMENT:
					var comment = action.payload.lineItemComment;
					lineItemComments.ids.push(comment.id);
					lineItemComments.list[comment.id] = comment;
					return lineItemComments;
				default:
					return lineItemComments;
			}
		},
		uiReducers: function (action, ui) {
			switch (action.type) {
				case INIT_STATE:
					ui = {
						courseCommentsModal: {
							isOpen: false
						},
						lineItemCommentsModal: {
							isOpen: false
						},
						sectionNav: {
							activeTab: "Course Costs",
							allTabs: ["Course Costs", "Instructor Costs", "Line Items", "Summary"]
						},
						termNav: {
							activeTab: null,
							activeTerm: null,
							allTabs: null
						},
						isAddBudgetScenarioModalOpen: false,
						isAddLineItemModalOpen: false,
						isBudgetConfigModalOpen: false,
						isLineItemOpen: false,
						isCourseCostOpen: false,
						openLineItems: [],
						selectedLineItems: [],
						lineItemDetails: {},
						sectionGroupCostDetails: {},
						selectedBudgetScenarioId: parseInt(action.selectedBudgetScenarioId),
						selectedTerm: action.selectedTerm,
						workgroupId: action.workgroupId,
						year: action.year
					};

					// Set initial lineItemDetail UI states
					action.payload.lineItems.forEach(function(lineItem) {
							ui.lineItemDetails[lineItem.id] = {
								displayDescriptionInput: false,
								displayAmountInput: false,
								displayTypeInput: false,
								displayNotesInput: false
							};
					});

					// Set initial sectionGroupCostDetail UI states
					action.payload.sectionGroupCosts.forEach(function(sectionGroupCost) {
							ui.sectionGroupCostDetails[sectionGroupCost.id] = {
								displaySectionCountInput: false,
								displayTaCountInput: false,
								displayReaderCountInput: false,
								displayEnrollmentInput: false,
								displayInstructorCostInput: false,
								displayReasonInput: false,
							};
					});



					return ui;
				case CALCULATE_SCENARIO_TERMS:
					ui.termNav.allTabs = action.payload.allTermTabs;
					ui.termNav.activeTab = action.payload.activeTermTab;
					ui.termNav.activeTerm = action.payload.activeTerm;
					return ui;
				case CREATE_BUDGET_SCENARIO:
					// Set initial lineItemDetail UI states
					action.payload.lineItems.forEach(function(lineItem) {
							ui.lineItemDetails[lineItem.id] = {
								displayDescriptionInput: false,
								displayAmountInput: false,
								displayTypeInput: false,
								displayNotesInput: false
							};
					});

					// Set initial sectionGroupCostDetail UI states
					action.payload.sectionGroupCosts.forEach(function(sectionGroupCost) {
							ui.sectionGroupCostDetails[sectionGroupCost.id] = {
								displaySectionCountInput: false,
								displayTaCountInput: false,
								displayReaderCountInput: false,
								displayEnrollmentInput: false,
								displayInstructorCostInput: false,
								displayReasonInput: false,
							};
					});

					return ui;
				case SELECT_TERM:
					ui.selectedTerm = action.payload.term;
					ui.termNav.activeTab = action.payload.activeTermTab;
					ui.termNav.activeTerm = action.payload.term;
					return ui;
				case SET_ROUTE:
					ui.sectionNav.activeTab = action.payload.selectedRoute;
					return ui;
				case TOGGLE_SELECT_LINE_ITEM:
					var lineItemId = action.payload.lineItem.id;
					var index = ui.selectedLineItems.indexOf(lineItemId);
					if (index == -1) {
						ui.selectedLineItems.push(lineItemId);
					} else {
						ui.selectedLineItems.splice(index, 1);
						ui.areAllLineItemsSelected = false;
					}
					return ui;
				case SELECT_ALL_LINE_ITEMS:
					action.payload.lineItems.forEach(function(lineItem) {
						if (ui.selectedLineItems.indexOf(lineItem.id) == -1) {
							ui.selectedLineItems.push(lineItem.id);
						}
					});
					ui.areAllLineItemsSelected = true;
					return ui;
				case DESELECT_ALL_LINE_ITEMS:
					ui.selectedLineItems = [];
					ui.areAllLineItemsSelected = false;
					return ui;
				case DELETE_LINE_ITEMS:
					action.payload.lineItemIds.forEach(function(lineItemId) {
						var index = ui.selectedLineItems.indexOf(lineItemId);
						if (index > -1) {
							ui.selectedLineItems.splice(index, 1);
						}
					});
					return ui;
				case DELETE_LINE_ITEM:
					var index = ui.selectedLineItems.indexOf(action.payload.lineItemId);
					if (index > -1) {
						ui.selectedLineItems.splice(index, 1);
					}
					return ui;
				case OPEN_ADD_COURSE_COMMENT_MODAL:
					ui.courseCommentsModal.isOpen = true;
					ui.courseCommentsModal.sectionGroup = action.payload.sectionGroup;
					return ui;
				case OPEN_ADD_LINE_ITEM_COMMENT_MODAL:
					ui.lineItemCommentsModal.isOpen = true;
					ui.lineItemCommentsModal.lineItem = action.payload.lineItem;
					return ui;
				case CLOSE_ADD_COURSE_COMMENT_MODAL:
					ui.courseCommentsModal.isOpen = false;
					ui.courseCommentsModal.course = null;
					return ui;
				case OPEN_ADD_LINE_ITEM_MODAL:
					ui.isAddLineItemModalOpen = true;
					ui.lineItemToEdit = action.payload.lineItemToEdit;
					return ui;
				case CLOSE_ADD_LINE_ITEM_MODAL:
					ui.isAddLineItemModalOpen = false;
					ui.lineItemToEdit = null;
					return ui;
				case OPEN_BUDGET_CONFIG_MODAL:
					ui.isBudgetConfigModalOpen = true;
					return ui;
				case CLOSE_BUDGET_CONFIG_MODAL:
					ui.isBudgetConfigModalOpen = false;
					return ui;
				case TOGGLE_ADD_BUDGET_SCENARIO_MODAL:
					ui.isAddBudgetScenarioModalOpen = ! ui.isAddBudgetScenarioModalOpen;
					return ui;
				case CREATE_LINE_ITEM:
					var lineItem = action.payload;
					ui.lineItemDetails[lineItem.id] = {
						displayDescriptionInput: false,
						displayAmountInput: false,
						displayTypeInput: false,
						displayNotesInput: false
					};
					return ui;
				case SELECT_BUDGET_SCENARIO:
					ui.selectedBudgetScenarioId = parseInt(action.payload.budgetScenarioId);
					return ui;
				case DELETE_BUDGET_SCENARIO:
					if (ui.selectedBudgetScenarioId == action.payload.budgetScenarioId) {
						ui.selectedBudgetScenarioId = null;
					}
					return ui;
				default:
					return ui;
			}
		},
		reduce: function (action) {
			var scope = this;

			newState = {};
			newState.budget = scope.scheduleBudgetReducers(action, scope._state.budget);
			newState.budgetScenarios = scope.budgetScenarioReducers(action, scope._state.budgetScenarios);
			newState.courses = scope.courseReducers(action, scope._state.courses);
			newState.lineItems = scope.lineItemReducers(action, scope._state.lineItems);
			newState.lineItemComments = scope.lineItemCommentReducers(action, scope._state.lineItemComments);
			newState.lineItemCategories = scope.lineItemCategoryReducers(action, scope._state.lineItemCategories);
			newState.sectionGroupCosts = scope.sectionGroupCostReducers(action, scope._state.sectionGroupCosts);
			newState.sectionGroupCostComments = scope.sectionGroupCostCommentReducers(action, scope._state.sectionGroupCostComments);
			newState.scheduleSectionGroups = scope.scheduleSectionGroupReducers(action, scope._state.scheduleSectionGroups);
			newState.instructors = scope.instructorReducers(action, scope._state.instructors);
			newState.instructorCosts = scope.instructorCostReducers(action, scope._state.instructorCosts);
			newState.ui = scope.uiReducers(action, scope._state.ui);
			newState.users = scope.userReducers(action, scope._state.users);
			newState.instructorTypes = scope.instructorTypeReducers(action, scope._state.instructorTypes);

			newState.calculatedSectionGroups = scope.calculatedSectionGroupReducers(action, scope._state.calculatedSectionGroups);
			newState.calculatedInstructorTypes = scope.calculatedInstructorTypeReducers(action, scope._state.calculatedInstructorTypes);

			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.selectedBudgetScenario = budgetSelectors.generateSelectedBudgetScenario(
				newState.budgetScenarios,
				newState.lineItems,
				newState.lineItemComments,
				newState.ui,
				newState.lineItemCategories,
				newState.sectionGroupCosts,
				newState.sectionGroupCostComments,
				newState.instructors,
				newState.budget,
				newState.instructorCosts,
				newState.sectionGroups,
				newState.sections,
				newState.courses,
				newState.scheduleSectionGroups,
				newState.users
			);

			newPageState.budgetScenarios = budgetSelectors.generateBudgetScenarios(newState.budgetScenarios);
			newPageState.budget = newState.budget;
			newPageState.ui = newState.ui;
			newPageState.lineItemCategories = budgetSelectors.generateLineItemCategories(newState.lineItemCategories);
			newPageState.instructors = budgetSelectors.generateInstructors(newState.instructors, newState.instructorCosts);
			newPageState.calculatedSectionGroups = newState.calculatedSectionGroups;
			newPageState.calculatedInstructorTypes = newState.calculatedInstructorTypes;

			$rootScope.$emit('budgetStateChanged', newPageState);
			console.log(newPageState);
		}
	};
});