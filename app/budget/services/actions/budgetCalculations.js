budgetApp.service('budgetCalculations', function ($rootScope, $window, budgetService, budgetReducers, termService) {
	return {
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

				// Find the sectionGroupCost for this sectionGroupCost/Scenario combo
				sectionGroup.sectionGroupCost = null;
				var sectionGroupCostIds = budgetReducers._state.sectionGroupCosts.bySectionGroupId[sectionGroup.id] || [];

				sectionGroupCostIds.forEach(function(sectionGroupCostId) {
					var sectionGroupCost = budgetReducers._state.sectionGroupCosts.list[sectionGroupCostId];

					if (sectionGroupCost.budgetScenarioId == selectedBudgetScenario.id) {
						sectionGroup.sectionGroupCost = sectionGroupCost;
					}
				});

				// Generate the placeholders used while editing by cascading values from the relevant sources
				self.calculateSectionGroupOverrides(sectionGroup);

				// Attach comments data
				self.calculateSectionGroupCostComments(sectionGroup.sectionGroupCost);

				// Attach instructors
				self.calculateSectionGroupInstructors(sectionGroup);

				// Attach cost data
				self.calculateSectionGroupFinancialCosts(sectionGroup);

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
			if (sectionGroup.overrideReaderAppointments == null) {
				sectionGroup.readerCost = 0;
			} else {
				sectionGroup.readerCost = sectionGroup.overrideReaderAppointments * budget.readerCost;
			}
			if (sectionGroup.overrideTeachingAssistantAppointments == null) {
				sectionGroup.taCost = 0;
			} else {
				sectionGroup.taCost = sectionGroup.overrideTeachingAssistantAppointments * budget.taCost;
			}

			sectionGroup.courseCostSubTotal = sectionGroup.taCost + sectionGroup.readerCost;

			// Instructor Costs
			sectionGroup.instructorCostSubTotal = sectionGroup.overrideInstructorCost || 0;

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
			budgetReducers._state.calculatedLineItems.forEach(function(lineItem) {
				lineItemFunds += lineItem.amount ? lineItem.amount : 0;
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
		calculateSectionGroupInstructors: function(sectionGroup) {
			var instructor = null;
			var originalInstructor = null;

			if (sectionGroup.sectionGroupCost) {
				instructor = budgetReducers._state.instructors.list[sectionGroup.sectionGroupCost.instructorId];
				originalInstructor = budgetReducers._state.instructors.list[sectionGroup.sectionGroupCost.originalInstructorId];

				if (instructor == null) {
					instructor = budgetReducers._state.instructors.list[sectionGroup.assignedInstructorIds[0]];
				}
			} else {
				instructor = budgetReducers._state.instructors.list[sectionGroup.assignedInstructorIds[0]];
				originalInstructor = null;
			}

			sectionGroup.instructorName = instructor ? instructor.lastName + ", " + instructor.firstName : null;
			sectionGroup.originalInstructorName = originalInstructor ? originalInstructor.lastName + ", " + originalInstructor.firstName : null;
		},
		calculateSectionGroupOverrides: function(sectionGroup) {
			// Generate totalSeats override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.enrollment !== null) {
				sectionGroup.overrideTotalSeats = angular.copy(sectionGroup.sectionGroupCost.enrollment);
			} else {
				sectionGroup.overrideTotalSeats = angular.copy(sectionGroup.totalSeats);
			}

			// Generate sections override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.sectionCount !== null) {
				sectionGroup.overrideSectionCount = angular.copy(sectionGroup.sectionGroupCost.sectionCount);
			} else {
				sectionGroup.overrideSectionCount = angular.copy(sectionGroup.sectionCount);
			}

			// Generate TAs override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.taCount !== null) {
				sectionGroup.overrideTeachingAssistantAppointments = angular.copy(sectionGroup.sectionGroupCost.taCount);
			} else {
				sectionGroup.overrideTeachingAssistantAppointments = angular.copy(sectionGroup.teachingAssistantAppointments);
			}

			// Generate Readers override
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.readerCount !== null) {
				sectionGroup.overrideReaderAppointments = angular.copy(sectionGroup.sectionGroupCost.readerCount);
			} else {
				sectionGroup.overrideReaderAppointments = angular.copy(sectionGroup.readerAppointments);
			}

			// Generate Instructor cost overrides
			sectionGroup.overrideInstructorCost = null;

			// (1st option) attempt to use per-course instructor cost
			if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.cost != null) {
				sectionGroup.overrideInstructorCost = angular.copy(sectionGroup.sectionGroupCost.cost);
				sectionGroup.overrideInstructorCostSource = "course";
			} else {
				// (2nd option) Attempt to use per-instructor cost
				var instructorCost = null;

				// Attempt to use instructor override
				if (sectionGroup.sectionGroupCost && sectionGroup.sectionGroupCost.instructorId != null) {
					instructorCost = budgetReducers._state.instructorCosts.byInstructorId[sectionGroup.sectionGroupCost.instructorId];
				}

				// Attempt to use assigned instructors
				if (instructorCost == null) {
					sectionGroup.assignedInstructorIds.forEach(function(instructorId) {
						instructorCost = budgetReducers._state.instructorCosts.byInstructorId[instructorId];
					});
				}

				if (instructorCost && instructorCost.cost != null) {
					sectionGroup.overrideInstructorCost = angular.copy(instructorCost.cost);
					sectionGroup.overrideInstructorCostSource = "instructor";
				} else if (instructorCost) {
					// (3rd option) Attempt to use per instructorType instructor cost
					var instructorType = budgetReducers._state.instructorTypes.list[instructorCost.instructorTypeId];

					if (instructorType && instructorType.cost != null) {
						sectionGroup.overrideInstructorCost = angular.copy(instructorType.cost);
						sectionGroup.overrideInstructorCostSource = "type";
					}
				}
			}
		},
		calculateSectionGroupCostComments: function(sectionGroupCost) {
			if (sectionGroupCost == null) { return; }

			// Set sectionGroupCostComments
			sectionGroupCost.comments = [];

			budgetReducers._state.sectionGroupCostComments.ids.forEach(function(commentId) {
				var comment = budgetReducers._state.sectionGroupCostComments.list[commentId];

				if (comment.sectionGroupCostId == sectionGroupCost.id) {
					sectionGroupCost.comments.push(comment);
				}
			});

			sectionGroupCost.comments =_array_sortByProperty(sectionGroupCost.comments, "lastModifiedOn", true);
		},
		calculateLineItems: function() {
			var self = this;
			var calculatedLineItems = [];

			// Set meta data on persisted lineItems
			budgetReducers._state.lineItems.ids.forEach(function(lineItemId) {
				var lineItem = budgetReducers._state.lineItems.list[lineItemId];
				var selectedBudgetScenarioId = budgetReducers._state.ui.selectedBudgetScenarioId;

				// Ensure lineItem is relevant to user selections
				if (lineItem.budgetScenarioId == selectedBudgetScenarioId) {
					// Apply filtered/hidden logic
					if (self.isLineItemFiltered(lineItem)) { return; }

					// Set 'lastModifiedBy', will convert 'user:bobsmith' to 'Smith, Bob'
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

					// Check if orphaned
					if (lineItem.teachingAssignmentId) {
						var teachingAssignment = budgetReducers._state.teachingAssignments.list[lineItem.teachingAssignmentId];
						lineItem.isOrphaned = teachingAssignment ? false : true;
					}

					// Set comments
					lineItem = self.calculateLineItemComments(lineItem);

					// Set lineItem category description
					lineItem.categoryDescription = budgetReducers._state.lineItemCategories.list[lineItem.lineItemCategoryId].description;

					calculatedLineItems.push(lineItem);
				}
			});

			// Calculate implicit lineItems
			budgetReducers._state.teachingAssignments.ids.forEach(function(teachingAssignmentId) {
				var teachingAssignment = teachingAssignments.list[teachingAssignmentId];

				if (teachingAssignment.approved == false) { return; }

				if (teachingAssignment.buyout || teachingAssignment.workLifeBalance) {
					if (self._matchingLineItemExists(teachingAssignment, budgetReducers._state.lineItems) == false) {
						lineItem = self.scaffoldLineItem(teachingAssignment);
						calculatedLineItems.push(lineItem);
					}
				}
			});

			calculatedLineItems = _array_sortByProperty(calculatedLineItems, "lineItemCategoryId");

			budgetReducers.reduce({
				type: CALCULATE_LINE_ITEMS,
				payload: {
					calculatedLineItems: calculatedLineItems
				}
			});
		},
		isLineItemFiltered: function(lineItem) {
			var isFiltered = false;

			// Hidden lineItem and hidden filter logic
			if (lineItem.hidden && budgetReducers._state.ui.filters.lineItems.showHidden.selected == false) {
				isFiltered = true;
			}

			return isFiltered;
		},
		calculateLineItemComments: function(lineItem) {
			lineItem.comments = [];

			budgetReducers._state.lineItemComments.ids.forEach(function(commentId) {
				var comment = budgetReducers._state.lineItemComments.list[commentId];

				if (comment.lineItemId == lineItem.id) {
					lineItem.comments.push(comment);
				}
			});

			// Sort sectionGroupCostComments
			var reverseOrder = true;
			lineItem.comments = _array_sortByProperty(lineItem.comments, "lastModifiedOn", reverseOrder);

			return lineItem;
		},
		_matchingLineItemExists: function(teachingAssignment, lineItems) {
			if (lineItems == false || lineItems.ids == false) { return false; }

			var lineItemExists = false;

			lineItems.ids.forEach(function(lineItemId) {
				var lineItem = lineItems.list[lineItemId];

				if (lineItem.teachingAssignmentId == teachingAssignment.id) {
					lineItemExists = true;
					return;
				}
			});

			return lineItemExists;
		},
		// Auto-generate a lineItem for this teachingAssignment
		scaffoldLineItem: function(teachingAssignment) {
			var lineItemCategoryId = null;
			var typeDescription = null;

			var instructor = budgetReducers._state.instructors.list[teachingAssignment.instructorId];
			var termDescription = termService.getTermName(teachingAssignment.termCode);

			if (teachingAssignment.buyout) {
				typeDescription = "Buyout Funds";
				lineItemCategoryId = 2;
			} else if (teachingAssignment.workLifeBalance) {
				typeDescription = "Work-Life Balance";
				lineItemCategoryId = 5;
			}

			var categoryDescription = budgetReducers._state.lineItemCategories.list[lineItemCategoryId].description;
			var description = instructor.firstName + " " + instructor.lastName + " " + typeDescription + " for " + termDescription;

			lineItem = {
				budgetScenarioId: budgetReducers._state.ui.selectedBudgetScenarioId,
				description: description,
				lineItemCategoryId: lineItemCategoryId,
				categoryDescription: categoryDescription,
				hidden: false,
				teachingAssignmentId: teachingAssignment.id
			};

			return lineItem;
		},
		calculateInstructors: function() {
			var instructorTypes = budgetReducers._state.instructorTypes;
			var instructors = budgetReducers._state.instructors;
			var instructorCosts = budgetReducers._state.instructorCosts;
			var budgetId = budgetReducers._state.budget.id;

			var calculatedInstructors = [];

			instructors.ids.forEach(function(instructorId) {
				var instructor = instructors.list[instructorId];
				instructor.instructorCost = null;
				calculatedInstructors.push(instructor);

				// Attach instructorCost
				instructorCosts.ids.forEach(function(instructorCostId) {
					var instructorCost = instructorCosts.list[instructorCostId];

					if (instructorCost.id == instructor.instructorCostId) {
						instructor.instructorCost = instructorCost;
						instructorCost.instructorType = null;
					}

					// Attach instructorType
					instructorTypes.ids.forEach(function(instructorTypeId) {
						var instructorType = instructorTypes.list[instructorTypeId];

						if (instructorType.id == instructorCost.instructorTypeId) {
							instructorCost.instructorType = instructorType;
						}
					});
				});

				if (instructor.instructorCost == null) {
					instructor.instructorCost = {
						id: null,
						cost: null,
						instructorId: instructor.id,
						budgetId: budgetId
					};
				}
			});

			calculatedInstructors = _array_sortByProperty(calculatedInstructors, "lastName");

			budgetReducers.reduce({
				type: CALCULATE_INSTRUCTORS,
				payload: {
					calculatedInstructors: calculatedInstructors
				}
			});
		},
		calculateInstructorTypeCosts: function () {
			var instructorTypes = budgetReducers._state.instructorTypes;
			var instructorTypeCosts = budgetReducers._state.instructorTypeCosts;
			var budgetId = budgetReducers._state.budget.id;

			var calculatedInstructorTypeCosts = [];

			instructorTypes.ids.forEach(function(instructorTypeId) {
				var instructorType = instructorTypes.list[instructorTypeId];
				var instructorTypeCost = instructorTypeCosts.byInstructorTypeId[instructorTypeId];

				if (instructorTypeCost == null) {
					instructorTypeCost = {
						cost: null,
						instructorTypeId: instructorType.id,
						description: instructorType.description,
						budgetId: budgetId
					};
				}

				calculatedInstructorTypeCosts.push(instructorTypeCost);
			});

			calculatedInstructorTypeCosts = _array_sortByProperty(calculatedInstructorTypeCosts, "description");

			budgetReducers.reduce({
				type: CALCULATE_INSTRUCTOR_TYPE_COSTS,
				payload: {
					calculatedInstructorTypeCosts: calculatedInstructorTypeCosts
				}
			});
		},
	};
});