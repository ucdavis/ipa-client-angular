let ipaDropdownSelect = function() {
	return {
		restrict: 'E',
		template: require('./ipaDropdownSelect.html'),
		replace: true,
		scope: {
			items: '<',
			buttonText: '<',
			headerText: '<?',
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
		}

	};
};

export default ipaDropdownSelect;
