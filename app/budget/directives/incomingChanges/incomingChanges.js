import './incomingChanges.css';

let incomingChanges = function (BudgetActions) {
  return {
    restrict: 'E',
    template: require('./incomingChanges.html'),
    replace: true,
    scope: {
      termNav: '<'
    },
    link: function (scope, element, attrs) {
      scope.setActiveTerm = function(activeTermTab) {
        BudgetActions.selectTerm(activeTermTab);
      };
    }
  };
};

export default incomingChanges;
