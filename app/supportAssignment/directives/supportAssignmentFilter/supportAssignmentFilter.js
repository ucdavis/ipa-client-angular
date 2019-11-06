import './supportAssignmentFilter.css';

let supportAssignmentFilter = function () {
	return {
		restrict: 'E',
		template: require('./supportAssignmentFilter.html'),
		replace: false,
		scope: {
			filters: '<',
			selectItem: '&',
			tooltip: '<',
			// title: '<',
			buttonIcon: '<'
		},
		link: function(scope) {
			scope.isVisible = false;

			scope.toggleDropdown = function () {
				scope.isVisible = !scope.isVisible;
			};

			scope.close = function () {
				scope.isVisible = false;
			};

			scope.clickItem = function () {
				scope.selectItem();
			};
		}
	};
};

export default supportAssignmentFilter;