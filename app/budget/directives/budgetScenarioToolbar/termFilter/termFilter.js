import './termFilter.css';

let termFilter = function ($rootScope, TermService) {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		template: require('./termFilter.html'),
		replace: true, // Replace with the template below
		scope: {
			activeTerms: '<',
			selectTerm: '&'
		},
		link: function(scope, element, attrs) {
			// Validate passed methods
			if (angular.isUndefined(scope.selectTerm)) {
				throw {
					message: "termFilter: Required method selectTerm was not provided."
				};
			}
			scope.isVisible = false;

			scope.getTermName = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.allTerms = ["01", "02", "03", "05", "06", "07", "08", "09", "10"];

			scope.toggleDropdown = function () {
				scope.isVisible = !scope.isVisible;
			};

			scope.close = function () {
				scope.isVisible = false;
			};

			scope.onClick = function (term) {
				scope.selectTerm(term);
			};
		}
	};
};

export default termFilter;
