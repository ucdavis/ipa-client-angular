instructionalSupportApp.directive("studentQualifications", this.studentQualifications = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'studentQualifications.html',
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