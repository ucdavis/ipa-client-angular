let assignSupportStaff = function () {
	return {
		restrict: 'E',
		template: require('./assignSupportStaff.html'),
		replace: true,
		scope: {
			assignmentOptions: '<',
			onSelect: '&',
			sectionGroup: '<?',
			section: '<?',
			viewType: '<'
		},
		link: function (scope, element, attrs) {
			scope.expanded = false;

			scope.closeDropdown = function() {
				scope.expanded = false;
			};

			scope.toggleDropdown = function() {
				scope.expanded = !scope.expanded;
			};

			scope.triggerSelection = function(preference) {
				scope.onSelect()(preference.supportStaffId, scope.sectionGroup || scope.section);
				scope.closeDropdown();
			};
		}
	};
};

export default assignSupportStaff;
