instructionalSupportApp.directive("gridAvailable", this.gridAvailable = function () {
	return {
		restrict: 'E',
		templateUrl: 'gridAvailable.html',
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