let ipaDropdown = function() {
	return {
		restrict: 'E',
		template: require('./ipaDropdown.html'), // directive html found here:
		scope: {
			items: '<', // Each item is expected to have an id, description (display value), and selected (bool flag).
			headerText: '<?',
			buttonText: '<',
			searchable: '<',
			selectItem: '&',
			buttonClass: '<?',
			isWide: '<?',
			style: '<?' // Current options are 'minimal' or leaving blank gives default styling
		},
		replace: true, // Replace with the template below
		link: function(scope, element, attrs, iAttr) {
			/* Example Usage:
			<ipa-dropdown
				expanded="expanded"
				header-text="headerText"
				button-text="buttonText"
				items="view.state.people"
				select-item="testSelect(item)">
			</ipa-dropdown>
			*/

			// Validate passed methods
			scope.isSelectItemSupplied = (angular.isUndefined(scope.selectItem) === false); // eslint-disable-line no-undef

			if (scope.isSelectItemSupplied == false) {
				throw {
					message: "ipaDropdown: Required method selectItem was not supplied."
				};
			}

			// Default values
			scope.expanded = false;
			scope.searchable = false;
			scope.overrideStyles = {};

			// Load attributes
			if (attrs.overrideStyles) {
				scope.overrideStyles = attrs.overrideStyles;
			}

			// Methods
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

export default ipaDropdown;
