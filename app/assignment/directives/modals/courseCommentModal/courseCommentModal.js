import { dateToCalendar } from '../../../../shared/helpers/dates';

import './courseCommentModal.css';

let courseCommentModal = function ($rootScope, AssignmentActionCreators) {
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
        const commentPayload = scope.courseComment.trim();

        if (commentPayload) {
          AssignmentActionCreators.createCourseComment(scope.selectedCourse.id, {
            comment: commentPayload,
          });
        } else {
          $rootScope.$emit('toast', {
            message: 'Please enter a comment',
            type: 'ERROR',
          });
        }
        scope.courseComment = "";
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
