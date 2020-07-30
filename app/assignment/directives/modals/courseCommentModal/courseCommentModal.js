import { dateToCalendar } from '../../../../shared/helpers/dates';

import './courseCommentModal.css';

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
        const commentPayload = scope.courseComment.trim();

        if (commentPayload) {
          AssignmentService.createCourseComment(scope.selectedCourse.id, {
            comment: scope.courseComment.trim(),
          });

          scope.selectedCourse.courseComments.unshift({
            comment: scope.courseComment,
            authorName: JSON.parse(localStorage.getItem('currentUser'))
              .displayName,
            creationDate: Date.now(),
          });
        } else {
          $rootScope.$emit('toast', {
            message: 'Please enter a comment',
            type: 'ERROR',
          });
        }
        scope.courseComment = "";
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
