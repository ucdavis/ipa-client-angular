let supportAssignmentRow = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./supportAssignmentRow.html'),
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
};

export default supportAssignmentRow;
