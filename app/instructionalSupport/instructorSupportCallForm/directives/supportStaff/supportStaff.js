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
      scope.selectSupportStaff = function(supportStaff) {
        InstructorFormActions.selectSupportStaff(supportStaff);
      };

      scope.addPreference = function() {
        InstructorFormActions.addInstructorPreference(scope.supportStaff.id);
      };

      scope.deletePreference = function() {
        InstructorFormActions.deleteInstructorPreference(scope.instructorPreference);
      };
    }
  };
};

export default supportStaff;
