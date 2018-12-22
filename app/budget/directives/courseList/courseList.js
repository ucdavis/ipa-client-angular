import './courseList.css';

let courseList = function (BudgetActions) {
  return {
    restrict: 'E',
    template: require('./courseList.html'),
    replace: true,
    scope: {
      courseList: '<',
      selectedBudgetScenario: '<',
      termNav: '<'
    },
    link: function (scope) {
      scope.setActiveTerm = function(activeTermTab) {
        BudgetActions.selectTerm(activeTermTab);
      };

      scope.unHide = function (sectionGroupCost) {
        if (sectionGroupCost.id) {
          sectionGroupCost.disabled = false;
          BudgetActions.updateSectionGroupCost(sectionGroupCost);
        } else {
          BudgetActions.createSectionGroupCost(sectionGroupCost);
        }
      };

      scope.hide = function (sectionGroupCost) {
        sectionGroupCost.disabled = true;
        BudgetActions.updateSectionGroupCost(sectionGroupCost);
      };
    }
  };
};

export default courseList;
