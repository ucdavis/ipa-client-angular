import './staffComments.css';

let staffComments = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./staffComments.html'),
		replace: true,
		scope: {
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
			scope.languageProficiencyDescriptions = [
				"Undergraduate degree from an institution where English is the sole language of instruction",
				"Achieved a minimum score of 26 on the speaking subset of the TOEFL iBT",
				"Achieved a minimum score of 8 on the speaking subset of the IELTS",
				"Achieved a minimum score of 50 on the SPEAK",
				"Achieved a “Pass” on the TOEP",
			];
		}
	};
};

export default staffComments;
