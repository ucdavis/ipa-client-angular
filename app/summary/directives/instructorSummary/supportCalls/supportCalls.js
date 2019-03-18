import './supportCalls.css';

let supportCalls = function (SummaryActionCreators) {
  return {
    restrict: 'E',
    template: require('./supportCalls.html'),
    replace: true,
    scope: {
      selectedSupportCallTermDisplay: '<',
      selectedSupportCallTerm: '<',
      allTerms: '<',
      allTermNames: '<',
      instructorSupportCallResponses: '<',
      workgroupId: '<',
      year: '<'
    },
    link: function (scope) {
      scope.selectTab = function(tab) {
        scope.allTerms.forEach(function(term) {

          if (term.getTermDisplayName() == tab) {
            scope.selectTerm(term);
          }
        });
      };

      scope.selectTerm = function (term) {
        SummaryActionCreators.selectTerm(term);
      };
    }
  };
};

export default supportCalls;
