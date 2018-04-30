let studentComments = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./studentComments.html'),
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateStudentComments = function() {
				StudentFormActions.updateStudentComments(scope.supportCallResponse);
			};
		}
	};
};

export default studentComments;
