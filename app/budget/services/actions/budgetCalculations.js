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

				self.calculateSectionGroupCostComments(sectionGroup.sectionGroupCost);

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
		calculateInstructorTypes: function() {
			var instructorTypes = budgetReducers._state.instructorTypes;

			var instructorTypeList = [];

			instructorTypes.ids.forEach(function(instructorTypeId) {
				var instructorType = instructorTypes.list[instructorTypeId];
				instructorTypeList.push(instructorType);
			});

			instructorTypeList = _array_sortByProperty(instructorTypeList, "description");

			budgetReducers.reduce({
				type: CALCULATE_INSTRUCTOR_TYPES,
				payload: {
					calculatedInstructorTypes: instructorTypeList
				}
			});
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
		}
	};
});