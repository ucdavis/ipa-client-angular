import './termFilter.css';

let termFilter = function ($rootScope) {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		template: require('./termFilter.html'),
		replace: true, // Replace with the template below
		scope: {
			activeTerms: '<'
		},
		link: function(scope, element, attrs) {
			scope.isVisible = false;

			scope.getTermName = function(term) {
				return TermService.getShortTermName(term);
			};

			scope.allTerms = ["01", "02", "03", "05", "06", "07", "08", "09", "10"];

			scope.toggleDropdown = function () {
				scope.isVisible = !scope.isVisible;
			};
		}
	};
};

export default termFilter;
