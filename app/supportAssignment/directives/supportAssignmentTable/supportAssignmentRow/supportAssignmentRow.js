import './supportAssignmentRow.css';

let supportAssignmentRow = function (SupportActions) {
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
			scope.deleteAssignment = function(supportAssignment) {
				SupportActions.deleteAssignment(supportAssignment);
			};
		}
	};
};

export default supportAssignmentRow;
