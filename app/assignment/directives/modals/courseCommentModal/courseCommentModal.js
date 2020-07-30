import { dateToCalendar } from '../../../../shared/helpers/dates';

let courseCommentModal = function ($rootScope, AssignmentService) {
  return {
    restrict: 'E',
    template: require('./courseCommentModal.html'),
    replace: true,
    scope: {
      state: '<',
      selectedCourse: '<',
    },
    link: function (scope) {
      scope.courseComment = "";

      scope.addComment = function () {
        AssignmentService.createCourseComment(scope.selectedCourse.id, { "comment": scope.courseComment });
        scope.selectedCourse.courseComments.unshift({"comment": scope.courseComment, "authorName": JSON.parse(localStorage.getItem("currentUser")).displayName, "creationDate": Date.now()});

				$rootScope.$emit('assignmentStateChanged', scope.state);
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
