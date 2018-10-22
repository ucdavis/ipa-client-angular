import './deleteCourseModal.css';

let deleteCourseModal = function ($rootScope, CourseActionCreators, $routeParams) {
  return {
    restrict: 'E',
    template: require('./deleteCourseModal.html'),
    replace: true,
    scope: {
      state: '<',
      isVisible: '='
    },
    link: function (scope, element, attrs) {
      scope.workgroupId = $routeParams.workgroupId;
      scope.year = $routeParams.year;

      scope.confirmDeleteCourses = function () {
        CourseActionCreators.deleteMultipleCourses(scope.state.uiState.selectedCourseRowIds, scope.workgroupId, scope.year);
      };

      scope.close = function() {
        scope.isVisible = false;
      };
    } // end link
  };
};

export default deleteCourseModal;
