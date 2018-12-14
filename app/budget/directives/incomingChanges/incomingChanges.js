import './incomingChanges.css';

let incomingChanges = function (BudgetActions) {
  return {
    restrict: 'E',
    template: require('./incomingChanges.html'),
    replace: true,
    scope: {
      termNav: '<',
      sectionGroups: '<',
      courses: '<',
      sectionGroupCosts: '<',
      selectedBudgetScenario: '<'
    },
    link: function (scope, element, attrs) {
      scope.setActiveTerm = function(activeTermTab) {
        BudgetActions.selectTerm(activeTermTab);
      };

      scope.calculateChanges = function () {
        scope.changes = [];

        var scenarioSectionGroupCostIds = scope.getActiveSectionGroupCostIds(scope.sectionGroupCosts, scope.selectedBudgetScenario);
        var presentSectionGroupCostIds = scope.getPresentSectionGroupCostIds(scenarioSectionGroupCostIds, scope.sectionGroupCosts, scope.sectionGroups);

        var changedValues = scope.calculateChangedValues(presentSectionGroupCostIds);
        var missingCourses = scope.calculateMissingCourses();
        var addedCourses = scope.calculateAddedCourses(scenarioSectionGroupCostIds);

        scope.changes = scope.changes.concat(changedValues);
        scope.changes = scope.changes.concat(missingCourses);
        scope.changes = scope.changes.concat(addedCourses);

        scope.changes = _.sortBy(scope.changes, function (change) {
          return change.display.course;
        });

        scope.changes = scope.breakIntoTerms(scope.changes);
      };

      // Loops over sectionGroupCosts
      scope.calculateChangedValues = function (sectionGroupCostIds) {
        var changes = [];

        sectionGroupCostIds.forEach(function(sectionGroupCostId) {
          var sectionGroupCost = scope.sectionGroupCosts.list[sectionGroupCostId];
          var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode;
          var sectionGroupId = scope.sectionGroups.idsByUniqueKey[uniqueKey];
          var sectionGroup = scope.sectionGroups.list[sectionGroupId];

          // Check enrollment
          if (sectionGroup.totalSeats != sectionGroupCost.enrollment) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                enrollment: sectionGroup.totalSeats
              },
              term: sectionGroup.termCode.slice(-2),
              display: {
                course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
                title: sectionGroup.title,
                description: "Seats",
                ipaText: sectionGroup.totalSeats,
                scenarioText: sectionGroupCost.enrollment
              }
            };

            changes.push(change);
          }

          // Check TAs
          if (sectionGroup.teachingAssistantAppointments != sectionGroupCost.taCount) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                taCount: sectionGroup.teachingAssistantAppointments
              },
              term: sectionGroup.termCode.slice(-2),
              display: {
                course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
                title: sectionGroup.title,
                description: "TA Count",
                ipaText: sectionGroup.teachingAssistantAppointments,
                scenarioText: sectionGroupCost.taCount
              }
            };

            changes.push(change);
          }

          // Check Readers
          if (sectionGroup.readerAppointments != sectionGroupCost.readerCount) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                readerCount: sectionGroup.readerAppointments
              },
              term: sectionGroup.termCode.slice(-2),
              display: {
                course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
                title: sectionGroup.title,
                description: "Reader Count",
                ipaText: sectionGroup.readerAppointments,
                scenarioText: sectionGroupCost.readerCount
              }
            };

            changes.push(change);
          }

          // Check assigned instructor / instructorType
          var sectionGroupInstructorId = sectionGroup.assignedInstructorIds[0];
          var sectionGroupInstructorTypeId = sectionGroup.assignedInstructorTypeIds[0];
          var sectionGroupCostInstructorId = sectionGroupCost.instructorId;
          var sectionGroupCostInstructorTypeId = sectionGroupCost.instructorTypeId;

          if (sectionGroupInstructorId != sectionGroupCostInstructorId) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                instructorId: sectionGroupInstructorId,
              },
              term: sectionGroupCost.termCode.slice(-2),
              display: {
                course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
                title: sectionGroup.title,
                description: "Instructor",
                ipaText: sectionGroup.assignedInstructorNames[0],
                scenarioText: sectionGroupCost.instructor ? sectionGroupCost.instructor.description : null
              }
            };

            changes.push(change);
          } else if (sectionGroupInstructorTypeId != sectionGroupCostInstructorTypeId) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                instructorTypeId: sectionGroupInstructorTypeId,
              },
              term: sectionGroupCost.termCode.slice(-2),
              display: {
                course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
                title: sectionGroup.title,
                description: "Instructor",
                ipaText: sectionGroup.assignedInstructorType ? sectionGroup.assignedInstructorType.description : null,
                scenarioText: sectionGroupCost.instructorType ? sectionGroupCost.instructorType.description : null
              }
            };

            changes.push(change);
          }

          // Check section count
          if (sectionGroup.sectionCount != sectionGroupCost.sectionCount) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                sectionCount: sectionGroup.sectionCount,
              },
              term: sectionGroupCost.termCode.slice(-2),
              display: {
                course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
                title: sectionGroup.title,
                description: "Section Count",
                ipaText: sectionGroup.sectionCount,
                scenarioText: sectionGroupCost.sectionCount
              }
            };

            changes.push(change);
          }
        });

        return changes;
      };

      // Filters provided sectionGroupCostIds to ensure they match a sectionGroup.
      scope.getPresentSectionGroupCostIds = function (sectionGroupCostIds, sectionGroupCosts, sectionGroups) {
        return sectionGroupCostIds.filter(function(sectionGroupCostId) {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          // Ensure sectionGroupCost is not disabled
          if (sectionGroupCost.disabled) { return false; }

          var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode;
          var sectionGroupId = sectionGroups.idsByUniqueKey[uniqueKey];
          var sectionGroup = sectionGroups.list[sectionGroupId];

          // Ensure sectionGroupCost has a match
          if (!sectionGroup) { return false; }

          return true;
        });
      };

      // Filters sectionGroupCosts against selected scenario and activeTerms
      scope.getActiveSectionGroupCostIds = function (sectionGroupCosts, selectedBudgetScenario) {
        return sectionGroupCosts.ids.filter(function(sectionGroupCostId) {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          // Ensure sectionGroupCost matches scenario
          if (sectionGroupCost.budgetScenarioId != selectedBudgetScenario.id) { return false; }

          // Ensure sectionGroupCost matches termCode
          var activeTerms = scope.selectedBudgetScenario.terms;
          var sectionGroupCostTerm = sectionGroupCost.termCode.slice(-2);

          if (activeTerms.indexOf(sectionGroupCostTerm) == -1) { return false; }

          return true;
        });
      };

      // Returns change objects with sectionGroups that need a corresponding sectionGroupCost created
      scope.calculateMissingCourses = function () {
        var changes = [];

        scope.sectionGroups.ids.forEach(function(sectionGroupId) {
          var sectionGroup = scope.sectionGroups.list[sectionGroupId];
          var sectionGroupTerm = sectionGroup.termCode.slice(-2);

          // Ensure sectionGroupCost matches termCode
          if (scope.selectedBudgetScenario.terms.indexOf(sectionGroupTerm) == -1) { return; }

          var uniqueKey = sectionGroup.subjectCode + "-" + sectionGroup.courseNumber + "-" + sectionGroup.sequencePattern + "-" + sectionGroup.termCode + "-" + scope.selectedBudgetScenario.id;
          var sectionGroupCostId = scope.sectionGroupCosts.idsByUniqueKey[uniqueKey];
          var sectionGroupCost = sectionGroupCostId ? scope.sectionGroupCosts.list[sectionGroupCostId] : null;

          // No matching active sectionGroupCost found for this sectionGroup
          if (!sectionGroupCost || sectionGroupCost.disabled) {
            var change = {
              payload: {
                sectionGroup: sectionGroup,
                sectionGroupCost: null,
              },
              term: sectionGroup.termCode.slice(-2),
              display: {
                course: sectionGroup.subjectCode + " " + sectionGroup.courseNumber,
                title: sectionGroup.title,
                description: "Not budgeted",
                ipaText: "check",
                scenarioText: ""
              }
            };

            changes.push(change);
          }
        });

        return changes;
      };

      scope.calculateAddedCourses = function (sectionGroupCostIds) {
        var changes = [];

        sectionGroupCostIds.forEach(function(sectionGroupCostId) {
          var sectionGroupCost = scope.sectionGroupCosts.list[sectionGroupCostId];
          // Course is on scenario but not on schedule
          if (sectionGroupCost.isBudgeted && sectionGroupCost.isScheduled == false) {
            var change = {
              payload: {
                sectionGroupCost: sectionGroupCost,
                sectionGroup: null,
              },
              term: sectionGroupCost.termCode.slice(-2),
              display: {
                course: sectionGroupCost.subjectCode + " " + sectionGroupCost.courseNumber,
                title: sectionGroupCost.title,
                description: "Not scheduled",
                ipaText: "",
                scenarioText: "check"
              }
            };

            changes.push(change);

          }
        });

        return changes;
      };

      scope.breakIntoTerms = function(changes) {
        var separatedChanges = {};

        changes.forEach(function(change) {
          separatedChanges[change.term] = separatedChanges[change.term] || [];
          separatedChanges[change.term].push(change);
        });

        return separatedChanges;
      };

      // Recalculate on changes
      scope.$watchGroup(['courses', 'sectionGroups', 'sectionGroupCosts'], function(newValues, oldValues, scope) {
        scope.calculateChanges();
      });

      // Calculate on instantation of directive
      scope.calculateChanges();
    }
  };
};

export default incomingChanges;
