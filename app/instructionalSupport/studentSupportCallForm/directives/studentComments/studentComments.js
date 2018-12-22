import './studentComments.css';

let studentComments = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./studentComments.html'),
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope) {
			scope.updateStudentComments = function() {
				StudentFormActions.updateStudentComments(scope.supportCallResponse);
			};
		}
	};
};

export default studentComments;
