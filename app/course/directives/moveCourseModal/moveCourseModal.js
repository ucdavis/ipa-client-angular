import './moveCourseModal.css';

let moveCourseModal = function (
  CourseActionCreators,
) {
  return {
    restrict: 'E',
    template: require('./moveCourseModal.html'),
    replace: true,
    scope: {
      state: '<',
    },
    link: function (scope) {
      scope.confirmMoveCourse = function () {
        CourseActionCreators.updateSectionGroup(
          scope.state.uiState.moveCourseModal.selectedSectionGroup,
          scope.state.uiState.moveCourseModal.selectedTermCode
        );
        CourseActionCreators.toggleMoveCourseModal();
      };

      scope.close = function () {
        CourseActionCreators.toggleMoveCourseModal();
      };
    }, // end link
  };
};

export default moveCourseModal;
