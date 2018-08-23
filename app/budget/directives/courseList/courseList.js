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
    link: function (scope, element, attrs) {
      scope.setActiveTerm = function(activeTermTab) {
        BudgetActions.selectTerm(activeTermTab);
      };
    }
  };
};

export default courseList;
