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

      scope.unHide = function (sectionGroupCost) {
        debugger;
        // TODO: do we need to create? look for id

        // or toggle the hide property?
      };

      scope.hide = function (sectionGroupCost) {
        sectionGroupCost.hidden = true;
        BudgetActions.updateSectionGroupCost(sectionGroupCost);
      };
    }
  };
};

export default courseList;
