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
        scope.courses;
        scope.sectionGroups;
        scope.sectionGroupCosts;

        scope.calculateChangedValues();
        scope.calculateMissingCourses();
        scope.calculateAddedCourses();
      };

      scope.calculateChangedValues = function () {
        scope.sectionGroupCosts.ids.forEach(function(sectionGroupCostId) {
          var sectionGroupCost = scope.sectionGroupCosts.list[sectionGroupCostId];
          var uniqueKey = sectionGroupCost.subjectCode + "-" + sectionGroupCost.courseNumber + "-" + sectionGroupCost.sequencePattern + "-" + sectionGroupCost.termCode;
          var sectionGroup = scope.sectionGroups.byUniqueKey[uniqueKey];

          // Ensure sectionGroupCost matches scenario
          if (sectionGroupCost.budgetScenario != scope.selectedBudgetScenario.id) { return; }

          // Ensure sectionGroupCost has a match in IPA
          if (!sectionGroup) { return; }

          // Check seats
          // Check assigned instructor
          // Check enrollment
          // Check seats
          // Check TAs
          // Check Readers
        });
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
