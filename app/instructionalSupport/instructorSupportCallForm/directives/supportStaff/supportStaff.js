import './supportStaff.css';

let supportStaff = function (InstructorFormActions) {
  return {
    restrict: 'E',
    template: require('./supportStaff.html'),
    replace: true,
    scope: {
      supportStaff: '<',
      instructorPreference: '<?',
      priority: '<'
    },
    link: function (scope, element, attrs) {
      scope.addPreference = function() {
        InstructorFormActions.addInstructorPreference(supportStaff);
      };

      scope.deletePreference = function() {
        InstructorFormActions.deleteInstructorPreference(instructorPreference);
      };
    }
  };
};

export default supportStaff;
