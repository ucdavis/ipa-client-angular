import { _array_sortByProperty, _array_find_by_properties } from 'shared/helpers/array';

class ScheduleCostCalculations {
  constructor (BudgetReducers, TermService, Roles, ActionTypes, UserService) {
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

        selectedBudgetScenario.budgetedCourseHiddenByTermFilter = false;

        var scheduleCosts = {
          terms: selectedBudgetScenario.terms,
          byTerm: {},
          byUniqueKey: {},
          sectionGroupCosts: [],
          trackedChanges: []
        };

        activeTerms.forEach(function(term) {
          scheduleCosts.byTerm[term] = [];
        });

        sectionGroupCosts.uniqueKeys.forEach(function(uniqueKey) {
          var sectionGroupCostId = sectionGroupCosts.idsByUniqueKey[uniqueKey];
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          if (sectionGroupCost.hidden) { return; }

          // Ensure sectionGroupCost belongs to this scenario
          if (sectionGroupCost.budgetScenarioId != selectedBudgetScenario.id) { return; }

          // Ensure sectionGroupCost isn't disabled
          if (sectionGroupCost.disabled) { return; }

          // Ensure sectionGroupCost belongs to an active term in this scenario
          var shortTerm = sectionGroupCost.termCode.slice(-2);

          if (selectedBudgetScenario.terms.indexOf(shortTerm) == -1) {
            selectedBudgetScenario.budgetedCourseHiddenByTermFilter = true;
            return;
          }

          var sectionGroupKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode;
          sectionGroupCost.sectionGroup = sectionGroups.list[sectionGroupKey];

          // Set sectionGroupCost instructor descriptions
          var instructor = BudgetReducers._state.assignedInstructors.list[sectionGroupCost.instructorId] || BudgetReducers._state.activeInstructors.list[sectionGroupCost.instructorId];
          var instructorType = BudgetReducers._state.instructorTypes.list[sectionGroupCost.instructorTypeId];
          sectionGroupCost.instructor = instructor;
          sectionGroupCost.instructorType = instructorType;
          sectionGroupCost.instructorDescription = null;
          sectionGroupCost.instructorTypeDescription = instructorType ? instructorType.description : '';

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
            sectionGroupCost.sectionGroup.assignedInstructorType = sectionGroupCost.sectionGroup.assignedInstructorType ? sectionGroupCost.sectionGroup.assignedInstructorType : _this._getInstructorType(assignedInstructor);
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
          if (sectionGroupCost.sectionGroup && sectionGroupCost.instructorId != assignedInstructorId || (assignedInstructorTypeId && sectionGroupCost.instructorTypeId != assignedInstructorTypeId)) {
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

            scheduleCosts.trackedChanges.push({
              sectionGroupCostId: sectionGroupCost.id,
              courseDescription: `${sectionGroupCost.subjectCode} ${sectionGroupCost.courseNumber}`,
              termName: TermService.getShortTermName(TermService.termCodeToTerm(sectionGroupCost.termCode)),
              name: 'Instructor',
              action: 'syncInstructor'
            });
          }

          // Track scenario changes to accept all
          _this._calculateScenarioChanges(sectionGroupCost, scheduleCosts);

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

          scheduleCosts.sectionGroupCosts.push(sectionGroupCost);
        });

        // Sort termCourses
        activeTerms.forEach(function(term) {
          scheduleCosts.byTerm[term] = _array_sortByProperty(scheduleCosts.byTerm[term], "uniqueKey");

          scheduleCosts.byTerm[term].forEach(function(scheduleCost) {
            scheduleCost.sectionGroupCosts = _array_sortByProperty(scheduleCost.sectionGroupCosts, "sequencePattern");
          });
        });

        BudgetReducers.reduce({
          type: ActionTypes.CALCULATE_SCHEDULE_COSTS,
          payload: {
            scheduleCosts: scheduleCosts
          }
        });
      },
      _getInstructorType: function(instructor) {
        if (!instructor) { return null; }

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
      _calculateScenarioChanges: function(sectionGroupCost, scheduleCosts) {
        if (sectionGroupCost.sectionGroup) {
          let baseTrackedChange = {
            sectionGroupCostId: sectionGroupCost.id,
            courseDescription: `${sectionGroupCost.subjectCode} ${sectionGroupCost.courseNumber}`,
            termName: TermService.getShortTermName(TermService.termCodeToTerm(sectionGroupCost.termCode)),
          };

          if (sectionGroupCost.enrollment !== sectionGroupCost.sectionGroup.totalSeats) {
            let trackedChange = { ...baseTrackedChange };
            trackedChange.name = "Enrollment";
            trackedChange.action = "syncEnrollment";
            scheduleCosts.trackedChanges.push(trackedChange);
          }

          if (sectionGroupCost.sectionCount != sectionGroupCost.sectionGroup.sectionCount) {
            let trackedChange = { ...baseTrackedChange };
            trackedChange.name = "Section";
            trackedChange.action = "syncSectionCount";
            scheduleCosts.trackedChanges.push(trackedChange);
          }

          if (sectionGroupCost.taCount != sectionGroupCost.sectionGroup.teachingAssistantAppointments) {
            let trackedChange = { ...baseTrackedChange };
            trackedChange.name = "TAs";
            trackedChange.action = "syncTaCount";
            scheduleCosts.trackedChanges.push(trackedChange);
          }

          if (sectionGroupCost.readerCount != sectionGroupCost.sectionGroup.readerAppointments) {
            let trackedChange = { ...baseTrackedChange };
            trackedChange.name = 'Readers';
            trackedChange.action = 'syncReaderCount';
            scheduleCosts.trackedChanges.push(trackedChange);
          }
        }
      },
      _calculateInstructorCost: function(sectionGroupCost) {
        sectionGroupCost.overrideInstructorCost = null;
        sectionGroupCost.overrideInstructorCostSource = "course";

        // If course cost => Use course cost
        if (sectionGroupCost.cost === 0 || sectionGroupCost.cost > 0) {
          sectionGroupCost.overrideInstructorCost = angular.copy(sectionGroupCost.cost); // eslint-disable-line no-undef
          sectionGroupCost.overrideInstructorCostSource = "course";
          sectionGroupCost.newInstructorCost = null;
          return;
        }

        // If instructor => Use instructor cost
        if (sectionGroupCost.instructorId > 0) {
          var instructorCost = BudgetReducers._state.instructorCosts.byInstructorId[sectionGroupCost.instructorId];
          var instructor = BudgetReducers._state.assignedInstructors.list[sectionGroupCost.instructorId] || BudgetReducers._state.activeInstructors.list[sectionGroupCost.instructorId];

          if (instructorCost && instructorCost.cost > 0) {
            sectionGroupCost.overrideInstructorCost = angular.copy(instructorCost.cost); // eslint-disable-line no-undef
            sectionGroupCost.overrideInstructorCostSource = "instructor";
            sectionGroupCost.overrideInstructorCostSourceDescription = instructor.firstName + " " + instructor.lastName;
            sectionGroupCost.newInstructorCost = null;
            return;
          }

          var instructorTypeId = sectionGroupCost.instructorTypeId;
          var instructorTypeCost = BudgetReducers._state.instructorTypeCosts.byInstructorTypeId[instructorTypeId];

          if (instructorTypeCost && instructorTypeCost.cost > 0) {
            sectionGroupCost.overrideInstructorCost = angular.copy(instructorTypeCost.cost); // eslint-disable-line no-undef
            sectionGroupCost.overrideInstructorCostSource = "instructor type";
            sectionGroupCost.overrideInstructorCostSourceDescription = instructorTypeCost.description + " category";
            sectionGroupCost.newInstructorCost = null;
            return;
          }
        }

        // If instructorType => use instructorType cost
        if (sectionGroupCost.instructorTypeId > 0) {
          var instructorTypeCost = BudgetReducers._state.instructorTypeCosts.byInstructorTypeId[sectionGroupCost.instructorTypeId];

          if (instructorTypeCost) {
            sectionGroupCost.overrideInstructorCost = angular.copy(instructorTypeCost.cost); // eslint-disable-line no-undef
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

        sectionGroupCost.comments = _array_sortByProperty(sectionGroupCost.comments, "lastModifiedOn", true);
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
          sectionGroupCosts: [],
          tagIds: sectionGroupCost.tagIds
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

ScheduleCostCalculations.$inject = ['BudgetReducers', 'TermService', 'Roles', 'ActionTypes', 'UserService'];

export default ScheduleCostCalculations;
