supportAssignmentApp.directive("assignSupportStaff", this.assignSupportStaff = function () {
	return {
		restrict: 'E',
		templateUrl: 'assignSupportStaff.html',
		replace: true,
		scope: {
			assignmentOptions: '<',
			onSelect: '&',
			sectionGroup: '<'
		},
		link: function (scope, element, attrs) {
			scope.expanded = false;

			scope.closeDropdown = function() {
				scope.expanded = false;
			};

			scope.toggleDropdown = function() {
				scope.expanded = !scope.expanded;
			};

			scope.triggerSelection = function(supportStaff) {
				scope.onSelect()(supportStaff, scope.sectionGroup);
			};
		}
	};
});
