class BudgetComparisonReportCalculations {
	constructor(BudgetComparisonReportReducers, ActionTypes, Roles, UserService) {
		return {
			calculateView: function () {
				var budget = BudgetComparisonReportReducers._state.budget;
				var budgetScenarios = BudgetComparisonReportReducers._state.budgetScenarios;
				var lineItems = BudgetComparisonReportReducers._state.lineItems;
				var sectionGroups = BudgetComparisonReportReducers._state.sectionGroups;
				var teachingAssignments = BudgetComparisonReportReducers._state.teachingAssignments;
				var instructorTypeCosts = BudgetComparisonReportReducers._state.instructorTypeCosts;
				var instructorCosts = BudgetComparisonReportReducers._state.instructorCosts;
				var sectionGroupCosts = BudgetComparisonReportReducers._state.sectionGroupCosts;

				sectionGroups = this._generateUnassignedSectionGroups(sectionGroups, teachingAssignments);

				var calculatedView = {
					ui: {
						currentSelectedBudgetScenario: this._getBudgetScenario(budgetScenarios.currentSelectedScenarioId, BudgetComparisonReportReducers._state.budgetScenarios.current),
						previousSelectedBudgetScenario: this._getBudgetScenario(budgetScenarios.previousSelectedScenarioId, BudgetComparisonReportReducers._state.budgetScenarios.previous),
						currentBudgetScenarios: this._getBudgetScenarios(BudgetComparisonReportReducers._state.budgetScenarios.current),
						previousBudgetScenarios: this._getBudgetScenarios(BudgetComparisonReportReducers._state.budgetScenarios.previous)
					},
					current: {
						costs: this._generateCosts(teachingAssignments.current, instructorTypeCosts.current, instructorCosts.current, sectionGroupCosts.current, budget.current, budgetScenarios.currentSelectedScenarioId),
						funding: this._generateFunding(lineItems.current, budgetScenarios.currentSelectedScenarioId),
						miscStats: this._generateMiscStats(sectionGroupCosts.current, budgetScenarios.currentSelectedScenarioId)
					},
					previous: {
						costs: this._generateCosts(teachingAssignments.previous, instructorTypeCosts.previous, instructorCosts.previous, sectionGroupCosts.previous, budget.previous, budgetScenarios.previousSelectedScenarioId, sectionGroups.previous),
						funding: this._generateFunding(lineItems.previous, budgetScenarios.previousSelectedScenarioId),
						miscStats: this._generateMiscStats(sectionGroupCosts.previous, budgetScenarios.previousSelectedScenarioId)
					}
				};

				calculatedView.change = {
					costs: this._generateCostChange(calculatedView.current.costs, calculatedView.previous.costs),
					funding: this._generatefundingChange(calculatedView.current.funding, calculatedView.previous.funding),
					miscStats: this._generateMiscStatsChange(calculatedView.current.miscStats, calculatedView.previous.miscStats),
					courseCount: this._generateCourseCountChange(sectionGroups.current.unassigned, sectionGroups.previous.unassigned)
				};

				BudgetComparisonReportReducers.reduce({
					type: ActionTypes.CALCULATE_VIEW,
					payload: {
						calculatedView: calculatedView
					}
				});
			},
			// Generates stats on seats and # of courses per area
			_generateMiscStats(sectionGroupCosts, currentSelectedScenarioId) {
				var miscStats = {
					lower: {
						courses: 0,
						seats: 0
					},
					upper: {
						courses: 0,
						seats: 0
					},
					grad: {
						courses: 0,
						seats: 0
					},
					total: {
						courses: 0,
						seats: 0
					}
				};

				sectionGroupCosts.ids.forEach((sectionGroupCostId) => {
					var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

					if (sectionGroupCost.disabled) { return; }
					if (sectionGroupCost.budgetScenarioId != currentSelectedScenarioId) { return; }

					var courseNumber = parseInt(sectionGroupCost.courseNumber);
					var seats = sectionGroupCost.enrollment;

					if (courseNumber < 100) {
						miscStats.lower.courses += 1;
						miscStats.lower.seats += seats;
					} else if (courseNumber >= 200) {
						miscStats.grad.courses += 1;
						miscStats.grad.seats +=  0; // Intentionally always zero, as this total is not relevant
					} else {
						miscStats.upper.courses += 1;
						miscStats.upper.seats += seats;
					}
				});

				miscStats.total.courses = miscStats.lower.courses + miscStats.grad.courses + miscStats.upper.courses;
				miscStats.total.seats = miscStats.lower.seats + miscStats.grad.seats + miscStats.upper.seats;

				return miscStats;
			},
			// Generates calculations for instructor and support (reader, TA) costs
			_generateCosts(teachingAssignments, instructorTypeCosts, instructorCosts, sectionGroupCosts, budget, selectedScenarioId) {
				var costs = {
					instructorCosts: this._generateInstructionCosts(teachingAssignments, instructorTypeCosts, instructorCosts, sectionGroupCosts, selectedScenarioId),
					supportCosts:this. _generateSupportCosts(budget, selectedScenarioId, sectionGroupCosts),
					total: null
				};

				costs.total = costs.instructorCosts.total.cost + costs.supportCosts.totalCost;

				return costs;
			},
			// Returns the cost associated with an assignment's instructor, based on the selected budget scenario
			_calculateAssignmentCost(sectionGroupCost, teachingAssignment, selectedScenarioId, instructorTypeCosts, instructorCosts, sectionGroupCosts, teachingAssignments) {
				var cost = null;
				var instructorTypeId = null;

				var instructorTypeCost = null;
				var instructorCost = null;
				var courseCost = sectionGroupCost.cost;

				// If an instructor is set
				if (sectionGroupCost.instructorId) {
					var instructorCostId = instructorCosts.byInstructorId[sectionGroupCost.instructorId];
					instructorCost = instructorCosts.list[instructorCostId] ? instructorCosts.list[instructorCostId].cost : instructorCost;

					var instructorType = this._calculateInstructorType(sectionGroupCost.instructorId, teachingAssignments);
					if (!instructorType) { return null; }

					instructorTypeId = instructorType.id;
					var instructorTypeCostId = instructorTypeCosts.byInstructorTypeId[instructorTypeId];
					instructorTypeCost = instructorTypeCosts.list[instructorTypeCostId] ? instructorTypeCosts.list[instructorTypeCostId].cost : null;
				// If an instructorType is set
				} else if (sectionGroupCost.instructorTypeId) {
					var instructorTypeCostId = instructorTypeCosts.byInstructorTypeId[sectionGroupCost.instructorTypeId];
					instructorTypeCost = instructorTypeCosts.list[instructorTypeCostId] ? instructorTypeCosts.list[instructorTypeCostId].cost : null;
					instructorTypeId = sectionGroupCost.instructorTypeId;
				// If there is an assignment
				} else if (teachingAssignment) {
					if (teachingAssignment.instructorId) {
						instructorTypeId = teachingAssignment.instructorTypeId;
						instructorCost = instructorCosts.byInstructorId[teachingAssignment.instructorId] ? instructorCosts.byInstructorId[teachingAssignment.instructorId].cost : null;
						instructorTypeCost = instructorTypeCosts.byInstructorTypeId[instructorTypeId] ? instructorTypeCosts.byInstructorTypeId[instructorTypeId].cost : null;
					} else if (teachingAssignment.instructorTypeId) {
						instructorTypeId = teachingAssignment.instructorTypeId;
						instructorTypeCost = instructorTypeCosts.byInstructorTypeId[instructorTypeId] ? instructorTypeCosts.byInstructorTypeId[instructorTypeId].cost : null;
					}
				} else {
					return null;
				}

				if (courseCost) {
					cost = courseCost;
				} else if (instructorCost) {
					cost = instructorCost;
				} else if (instructorTypeCost) {
					cost = instructorTypeCost;
				} else {
					cost = null;
				}

				return {
					cost: cost,
					instructorTypeId: instructorTypeId
				};
			},
			// Generates instructor costs (based on sectionGroupCosts, and the selected budget scenario)
			_generateInstructionCosts(teachingAssignments, instructorTypeCosts, instructorCosts, sectionGroupCosts, selectedScenarioId) {
				var _self = this;
				var instructionCosts = {
					byType: {},
					byTypeNoCost: {},
					scenarioCourses: {},
					unassigned: 0,
					total: {
						cost: 0,
						courses: 0
					}
				};

				sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
					var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

					if (sectionGroupCost.budgetScenarioId != selectedScenarioId) { return; }
					if (sectionGroupCost.disabled) { return; }
					if (!sectionGroupCost.instructorTypeId) { instructionCosts.unassigned++; }

					var teachingAssignment = _self._getTeachingAssignment(sectionGroupCost.sectionGroupId);
					var assignmentCosts = _self._calculateAssignmentCost(sectionGroupCost, teachingAssignment, selectedScenarioId, instructorTypeCosts, instructorCosts, sectionGroupCosts, teachingAssignments);

					if (!assignmentCosts) { return; }

					var instructorTypeId = assignmentCosts.instructorTypeId;
					var assignmentCost = assignmentCosts.cost;

					instructionCosts.byType[instructorTypeId] = instructionCosts.byType[instructorTypeId] || {
						cost: 0,
						courses: 0
					};

					if (!assignmentCost) {
						instructionCosts.byTypeNoCost[instructorTypeId] = instructionCosts.byTypeNoCost[instructorTypeId] || 0;
						instructionCosts.byTypeNoCost[instructorTypeId] += 1;
					}

					instructionCosts.byType[instructorTypeId].courses += 1;
					instructionCosts.byType[instructorTypeId].cost += assignmentCost;
					instructionCosts.total.cost += assignmentCost;
					instructionCosts.total.courses += 1;
				});

				var instructorTypes = [...new Set([...Object.keys(instructionCosts.byType), ...Object.keys(instructionCosts.byTypeNoCost)])];

				instructorTypes.forEach(function(instructorType) {
					instructionCosts.scenarioCourses[instructorType] = instructionCosts.byType[instructorType].courses - (instructionCosts.byTypeNoCost[instructorType] || 0);
				});

				return instructionCosts;
			},
			// Generates support (reader and TA) based costs and course count
			_generateSupportCosts(budget, selectedScenarioId, sectionGroupCosts) {
				var supportCosts = {
					taCount: 0,
					readerCount: 0,
					taCost: 0,
					readerCost: 0,
					totalCost: 0,
					totalCount: 0,
				};

				sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
					var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];
					if (sectionGroupCost.budgetScenarioId != selectedScenarioId || sectionGroupCost.disabled) { return; }

					supportCosts.taCount += sectionGroupCost.taCount || 0;
					supportCosts.readerCount += sectionGroupCost.readerCount || 0;	
				});

				supportCosts.taCost = supportCosts.taCount * budget.taCost;
				supportCosts.readerCost = supportCosts.readerCount * budget.readerCost;

				supportCosts.totalCount += supportCosts.taCount + supportCosts.readerCount;
				supportCosts.totalCost += supportCosts.taCost + supportCosts.readerCost;

				return supportCosts;
			},
			// Generates funding values based on the selected budget scenario
			_generateFunding(lineItems, selectedScenarioId) {
				var funding = {
					typeIds: [],
					types: {},
					total: 0
				};

				lineItems.ids.forEach(function(lineItemId) {
					var lineItem = lineItems.list[lineItemId];
					var lineItemCategoryId = lineItem.lineItemCategoryId;

					if (lineItem.budgetScenarioId != selectedScenarioId || lineItem.amount == 0) { return; }

					if (funding.typeIds.indexOf(lineItemCategoryId) == -1) {
						funding.typeIds.push(lineItemCategoryId);
					}

					funding.types[lineItemCategoryId] = funding.types[lineItemCategoryId] || 0;
					funding.types[lineItemCategoryId] += lineItem.amount;
					funding.total += lineItem.amount;
				});

				return funding;
			},
			// Generates previous -> current change values for costs
			_generateCostChange(currentCosts, previousCosts) {
				var _self = this;

				var costs = {
					instructorCosts: {
						byType: {},
						total: {
							cost: 0,
							courses: 0
						}
					},
					supportCosts: {
						ta: {
							rawCount: (currentCosts.supportCosts.taCount - previousCosts.supportCosts.taCount).toFixed(2),
							percentageCount: this._percentageChange(previousCosts.supportCosts.taCount, currentCosts.supportCosts.taCount),
							rawCost: currentCosts.supportCosts.taCost - previousCosts.supportCosts.taCost,
							percentageCost: this._percentageChange(previousCosts.supportCosts.taCost, currentCosts.supportCosts.taCost)
						},
						reader: {
							rawCount: (currentCosts.supportCosts.readerCount - previousCosts.supportCosts.readerCount).toFixed(2),
							percentageCount: this._percentageChange(previousCosts.supportCosts.readerCount, currentCosts.supportCosts.readerCount),
							rawCost: currentCosts.supportCosts.readerCost - previousCosts.supportCosts.readerCost,
							percentageCost: this._percentageChange(previousCosts.supportCosts.readerCost, currentCosts.supportCosts.readerCost),
						},
						rawTotalCost: currentCosts.supportCosts.totalCost - previousCosts.supportCosts.totalCost,
						percentageTotalCost: this._percentageChange(previousCosts.supportCosts.totalCost, currentCosts.supportCosts.totalCost)
					}
				};

				var instructorTypes = BudgetComparisonReportReducers._state.instructorTypes;

				instructorTypes.current.ids.forEach(function(instructorTypeId) {
					var currentInstructorCost = currentCosts.instructorCosts.byType[instructorTypeId];
					var currentCost = currentInstructorCost ? currentInstructorCost.cost : 0;
					var currentCourses = currentInstructorCost ? currentInstructorCost.courses : 0;
					var currentCoursesCount = currentInstructorCost ? currentCosts.instructorCosts.scenarioCourses[instructorTypeId] : 0;

					var previousInstructorCost = previousCosts.instructorCosts.byType[instructorTypeId];
					var previousCost = previousInstructorCost ? previousInstructorCost.cost : 0;
					var previousCourses = previousInstructorCost ? previousInstructorCost.courses : 0;
					var previousCoursesCount = previousInstructorCost ? previousCosts.instructorCosts.scenarioCourses[instructorTypeId] : 0;

					costs.instructorCosts.byType[instructorTypeId] = {
						rawCourses: currentCourses - previousCourses,
						percentageCourses: _self._percentageChange(previousCourses, currentCourses),
						rawCost: currentCost - previousCost,
						percentageCost: _self._percentageChange(previousCost, currentCost),
						percentageCoursesCount: _self._percentageChange(previousCoursesCount, currentCoursesCount)
					};
				});

				costs.instructorCosts.total = {
					rawCost: currentCosts.instructorCosts.total.cost - previousCosts.instructorCosts.total.cost,
					rawCourses: currentCosts.instructorCosts.total.courses - previousCosts.instructorCosts.total.courses,
					percentageCost: _self._percentageChange(previousCosts.instructorCosts.total.cost, currentCosts.instructorCosts.total.cost),
					percentageCourses: _self._percentageChange(previousCosts.instructorCosts.total.courses, currentCosts.instructorCosts.total.courses)
				};

				return costs;
			},
			// Generates previous -> current change values for funds
			_generatefundingChange(currentFunding, previousFunding) {
				var _self = this;
				var lineItemCategories = BudgetComparisonReportReducers._state.lineItemCategories;

				var fundingChange = {
					types: {},
					rawTotal: 0,
					percentageTotal: 0
				};

				lineItemCategories.current.ids.forEach(function(lineItemCategoryId) {
					var currentRaw = currentFunding.types[lineItemCategoryId] || 0;
					var previousRaw = previousFunding.types[lineItemCategoryId] || 0;
					
					fundingChange.types[lineItemCategoryId] = {
						raw: currentRaw - previousRaw,
						percentage: _self._percentageChange(previousRaw, currentRaw)
					};

					fundingChange.rawTotal += fundingChange.types[lineItemCategoryId].raw;
				});

				fundingChange.percentageTotal = this._percentageChange(previousFunding.total, currentFunding.total);

				return fundingChange;
			},
			_generateUnassignedSectionGroups(sectionGroups, teachingAssignments) {
				var newSectionGroups = sectionGroups;

				for (var year in sectionGroups) {
					var unassignedSectionGroups = [];
					var assignedSectionGroups = Object.keys(teachingAssignments[year].bySectionGroupId);

					sectionGroups[year].ids.forEach(function (sectionGroupId) {
						if (assignedSectionGroups.indexOf(sectionGroupId.toString()) < 0) {
							unassignedSectionGroups.push(sectionGroupId);
						}
					});

					newSectionGroups[year].unassigned = unassignedSectionGroups;
				}

				return newSectionGroups;
			},
			// Generates previous -> current change values for misc calculations
			_generateMiscStatsChange(currentMiscStats, previousMiscStats) {
				return {
					lower: {
						courses: currentMiscStats.lower.courses - previousMiscStats.lower.courses,
						seats: currentMiscStats.lower.seats - previousMiscStats.lower.seats
					},
					upper: {
						courses: currentMiscStats.upper.courses - previousMiscStats.upper.courses,
						seats: currentMiscStats.upper.seats - previousMiscStats.upper.seats
					},
					grad: {
						courses: currentMiscStats.grad.courses - previousMiscStats.grad.courses,
						seats: currentMiscStats.grad.seats - previousMiscStats.grad.seats
					},
					total: {
						courses: currentMiscStats.total.courses - previousMiscStats.total.courses,
						seats: currentMiscStats.total.seats - previousMiscStats.total.seats
					}
				};
			},
			// Generates previous -> current change values for misc calculations
			_generateCourseCountChange(currentUnassignedSectionGroups, previousUnassignedSectionGroups) {
				var courseChange = {};
				var previousTotal = previousUnassignedSectionGroups.length || 0;
				var currentTotal = currentUnassignedSectionGroups.length || 0;

				courseChange.total = this._percentageChange(currentTotal, previousTotal);

				return courseChange;
			},
			// Will return null if oldValue is zero, otherwise returns percentage change
			_percentageChange(oldValue, newValue, degreesOfPrecision) {
				if (!oldValue && !newValue) { return "0%"; }

				if (!oldValue) { return null; }

				var roundTo = degreesOfPrecision || 2;

				return ((parseFloat(newValue - oldValue) / oldValue) * 100).toFixed(roundTo) + "%";
			},
			_getBudgetScenario(budgetScenarioId, budgetScenarios) {
				var budgetScenario = null;

				budgetScenarios.ids.forEach(function(slotScenarioId) {
					if (budgetScenarioId == slotScenarioId) {
						budgetScenario = budgetScenarios.list[slotScenarioId];
						budgetScenario.description = budgetScenario.name;
					}
				});

				return budgetScenario;
			},
			_getBudgetScenarios(budgetScenarios) {
				var scenarios = [];

				budgetScenarios.ids.forEach(function(budgetScenarioId) {
					var budgetScenario = budgetScenarios.list[budgetScenarioId];
					budgetScenario.description = budgetScenario.name;
					scenarios.push(budgetScenarios.list[budgetScenarioId]);
				});

				return scenarios;
			},
			_getSectionGroupCost(sectionGroupId, selectedScenarioId) {
				var sectionGroupCostIds = BudgetComparisonReportReducers._state.sectionGroupCosts.current.bySectionGroupId[sectionGroupId] || BudgetComparisonReportReducers._state.sectionGroupCosts.previous.bySectionGroupId[sectionGroupId];
				var sectionGroupCost = null;

				if (!sectionGroupCostIds) { return null; }

				sectionGroupCostIds.forEach(function(sectionGroupCostId) {
					var slotSectionGroupCost = BudgetComparisonReportReducers._state.sectionGroupCosts.current.list[sectionGroupCostId] || BudgetComparisonReportReducers._state.sectionGroupCosts.previous.list[sectionGroupCostId];

					if (slotSectionGroupCost.budgetScenarioId == selectedScenarioId) {
						sectionGroupCost = slotSectionGroupCost;
					}
				});

				return sectionGroupCost;
			},
			_getTeachingAssignment(sectionGroupId) {
				var teachingAssignmentIds = BudgetComparisonReportReducers._state.teachingAssignments.current.bySectionGroupId[sectionGroupId] || BudgetComparisonReportReducers._state.teachingAssignments.previous.bySectionGroupId[sectionGroupId];

				if (teachingAssignmentIds) {
					return BudgetComparisonReportReducers._state.teachingAssignments.current.list[teachingAssignmentIds[0]] || BudgetComparisonReportReducers._state.teachingAssignments.previous.list[teachingAssignmentIds[0]];
				} else {
					return null;
				}
			},
			// Will first look at userRoles for a match, and then teachingAssignments as a fallback.
			_calculateInstructorType: function(instructorId, teachingAssignments) {
				var instructors = BudgetComparisonReportReducers._state.instructors;
				var users = BudgetComparisonReportReducers._state.users;
				var userRoles = BudgetComparisonReportReducers._state.userRoles;
				var instructorTypes = BudgetComparisonReportReducers._state.instructorTypes.current;
				var instructorType = null;
				var instructor = instructors.list[instructorId];

				if (!instructor) { return null; }

				var user = UserService.getUserByInstructor(instructor, users);

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
			}
		};
	}
}

BudgetComparisonReportCalculations.$inject = ['BudgetComparisonReportReducers', 'ActionTypes', 'Roles', 'UserService'];

export default BudgetComparisonReportCalculations;
