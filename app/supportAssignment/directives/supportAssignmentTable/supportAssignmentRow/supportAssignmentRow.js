import './supportAssignmentRow.css';

let supportAssignmentRow = function (SupportActions) {
	return {
		restrict: 'E',
		template: require('./supportAssignmentRow.html'),
		replace: true,
		scope: {
			name: '<',
			count: '<?',
			onDelete: "&",
			supportAssignment: '<',
			readOnly: '<?'
		},
		link: function (scope) {
			scope.deleteAssignment = function(supportAssignment) {
				SupportActions.deleteAssignment(supportAssignment);
			};
		}
	};
};

export default supportAssignmentRow;
