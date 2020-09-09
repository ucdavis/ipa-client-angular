import { _array_sortByProperty } from 'shared/helpers/array';

class BudgetReducers {
	constructor ($rootScope, $log, BudgetSelectors, ActionTypes) {
		return {
			_state: {},
			budgetScenarioReducers: function (action, budgetScenarios) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						budgetScenarios = {
							ids: [],
							list: {}
						};
						action.payload.budgetScenarios.forEach(function(budgetScenario) {
							budgetScenarios.ids.push(budgetScenario.id);
							budgetScenarios.list[budgetScenario.id] = budgetScenario;
						});
						return budgetScenarios;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						var newBudgetScenario = action.payload.budgetScenario;
						budgetScenarios.ids.push(newBudgetScenario.id);
						budgetScenarios.list[newBudgetScenario.id] = newBudgetScenario;
						return budgetScenarios;
					case ActionTypes.UPDATE_BUDGET_SCENARIO:
						var newBudgetScenario = action.payload.budgetScenario;
						budgetScenarios.list[newBudgetScenario.id] = newBudgetScenario;
						return budgetScenarios;
					case ActionTypes.CALCULATE_TOTAL_COST:
						var budgetScenarioId = action.payload.budgetScenarioId;
						var budgetScenario = budgetScenarios.list[budgetScenarioId];
						budgetScenario.totalCost = action.payload.totalCost;
						budgetScenario.funds = action.payload.funds;
						budgetScenario.scheduleCost = action.payload.scheduleCost;
						return budgetScenarios;
					case ActionTypes.DELETE_BUDGET_SCENARIO:
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
					case ActionTypes.INIT_STATE:
						instructorTypes = {
							ids: [],
							list: {}
						};
						action.payload.instructorTypes.forEach(function(instructorType) {
							instructorTypes.list[instructorType.id] = instructorType;
							instructorTypes.ids.push(instructorType.id);
						});

						return instructorTypes;
					default:
						return instructorTypes;
				}
			},
			instructorTypeCostReducers: function (action, instructorTypeCosts) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						instructorTypeCosts = {
							ids: [],
							list: {},
							byInstructorTypeId: {},
							byBudgetScenarioId: {}
						};
						action.payload.instructorTypeCosts.forEach(function(instructorTypeCost) {
							instructorTypeCosts.ids.push(instructorTypeCost.id);
							instructorTypeCosts.list[instructorTypeCost.id] = instructorTypeCost;
							if (!instructorTypeCost.budgetScenarioId) {
								instructorTypeCosts.byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
							} else {
								if (!instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId]) {
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId] = {
										byInstructorTypeId: {}
									};
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId].byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
								} else {
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId].byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
								}
							}
						});
						return instructorTypeCosts;
					case ActionTypes.CREATE_INSTRUCTOR_TYPE_COST:
						var newInstructorTypeCost = action.payload.instructorTypeCost;
						instructorTypeCosts.ids.push(newInstructorTypeCost.id);
						instructorTypeCosts.list[newInstructorTypeCost.id] = newInstructorTypeCost;
						instructorTypeCosts.byInstructorTypeId[newInstructorTypeCost.instructorTypeId] = newInstructorTypeCost;
						return instructorTypeCosts;
					case ActionTypes.UPDATE_INSTRUCTOR_TYPE_COST:
						var newInstructorTypeCost = action.payload.instructorTypeCost;
						instructorTypeCosts.list[newInstructorTypeCost.id] = newInstructorTypeCost;
						instructorTypeCosts.byInstructorTypeId[newInstructorTypeCost.instructorTypeId] = newInstructorTypeCost;
						return instructorTypeCosts;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						action.payload.instructorTypeCosts.forEach(function(instructorTypeCost) {
							instructorTypeCosts.ids.push(instructorTypeCost.id);
							instructorTypeCosts.list[instructorTypeCost.id] = instructorTypeCost;

							if (!instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId]) {
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId] = {
										byInstructorTypeId: {}
									};
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId].byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
								} else {
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId].byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
								}
						});
						return instructorTypeCosts;
					default:
						return instructorTypeCosts;
				}
			},
			calculatedInstructorTypeCostReducers: function (action, calculatedInstructorTypeCosts) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return [];
					case ActionTypes.CALCULATE_INSTRUCTOR_TYPE_COSTS:
						return action.payload.calculatedInstructorTypeCosts;
					default:
						return calculatedInstructorTypeCosts;
				}
			},
			calculatedLineItemReducers: function (action, calculatedLineItems) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return [];
					case ActionTypes.CALCULATE_LINE_ITEMS:
						return action.payload.calculatedLineItems;
					default:
						return calculatedLineItems;
				}
			},
			lineItemReducers: function (action, lineItems) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						lineItems = {
							ids: [],
							list: {}
						};
						action.payload.lineItems.forEach(function(lineItem) {
							lineItems.ids.push(lineItem.id);
							lineItems.list[lineItem.id] = lineItem;
						});
						return lineItems;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						action.payload.lineItems.forEach(function(lineItem) {
							lineItems.ids.push(lineItem.id);
							lineItems.list[lineItem.id] = lineItem;
						});
						return lineItems;
					case ActionTypes.CREATE_LINE_ITEM:
						var newLineItem = action.payload;
						lineItems.ids.push(newLineItem.id);
						lineItems.list[newLineItem.id] = newLineItem;
						return lineItems;
					case ActionTypes.UPDATE_LINE_ITEM:
						var updatedLineItem = action.payload;
						lineItems.list[updatedLineItem.id] = updatedLineItem;
						return lineItems;
					case ActionTypes.DELETE_LINE_ITEMS:
						action.payload.lineItemIds.forEach(function(lineItemId) {
							var index = lineItems.ids.indexOf(lineItemId);
							if (index > -1) {
								lineItems.ids.splice(index, 1);
								delete lineItems.list[lineItemId];
							}
						});
						return lineItems;
					case ActionTypes.DELETE_LINE_ITEM:
						var lineItemId = action.payload.lineItemId;
						var index = lineItems.ids.indexOf(lineItemId);
						lineItems.ids.splice(index, 1);
						delete lineItems.list[lineItemId];
						return lineItems;
					case ActionTypes.UPDATE_FILTERS:
						var selectedFilterDescriptions = action.payload.filters
							.filter(function(filter) {
								return filter.selected === true && filter.type === 'accountNumber';
							}).map(function(filter) {
								return filter.description;
							});

						if (selectedFilterDescriptions.length > 0) {
						lineItems.ids.forEach(function(lineItemId) {
								var slotLineItem = lineItems.list[lineItemId];

								if (selectedFilterDescriptions.includes(slotLineItem.accountNumber)) {
									slotLineItem.hidden = false;
								} else {
									slotLineItem.hidden = true;
								}
							});
						} else {
							lineItems.ids.forEach(function(lineItemId) {
								lineItems.list[lineItemId].hidden = false;
							});
						}
						return lineItems;
					default:
						return lineItems;
				}
			},
			scheduleBudgetReducers: function (action, budget) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						budget = action.payload.budget;
						return budget;
					case ActionTypes.UPDATE_BUDGET:
						budget = action.payload.budget;
						return budget;
					default:
						return budget;
				}
			},
			lineItemCategoryReducers: function (action, lineItemCategories) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						lineItemCategories = {
							ids: [],
							list: []
						};

						action.payload.lineItemCategories.forEach(function(lineItemCategory) {
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
					case ActionTypes.INIT_STATE:
						sectionGroupCosts = {
							ids: [],
							list: [],
							idsByUniqueKey: {},
							uniqueKeys: []
						};

						var sectionGroupsCache = {
							ids: [],
							list: [],
							bySectionGroupKey: {}
						};

						var coursesCache = {
							ids: [],
							list: [],
						};

						action.payload.courses.forEach(function(course) {
							coursesCache.ids.push(course.id);
							coursesCache.list[course.id] = course;
						});

						action.payload.sectionGroups.forEach(function(sectionGroup) {
							var course = coursesCache.list[sectionGroup.courseId];
							var sectionGroupKey = course.subjectCode + "-" + course.courseNumber + "-" + course.sequencePattern;
							sectionGroup.tagIds = course.tagIds;
							sectionGroupsCache.ids.push(sectionGroup.id);
							sectionGroupsCache.list[sectionGroup.id] = sectionGroup;
							sectionGroupsCache.bySectionGroupKey[sectionGroupKey] = sectionGroup;

						});

						action.payload.sectionGroupCosts.forEach(function(sectionGroupCost) {
							var sectionGroupKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern;
							sectionGroupCost.tagIds = sectionGroupsCache.bySectionGroupKey[sectionGroupKey] ? sectionGroupsCache.bySectionGroupKey[sectionGroupKey].tagIds : [];
							sectionGroupCost.hidden = false;
							sectionGroupCosts.ids.push(sectionGroupCost.id);
							sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
							var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode + "-" + sectionGroupCost.budgetScenarioId;
							sectionGroupCost.uniqueKey = uniqueKey;
							sectionGroupCost.sectionGroup = {};
							sectionGroupCosts.idsByUniqueKey[uniqueKey] = sectionGroupCost.id;

							if (sectionGroupCosts.uniqueKeys.indexOf(uniqueKey) == -1) {
								sectionGroupCosts.uniqueKeys.push(uniqueKey);
							}
						});
						return sectionGroupCosts;
					case ActionTypes.UPDATE_FILTERS:
						var shownFilters = [];

						action.payload.filters.forEach(function(filter) {
							if (filter.selected && filter.type !== 'accountNumber') {
								filter.id ? shownFilters.push(filter.id) : shownFilters.push(filter.description);
							}
						});

						sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
							var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];
							sectionGroupCost.hidden = false;

							// Tag filtering isn't active, show all sectionGroupCosts
							if (shownFilters.length == 0) { return; }

							var matchingTagIds = sectionGroupCost.tagIds.filter(function (tag) {
								return shownFilters.includes(tag);
							});

							var matchingSubjectCode = shownFilters.includes(sectionGroupCost.subjectCode);

							// Course passes the filter
							if (matchingTagIds.length > 0 || matchingSubjectCode) { return; }

							// Otherwise hide
							sectionGroupCost.hidden = true;
						});
						return sectionGroupCosts;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						action.payload.sectionGroupCosts.forEach(function(sectionGroupCost) {
							if (sectionGroupCosts.ids.indexOf(sectionGroupCost.id) == -1) {
								sectionGroupCosts.ids.push(sectionGroupCost.id);
							}
							sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
							var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode + "-" + sectionGroupCost.budgetScenarioId;
							sectionGroupCost.uniqueKey = uniqueKey;
							sectionGroupCosts.idsByUniqueKey[uniqueKey] = sectionGroupCost.id;
							if (sectionGroupCosts.uniqueKeys.indexOf(uniqueKey) == -1) {
								sectionGroupCosts.uniqueKeys.push(uniqueKey);
							}
						});
						return sectionGroupCosts;
					case ActionTypes.UPDATE_SECTION_GROUP_COST:
						var sectionGroupCost = action.payload.sectionGroupCost;
						sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
						return sectionGroupCosts;
					case ActionTypes.CREATE_SECTION_GROUP_COST:
						var sectionGroupCost = action.payload.sectionGroupCost;
						if (sectionGroupCosts.ids.indexOf(sectionGroupCost.id) == -1) {
							sectionGroupCosts.ids.push(sectionGroupCost.id);
						}
            var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode + "-" + sectionGroupCost.budgetScenarioId;
						sectionGroupCosts.idsByUniqueKey[uniqueKey] = sectionGroupCost.id;
            sectionGroupCosts.uniqueKeys.push(uniqueKey);
						sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
						return sectionGroupCosts;
					default:
						return sectionGroupCosts;
				}
			},
			assignedInstructorReducers: function (action, assignedInstructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						assignedInstructors = {
							ids: [],
							list: []
						};

						// Create hash for quick lookup
						var instructorCostsByInstructorId = {};
						action.payload.instructorCosts.forEach(function(instructorCost) {
							instructorCostsByInstructorId[instructorCost.instructorId] = instructorCost;
						});

						action.payload.assignedInstructors.forEach(function(instructor) {
							var instructorCost = instructorCostsByInstructorId[instructor.id];
							if (instructorCost) {
								instructor.instructorCostId = instructorCost.id;
							}

							if (assignedInstructors.ids.indexOf(instructor.id) == -1) {
								assignedInstructors.ids.push(instructor.id);
							}
							assignedInstructors.list[instructor.id] = instructor;
						});
						return assignedInstructors;
					default:
						return assignedInstructors;
				}
			},
			activeInstructorReducers: function (action, activeInstructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						activeInstructors = {
							ids: [],
							list: []
						};

						// Create hash for quick lookup
						var instructorCostsByInstructorId = {};
						action.payload.instructorCosts.forEach(function(instructorCost) {
							instructorCostsByInstructorId[instructorCost.instructorId] = instructorCost;
						});

						action.payload.activeInstructors.forEach(function(instructor) {
							var instructorCost = instructorCostsByInstructorId[instructor.id];
							if (instructorCost) {
								instructor.instructorCostId = instructorCost.id;
							}

							activeInstructors.ids.push(instructor.id);
							activeInstructors.list[instructor.id] = instructor;
						});
						return activeInstructors;
					default:
						return activeInstructors;
				}
			},
			calculatedInstructorReducers: function (action, calculatedInstructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return [];
					case ActionTypes.CALCULATE_INSTRUCTORS:
						return action.payload.calculatedInstructors;
					default:
						return calculatedInstructors;
				}
			},
			instructorCostReducers: function (action, instructorCosts) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						instructorCosts = {
							ids: [],
							list: [],
							byInstructorId: {},
							byBudgetScenarioId: {}
						};

						action.payload.instructorCosts.forEach(function(instructorCost) {
							instructorCosts.ids.push(instructorCost.id);
							instructorCosts.list[instructorCost.id] = instructorCost;

							if (!instructorCost.budgetScenarioId) {
								instructorCosts.byInstructorId[instructorCost.instructorId] = instructorCost;
							} else {
								if (!instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId]) {
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId] = {
										byInstructorId: {}
									};
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId].byInstructorId[instructorCost.instructorId] = instructorCost;
								} else {
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId].byInstructorId[instructorCost.instructorId] = instructorCost;
								}
							}
						});

						return instructorCosts;
					case ActionTypes.UPDATE_INSTRUCTOR_COST:
						var instructorCost = action.payload.instructorCost;
						instructorCosts.list[instructorCost.id] = instructorCost;
						instructorCosts.byInstructorId[instructorCost.instructorId] = instructorCost;

						return instructorCosts;
					case ActionTypes.CREATE_INSTRUCTOR_COST:
						var instructorCost = action.payload.instructorCost;
						instructorCosts.ids.push(instructorCost.id);
						instructorCosts.list[instructorCost.id] = instructorCost;
						instructorCosts.byInstructorId[instructorCost.instructorId] = instructorCost;
						return instructorCosts;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						action.payload.instructorCosts.forEach(function(instructorCost) {
							instructorCosts.ids.push(instructorCost.id);
							instructorCosts.list[instructorCost.id] = instructorCost;

							if (!instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId]) {
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId] = {
										byInstructorId: {}
									};
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId].byInstructorId[instructorCost.instructorId] = instructorCost;
								} else {
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId].byInstructorId[instructorCost.instructorId] = instructorCost;
								}
						});
						return instructorCosts;
					default:
						return instructorCosts;
				}
			},
			sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {

					case ActionTypes.INIT_STATE:
						sectionGroups = {
							ids: [],
							list: [],
							idsByUniqueKey: {}
						};

						var courses = {
							ids: [],
							list: [],
						};

						action.payload.courses.forEach(function(course) {
							courses.ids.push(course.id);
							courses.list[course.id] = course;
						});

						// Adding useful metadata to sectionGroups
						action.payload.sectionGroups.forEach(function(sectionGroup) {
							var course = courses.list[sectionGroup.courseId];
							sectionGroup.subjectCode = course.subjectCode;
							sectionGroup.courseNumber = course.courseNumber;
							sectionGroup.title = course.title;
							sectionGroup.sequencePattern;
							sectionGroup.tagIds = course.tagIds;
							var uniqueKey = course.subjectCode + "-" + course.courseNumber + "-" + course.sequencePattern + "-" + sectionGroup.termCode;
							sectionGroups.ids.push(sectionGroup.id);
							sectionGroups.list[sectionGroup.id] = sectionGroup;
							sectionGroups.idsByUniqueKey[uniqueKey] = sectionGroup.id;
						});
						return sectionGroups;
					default:
						return sectionGroups;
				}
			},
			courseReducers: function (action, courses) {
				switch (action.type) {

					case ActionTypes.INIT_STATE:
						courses = {
							ids: [],
							list: [],
							bySubjAndNumber: {}
						};

						action.payload.courses.forEach(function(course) {
							courses.ids.push(course.id);
							courses.list[course.id] = course;
							courses.bySubjAndNumber[course.subjectCode + course.courseNumber] = course;
						});
						return courses;
					default:
						return courses;
				}
			},
			teachingAssignmentReducers: function (action, teachingAssignments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						teachingAssignments = {
							ids: [],
							list: []
						};
						action.payload.teachingAssignments.forEach(function(teachingAssignment) {
							teachingAssignments.ids.push(teachingAssignment.id);
							teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
						});
						return teachingAssignments;
					default:
						return teachingAssignments;
				}
			},
			tagReducers: function (action, tags) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						tags = {
							ids: [],
							list: []
						};
						action.payload.tags.forEach(function(tag) {
							tags.ids.push(tag.id);
							tags.list[tag.id] = tag;
						});
						return tags;
					default:
						return tags;
				}
			},
			calculatedCourseListReducers: function (action, calculatedCourseList) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						calculatedCourseList = [];
						return calculatedCourseList;
					case ActionTypes.CALCULATE_COURSE_LIST:
						calculatedCourseList = action.payload.courseList;
						return calculatedCourseList;
					default:
						return calculatedCourseList;
				}
			},

			calculatedScheduleCostReducers: function (action, calculatedScheduleCosts) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						calculatedScheduleCosts = {
							terms: [],
							byTerm: {},
							byUniqueKey: {},
							sectionGroupCosts: [],
							trackedChanges: []
						};
						return calculatedScheduleCosts;
					case ActionTypes.CALCULATE_SCHEDULE_COSTS:
						calculatedScheduleCosts = action.payload.scheduleCosts;
						return calculatedScheduleCosts;
					default:
						return calculatedScheduleCosts;
				}
			},
			userReducers: function (action, users) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						users = {
							ids: [],
							list: [],
							byLoginId: {}
						};

						action.payload.users.forEach(function(user) {
							users.ids.push(user.id);
							users.list[user.id] = user;
							users.byLoginId[user.loginId.toLowerCase()] = user;
						});
						return users;
					default:
						return users;
				}
			},
			userRoleReducers: function (action, userRoles) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						userRoles = {
							ids: [],
							list: [],
							byUserId: {}
						};

						action.payload.userRoles.forEach(function(userRole) {
							userRoles.ids.push(userRole.id);
							userRoles.list[userRole.id] = userRole;
							userRoles.byUserId[userRole.userId] = userRoles.byUserId[userRole.userId] || [];
							userRoles.byUserId[userRole.userId].push(userRole);
						});
						return userRoles;
					default:
						return userRoles;
				}
			},
			scheduleSectionGroupReducers: function (action, scheduleSectionGroups) {
				switch (action.type) {
					case ActionTypes.INIT_STATE: {
						let courses = {
							ids: [],
							list: {}
						};
						action.payload.courses.forEach(function(course) {
							courses.ids.push(course.id);
							courses.list[course.id] = course;
						});
						let sectionGroups = {
							ids: [],
							list: {}
						};
						action.payload.sectionGroups.forEach(function(sectionGroup) {
							sectionGroups.ids.push(sectionGroup.id);
							sectionGroups.list[sectionGroup.id] = sectionGroup;
						});
						let sections = {
							ids: [],
							list: {}
						};
						action.payload.sections.forEach(function(section) {
							sections.ids.push(section.id);
							sections.list[section.id] = section;
						});
						let teachingAssignments = {
							ids: [],
							list: {}
						};
						action.payload.teachingAssignments.forEach(function(teachingAssignment) {
							teachingAssignments.ids.push(teachingAssignment.id);
							teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
						});
						let instructorTypes = {
							ids: [],
							list: {}
						};
						action.payload.instructorTypes.forEach(function(instructorType) {
							instructorTypes.ids.push(instructorType.id);
							instructorTypes.list[instructorType.id] = instructorType;
						});
						let supportAssignments = {
							ids: [],
							list: {}
						};
						action.payload.supportAssignments.forEach(function(supportAssignment) {
							supportAssignments.ids.push(supportAssignment.id);
							supportAssignments.list[supportAssignment.id] = supportAssignment;
						});
						let assignedInstructors = {
							ids: [],
							list: {}
						};
						action.payload.assignedInstructors.forEach(function(instructor) {
							assignedInstructors.ids.push(instructor.id);
							assignedInstructors.list[instructor.id] = instructor;
						});
						let activeInstructors = {
							ids: [],
							list: {}
						};
						action.payload.activeInstructors.forEach(function(instructor) {
							activeInstructors.ids.push(instructor.id);
							activeInstructors.list[instructor.id] = instructor;
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
							sectionGroup.assignedInstructorTypeIds = [];
							sectionGroup.assignedInstructorTypeNames = [];
							sectionGroup.assignedInstructors = [];

							// calculate assignedInstructors
							teachingAssignments.ids.forEach(function(teachingAssignmentId) {
								var teachingAssignment = teachingAssignments.list[teachingAssignmentId];

								if (teachingAssignment.sectionGroupId != sectionGroup.id || !(teachingAssignment.approved)) { return; }

								if (teachingAssignment.instructorId) {
									sectionGroup.assignedInstructorIds.push(teachingAssignment.instructorId);
									let instructor = { ...assignedInstructors.list[teachingAssignment.instructorId]};
									var instructorName = instructor.lastName + ", " + instructor.firstName;
									var instructorType = instructorTypes.list[teachingAssignment.instructorTypeId];
									sectionGroup.assignedInstructorNames.push(instructorName);
									sectionGroup.assignedInstructorTypeIds.push(teachingAssignment.instructorTypeId);
									sectionGroup.assignedInstructorTypeNames.push(instructorType.description);
									// TODO is this better than accessing the above assignedInstructors list?
									instructor.teachingAssignmentId = teachingAssignment.id;
									instructor.sectionGroupId = sectionGroup.id;
									instructor.instructorTypeId = instructorType.id;
									instructor.instructorTypeDescription = instructorType.description;
									instructor.instructorName = instructor.firstName + ' ' + instructor.lastName;
									sectionGroup.assignedInstructors.push(instructor);
								} else if (teachingAssignment.instructorTypeId > 0 && !(teachingAssignment.instructorId)) {
									sectionGroup.assignedInstructorTypeIds.push(teachingAssignment.instructorTypeId);
									var instructorType = instructorTypes.list[teachingAssignment.instructorTypeId];
									sectionGroup.assignedInstructorTypeNames.push(instructorType.description);
									var instructor = {
										instructorTypeId: teachingAssignment.instructorTypeId,
										sectionGroupId: sectionGroup.id,
										instructorTypeDescription: instructorType.description,
										teachingAssignmentId: teachingAssignment.id
									};
									sectionGroup.assignedInstructors.push(instructor);
								}
							});
							// Add to payload
							sectionGroup.uniqueKey = uniqueKey;

							scheduleSectionGroups.uniqueKeys.push(uniqueKey);
							scheduleSectionGroups.list[uniqueKey] = sectionGroup;
						});
						return scheduleSectionGroups;
					}
					default:
						return scheduleSectionGroups;
				}
			},
			sectionGroupCostCommentReducers: function (action, sectionGroupCostComments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						sectionGroupCostComments = {
							ids: [],
							list: []
						};

						action.payload.sectionGroupCostComments.forEach(function(sectionGroupCostComment) {
							sectionGroupCostComments.ids.push(sectionGroupCostComment.id);
							sectionGroupCostComments.list[sectionGroupCostComment.id] = sectionGroupCostComment;
						});
						return sectionGroupCostComments;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						action.payload.sectionGroupCostComments.forEach(function(sectionGroupCostComment) {
							sectionGroupCostComments.ids.push(sectionGroupCostComment.id);
							sectionGroupCostComments.list[sectionGroupCostComment.id] = sectionGroupCostComment;
						});
						return sectionGroupCostComments;
					case ActionTypes.CREATE_SECTION_GROUP_COST_COMMENT:
						var comment = action.payload.sectionGroupCostComment;
						sectionGroupCostComments.ids.push(comment.id);
						sectionGroupCostComments.list[comment.id] = comment;
						return sectionGroupCostComments;
					default:
						return sectionGroupCostComments;
				}
			},
			sectionGroupCostInstructorReducers: function (action, sectionGroupCostInstructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						sectionGroupCostInstructors = {
							bySectionGroupCostId : {}
						};

						action.payload.sectionGroupCostInstructors.forEach(function(sectionGroupCostInstructor) {

							sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] = sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] || [];
							sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId].push(sectionGroupCostInstructor);
							sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] = _array_sortByProperty(sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId], 'teachingAssignmentId');
						});
						return sectionGroupCostInstructors;
					case ActionTypes.CREATE_SECTION_GROUP_COST_INSTRUCTOR:
						var newSectionGroupCostInstructors = action.payload.sectionGroupCostInstructors;
						var teachingAssignmentIds = action.payload.sectionGroupCostInstructors.map((obj) => obj.teachingAssignmentId);
						var sectionGroupCostId = newSectionGroupCostInstructors[0].sectionGroupCostId;
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId] = sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId] || [];
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId] = sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId].concat(newSectionGroupCostInstructors)
						.filter(instructor => ((teachingAssignmentIds.includes(instructor.teachingAssignmentId) && instructor.sectionGroupCostId) || !teachingAssignmentIds.includes(instructor.teachingAssignmentId)));
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId] = _array_sortByProperty(sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId], 'teachingAssignmentId');
						return sectionGroupCostInstructors;
					case ActionTypes.UPDATE_SECTION_GROUP_COST_INSTRUCTOR:
						var newSectionGroupCostInstructor = action.payload.sectionGroupCostInstructor;
						var newSectionGroupCostInstructors = [];

						sectionGroupCostInstructors.bySectionGroupCostId[newSectionGroupCostInstructor.sectionGroupCostId] = sectionGroupCostInstructors.bySectionGroupCostId[newSectionGroupCostInstructor.sectionGroupCostId] || [];

						sectionGroupCostInstructors.bySectionGroupCostId[newSectionGroupCostInstructor.sectionGroupCostId].forEach(function(sectionGroupCostInstructor){
							if (sectionGroupCostInstructor.id == newSectionGroupCostInstructor.id){
								newSectionGroupCostInstructors.push(newSectionGroupCostInstructor);
							} else {
								newSectionGroupCostInstructors.push(sectionGroupCostInstructor);
							}
						});
						newSectionGroupCostInstructors = _array_sortByProperty(newSectionGroupCostInstructors, 'teachingAssignmentId');
						sectionGroupCostInstructors.bySectionGroupCostId[newSectionGroupCostInstructor.sectionGroupCostId] = newSectionGroupCostInstructors;
						return sectionGroupCostInstructors;
					case ActionTypes.DELETE_SECTION_GROUP_COST_INSTRUCTOR:
						var removedSectionGroupCostInstructorId = action.payload.removedSectionGroupCostInstructorId;
						var sectionGroupCostId = action.payload.sectionGroupCostId;
						var newSectionGroupCostInstructors = [];
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId] = sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId] || [];
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId].forEach(function(sectionGroupCostInstructor){
							if (sectionGroupCostInstructor.id != removedSectionGroupCostInstructorId){
								newSectionGroupCostInstructors.push(sectionGroupCostInstructor);
							}
						});
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostId] = newSectionGroupCostInstructors;
						newSectionGroupCostInstructors = _array_sortByProperty(newSectionGroupCostInstructors, 'teachingAssignmentId');
						return sectionGroupCostInstructors;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						if (action.payload.sectionGroupCostInstructors){
							action.payload.sectionGroupCostInstructors.forEach(function(sectionGroupCostInstructor) {

								sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] = sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] || [];
								sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId].push(sectionGroupCostInstructor);
								sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] = _array_sortByProperty(sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId], 'teachingAssignmentId');
							});
						}
						return sectionGroupCostInstructors;
					default:
						return sectionGroupCostInstructors;
				}
			},
			lineItemCommentReducers: function (action, lineItemComments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						lineItemComments = {
							ids: [],
							list: []
						};

						action.payload.lineItemComments.forEach(function(lineItemComment) {
							lineItemComments.ids.push(lineItemComment.id);
							lineItemComments.list[lineItemComment.id] = lineItemComment;
						});
						return lineItemComments;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
						action.payload.lineItemComments.forEach(function(lineItemComment) {
							lineItemComments.ids.push(lineItemComment.id);
							lineItemComments.list[lineItemComment.id] = lineItemComment;
						});
						return lineItemComments;
					case ActionTypes.CREATE_LINE_ITEM_COMMENT:
						var comment = action.payload.lineItemComment;
						lineItemComments.ids.push(comment.id);
						lineItemComments.list[comment.id] = comment;
						return lineItemComments;
					default:
						return lineItemComments;
				}
			},
			summaryReducers: function (action, summary) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.CALCULATE_SUMMARY_TOTALS:
						return action.payload.summary;
					default:
						return summary;
				}
			},
			userWorkgroupsScenariosReducers: function (action, userWorkgroupsScenarios) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						userWorkgroupsScenarios = action.payload.userWorkgroupsScenarios;
						return userWorkgroupsScenarios;
					default:
						return userWorkgroupsScenarios;
				}
			},
			uiReducers: function (action, ui) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						var isSnapshot = action.payload.budgetScenarios.find(scenario => scenario.id == action.selectedBudgetScenarioId).isSnapshot;
						ui = {
							addCourseModal: {
								isOpen: false
							},
							courseCommentsModal: {
								isOpen: false
							},
							lineItemCommentsModal: {
								isOpen: false
							},
							budgetScenariosModal: {
								isOpen: false
							},
							filters: {
								lineItems: {
									showHidden: {
										type: "showHidden",
										description: "Show Hidden line items",
										selected: false
									}
								},
								list: []
							},
							sectionNav: {
								activeTab: action.activeTab || "Summary",
								allTabs: ["Schedule Costs", "Funds", "Summary", "Instructor List", "Course List"]
							},
							termNav: {
								activeTab: null,
								activeTerm: null,
								allTabs: null
							},
							fundsNav: {
								allTabs: isSnapshot ? ['Funds'] : ['Funds', 'Suggested'],
								activeTab: 'Funds',
								tabOverrides: {}
							},
							syncScenario: {
								showSyncWarning: false,
								updateFailures: [],
								summaryHtml: ""
							},
							isAddBudgetScenarioModalOpen: false,
							isAddLineItemModalOpen: false,
							isBudgetConfigModalOpen: false,
							isLineItemOpen: false,
							isCourseCostOpen: false,
							instructorAssignmentOptions: [],
							regularInstructorAssignmentOptions: [],
							openLineItems: [],
							selectedLineItems: [],
							lineItemDetails: {},
							sectionGroupCostDetails: {},
							selectedBudgetScenarioId: parseInt(action.selectedBudgetScenarioId),
							isSnapshot: isSnapshot,
							createInProgress: false,
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

						if (action.payload.tags.length > 0) {
							ui.filters.list.push({ subheader: true, description: 'Tags' });

							action.payload.tags.forEach(function(tag) {
								tag.type = 'tag';
								tag.description = tag.name;
								tag.selected = false;
								ui.filters.list.push(tag);
							});
						}

						if (action.filters.subjectCodes.length > 0) {
							ui.filters.list.push({ subheader: true, description: 'Subject Codes' });

							action.filters.subjectCodes.forEach(function(subjectCode) {
								let subjectCodeFilter = {
									type: 'subjectCode',
									description: subjectCode,
									selected: false
								};

								ui.filters.list.push(subjectCodeFilter);
							});
						}

						if (action.filters.accountNumbers.length > 0) {
							ui.filters.list.push({ subheader: true, description: 'Account Numbers' });

							action.filters.accountNumbers.forEach(function(accountNumber) {
								let accountNumberFilter = {
									type: 'accountNumber',
									description: accountNumber,
									selected: false
								};

								ui.filters.list.push(accountNumberFilter);
							});
						}

						return ui;
					case ActionTypes.UPDATE_FILTERS:
						ui.filters.list = action.payload.filters;
						return ui;
					case ActionTypes.CALCULATE_INSTRUCTORS:
						ui.instructorAssignmentOptions = action.payload.instructorAssignmentOptions;
						ui.regularInstructorAssignmentOptions = action.payload.regularInstructorAssignmentOptions;

						return ui;
					case ActionTypes.CALCULATE_SCENARIO_TERMS:
						ui.termNav.allTabs = action.payload.allTermTabs;
						ui.termNav.activeTab = action.payload.activeTermTab;
						ui.termNav.activeTerm = action.payload.activeTerm;
						ui.termNav.budgetScenarioDropdownTerms = action.payload.budgetScenarioDropdownTerms;
						return ui;
					case ActionTypes.TOGGLE_FILTER_LINE_ITEM_SHOW_HIDDEN:
						ui.filters.lineItems.showHidden.selected = !ui.filters.lineItems.showHidden.selected;
						return ui;
					case ActionTypes.CREATE_BUDGET_SCENARIO:
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
						ui.createInProgress = false;
						return ui;
					case ActionTypes.SELECT_TERM:
						ui.selectedTerm = action.payload.term;
						ui.termNav.activeTab = action.payload.activeTermTab;
						ui.termNav.activeTerm = action.payload.term;
						return ui;
					case ActionTypes.SELECT_FUNDS_NAV:
						ui.fundsNav.activeTab = action.payload.activeTab;
						return ui;
					case ActionTypes.SET_ROUTE:
						ui.sectionNav.activeTab = action.payload.selectedRoute;
						return ui;
					case ActionTypes.TOGGLE_SELECT_LINE_ITEM:
						var lineItemId = action.payload.lineItem.id;
						var index = ui.selectedLineItems.indexOf(lineItemId);
						if (index == -1) {
							ui.selectedLineItems.push(lineItemId);
						} else {
							ui.selectedLineItems.splice(index, 1);
							ui.areAllLineItemsSelected = false;
						}
						return ui;
					case ActionTypes.SELECT_ALL_LINE_ITEMS:
						action.payload.lineItems.forEach(function(lineItem) {
							if (ui.selectedLineItems.indexOf(lineItem.id) == -1) {
								ui.selectedLineItems.push(lineItem.id);
							}
						});
						ui.areAllLineItemsSelected = true;
						return ui;
					case ActionTypes.DESELECT_ALL_LINE_ITEMS:
						ui.selectedLineItems = [];
						ui.areAllLineItemsSelected = false;
						return ui;
					case ActionTypes.DELETE_LINE_ITEMS:
						action.payload.lineItemIds.forEach(function(lineItemId) {
							var index = ui.selectedLineItems.indexOf(lineItemId);
							if (index > -1) {
								ui.selectedLineItems.splice(index, 1);
							}
						});
						return ui;
					case ActionTypes.DELETE_LINE_ITEM:
						var index = ui.selectedLineItems.indexOf(action.payload.lineItemId);
						if (index > -1) {
							ui.selectedLineItems.splice(index, 1);
						}
						return ui;
					case ActionTypes.OPEN_ADD_COURSE_COMMENT_MODAL:
						ui.courseCommentsModal.isOpen = true;
						ui.courseCommentsModal.sectionGroupCost = action.payload.sectionGroupCost;
						return ui;
					case ActionTypes.OPEN_ADD_COURSE_MODAL:
						ui.addCourseModal.isOpen = true;
						return ui;
					case ActionTypes.CLOSE_ADD_COURSE_MODAL:
						ui.addCourseModal.isOpen = false;
						return ui;
					case ActionTypes.OPEN_ADD_LINE_ITEM_COMMENT_MODAL:
						ui.lineItemCommentsModal.isOpen = true;
						ui.lineItemCommentsModal.lineItem = action.payload.lineItem;
						return ui;
					case ActionTypes.CLOSE_ADD_COURSE_COMMENT_MODAL:
						ui.courseCommentsModal.isOpen = false;
						ui.courseCommentsModal.course = null;
						return ui;
					case ActionTypes.OPEN_ADD_LINE_ITEM_MODAL:
						ui.isAddLineItemModalOpen = true;
						ui.lineItemToEdit = action.payload.lineItemToEdit;
						return ui;
					case ActionTypes.CLOSE_ADD_LINE_ITEM_MODAL:
						ui.isAddLineItemModalOpen = false;
						ui.lineItemToEdit = null;
						return ui;
					case ActionTypes.OPEN_BUDGET_CONFIG_MODAL:
						ui.isBudgetConfigModalOpen = true;
						return ui;
					case ActionTypes.CLOSE_BUDGET_CONFIG_MODAL:
						ui.isBudgetConfigModalOpen = false;
						return ui;
					case ActionTypes.TOGGLE_ADD_BUDGET_SCENARIO_MODAL:
						ui.isAddBudgetScenarioModalOpen = ! ui.isAddBudgetScenarioModalOpen;
						return ui;
					case ActionTypes.TOGGLE_DOWNLOAD_BUDGET_SCENARIOS:
						ui.budgetScenariosModal.isOpen = !ui.budgetScenariosModal.isOpen;
						return ui;
					case ActionTypes.CREATE_LINE_ITEM:
						var lineItem = action.payload;
						ui.lineItemDetails[lineItem.id] = {
							displayDescriptionInput: false,
							displayAmountInput: false,
							displayTypeInput: false,
							displayNotesInput: false
						};
						return ui;
					case ActionTypes.SELECT_BUDGET_SCENARIO:
						ui.fundsNav.allTabs = action.payload.isSnapshot ? ['Funds'] : ['Funds', 'Suggested'];
						ui.shouldShowCourseList = !action.payload.fromLiveData && !action.payload.isSnapshot;
						ui.fromLiveData = action.payload.fromLiveData;
						ui.isSnapshot = action.payload.isSnapshot;
						ui.selectedBudgetScenarioId = parseInt(action.payload.budgetScenarioId);
						return ui;
					case ActionTypes.DELETE_BUDGET_SCENARIO:
						if (ui.selectedBudgetScenarioId == action.payload.budgetScenarioId) {
							ui.selectedBudgetScenarioId = null;
						}
						return ui;
					case ActionTypes.UPDATE_SYNC_STATUS:
						ui.syncScenario.updateFailures = [...ui.syncScenario.updateFailures, action.payload.updateFailure];
						ui.syncScenario.showSyncWarning = ui.syncScenario.updateFailures.length > 0;
						ui.syncScenario.summaryHtml = ui.syncScenario.updateFailures.map(change => `${change.termName}, ${change.courseDescription}, ${change.name}`).join("<br>");
						return ui;
					default:
						return ui;
				}
			},
			reduce: function (action) {
				var scope = this;

				let newState = {};
				newState.budget = scope.scheduleBudgetReducers(action, scope._state.budget);
				newState.budgetScenarios = scope.budgetScenarioReducers(action, scope._state.budgetScenarios);
				newState.courses = scope.courseReducers(action, scope._state.courses);
				newState.sectionGroups = scope.sectionGroupReducers(action, scope._state.sectionGroups);
				newState.lineItems = scope.lineItemReducers(action, scope._state.lineItems);
				newState.lineItemComments = scope.lineItemCommentReducers(action, scope._state.lineItemComments);
				newState.lineItemCategories = scope.lineItemCategoryReducers(action, scope._state.lineItemCategories);
				newState.sectionGroupCosts = scope.sectionGroupCostReducers(action, scope._state.sectionGroupCosts);
				newState.sectionGroupCostComments = scope.sectionGroupCostCommentReducers(action, scope._state.sectionGroupCostComments);
				newState.sectionGroupCostInstructors = scope.sectionGroupCostInstructorReducers(action, scope._state.sectionGroupCostInstructors);
				newState.scheduleSectionGroups = scope.scheduleSectionGroupReducers(action, scope._state.scheduleSectionGroups);
				newState.assignedInstructors = scope.assignedInstructorReducers(action, scope._state.assignedInstructors);
				newState.activeInstructors = scope.activeInstructorReducers(action, scope._state.activeInstructors);
				newState.instructorCosts = scope.instructorCostReducers(action, scope._state.instructorCosts);
				newState.ui = scope.uiReducers(action, scope._state.ui);
				newState.users = scope.userReducers(action, scope._state.users);
				newState.userRoles = scope.userRoleReducers(action, scope._state.userRoles);
				newState.instructorTypes = scope.instructorTypeReducers(action, scope._state.instructorTypes);
				newState.instructorTypeCosts = scope.instructorTypeCostReducers(action, scope._state.instructorTypeCosts);
				newState.teachingAssignments = scope.teachingAssignmentReducers(action, scope._state.teachingAssignments);
				newState.tags = scope.tagReducers(action, scope._state.tags);
				newState.userWorkgroupsScenarios = scope.userWorkgroupsScenariosReducers(action, scope._state.userWorkgroupsScenarios);

				newState.calculatedScheduleCosts = scope.calculatedScheduleCostReducers(action, scope._state.calculatedScheduleCosts);
				newState.calculatedInstructorTypeCosts = scope.calculatedInstructorTypeCostReducers(action, scope._state.calculatedInstructorTypeCosts);
				newState.calculatedInstructors = scope.calculatedInstructorReducers(action, scope._state.calculatedInstructors);
				newState.calculatedLineItems = scope.calculatedLineItemReducers(action, scope._state.calculatedLineItems);
				newState.summary = scope.summaryReducers(action, scope._state.summary);
				newState.calculatedCourseList = scope.calculatedCourseListReducers(action, scope._state.calculatedCourseList);

				scope._state = newState;

				// Build new 'page state'
				// This is the 'view friendly' version of the store
				let newPageState = {};
				newPageState.selectedBudgetScenario = BudgetSelectors.generateSelectedBudgetScenario(newState.budgetScenarios, newState.ui);

				newPageState.budgetScenarios = BudgetSelectors.generateBudgetScenarios(newState.budgetScenarios);
				newPageState.budget = newState.budget;
				newPageState.ui = newState.ui;
				newPageState.lineItemCategories = BudgetSelectors.generateLineItemCategories(newState.lineItemCategories);
				newPageState.courses = newState.courses;
				newPageState.sectionGroups = newState.sectionGroups;
				newPageState.tags = newState.tags;

				newPageState.calculatedCourseList = newState.calculatedCourseList;
				newPageState.calculatedScheduleCosts = newState.calculatedScheduleCosts;
				newPageState.calculatedInstructorTypeCosts = newState.calculatedInstructorTypeCosts;
				newPageState.calculatedInstructors = newState.calculatedInstructors;
				newPageState.calculatedLineItems = newState.calculatedLineItems;
				newPageState.summary = newState.summary;
				newPageState.instructorTypes = newState.instructorTypes;
				newPageState.userWorkgroupsScenarios = scope._state.userWorkgroupsScenarios;

				$rootScope.$emit('budgetStateChanged', newPageState);
			}
		};
	}
}

BudgetReducers.$inject = ['$rootScope', '$log', 'BudgetSelectors', 'ActionTypes'];

export default BudgetReducers;
