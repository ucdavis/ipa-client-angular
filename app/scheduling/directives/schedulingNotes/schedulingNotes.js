import { dateToCalendar } from '../../../shared/helpers/dates';

import './schedulingNotes.css';

let schedulingNotes = function ($rootScope, SchedulingActionCreators) {
  return {
    restrict: 'E',
    template: require('./schedulingNotes.html'),
    replace: true,
    scope: {
      schedulingNoteDetails: '<',
    },
    link: function (scope) {
      scope.schedulingNote = '';

      scope.addNote = function () {
        const schedulingNote = scope.schedulingNote.trim();

        if (schedulingNote) {
          SchedulingActionCreators.createSchedulingNote(
            scope.schedulingNoteDetails.sectionGroup.id,
            {
              message: schedulingNote,
            }
          );
        } else {
          $rootScope.$emit('toast', {
            message: 'Please enter a comment',
            type: 'ERROR',
          });
        }
        scope.schedulingNote = '';
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

export default schedulingNotes;
