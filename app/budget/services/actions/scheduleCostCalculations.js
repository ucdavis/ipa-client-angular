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
          byTerm: {},
          byUniqueKey: {}
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

          // Ensure sectionGroupCost belongs to the scenario
          if (sectionGroupCost.budgetScenarioId != selectedBudgetScenario.id) { return; }

          sectionGroupCost.sectionGroup = sectionGroups.list[uniqueKey];

          // Set sectionGroupCost instructor descriptions
          var instructor = BudgetReducers._state.assignedInstructors.list[sectionGroupCost.instructorId] || BudgetReducers._state.activeInstructors.list[sectionGroupCost.instructorId];
          var instructorType = BudgetReducers._state.instructorTypes.list[sectionGroupCost.instructorTypeId];
          sectionGroupCost.instructor = instructor;
          sectionGroupCost.instructorType = instructorType;
          sectionGroupCost.instructorDescription = null;

          if (instructor) {
            sectionGroupCost.instructorDescription = instructor.lastName + ", " + instructor.firstName;
          } else if (instructorType) {
            sectionGroupCost.instructorDescription = instructorType.description;
          }

          var originalInstructor = BudgetReducers._state.assignedInstructors.list[sectionGroupCost.originalInstructorId] || BudgetReducers._state.activeInstructors.list[sectionGroupCost.originalInstructorId];
          sectionGroupCost.originalInstructorDescription = originalInstructor ? originalInstructor.lastName + ", " + originalInstructor.firstName : null;

          var assignedInstructorId = sectionGroupCost.sectionGroup ? sectionGroupCost.sectionGroup.assignedInstructorIds[0] : null;
          var assignedInstructorTypeId = sectionGroupCost.sectionGroup ? sectionGroupCost.sectionGroup.assignedInstructorTypeIds[0] : null;
          var assignedInstructor = BudgetReducers._state.assignedInstructors.list[assignedInstructorId];
          var assignedInstructorType = BudgetReducers._state.instructorTypes.list[assignedInstructorTypeId];
          assignedInstructorId = assignedInstructor ? assignedInstructor.id : null;
          assignedInstructorTypeId = assignedInstructorType ? assignedInstructorType.id : null;

          if (sectionGroupCost.sectionGroup) {
            sectionGroupCost.sectionGroup.assignedInstructor = assignedInstructor;
            sectionGroupCost.sectionGroup.assignedInstructorType = assignedInstructorType;
          }

          if (assignedInstructor) {
            sectionGroupCost.sectionGroup.assignedInstructorType = _this._getInstructorType(assignedInstructor);
          }

          // Set sectionGroup instructor descriptions
          if (sectionGroupCost.sectionGroup) {
            sectionGroupCost.sectionGroup.instructorDescription = null;
            if (assignedInstructor) {
              sectionGroupCost.sectionGroup.instructorDescription = assignedInstructor ? assignedInstructor.lastName + ", " + assignedInstructor.firstName : null;
            } else if (assignedInstructorType) {
              sectionGroupCost.sectionGroup.instructorDescription = assignedInstructorType ? assignedInstructorType.description : null;
            }
          }

          // Calculate reversion
          // Identify a difference
          if (sectionGroupCost.instructorId != assignedInstructorId || sectionGroupCost.instructorTypeId != assignedInstructorTypeId) {
            // Schedule has no assignment
            if (!assignedInstructorId && !assignedInstructorTypeId) {
              sectionGroupCost.reversionDisplayName = "no instructor";
            }

            // Schedule has an instructor assignment
            else if (assignedInstructorId) {
              sectionGroupCost.reversionDisplayName = assignedInstructor.lastName + ", " + assignedInstructor.firstName;
            }

            // Schedule has an instructorType assignment
            else if (assignedInstructorTypeId) {
              sectionGroupCost.reversionDisplayName = assignedInstructorType.description;
            }
          }

          // Calculate instructor cost
          _this._calculateInstructorCost(sectionGroupCost);

          // Attach comments data
          _this._calculateSectionGroupCostComments(sectionGroupCost);

          // Attach cost data
          _this._calculateSectionGroupFinancialCosts(sectionGroupCost);

          // Generate container if one does not already exist
          var container = _this._findOrAddSectionGroupContainer(sectionGroupCost, scheduleCosts.byTerm[shortTerm]);
          container.sectionGroupCosts.push(sectionGroupCost);
          scheduleCosts.byUniqueKey[container.uniqueKey] = container;
        });

        // Sort termCourses
        activeTerms.forEach(function(term) {
          scheduleCosts.byTerm[term] = _array_sortByProperty(scheduleCosts.byTerm[term], "uniqueKey");
        });

        BudgetReducers.reduce({
          type: ActionTypes.CALCULATE_SCHEDULE_COSTS,
          payload: {
            scheduleCosts: scheduleCosts
          }
        });
      },
      _getInstructorType: function(instructor) {
        var users = BudgetReducers._state.users;
        var userRoles = BudgetReducers._state.userRoles;
        var instructorTypes = BudgetReducers._state.instructorTypes;

        var user = users.byLoginId[instructor.loginId.toLowerCase()];
        var userRoleId = userRoles.ids.find(id => (userRoles.list[id].roleId == Roles.instructor && userRoles.list[id].userId == user.id));

        if (!userRoleId) { return null; }

        var userRole = userRoles.list[userRoleId];
        var instructorType = instructorTypes.list[userRole.instructorTypeId];

        return instructorType;
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

          if (instructorCost && instructorCost.cost > 0) {
            sectionGroupCost.overrideInstructorCost = angular.copy(instructorCost.cost);
            sectionGroupCost.overrideInstructorCostSource = "instructor";
            sectionGroupCost.overrideInstructorCostSourceDescription = instructor.firstName + " " + instructor.lastName;
            sectionGroupCost.newInstructorCost = null;
            return;
          }

          var instructorTypeCost = BudgetReducers._state.instructorTypeCosts.byInstructorTypeId[sectionGroupCost.instructorTypeId];

          if (instructorTypeCost && instructorTypeCost.cost > 0) {
            sectionGroupCost.overrideInstructorCost = angular.copy(instructorTypeCost.cost);
            sectionGroupCost.overrideInstructorCostSource = "instructor type";
            sectionGroupCost.overrideInstructorCostSourceDescription = instructorTypeCost.description + " category";
            sectionGroupCost.newInstructorCost = null;
            return;
          }
        }

        // If instructorType => use instructorType cost
        if (sectionGroupCost.instructorTypeId > 0) {
          var instructorTypeCost = BudgetReducers._state.instructorTypeCosts.byInstructorTypeId[sectionGroupCost.instructorTypeId];

          if (instructorTypeCost > 0) {
            sectionGroupCost.overrideInstructorCost = angular.copy(instructorTypeCost.cost);
            sectionGroupCost.overrideInstructorCostSource = "instructor type";
            sectionGroupCost.overrideInstructorCostSourceDescription = instructorTypeCost.description + " category";
            sectionGroupCost.newInstructorCost = null;
            return;
          }
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

        // Support Costs
        sectionGroupCost.readerCost = sectionGroupCost.readerCount > 0 ? sectionGroupCost.readerCount * budget.readerCost : 0;
        sectionGroupCost.taCost = sectionGroupCost.taCount > 0 ? sectionGroupCost.taCount * budget.taCost : 0;

        sectionGroupCost.courseCostSubTotal = sectionGroupCost.taCost + sectionGroupCost.readerCost;

        // Instructor Costs
        sectionGroupCost.instructorCostSubTotal = sectionGroupCost.overrideInstructorCost || 0;

        sectionGroupCost.totalCost = sectionGroupCost.courseCostSubTotal + sectionGroupCost.instructorCostSubTotal;
      },
      // Find or create a container for this sectionGroupCost
      _findOrAddSectionGroupContainer: function(sectionGroupCost, containers) {
        let newContainer = {
          subjectCode: sectionGroupCost.subjectCode,
          courseNumber: sectionGroupCost.courseNumber,
          title: sectionGroupCost.title,
          unitsHigh: sectionGroupCost.unitsHigh,
          unitsLow: sectionGroupCost.unitsLow,
          uniqueKey: sectionGroupCost.subjectCode + sectionGroupCost.courseNumber,
          sectionGroupCosts: []
        };

        var container = _array_find_by_properties(containers, ["uniqueKey"], newContainer);

        if (container == false || container == undefined) {
          containers.push(newContainer);
          container = newContainer;
        }

        return container;
      }
    };
  }
}

ScheduleCostCalculations.$inject = ['BudgetReducers', 'TermService', 'Roles', 'ActionTypes'];

export default ScheduleCostCalculations;
