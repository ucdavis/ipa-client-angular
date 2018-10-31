import './languageProficiencies.css';

let languageProficiencies = function ($rootScope, StudentFormActions) {
  return {
    restrict: 'E',
    template: require('./languageProficiencies.html'),
    replace: true,
    scope: {
      supportCallResponse: '<'
    },
    link: function (scope, element, attrs) {
      scope.selectedProficiency;

      scope.selectProficiency = function (option) {
        scope.selectedProficiency = scope.languageProficiencies[option.id];
      };

      scope.languageProficiencies = [
        {
          id: 0,
          description: "Undergraduate degree from an institution where English is the sole language of instruction",
          selected: false
        },
        {
          id: 1,
          description: "Achieving a minimum score of 26 on the speaking subset of the TOEFL iBT",
          selected: false
        },
        {
          id: 2,
          description: "Achieving a minimum score of 8 on the speaking subset of the IELTS",
          selected: false
        },
        {
          id: 3,
          description: "Achieving a minimum score of 50 on the SPEAK",
          selected: false
        },
        {
          id: 4,
          description: "Achieving a “Pass” on the TOEP",
          selected: false
        },
      ];
    }
  };
};

export default languageProficiencies;
