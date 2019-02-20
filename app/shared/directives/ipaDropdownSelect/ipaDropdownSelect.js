let ipaDropdownSelect = function() {
	return {
		restrict: 'E',
		template: require('./ipaDropdownSelect.html'),
		replace: true,
		transclude: {
			'custom-item-template': '?customItemTemplate'
		},
		scope: {
			items: '<', // Each item is expected to have an id, description (display value), and selected (bool flag). A rowType value = 'subheader' will display as header for another list group
			itemDescription: '@',
			buttonText: '<',
			selectItem: '&',
			showAs: '@', // Use 'button' or 'input' to show the component as such. Input is default.
		},
		link: function(scope, el, attrs, ctrl, transclude) {
		/* Example Usage:
			<ipa-dropdown-select 
				button-text="'Search Person'"
				show-as="input"
				items="data"
				item-description="displayName"
				select-item="addItem(item)">
			</ipa-dropdown-select>
		*/

			scope.hasCustomItemTemplate = transclude.isSlotFilled('custom-item-template');

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
