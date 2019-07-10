import { dateToRelative } from "shared/helpers/dates";

import './commentModal.css';

let commentModal = function () {
  return {
    restrict: 'E',
    template: require('./commentModal.html'),
    replace: true,
    scope: {
      state: '<',
      isVisible: '=',
      instructor: '<',
      scheduleInstructorNote: '<',
      instructorComment: '<',
      privateComment: '<',
      year: '<',
      workgroupId: '<'
    },
    link: function (scope) {
      scope.close = function () {
        scope.isVisible = false;
      };

      scope.dateToRelative = function (date) {
        return dateToRelative(date);
      };
    } // end link
  };
};

export default commentModal;
