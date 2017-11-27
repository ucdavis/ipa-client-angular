summaryApp.directive("studentAvailabilities", this.studentAvailabilities = function () {
	return {
		restrict: 'E',
		templateUrl: 'studentAvailabilities.html',
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