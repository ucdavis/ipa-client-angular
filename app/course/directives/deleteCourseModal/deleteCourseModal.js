courseApp.directive("deleteCourseModal", this.deleteCourseModal = function ($rootScope, courseActionCreators, $routeParams) {
	return {
		restrict: 'E',
		templateUrl: 'deleteCourseModal.html',
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.workgroupId = $routeParams.workgroupId;
			scope.year = $routeParams.year;

			scope.confirmDeleteCourses = function () {
				courseActionCreators.deleteMultipleCourses(scope.state.uiState.selectedCourseRowIds, scope.workgroupId, scope.year);
			};

			scope.close = function() {
				scope.isVisible = false;
			};
		} // end link
	};
});
