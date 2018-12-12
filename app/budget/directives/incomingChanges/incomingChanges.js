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
        var scenarioSectionGroupCostIds = scope.getScenarioSectionGroupCostIds(scope.sectionGroupCosts, scope.selectedBudgetScenario);
        var scenarioSectionGroupIds = scope.getScenarioSectionGroupIds(scope.sectionGroups, scope.selectedBudgetScenario);
        var presentSectionGroupCostIds = scope.getPresentSectionGroupCostIds(scenarioSectionGroupCostIds, scope.sectionGroupCosts, scope.sectionGroups);

        var changedValues = scope.calculateChangedValues(presentSectionGroupCostIds);
        var missingCourses = scope.calculateMissingCourses(scope.sectionGroupIds);
        var addedCourses = scope.calculateAddedCourses(sectionGroupIds);

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
          } else if (sectionGroupInstructorTypeId != sectionGroupCostInstructorId) {
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

      // Filters sectionGroups against selected scenario
      scope.getScenarioSectionGroupIds = function (sectionGroups, selectedBudgetScenario) {
        return sectionGroups.ids.filter(function(sectionGroupId) {
          var sectionGroup = sectionGroups.list[sectionGroupId];

          // Ensure sectionGroupCost matches scenario
          if (sectionGroup.budgetScenarioId != selectedBudgetScenario.id) { return false; }

          return true;
        });
      };

      // Filters sectionGroupCosts against selected scenario
      scope.getScenarioSectionGroupCostIds = function (sectionGroupCosts, selectedBudgetScenario) {
        return sectionGroupCosts.ids.filter(function(sectionGroupCostId) {
          var sectionGroupCost = sectionGroupCosts.list[sectionGroupCostId];

          // Ensure sectionGroupCost matches scenario
          if (sectionGroupCost.budgetScenarioId != selectedBudgetScenario.id) { return false; }

          return true;
        });
      };

      scope.calculateMissingCourses = function () {

      };

      scope.calculateAddedCourses = function () {

      };

      // // Example changeObject
      // var changeObject = {
      //   sectionGroupCostId: 22
      //   parameter: "enrollment"
      //   value: 22
      //   term: "201610"
      // };

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
