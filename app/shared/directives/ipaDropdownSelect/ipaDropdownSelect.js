let ipaDropdownSelect = function() {
	return {
		restrict: 'E',
		template: require('./ipaDropdownSelect.html'),
		replace: true,
		
		scope: {
			items: '<', // Each item is expected to have an id, description (display value), and selected (bool flag). A rowType value = 'subheader' will display as header for another list group
			buttonText: '<',
			selectItem: '&',
			showAs: '@', // Use 'button' or 'input' to show the component as such. Input is default.
		},
		link: function(scope) {
		/* Example Usage:
			<ipa-dropdown-select 
				button-text="'Search Person'"
				show-as="input"
				items="data"
				select-item="addItem(item)">
			</ipa-dropdown-select>
		*/

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


			// Default values
			scope.showAs = "input";

		}

	};
};

export default ipaDropdownSelect;
