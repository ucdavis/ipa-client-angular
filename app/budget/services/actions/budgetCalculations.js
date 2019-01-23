import { _array_sortByProperty } from 'shared/helpers/array';

class BudgetCalculations {
	constructor (BudgetReducers, TermService, Roles, ActionTypes, ScheduleCostCalculations) {
		return {
			calculateScenarioTerms: function() {
				var allTermTabs = [];
				var activeTermTab = null;
	
				var selectedBudgetScenario = BudgetReducers._state.budgetScenarios.list[BudgetReducers._state.ui.selectedBudgetScenarioId];
	
				selectedBudgetScenario.terms.forEach(function(term) {
					allTermTabs.push(TermService.getShortTermName(term));
					activeTermTab = activeTermTab || TermService.getShortTermName(term);
				});
	
				BudgetReducers.reduce({
					type: ActionTypes.CALCULATE_SCENARIO_TERMS,
					payload: {
						allTermTabs: allTermTabs,
						activeTermTab: activeTermTab,
						activeTerm: TermService.getTermFromDescription(activeTermTab),
						selectedScenarioTerms: selectedBudgetScenario.terms
					}
				});
			},
			calculateSectionGroups: function() {
				ScheduleCostCalculations.calculateScheduleCosts();
				this.calculateTotalCost();
			},
			// Calculate sectionGroup costs
			_calculateSectionGroupFinancialCosts: function(sectionGroup) {
				var budget = BudgetReducers._state.budget;
	
				// Support Costs
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
				var scheduleCosts = BudgetReducers._state.calculatedScheduleCosts;

				// Add sectionGroup costs
				scheduleCosts.terms.forEach(function(term) {
					scheduleCosts.byTerm[term].forEach(function(container) {
						container.sectionGroupCosts.forEach(function(sectionGroupCost) {
							courseCosts += sectionGroupCost.totalCost;
						});
					});
				});

				// Add line item costs
				BudgetReducers._state.calculatedLineItems.forEach(function(lineItem) {
					lineItemFunds += lineItem.amount ? lineItem.amount : 0;
				});
	
				var totalCost = lineItemFunds - courseCosts;
	
				BudgetReducers.reduce({
					type: ActionTypes.CALCULATE_TOTAL_COST,
					payload: {
						totalCost: totalCost,
						funds: lineItemFunds,
						scheduleCost: courseCosts,
						budgetScenarioId: BudgetReducers._state.ui.selectedBudgetScenarioId
					}
				});

				this.calculateSummaryTotals();
			},
			_calculateSectionGroupCostComments: function(sectionGroupCost) {
				if (sectionGroupCost == null) { return; }
	
				// Set sectionGroupCostComments
				sectionGroupCost.comments = [];
				sectionGroupCost.commentCount = 0;
	
				BudgetReducers._state.sectionGroupCostComments.ids.forEach(function(commentId) {
					var comment = BudgetReducers._state.sectionGroupCostComments.list[commentId];
	
					if (comment.sectionGroupCostId == sectionGroupCost.id) {
						sectionGroupCost.comments.push(comment);
						sectionGroupCost.commentCount += 1;
					}
				});
	
				sectionGroupCost.commentCountDisplay = sectionGroupCost.commentCount > 0 ? " (" + sectionGroupCost.commentCount + ")" : '   ';
	
				sectionGroupCost.comments = _array_sortByProperty(sectionGroupCost.comments, "lastModifiedOn", true);
			},
			calculateLineItems: function() {
				var self = this;
				var calculatedLineItems = [];
	
				// Set meta data on persisted lineItems
				BudgetReducers._state.lineItems.ids.forEach(function(lineItemId) {
					var lineItem = BudgetReducers._state.lineItems.list[lineItemId];
					var selectedBudgetScenarioId = BudgetReducers._state.ui.selectedBudgetScenarioId;
	
					// Ensure lineItem is relevant to user selections
					if (lineItem.budgetScenarioId == selectedBudgetScenarioId) {
						// Apply filtered/hidden logic
						if (self.isLineItemFiltered(lineItem)) { return; }
	
						// Set 'lastModifiedBy', will convert 'user:bobsmith' to 'Smith, Bob'
						if (lineItem.lastModifiedBy) {
							var split = lineItem.lastModifiedBy.split(":");
							if (split.length > 0 && split[0] == "user") {
								var loginId = split[1];
	
								BudgetReducers._state.users.ids.forEach(function(userId) {
									var user = BudgetReducers._state.users.list[userId];
									if (user.loginId == loginId) {
										lineItem.lastModifiedBy = user.firstName + " " + user.lastName;
									}
								});
							}
						}
	
						// Check if orphaned
						if (lineItem.teachingAssignmentId) {
							var teachingAssignment = BudgetReducers._state.teachingAssignments.list[lineItem.teachingAssignmentId];
							lineItem.isOrphaned = teachingAssignment ? false : true;
						}
	
						// Set comments
						lineItem = self.calculateLineItemComments(lineItem);
	
						// Set lineItem category description
						lineItem.categoryDescription = BudgetReducers._state.lineItemCategories.list[lineItem.lineItemCategoryId].description;
	
						calculatedLineItems.push(lineItem);
					}
				});
	
				// Calculate implicit lineItems
				var implicitLineItems = 0;

				BudgetReducers._state.teachingAssignments.ids.forEach(function(teachingAssignmentId) {
					var teachingAssignment = BudgetReducers._state.teachingAssignments.list[teachingAssignmentId];
	
					if (teachingAssignment.approved == false) { return; }
	
					if (teachingAssignment.buyout || teachingAssignment.workLifeBalance || teachingAssignment.courseRelease) {
						if (self._matchingLineItemExists(teachingAssignment, BudgetReducers._state.lineItems) == false) {
							let lineItem = self.scaffoldLineItem(teachingAssignment);
							calculatedLineItems.push(lineItem);
							implicitLineItems += 1;
						}
					}
				});

				BudgetReducers._state.ui.implicitLineItemCount = implicitLineItems;

				BudgetReducers._state.ui.fundsNav.tabOverrides["Suggested"] = implicitLineItems > 0 ? "Suggested (" + implicitLineItems + ")" : null;
				calculatedLineItems = _array_sortByProperty(calculatedLineItems, "lineItemCategoryId");
	
				BudgetReducers.reduce({
					type: ActionTypes.CALCULATE_LINE_ITEMS,
					payload: {
						calculatedLineItems: calculatedLineItems
					}
				});
			},
			isLineItemFiltered: function(lineItem) {
				var isFiltered = false;
	
				// Hidden lineItem and hidden filter logic
				if (lineItem.hidden && BudgetReducers._state.ui.filters.lineItems.showHidden.selected == false) {
					isFiltered = true;
				}
	
				return isFiltered;
			},
			calculateLineItemComments: function(lineItem) {
				lineItem.comments = [];
				lineItem.commentCount = 0;
	
				BudgetReducers._state.lineItemComments.ids.forEach(function(commentId) {
					var comment = BudgetReducers._state.lineItemComments.list[commentId];
	
					if (comment.lineItemId == lineItem.id) {
						lineItem.comments.push(comment);
						lineItem.commentCount += 1;
					}
				});
	
				lineItem.commentCountDisplay = lineItem.commentCount > 0 ? lineItem.commentCount : '';
	
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
	
				var instructor = BudgetReducers._state.assignedInstructors.list[teachingAssignment.instructorId];
	
				var termDescription = TermService.getTermName(teachingAssignment.termCode);
	
				if (teachingAssignment.buyout) {
					typeDescription = "Buyout Funds";
					lineItemCategoryId = 2;
				} else if (teachingAssignment.workLifeBalance) {
					typeDescription = "Work-Life Balance";
					lineItemCategoryId = 5;
				} else if (teachingAssignment.courseRelease) {
					typeDescription = "Course Release";
					lineItemCategoryId = 6;
				}
	
				var categoryDescription = BudgetReducers._state.lineItemCategories.list[lineItemCategoryId].description;
				var description = instructor.firstName + " " + instructor.lastName + " " + typeDescription + " for " + termDescription;
	
				let lineItem = {
					budgetScenarioId: BudgetReducers._state.ui.selectedBudgetScenarioId,
					description: description,
					lineItemCategoryId: lineItemCategoryId,
					categoryDescription: categoryDescription,
					hidden: false,
					teachingAssignmentId: teachingAssignment.id
				};
	
				return lineItem;
			},
			calculateInstructors: function() {
				var self = this;
				var instructorTypes = BudgetReducers._state.instructorTypes;
				var activeInstructors = BudgetReducers._state.activeInstructors;
				var assignedInstructors = BudgetReducers._state.assignedInstructors;
	
				var calculatedInstructors = [];
				var calculatedActiveInstructors = [];
				var usedInstructorIds = [];
	
				activeInstructors.ids.forEach(function(instructorId) {
					if (usedInstructorIds.indexOf(instructorId) > -1) { return; }
	
					calculatedActiveInstructors.push(self._generateInstructor(instructorId));
					calculatedInstructors.push(self._generateInstructor(instructorId));
					usedInstructorIds.push(instructorId);
				});
	
				assignedInstructors.ids.forEach(function(instructorId) {
					if (usedInstructorIds.indexOf(instructorId) > -1) { return; }
	
					calculatedInstructors.push(self._generateInstructor(instructorId));
					usedInstructorIds.push(instructorId);
				});

				calculatedInstructors = _array_sortByProperty(calculatedInstructors, ["instructorTypeDescription", "lastName"]);
				calculatedActiveInstructors = _array_sortByProperty(calculatedActiveInstructors, ["instructorTypeDescription", "lastName"]);

				let instructorAssignmentOptions = [];
	
				instructorTypes.ids.forEach(function(instructorTypeId) {
					var instructorType = instructorTypes.list[instructorTypeId];
					instructorType.isInstructorType = true;
					instructorAssignmentOptions.push(instructorType);
				});
	
				instructorAssignmentOptions.push({
					rowType: "subheader",
					description: "Instructors"
				});
	
				instructorAssignmentOptions = instructorAssignmentOptions.concat(calculatedActiveInstructors);
	
				BudgetReducers.reduce({
					type: ActionTypes.CALCULATE_INSTRUCTORS,
					payload: {
						calculatedInstructors: calculatedInstructors,
						instructorAssignmentOptions: instructorAssignmentOptions,
						regularInstructorAssignmentOptions: calculatedActiveInstructors
					}
				});
			},
			_generateInstructor: function (instructorId) {
				var instructorCosts = BudgetReducers._state.instructorCosts;
				var instructorTypes = BudgetReducers._state.instructorTypes;
				var instructorTypeCosts = BudgetReducers._state.instructorTypeCosts;
				var assignedInstructors = BudgetReducers._state.assignedInstructors;
				var activeInstructors = BudgetReducers._state.activeInstructors;
				var instructor = assignedInstructors.list[instructorId] || activeInstructors.list[instructorId];
				var budgetId = BudgetReducers._state.budget.id;
				var users = BudgetReducers._state.users;
				var userRoles = BudgetReducers._state.userRoles;
				var assignedInstructors = BudgetReducers._state.assignedInstructors;
				var activeInstructors = BudgetReducers._state.activeInstructors;
				var workgroupId = BudgetReducers._state.ui.workgroupId;

				instructor.instructorCost = null;
				instructor.description = instructor.lastName + ", " + instructor.firstName;
	
				instructor.instructorType = this._calculateInstructorType(instructor.id);
				// Attach instructorCost
				instructorCosts.ids.forEach(function(instructorCostId) {
					var instructorCost = instructorCosts.list[instructorCostId];

					if (instructorCost.instructorId != instructor.id) { return; }

					instructor.instructorCost = instructorCost;
					var user = users.byLoginId[instructor.loginId.toLowerCase()];
          if (!user) { return; }

					var instructorTypeId = null;

					for (var i = 0; i < userRoles.ids.length; i++) {
						var userRole = userRoles.list[userRoles.ids[i]];
	
						if (userRole.roleId == Roles.instructor && userRole.userId == user.id && userRole.workgroupId == workgroupId) {
							instructorTypeId = userRole.instructorTypeId;
							break;
						}
					}

					instructorCost.instructorTypeId = instructorTypeId;
					instructorCost.instructorType = instructorTypes.list[instructorTypeId];
					instructorCost.overrideCost = null;
					instructorCost.overrideCostSource = null;
					instructorCost.overrideCostSourceDescription = null;

					instructorCost.instructorTypeCost = instructorTypeCosts.byInstructorTypeId[instructorCost.instructorTypeId];

					if (instructorCost.cost) {
						instructorCost.overrideCost = instructorCost.cost;
						instructorCost.overrideCostSource = "instructor";
					}

					if (!instructorCost.cost && instructorCost.instructorTypeCost && instructorCost.instructorTypeCost.cost) {
						instructorCost.overrideCost = instructorCost.instructorTypeCost.cost;
						instructorCost.overrideCostSource = "instructor type";
						instructorCost.overrideCostSourceDescription = instructorCost.instructorType.description + " category";
					}
				});

				if (instructor.instructorCost == null) {
					instructor.instructorCost = {
						id: null,
						cost: null,
						instructorId: instructor.id,
						budgetId: budgetId
					};
				}
	
				return instructor;
			},
			calculateInstructorTypeCosts: function () {
				var instructorTypes = BudgetReducers._state.instructorTypes;
				var instructorTypeCosts = BudgetReducers._state.instructorTypeCosts;
				var budgetId = BudgetReducers._state.budget.id;
	
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
	
				BudgetReducers.reduce({
					type: ActionTypes.CALCULATE_INSTRUCTOR_TYPE_COSTS,
					payload: {
						calculatedInstructorTypeCosts: calculatedInstructorTypeCosts
					}
				});
			},
			// Will first look at userRoles for a match, and then teachingAssignments as a fallback.
			_calculateInstructorType: function(instructorId) {
				var instructorType = null;
	
				var assignedInstructors = BudgetReducers._state.assignedInstructors;
				var activeInstructors = BudgetReducers._state.activeInstructors;
	
				var users = BudgetReducers._state.users;
				var userRoles = BudgetReducers._state.userRoles;
				var teachingAssignments = BudgetReducers._state.teachingAssignments;
				var instructorTypes = BudgetReducers._state.instructorTypes;
	
				var instructor = assignedInstructors.list[instructorId] || activeInstructors.list[instructorId];
				var user = users.byLoginId[instructor.loginId.toLowerCase()];
	
				if (!user) { return; }
	
				if (userRoles.byUserId[user.id]) {
					userRoles.byUserId[user.id].forEach(function(userRole) {
						if (userRole.roleId != Roles.instructor) { return; }
	
						instructorType = instructorTypes.list[userRole.instructorTypeId];
					});
				}
	
				if (instructorType) { return instructorType; }
	
				// Find instructorType by teachingAssignment
				teachingAssignments.ids.forEach(function(teachingAssignmentId) {
					var teachingAssignment = teachingAssignments.list[teachingAssignmentId];
	
					if (teachingAssignment.instructorId == instructor.id) {
						instructorType = instructorTypes.list[teachingAssignment.instructorTypeId];
					}
				});
	
				return instructorType;
			},
			calculateSummaryTotals: function () {
				let _self = this;
				var selectedBudgetScenario = BudgetReducers._state.budgetScenarios.list[BudgetReducers._state.ui.selectedBudgetScenarioId];
				var scheduleCosts = BudgetReducers._state.calculatedScheduleCosts;
				var lineItems = BudgetReducers._state.lineItems;
				var activeTerms = selectedBudgetScenario.terms;
	
				// Calculate lineItem 'cost'
				var lineItemsAmount = 0;
				lineItems.ids.forEach(function(lineItemId) {
					var lineItem = lineItems.list[lineItemId];
					lineItemsAmount += lineItem.amount;
				});
	
				var summary = BudgetReducers._state.summary = {};
				summary.terms = activeTerms;
				summary.byTerm = {};
				summary.combinedTerms = {
					taCount: 0,
					taCost: 0,
					readerCount: 0,
					readerCost: 0,
					supportCosts: 0,
					totalUnits: 0,
					replacementCosts: {
						overall: 0,
						instructorTypeIds: [],
						byInstructorTypeId: {}
					},
					totalCosts: 0,
					funds: 0,
					balance: 0,
					totalSCH: 0,
					gradSCH: 0,
					undergradSCH: 0,
					lowerDivCount: 0,
					upperDivCount: 0,
					graduateCount: 0,
					totalOfferingsCount: 0,
					enrollment: 0
				};
	
				summary.terms.forEach(function(term) {
					summary.byTerm[term] = {
						taCount: 0,
						taCost: 0,
						readerCount: 0,
						readerCost: 0,
						supportCosts: 0,
						totalUnits: 0,
						replacementCosts: {
							overall: 0,
							instructorTypeIds: [],
							byInstructorTypeId: {}
						},
						totalCosts: 0,
						totalSCH: 0,
						gradSCH: 0,
						undergradSCH: 0,
						lowerDivCount: 0,
						upperDivCount: 0,
						graduateCount: 0,
						totalOfferingsCount: 0,
						enrollment: 0,
						sectionCount: 0,
						balance: (lineItemsAmount * -1)
					};
				});

				summary.terms.forEach(function(term) {
					scheduleCosts.byTerm[term].forEach(function(container) {
						container.sectionGroupCosts.forEach(function(sectionGroupCost) {
							summary.byTerm[term].taCount += sectionGroupCost.taCount || 0;
							summary.byTerm[term].taCost += sectionGroupCost.taCost || 0;
							summary.byTerm[term].readerCount += sectionGroupCost.readerCount || 0;
							summary.byTerm[term].readerCost += sectionGroupCost.readerCost || 0;
							summary.byTerm[term].supportCosts += (sectionGroupCost.taCost || 0) + (sectionGroupCost.readerCost || 0);
							summary.byTerm[term].replacementCosts.overall += sectionGroupCost.overrideInstructorCost || 0;
							summary.byTerm[term].replacementCosts = _self._calculateReplacementCost(summary.byTerm[term].replacementCosts, sectionGroupCost);
							summary.byTerm[term].totalCosts += (sectionGroupCost.taCost || 0) + (sectionGroupCost.readerCost || 0) + (sectionGroupCost.overrideInstructorCost || 0);

							var units = 0;

							if (sectionGroupCost.unitsHigh && sectionGroupCost.unitsHigh >= sectionGroupCost.unitsLow) {
								units = sectionGroupCost.unitsHigh;
							} else if (sectionGroupCost.unitsLow && sectionGroupCost.unitsLow > sectionGroupCost.unitsHigh) {
								units = sectionGroupCost.unitsLow;
							}

							if (sectionGroupCost.courseNumber >= 200) {
								summary.byTerm[term].gradSCH += (sectionGroupCost.enrollment || 0) * (sectionGroupCost.unitsLow || 0);
							} else {
								summary.byTerm[term].undergradSCH += (sectionGroupCost.enrollment || 0) * (sectionGroupCost.unitsLow || 0);
							}

							summary.byTerm[term].totalUnits += units;
							summary.byTerm[term].totalSCH += (sectionGroupCost.enrollment || 0) * (sectionGroupCost.unitsLow || 0);
							summary.byTerm[term].lowerDivCount += (parseInt(sectionGroupCost.courseNumber) < 100 ? 1 : 0);
							summary.byTerm[term].upperDivCount += (parseInt(sectionGroupCost.courseNumber) >= 100 && parseInt(sectionGroupCost.courseNumber) < 200 ? 1 : 0);
							summary.byTerm[term].graduateCount += (parseInt(sectionGroupCost.courseNumber) > 199 ? 1 : 0);
							summary.byTerm[term].enrollment += sectionGroupCost.enrollment || 0;
							summary.byTerm[term].sectionCount += sectionGroupCost.sectionCount || 0;
							summary.byTerm[term].totalOfferingsCount += 1;
						});
					});

					summary.combinedTerms.taCount += summary.byTerm[term].taCount;
					summary.combinedTerms.taCost += summary.byTerm[term].taCost;
					summary.combinedTerms.readerCount += summary.byTerm[term].readerCount;
					summary.combinedTerms.readerCost += summary.byTerm[term].readerCost;
					summary.combinedTerms.supportCosts += summary.byTerm[term].supportCosts;
					summary.combinedTerms.replacementCosts.overall += summary.byTerm[term].replacementCosts.overall;
					summary.combinedTerms.replacementCosts = _self._combineReplacementCost(summary.combinedTerms.replacementCosts, summary.byTerm[term].replacementCosts);
					summary.combinedTerms.totalCosts += summary.byTerm[term].totalCosts;
					summary.combinedTerms.totalUnits += summary.byTerm[term].totalUnits;
					summary.combinedTerms.totalSCH += summary.byTerm[term].totalSCH;
					summary.combinedTerms.gradSCH += summary.byTerm[term].gradSCH;
					summary.combinedTerms.undergradSCH += summary.byTerm[term].undergradSCH;
					summary.combinedTerms.lowerDivCount += summary.byTerm[term].lowerDivCount;
					summary.combinedTerms.upperDivCount += summary.byTerm[term].upperDivCount;
					summary.combinedTerms.graduateCount += summary.byTerm[term].graduateCount;
					summary.combinedTerms.totalOfferingsCount += summary.byTerm[term].totalOfferingsCount;
					summary.combinedTerms.enrollment += summary.byTerm[term].enrollment;
				});

				BudgetReducers.reduce({
					type: ActionTypes.CALCULATE_SUMMARY_TOTALS,
					payload: {
						summary: summary
					}
				});
			},
			_calculateReplacementCost: function (replacementCosts, sectionGroup) {
				var replacementCost = sectionGroup.overrideInstructorCost;

				if (!replacementCost) { return replacementCosts; }

        var instructorTypeId = null;

        if (sectionGroup.overrideInstructorTypeId) {
          instructorTypeId = sectionGroup.overrideInstructorTypeId;
        } else if (sectionGroup.instructor && sectionGroup.instructor.instructorType && sectionGroup.instructor.instructorType.id) {
          instructorTypeId = sectionGroup.instructor.instructorType.id;
        } else {
          instructorTypeId = sectionGroup.instructorTypeId;
        }

				var instructor = BudgetReducers._state.assignedInstructors.list[sectionGroup.instructorId] || BudgetReducers._state.activeInstructors.list[sectionGroup.instructorId];

				// Course has a cost but no instructor
				if (!instructorTypeId && !instructor) { return replacementCosts; }

				if (!instructorTypeId) {
					instructorTypeId = instructor.instructorType.id;
				}

				var index = replacementCosts.instructorTypeIds.indexOf(instructorTypeId);
	
				if (index == -1) {
					replacementCosts.instructorTypeIds.push(instructorTypeId);
				}
	
				replacementCosts.byInstructorTypeId[instructorTypeId] = replacementCosts.byInstructorTypeId[instructorTypeId] || 0;
	
				// Add cost
				replacementCosts.byInstructorTypeId[instructorTypeId] += replacementCost;

				return replacementCosts;
			},
			_combineReplacementCost: function (replacementCosts, termCosts) {
				termCosts.instructorTypeIds.forEach(function (instructorTypeId) {
					// Add any newly identified instructorTypes
					var index = replacementCosts.instructorTypeIds.indexOf(instructorTypeId);
					if (index == -1) {
						replacementCosts.instructorTypeIds.push(instructorTypeId);
					}
		
					// Ensure not null (un-initialized)
					replacementCosts.byInstructorTypeId[instructorTypeId] = replacementCosts.byInstructorTypeId[instructorTypeId] > 0 ? replacementCosts.byInstructorTypeId[instructorTypeId] : 0;
	
					// Add costs
					replacementCosts.byInstructorTypeId[instructorTypeId] += termCosts.byInstructorTypeId[instructorTypeId];
				});
	
				return replacementCosts;
			},
			calculateCourseList: function () {
				var sectionGroups = BudgetReducers._state.sectionGroups;
				var sectionGroupCosts = BudgetReducers._state.sectionGroupCosts;
				var selectedBudgetScenario = BudgetReducers._state.budgetScenarios.list[BudgetReducers._state.ui.selectedBudgetScenarioId];
				var activeTerm = BudgetReducers._state.ui.termNav.activeTerm;

				// List of sectionGroupCosts, sorted by subj/course/sequence
				// template will filter by isBudgeted, isScheduled, termCode
				var courseList = [];

				// Find sectionGroupCosts
				sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
					var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

					// Ensure sectionGroupCost belongs to an active term in this scenario
					var shortTermCode = sectionGroupCost.termCode.slice(-2);
					if (activeTerm != shortTermCode) { return; }

					// Ensure sectionGroupCost is part of current scenario
					if (sectionGroupCost.budgetScenarioId != selectedBudgetScenario.id) { return; }

					sectionGroupCost.shortTermCode = sectionGroupCost.termCode.slice(-2);
					sectionGroupCost.isPersisted = true;

					sectionGroupCost.isBudgeted = !sectionGroupCost.disabled;
					var key = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode;
					sectionGroupCost.isScheduled = sectionGroups.idsByUniqueKey[key] > 0;

					// These sectionGroupCosts were once apart of the schedule and budget, but have since been removed
					if (sectionGroupCost.isScheduled == false && sectionGroupCost.isBudgeted == false) { return; }

					courseList.push(sectionGroupCost);
				});

				// Find sectionGroups that aren't budgeted (and create scaffold sectionGroupCosts for them)
				sectionGroups.ids.forEach(function(sectionGroupId) {
					var sectionGroup = sectionGroups.list[sectionGroupId];

					// Ensure sectionGroup belongs to an active term in this scenario
					var shortTermCode = sectionGroup.termCode.slice(-2);
					if (activeTerm != shortTermCode) { return; }

					var uniqueKey = sectionGroup.subjectCode + "-" + sectionGroup.courseNumber + "-" + sectionGroup.sequencePattern + "-" + sectionGroup.termCode + "-" + selectedBudgetScenario.id;
					var sectionGroupCostId = sectionGroupCosts.idsByUniqueKey[uniqueKey];

					// Already persisted in a sectionGroupCost
					if (sectionGroupCostId) { return; }

					var scaffoldedSectionGroupCost = {
						budgetScenarioId: selectedBudgetScenario.id,
						title: sectionGroup.title,
						subjectCode: sectionGroup.subjectCode,
						courseNumber: sectionGroup.courseNumber,
						sequencePattern: sectionGroup.sequencePattern,
						termCode: sectionGroup.termCode,
						shortTermCode: shortTermCode,
						sectionCount: sectionGroup.sectionCount,
						enrollment: sectionGroup.totalSeats,
						sectionGroupId: sectionGroup.id,
						isBudgeted: false,
						isScheduled: true,
						isPersisted: false
					};

					courseList.push(scaffoldedSectionGroupCost);
				});

				courseList = _array_sortByProperty(courseList, ["subjectCode", "courseNumber", "sequencePattern"]);

				BudgetReducers.reduce({
					type: ActionTypes.CALCULATE_COURSE_LIST,
					payload: {
						courseList: courseList
					}
				});

				return courseList;
			}
		};
	}
}

BudgetCalculations.$inject = ['BudgetReducers', 'TermService', 'Roles', 'ActionTypes', 'ScheduleCostCalculations'];

export default BudgetCalculations;
