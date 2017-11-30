instructionalSupportApp.directive("crnAvailable", this.crnAvailable = function () {
	return {
		restrict: 'E',
		templateUrl: 'crnAvailable.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.props = {};

			scope.$watch('state',function() {
				scope.mapStateToProps(scope.state);
			});

			scope.mapStateToProps = function(state) {
				scope.props.state = state;
			};

			scope.mapStateToProps(scope.state);
		}
	};
});