instructionalSupportApp.directive("confirmEligible", this.confirmEligible = function () {
	return {
		restrict: 'E',
		templateUrl: 'confirmEligible.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			$rootScope.$on('supportStaffFormStateChanged', function (event, data) {
				scope.mapStateToProps(data);
			});

			scope.mapStateToProps = function(state) {
				scope.props.supportCallResponse = state.supportCallResponse;
				scope.props.supportCallResponse.eligibilityConfirmed = Boolean(scope.props.supportCallResponse.eligibilityConfirmed);
			};

			scope.toggleEligibilityConfirmed = function() {
				scope.props.supportCallResponse.eligibilityConfirmed = !scope.props.supportCallResponse.eligibilityConfirmed;

				studentActions.updateSupportCallResponse(scope.props.supportCallResponse);
			};

			scope.props = {};
			scope.mapStateToProps(scope.state);
		}
	};
});