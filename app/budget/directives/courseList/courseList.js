import './courseList.css';

let courseList = function ($rootScope, TermService) {
  return {
    restrict: 'E',
    template: require('./courseList.html'),
    replace: true,
    scope: {
      courseList: '<',
      selectedBudgetScenario: '<'
    },
    link: function (scope, element, attrs) {
      // Intentionally Empty
    }
  };
};

export default courseList;
