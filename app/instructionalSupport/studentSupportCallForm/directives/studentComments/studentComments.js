instructionalSupportApp.directive("studentComments", this.studentComments = function () {
	return {
		restrict: 'E',
		templateUrl: 'studentComments.html',
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateSupportCallResponse = function() {
				studentActions.updateSupportCallResponse($scope.props.state.supportCallResponse);
			};
		}
	};
});