supportAssignmentApp.directive("supportAssignmentRow", this.supportAssignmentRow = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'supportAssignmentRow.html',
		replace: true,
		scope: {
			name: '<',
			onDelete: "&",
			supportAssignment: '<',
			readOnly: '<?'
		},
		link: function (scope, element, attrs) {
			scope.deleteAssignment = function() {
				scope.onDelete()(scope.supportAssignment);
			};
		}
	};
});
