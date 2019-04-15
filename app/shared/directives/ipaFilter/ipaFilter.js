import './ipaFilter.css';

let ipaFilter = function () {
	return {
		restrict: 'E',
		template: require('./ipaFilter.html'),
		replace: false,
		scope: {
			items: '<',
			selectItem: '&',
			tooltip: '<',
			title: '<',
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

			scope.clickItem = function (item) {
				scope.selectItem({item: item});
			};
		}
	};
};

export default ipaFilter;
