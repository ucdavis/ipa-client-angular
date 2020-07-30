import { dateToCalendar } from '../../../../shared/helpers/dates';

let courseCommentModal = function () {
  return {
    restrict: 'E',
    template: require('./courseCommentModal.html'),
    replace: true,
    scope: {
      selectedCourse: '<',
    },
    link: function (scope) {
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
