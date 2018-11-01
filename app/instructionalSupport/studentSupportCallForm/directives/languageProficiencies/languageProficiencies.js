import './languageProficiencies.css';

let languageProficiencies = function ($rootScope, StudentFormActions, SupportCallService) {
  return {
    restrict: 'E',
    template: require('./languageProficiencies.html'),
    replace: true,
    scope: {
      supportCallResponse: '<'
    },
    link: function (scope, element, attrs) {
      scope.selectedLanguageProficiency = {
        id: scope.supportCallResponse.languageProficiency,
        description: SupportCallService.getLanguageProficiencyDescription(scope.supportCallResponse.languageProficiency),
      };

      scope.selectLanguageProficiency = function (languageProficiency) {
        scope.supportCallResponse.languageProficiency = languageProficiency.id;
        StudentFormActions.updateSupportCallResponse(scope.supportCallResponse);

        scope.selectedLanguageProficiency = languageProficiency;
      };

      scope.languageProficiencies = [
        {
          id: 0,
          description: SupportCallService.getLanguageProficiencyDescription(0),
          selected: false
        },
        {
          id: 1,
          description: SupportCallService.getLanguageProficiencyDescription(1),
          selected: false
        },
        {
          id: 2,
          description: SupportCallService.getLanguageProficiencyDescription(2),
          selected: false
        },
        {
          id: 3,
          description: SupportCallService.getLanguageProficiencyDescription(3),
          selected: false
        },
        {
          id: 4,
          description: SupportCallService.getLanguageProficiencyDescription(4),
          selected: false
        },
      ];
    }
  };
};

export default languageProficiencies;
