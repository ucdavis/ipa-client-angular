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
      // Total of differences, by term
      scope.setActiveTerm = function(activeTermTab) {
        BudgetActions.selectTerm(activeTermTab);
      };

      scope.calculateChanges = function () {
        var scenarioSectionGroupCostIds = scope.getActiveSectionGroupCostIds(scope.sectionGroupCosts, scope.selectedBudgetScenario);
        var presentSectionGroupCostIds = scope.getPresentSectionGroupCostIds(scenarioSectionGroupCostIds, scope.sectionGroupCosts, scope.sectionGroups);
        var changedValues = scope.calculateChangedValues(presentSectionGroupCostIds);
        var missingCourses = scope.calculateMissingCourses();
        debugger;
        var addedCourses = scope.calculateAddedCourses(scenarioSectionGroupCostIds);

        debugger;
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
              sectionGroupCost: sectionGroupCost,
              enrollment: sectionGroup.totalSeats
            };

            changes.push(change);
          }

          // Check TAs
          if (sectionGroup.teachingAssistantAppointments != sectionGroupCost.taCount) {
            var change = {
              sectionGroupCost: sectionGroupCost,
              taCount: sectionGroup.teachingAssistantAppointments
            };

            changes.push(change);
          }

          // Check Readers
          if (sectionGroup.readerAppointments != sectionGroupCost.readerCount) {
            var change = {
              sectionGroupCost: sectionGroupCost,
              readerCount: sectionGroup.readerAppointments
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
              sectionGroupCost: sectionGroupCost,
              instructorId: sectionGroupInstructorId
            };

            changes.push(change);
          } else if (sectionGroupInstructorTypeId != sectionGroupCostInstructorTypeId) {
            var change = {
              sectionGroupCost: sectionGroupCost,
              instructorTypeId: sectionGroupInstructorTypeId
            };

            changes.push(change);
          }

          // Check section count
          if (sectionGroup.sectionCount != sectionGroupCost.sectionCount) {
            var change = {
              sectionGroupCost: sectionGroupCost,
              sectionCount: sectionGroup.sectionCount
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
          var isPresent =  scope.sectionGroupCosts.list[sectionGroupCostId] && scope.sectionGroupCosts.list[sectionGroupCostId].disabled == false ? true : false;

          // No matching active sectionGroupCost found for this sectionGroup
          if (isPresent == false) {
            var change = {
              sectionGroup: sectionGroup,
              sectionGroupCost: null
            };

            changes.push(change);
          }
        });

        return changes;
      };

      scope.calculateAddedCourses = function () {
        debugger;
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
