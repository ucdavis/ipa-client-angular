import './commentModal.css';

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
    } // end link
  };
};

export default commentModal;
