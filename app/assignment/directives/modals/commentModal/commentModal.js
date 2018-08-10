let commentModal = function (AssignmentActionCreators) {
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
    link: function (scope, element, attrs) {
      scope.close = function () {
        scope.isVisible = false;
      };

      scope.confirm = function () {
        if (scope.privateComment != scope.scheduleInstructorNote.instructorComment) {
          // Update the scheduleInstructorNote
          if (scope.scheduleInstructorNote && scope.scheduleInstructorNote.id) {
            scope.scheduleInstructorNote.instructorComment = scope.privateComment;
            AssignmentActionCreators.updateScheduleInstructorNote(scope.scheduleInstructorNote);
          }

          // Create new scheduleInstructorNote
          else {
            AssignmentActionCreators.addScheduleInstructorNote(scope.instructor.id, scope.year, scope.workgroupId, scope.privateComment);
          }
        }

        scope.close();
      };
    } // end link
  };
};

export default commentModal;
