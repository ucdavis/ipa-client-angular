let ipaDropdownSelect = function() {
	return {
		restrict: 'E',
		template: require('./ipaDropdownSelect.html'),
		replace: true,
		scope: {
			items: '<', // Each item is expected to have an id, description (display value), and selected (bool flag). A rowType value = 'subheader' will display as header for another list group
			buttonText: '<',
			selectItem: '&',
		},
		link: function(scope){

			scope.toggleDropdown = function() {
				scope.expanded = !scope.expanded;
			};

			scope.closeDropdown = function() {
				scope.expanded = false;
			};

			scope.openDropdown = function() {
				scope.expanded = true;
			};

			scope.selectDropdownItem = function(item) {
				scope.selectItem({item: item});
				scope.closeDropdown();
			};

		}

	};
};

export default ipaDropdownSelect;
