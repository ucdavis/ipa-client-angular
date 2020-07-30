import { dateToCalendar } from '../../../../shared/helpers/dates';

let courseCommentModal = function (AssignmentService) {
  return {
    restrict: 'E',
    template: require('./courseCommentModal.html'),
    replace: true,
    scope: {
      selectedCourse: '<',
    },
    link: function (scope) {
      scope.courseComment = "";
      scope.addComment = function () {
        AssignmentService.createCourseComment(scope.selectedCourse.id, { "comment": scope.courseComment });
      };

      scope.close = function () {
        scope.isVisible = false;
      };

      scope.dateToCalendar = function (date) {
        return dateToCalendar(date);
      };
    }, // end link
  };
};

export default courseCommentModal;
