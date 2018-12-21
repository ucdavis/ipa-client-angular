import './staffComments.css';

let staffComments = function ($rootScope, SupportCallService) {
	return {
		restrict: 'E',
		template: require('./staffComments.html'),
		replace: true,
		scope: {
			supportStaff: '<'
		},
		link: function (scope) {
			// Intentionally empty
			scope.getLanguageProficiencyDescription = function (languageProficiencyId) {
				return SupportCallService.getLanguageProficiencyDescription(languageProficiencyId);
			};
		}
	};
};

export default staffComments;
