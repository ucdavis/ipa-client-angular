instructionalSupportApp.directive("studentFormReview", this.studentFormReview = function () {
	return {
		restrict: 'E',
		templateUrl: 'studentFormReview.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.props = {};
			scope.mapStateToProps(scope.state);

			$rootScope.$on('supportStaffFormStateChanged', function (event, data) {
				scope.mapStateToProps(data);
			});

			scope.mapStateToProps = function(state) {
				return state;
			};
		}
	};
});