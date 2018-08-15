class ScheduleCostCalculations {
  constructor (BudgetReducers, TermService, Roles, ActionTypes) {
    return {
      /*
      Generates the schedule costs view
      */
      calculateScheduleCosts: function () {
        var _this = this;
        var selectedBudgetScenario = BudgetReducers._state.budgetScenarios.list[BudgetReducers._state.ui.selectedBudgetScenarioId];
        var sectionGroupCosts = BudgetReducers._state.sectionGroupCosts;
        var sectionGroups = BudgetReducers._state.scheduleSectionGroups;
        var activeTerms = selectedBudgetScenario.terms;

        var scheduleCosts = {
          terms: selectedBudgetScenario.terms,
          byTerm: {}
        };

        activeTerms.forEach(function(term) {
          scheduleCosts.byTerm[term] = [];
        });

        sectionGroupCosts.uniqueKeys.forEach(function(uniqueKey) {
          var sectionGroupCostId = sectionGroupCosts.idsByUniqueKey[uniqueKey];
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          // Ensure sectionGroupCost belongs to an active term in this scenario
          var shortTerm = sectionGroupCost.termCode.slice(-2);

          if (selectedBudgetScenario.terms.indexOf(shortTerm) == -1) { return; }

          sectionGroupCost.sectionGroup = sectionGroups.list[uniqueKey];

          // Calculate instructor cost
          _this._calculateInstructorCost(sectionGroupCost);

          // Attach comments data
          _this._calculateSectionGroupCostComments(sectionGroupCost);

          // Attach cost data
          _this._calculateSectionGroupFinancialCosts(sectionGroupCost);

          // Generate container if one does not already exist
          var container = self.calculateSectionGroupContainer(sectionGroup, scheduleCosts.byTerm[shortTerm]);
          container.sectionGroups.push(sectionGroup);
        });

        // // Sort termCourses
        // activeTerms.forEach(function(term) {
        // 	scheduleCosts.byTerm[term] = _array_sortByProperty(scheduleCosts.byTerm[term], "uniqueKey");
        // });

        // BudgetReducers.reduce({
        // 	type: ActionTypes.CALCULATE_SECTION_GROUPS,
        // 	payload: {
        // 		scheduleCosts: scheduleCosts
        // 	}
        // });

        // this.calculateTotalCost();
      },
      _calculateInstructorCost: function(sectionGroupCost) {
        var _this = this;

        sectionGroupCost.overrideInstructorCost = null;
        sectionGroupCost.overrideInstructorCostSource = "course";

        // If course cost => Use course cost
        if (sectionGroupCost.cost) {
          sectionGroupCost.overrideInstructorCost = angular.copy(sectionGroupCost.cost);
          sectionGroupCost.overrideInstructorCostSource = "course";
          sectionGroupCost.newInstructorCost = null;
          return;
        }

        // If instructor => Use instructor cost
        if (sectionGroupCost.instructorId > 0) {
          var instructorCost = BudgetReducers._state.instructorCosts.byInstructorId[sectionGroupCost.instructorId];
          var instructor = BudgetReducers._state.assignedInstructors.list[sectionGroupCost.instructorId] || BudgetReducers._state.activeInstructors.list[sectionGroupCost.instructorId];

          sectionGroupCost.overrideInstructorCost = angular.copy(instructorCost.cost);
          sectionGroupCost.overrideInstructorCostSource = "instructor";
          sectionGroupCost.overrideInstructorCostSourceDescription = instructor.firstName + " " + instructor.lastName;
          sectionGroupCost.newInstructorCost = null;
          return;
        }

        // If instructorType => use instructorType cost
        if (sectionGroupCost.instructorTypeId > 0) {
          var instructorTypeCost = BudgetReducers._state.instructorTypeCosts.byInstructorTypeId[sectionGroupCost.instructorTypeId];
          sectionGroupCost.overrideInstructorCost = angular.copy(instructorTypeCost.cost);
          sectionGroupCost.overrideInstructorCostSource = "instructor type";
          sectionGroupCost.overrideInstructorCostSourceDescription = instructorTypeCost.description + " category";
          sectionGroupCost.newInstructorCost = null;
          return;
        }
      },
      _calculateSectionGroupCostComments: function(sectionGroupCost) {
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

        sectionGroupCost.comments =_array_sortByProperty(sectionGroupCost.comments, "lastModifiedOn", true);
      },
      // Calculate sectionGroup costs
      _calculateSectionGroupFinancialCosts: function(sectionGroupCost) {
        var budget = BudgetReducers._state.budget;
        debugger;
        // Support Costs
        sectionGroupCost.readerCost = sectionGroupCost.readerCount > 0 ? sectionGroupCost.readerCount * budget.readerCost : 0;
        sectionGroupCost.taCost = sectionGroupCost.taCount > 0 ? sectionGroupCost.taCount * budget.taCost : 0;

        sectionGroupCost.courseCostSubTotal = sectionGroupCost.taCost + sectionGroupCost.readerCost;

        // Instructor Costs
        sectionGroupCost.instructorCostSubTotal = sectionGroupCost.overrideInstructorCost || 0;

        sectionGroupCost.totalCost = sectionGroupCost.courseCostSubTotal + sectionGroupCost.instructorCostSubTotal;
      }
    };
  }
}


		// 	calculateTotalCost: function() {
		// 		var courseCosts = 0;
		// 		var lineItemFunds = 0;
		// 		var terms = BudgetReducers._state.calculatedSectionGroups.terms;
		// 		var sectionGroups = BudgetReducers._state.calculatedSectionGroups.byTerm;
	
		// 		// Add sectionGroup costs
		// 		terms.forEach(function(term) {
		// 			sectionGroups[term].forEach(function(course) {
		// 				course.sectionGroups.forEach(function(sectionGroup) {
		// 					courseCosts += sectionGroup.totalCost;
		// 				});
		// 			});
		// 		});
	
		// 		// Add line item costs
		// 		BudgetReducers._state.calculatedLineItems.forEach(function(lineItem) {
		// 			lineItemFunds += lineItem.amount ? lineItem.amount : 0;
		// 		});
	
		// 		var totalCost = lineItemFunds - courseCosts;
	
		// 		BudgetReducers.reduce({
		// 			type: ActionTypes.CALCULATE_TOTAL_COST,
		// 			payload: {
		// 				totalCost: totalCost,
		// 				funds: lineItemFunds,
		// 				scheduleCost: courseCosts,
		// 				budgetScenarioId: BudgetReducers._state.ui.selectedBudgetScenarioId
		// 			}
		// 		});

		// 		this.calculateSummaryTotals();
		// 	},
		// 	// Find or create a sectionGroupContainer for this sectionGroup
		// 	calculateSectionGroupContainer: function(sectionGroup, containers) {
		// 		var course = BudgetReducers._state.courses.list[sectionGroup.courseId];
		// 		var uniqueKey = course.subjectCode + course.courseNumber;
	
		// 		let newContainer = {
		// 			subjectCode: course.subjectCode,
		// 			courseNumber: course.courseNumber,
		// 			title: course.title,
		// 			unitsHigh: course.unitsHigh,
		// 			unitsLow: course.unitsLow,
		// 			courseId: course.id,
		// 			uniqueKey: course.subjectCode + course.courseNumber,
		// 			sectionGroups: []
		// 		};
	
		// 		var properties = ["uniqueKey"];
		// 		var container = _array_find_by_properties(containers, properties, newContainer);
	
		// 		if(container == false || container == undefined) {
		// 			containers.push(newContainer);
		// 			container = newContainer;
		// 		}
	
		// 		return container;
		// 	},
		// 	_findInstructorTypeCostBySectionGroupIdAndInstructorId: function (sectionGroupId, instructorId) {
		// 		var teachingAssignments = BudgetReducers._state.teachingAssignments;
		// 		var instructorTypeCosts = BudgetReducers._state.instructorTypeCosts;
		// 		var users = BudgetReducers._state.users;
		// 		var userRoles = BudgetReducers._state.userRoles;

		// 		var instructor = BudgetReducers._state.activeInstructors.list[instructorId] || BudgetReducers._state.assignedInstructors.list[instructorId];
		// 		var user = BudgetReducers._state.users.byLoginId[instructor.loginId];
		// 		var instructorType = this._calculateInstructorType(instructorId);
		// 		var instructorTypeCost = instructorTypeCosts.byInstructorTypeId[instructorType.id];
	
		// 		return instructorTypeCost;
		// 	},
		// 	calculateLineItems: function() {
		// 		var self = this;
		// 		var calculatedLineItems = [];
	
		// 		// Set meta data on persisted lineItems
		// 		BudgetReducers._state.lineItems.ids.forEach(function(lineItemId) {
		// 			var lineItem = BudgetReducers._state.lineItems.list[lineItemId];
		// 			var selectedBudgetScenarioId = BudgetReducers._state.ui.selectedBudgetScenarioId;
	
		// 			// Ensure lineItem is relevant to user selections
		// 			if (lineItem.budgetScenarioId == selectedBudgetScenarioId) {
		// 				// Apply filtered/hidden logic
		// 				if (self.isLineItemFiltered(lineItem)) { return; }
	
		// 				// Set 'lastModifiedBy', will convert 'user:bobsmith' to 'Smith, Bob'
		// 				if (lineItem.lastModifiedBy) {
		// 					var split = lineItem.lastModifiedBy.split(":");
		// 					if (split.length > 0 && split[0] == "user") {
		// 						var loginId = split[1];
	
		// 						BudgetReducers._state.users.ids.forEach(function(userId) {
		// 							var user = BudgetReducers._state.users.list[userId];
		// 							if (user.loginId == loginId) {
		// 								lineItem.lastModifiedBy = user.firstName + " " + user.lastName;
		// 							}
		// 						});
		// 					}
		// 				}
	
		// 				// Check if orphaned
		// 				if (lineItem.teachingAssignmentId) {
		// 					var teachingAssignment = BudgetReducers._state.teachingAssignments.list[lineItem.teachingAssignmentId];
		// 					lineItem.isOrphaned = teachingAssignment ? false : true;
		// 				}
	
		// 				// Set comments
		// 				lineItem = self.calculateLineItemComments(lineItem);
	
		// 				// Set lineItem category description
		// 				lineItem.categoryDescription = BudgetReducers._state.lineItemCategories.list[lineItem.lineItemCategoryId].description;
	
		// 				calculatedLineItems.push(lineItem);
		// 			}
		// 		});
	
		// 		// Calculate implicit lineItems
		// 		BudgetReducers._state.teachingAssignments.ids.forEach(function(teachingAssignmentId) {
		// 			var teachingAssignment = BudgetReducers._state.teachingAssignments.list[teachingAssignmentId];
	
		// 			if (teachingAssignment.approved == false) { return; }
	
		// 			if (teachingAssignment.buyout || teachingAssignment.workLifeBalance || teachingAssignment.courseRelease) {
		// 				if (self._matchingLineItemExists(teachingAssignment, BudgetReducers._state.lineItems) == false) {
		// 					let lineItem = self.scaffoldLineItem(teachingAssignment);
		// 					calculatedLineItems.push(lineItem);
		// 				}
		// 			}
		// 		});
	
		// 		calculatedLineItems = _array_sortByProperty(calculatedLineItems, "lineItemCategoryId");
	
		// 		BudgetReducers.reduce({
		// 			type: ActionTypes.CALCULATE_LINE_ITEMS,
		// 			payload: {
		// 				calculatedLineItems: calculatedLineItems
		// 			}
		// 		});
		// 	},
		// 	isLineItemFiltered: function(lineItem) {
		// 		var isFiltered = false;
	
		// 		// Hidden lineItem and hidden filter logic
		// 		if (lineItem.hidden && BudgetReducers._state.ui.filters.lineItems.showHidden.selected == false) {
		// 			isFiltered = true;
		// 		}
	
		// 		return isFiltered;
		// 	},
		// 	calculateLineItemComments: function(lineItem) {
		// 		lineItem.comments = [];
		// 		lineItem.commentCount = 0;
	
		// 		BudgetReducers._state.lineItemComments.ids.forEach(function(commentId) {
		// 			var comment = BudgetReducers._state.lineItemComments.list[commentId];
	
		// 			if (comment.lineItemId == lineItem.id) {
		// 				lineItem.comments.push(comment);
		// 				lineItem.commentCount += 1;
		// 			}
		// 		});
	
		// 		lineItem.commentCountDisplay = lineItem.commentCount > 0 ? lineItem.commentCount : '';
	
		// 		// Sort sectionGroupCostComments
		// 		var reverseOrder = true;
		// 		lineItem.comments = _array_sortByProperty(lineItem.comments, "lastModifiedOn", reverseOrder);
	
		// 		return lineItem;
		// 	},
		// 	_matchingLineItemExists: function(teachingAssignment, lineItems) {
		// 		if (lineItems == false || lineItems.ids == false) { return false; }
	
		// 		var lineItemExists = false;
	
		// 		lineItems.ids.forEach(function(lineItemId) {
		// 			var lineItem = lineItems.list[lineItemId];
	
		// 			if (lineItem.teachingAssignmentId == teachingAssignment.id) {
		// 				lineItemExists = true;
		// 				return;
		// 			}
		// 		});
	
		// 		return lineItemExists;
		// 	},
		// 	// Auto-generate a lineItem for this teachingAssignment
		// 	scaffoldLineItem: function(teachingAssignment) {
		// 		var lineItemCategoryId = null;
		// 		var typeDescription = null;
	
		// 		var instructor = BudgetReducers._state.assignedInstructors.list[teachingAssignment.instructorId];
	
		// 		var termDescription = TermService.getTermName(teachingAssignment.termCode);
	
		// 		if (teachingAssignment.buyout) {
		// 			typeDescription = "Buyout Funds";
		// 			lineItemCategoryId = 2;
		// 		} else if (teachingAssignment.workLifeBalance) {
		// 			typeDescription = "Work-Life Balance";
		// 			lineItemCategoryId = 5;
		// 		} else if (teachingAssignment.courseRelease) {
		// 			typeDescription = "Course Release";
		// 			lineItemCategoryId = 6;
		// 		}
	
		// 		var categoryDescription = BudgetReducers._state.lineItemCategories.list[lineItemCategoryId].description;
		// 		var description = instructor.firstName + " " + instructor.lastName + " " + typeDescription + " for " + termDescription;
	
		// 		let lineItem = {
		// 			budgetScenarioId: BudgetReducers._state.ui.selectedBudgetScenarioId,
		// 			description: description,
		// 			lineItemCategoryId: lineItemCategoryId,
		// 			categoryDescription: categoryDescription,
		// 			hidden: false,
		// 			teachingAssignmentId: teachingAssignment.id
		// 		};
	
		// 		return lineItem;
		// 	},
		// 	calculateInstructors: function() {
		// 		var self = this;
		// 		var instructorTypes = BudgetReducers._state.instructorTypes;
		// 		var activeInstructors = BudgetReducers._state.activeInstructors;
		// 		var assignedInstructors = BudgetReducers._state.assignedInstructors;
	
		// 		var calculatedInstructors = [];
		// 		var calculatedActiveInstructors = [];
		// 		var usedInstructorIds = [];
	
		// 		activeInstructors.ids.forEach(function(instructorId) {
		// 			if (usedInstructorIds.indexOf(instructorId) > -1) { return; }
	
		// 			calculatedActiveInstructors.push(self._generateInstructor(instructorId));
		// 			calculatedInstructors.push(self._generateInstructor(instructorId));
		// 			usedInstructorIds.push(instructorId);
		// 		});
	
		// 		assignedInstructors.ids.forEach(function(instructorId) {
		// 			if (usedInstructorIds.indexOf(instructorId) > -1) { return; }
	
		// 			calculatedInstructors.push(self._generateInstructor(instructorId));
		// 			usedInstructorIds.push(instructorId);
		// 		});
	
		// 		calculatedInstructors = _array_sortByProperty(calculatedInstructors, ["instructorTypeDescription", "lastName"]);

		// 		let instructorAssignmentOptions = [];
	
		// 		instructorTypes.ids.forEach(function(instructorTypeId) {
		// 			var instructorType = instructorTypes.list[instructorTypeId];
		// 			instructorType.isInstructorType = true;
		// 			instructorAssignmentOptions.push(instructorType);
		// 		});
	
		// 		instructorAssignmentOptions.push({
		// 			rowType: "subheader",
		// 			description: "Instructors"
		// 		});
	
		// 		instructorAssignmentOptions = instructorAssignmentOptions.concat(calculatedActiveInstructors);
	
		// 		BudgetReducers.reduce({
		// 			type: ActionTypes.CALCULATE_INSTRUCTORS,
		// 			payload: {
		// 				calculatedInstructors: calculatedInstructors,
		// 				instructorAssignmentOptions: instructorAssignmentOptions,
		// 				regularInstructorAssignmentOptions: calculatedActiveInstructors
		// 			}
		// 		});
		// 	},
		// 	_generateInstructor: function (instructorId) {
		// 		var instructorCosts = BudgetReducers._state.instructorCosts;
		// 		var instructorTypes = BudgetReducers._state.instructorTypes;
		// 		var instructorTypeCosts = BudgetReducers._state.instructorTypeCosts;
		// 		var assignedInstructors = BudgetReducers._state.assignedInstructors;
		// 		var activeInstructors = BudgetReducers._state.activeInstructors;
		// 		var instructor = assignedInstructors.list[instructorId] || activeInstructors.list[instructorId];
		// 		var budgetId = BudgetReducers._state.budget.id;
		// 		var users = BudgetReducers._state.users;
		// 		var userRoles = BudgetReducers._state.userRoles;
		// 		var assignedInstructors = BudgetReducers._state.assignedInstructors;
		// 		var activeInstructors = BudgetReducers._state.activeInstructors;
		// 		var workgroupId = BudgetReducers._state.ui.workgroupId;

		// 		instructor.instructorCost = null;
		// 		instructor.description = instructor.lastName + ", " + instructor.firstName;
	
		// 		instructor.instructorType = this._calculateInstructorType(instructor.id);
		// 		// Attach instructorCost
		// 		instructorCosts.ids.forEach(function(instructorCostId) {
		// 			var instructorCost = instructorCosts.list[instructorCostId];

		// 			if (instructorCost.instructorId != instructor.id) { return; }

		// 			instructor.instructorCost = instructorCost;
		// 			var user = users.byLoginId[instructor.loginId.toLowerCase()];
		// 			var instructorTypeId = null;

		// 			for (var i = 0; i < userRoles.ids.length; i++) {
		// 				var userRole = userRoles.list[userRoles.ids[i]];
	
		// 				if (userRole.roleId == Roles.instructor && userRole.userId == user.id && userRole.workgroupId == workgroupId) {
		// 					instructorTypeId = userRole.instructorTypeId;
		// 					break;
		// 				}
		// 			}

		// 			instructorCost.instructorTypeId = instructorTypeId;
		// 			instructorCost.instructorType = instructorTypes.list[instructorTypeId];
		// 			instructorCost.overrideCost = null;
		// 			instructorCost.overrideCostSource = null;
		// 			instructorCost.overrideCostSourceDescription = null;

		// 			instructorCost.instructorTypeCost = instructorTypeCosts.byInstructorTypeId[instructorCost.instructorTypeId];

		// 			if (instructorCost.cost) {
		// 				instructorCost.overrideCost = instructorCost.cost;
		// 				instructorCost.overrideCostSource = "instructor";
		// 			}

		// 			if (!instructorCost.cost && instructorCost.instructorTypeCost && instructorCost.instructorTypeCost.cost) {
		// 				instructorCost.overrideCost = instructorCost.instructorTypeCost.cost;
		// 				instructorCost.overrideCostSource = "instructor type";
		// 				instructorCost.overrideCostSourceDescription = instructorCost.instructorType.description + " category";
		// 			}
		// 		});

		// 		if (instructor.instructorCost == null) {
		// 			instructor.instructorCost = {
		// 				id: null,
		// 				cost: null,
		// 				instructorId: instructor.id,
		// 				budgetId: budgetId
		// 			};
		// 		}
	
		// 		return instructor;
		// 	},
		// 	calculateInstructorTypeCosts: function () {
		// 		var instructorTypes = BudgetReducers._state.instructorTypes;
		// 		var instructorTypeCosts = BudgetReducers._state.instructorTypeCosts;
		// 		var budgetId = BudgetReducers._state.budget.id;
	
		// 		var calculatedInstructorTypeCosts = [];
	
		// 		instructorTypes.ids.forEach(function(instructorTypeId) {
		// 			var instructorType = instructorTypes.list[instructorTypeId];
		// 			var instructorTypeCost = instructorTypeCosts.byInstructorTypeId[instructorTypeId];
	
		// 			if (instructorTypeCost == null) {
		// 				instructorTypeCost = {
		// 					cost: null,
		// 					instructorTypeId: instructorType.id,
		// 					description: instructorType.description,
		// 					budgetId: budgetId
		// 				};
		// 			}
	
		// 			calculatedInstructorTypeCosts.push(instructorTypeCost);
		// 		});
	
		// 		calculatedInstructorTypeCosts = _array_sortByProperty(calculatedInstructorTypeCosts, "description");
	
		// 		BudgetReducers.reduce({
		// 			type: ActionTypes.CALCULATE_INSTRUCTOR_TYPE_COSTS,
		// 			payload: {
		// 				calculatedInstructorTypeCosts: calculatedInstructorTypeCosts
		// 			}
		// 		});
		// 	},
		// 	// Will first look at userRoles for a match, and then teachingAssignments as a fallback.
		// 	_calculateInstructorType: function(instructorId) {
		// 		var instructorType = null;
	
		// 		var assignedInstructors = BudgetReducers._state.assignedInstructors;
		// 		var activeInstructors = BudgetReducers._state.activeInstructors;
	
		// 		var users = BudgetReducers._state.users;
		// 		var userRoles = BudgetReducers._state.userRoles;
		// 		var teachingAssignments = BudgetReducers._state.teachingAssignments;
		// 		var instructorTypes = BudgetReducers._state.instructorTypes;
	
		// 		var instructor = assignedInstructors.list[instructorId] || activeInstructors.list[instructorId];
		// 		var user = users.byLoginId[instructor.loginId.toLowerCase()];
	
		// 		if (!user) { return; }
	
		// 		if (userRoles.byUserId[user.id]) {
		// 			userRoles.byUserId[user.id].forEach(function(userRole) {
		// 				if (userRole.roleId != Roles.instructor) { return; }
	
		// 				instructorType = instructorTypes.list[userRole.instructorTypeId];
		// 			});
		// 		}
	
		// 		if (instructorType) { return instructorType; }
	
		// 		// Find instructorType by teachingAssignment
		// 		teachingAssignments.ids.forEach(function(teachingAssignmentId) {
		// 			var teachingAssignment = teachingAssignments.list[teachingAssignmentId];
	
		// 			if (teachingAssignment.instructorId == instructor.id) {
		// 				instructorType = instructorTypes.list[teachingAssignment.instructorTypeId];
		// 			}
		// 		});
	
		// 		return instructorType;
		// 	},
		// 	calculateSummaryTotals: function () {
		// 		let _self = this;
		// 		var selectedBudgetScenario = BudgetReducers._state.budgetScenarios.list[BudgetReducers._state.ui.selectedBudgetScenarioId];
		// 		var sectionGroups = BudgetReducers._state.calculatedSectionGroups.byTerm;
		// 		var lineItems = BudgetReducers._state.lineItems;
		// 		var activeTerms = selectedBudgetScenario.terms;
		// 		var readerCost = BudgetReducers._state.budget.readerCost;
		// 		var taCost = BudgetReducers._state.budget.taCost;
	
		// 		// Calculate lineItem 'cost'
		// 		var lineItemsAmount = 0;
		// 		lineItems.ids.forEach(function(lineItemId) {
		// 			var lineItem = lineItems.list[lineItemId];
		// 			lineItemsAmount += lineItem.amount;
		// 		});
	
		// 		var summary = BudgetReducers._state.summary = {};
		// 		summary.terms = activeTerms;
		// 		summary.byTerm = {};
		// 		summary.combinedTerms = {
		// 			taCount: 0,
		// 			taCost: 0,
		// 			readerCount: 0,
		// 			readerCost: 0,
		// 			supportCosts: 0,
		// 			totalUnits: 0,
		// 			replacementCosts: {
		// 				overall: 0,
		// 				instructorTypeIds: [],
		// 				byInstructorTypeId: {}
		// 			},
		// 			totalCosts: 0,
		// 			funds: 0,
		// 			balance: 0,
		// 			totalSCH: 0,
		// 			lowerDivCount: 0,
		// 			upperDivCount: 0,
		// 			graduateCount: 0,
		// 			totalOfferingsCount: 0,
		// 			enrollment: 0
		// 		};
	
		// 		summary.terms.forEach(function(term) {
		// 			summary.byTerm[term] = {
		// 				taCount: 0,
		// 				taCost: 0,
		// 				readerCount: 0,
		// 				readerCost: 0,
		// 				supportCosts: 0,
		// 				totalUnits: 0,
		// 				replacementCosts: {
		// 					overall: 0,
		// 					instructorTypeIds: [],
		// 					byInstructorTypeId: {}
		// 				},
		// 				totalCosts: 0,
		// 				totalSCH: 0,
		// 				lowerDivCount: 0,
		// 				upperDivCount: 0,
		// 				graduateCount: 0,
		// 				totalOfferingsCount: 0,
		// 				enrollment: 0,
		// 				sectionCount: 0,
		// 				balance: (lineItemsAmount * -1)
		// 			};
	
		// 			sectionGroups[term].forEach(function(course) {
		// 				course.sectionGroups.forEach(function(sectionGroup) {
		// 					summary.byTerm[term].taCount += sectionGroup.overrideTeachingAssistantAppointments || 0;
		// 					summary.byTerm[term].taCost += sectionGroup.taCost || 0;
		// 					summary.byTerm[term].readerCount += sectionGroup.overrideReaderAppointments || 0;
		// 					summary.byTerm[term].readerCost += sectionGroup.readerCost || 0;
		// 					summary.byTerm[term].supportCosts += (sectionGroup.taCost || 0) + (sectionGroup.readerCost || 0);
		// 					summary.byTerm[term].replacementCosts.overall += sectionGroup.overrideInstructorCost || 0;
		// 					summary.byTerm[term].replacementCosts = _self._calculateReplacementCost(summary.byTerm[term].replacementCosts, sectionGroup.instructorType, sectionGroup.overrideInstructorCost);
		// 					summary.byTerm[term].totalCosts += (sectionGroup.taCost || 0) + (sectionGroup.readerCost || 0) + (sectionGroup.overrideInstructorCost || 0);
		// 					summary.byTerm[term].totalUnits += (course.unitsLow || course.unitsHigh || 0);
		// 					summary.byTerm[term].totalSCH += (sectionGroup.overrideTotalSeats || 0) * (course.unitsLow || 0);
		// 					summary.byTerm[term].lowerDivCount += (parseInt(course.courseNumber) < 100 ? 1 : 0);
		// 					summary.byTerm[term].upperDivCount += (parseInt(course.courseNumber) > 100 && parseInt(course.courseNumber) < 200 ? 1 : 0);
		// 					summary.byTerm[term].graduateCount += (parseInt(course.courseNumber) > 199 ? 1 : 0);
		// 					summary.byTerm[term].enrollment += sectionGroup.overrideTotalSeats || 0;
		// 					summary.byTerm[term].sectionCount += sectionGroup.overrideSectionCount || 0;
		// 					summary.byTerm[term].totalOfferingsCount += 1;
		// 				});
		// 			});
	
		// 			summary.combinedTerms.taCount += summary.byTerm[term].taCount;
		// 			summary.combinedTerms.taCost += summary.byTerm[term].taCost;
		// 			summary.combinedTerms.readerCount += summary.byTerm[term].readerCount;
		// 			summary.combinedTerms.readerCost += summary.byTerm[term].readerCost;
		// 			summary.combinedTerms.supportCosts += summary.byTerm[term].supportCosts;
		// 			summary.combinedTerms.replacementCosts.overall += summary.byTerm[term].replacementCosts.overall;
		// 			summary.combinedTerms.replacementCosts = _self._combineReplacementCost(summary.combinedTerms.replacementCosts, summary.byTerm[term].replacementCosts);
		// 			summary.combinedTerms.totalCosts += summary.byTerm[term].totalCosts;
		// 			summary.combinedTerms.totalUnits += summary.byTerm[term].totalUnits;
		// 			summary.combinedTerms.totalSCH += summary.byTerm[term].totalSCH;
		// 			summary.combinedTerms.lowerDivCount += summary.byTerm[term].lowerDivCount;
		// 			summary.combinedTerms.upperDivCount += summary.byTerm[term].upperDivCount;
		// 			summary.combinedTerms.graduateCount += summary.byTerm[term].graduateCount;
		// 			summary.combinedTerms.totalOfferingsCount += summary.byTerm[term].totalOfferingsCount;
		// 			summary.combinedTerms.enrollment += summary.byTerm[term].enrollment;
		// 		});
	
		// 		BudgetReducers.reduce({
		// 			type: ActionTypes.CALCULATE_SUMMARY_TOTALS,
		// 			payload: {
		// 				summary: summary
		// 			}
		// 		});
		// 	},
		// 	_calculateReplacementCost: function (replacementCosts, instructorType, replacementCost) {
		// 		if (!instructorType || !replacementCost) { return replacementCosts; }
	
		// 		var index = replacementCosts.instructorTypeIds.indexOf(instructorType.id);
	
		// 		if (index == -1) {
		// 			replacementCosts.instructorTypeIds.push(instructorType.id);
		// 		}
	
		// 		// Ensure not null (un-initialized)
		// 		replacementCosts.byInstructorTypeId[instructorType.id] = replacementCosts.byInstructorTypeId[instructorType.id] > 0 ? replacementCosts.byInstructorTypeId[instructorType.id] : 0;
	
		// 		// Add cost
		// 		replacementCosts.byInstructorTypeId[instructorType.id] += replacementCost;
	
		// 		return replacementCosts;
		// 	},
		// 	_combineReplacementCost: function (replacementCosts, termCosts) {
		// 		termCosts.instructorTypeIds.forEach(function (instructorTypeId) {
		// 			// Add any newly identified instructorTypes
		// 			var index = replacementCosts.instructorTypeIds.indexOf(instructorTypeId);
		// 			if (index == -1) {
		// 				replacementCosts.instructorTypeIds.push(instructorTypeId);
		// 			}
		
		// 			// Ensure not null (un-initialized)
		// 			replacementCosts.byInstructorTypeId[instructorTypeId] = replacementCosts.byInstructorTypeId[instructorTypeId] > 0 ? replacementCosts.byInstructorTypeId[instructorTypeId] : 0;
	
		// 			// Add costs
		// 			replacementCosts.byInstructorTypeId[instructorTypeId] += termCosts.byInstructorTypeId[instructorTypeId];
		// 		});
	
		// 		return replacementCosts;
		// 	}
		// };
// 	}
// }

ScheduleCostCalculations.$inject = ['BudgetReducers', 'TermService', 'Roles', 'ActionTypes'];

export default ScheduleCostCalculations;
