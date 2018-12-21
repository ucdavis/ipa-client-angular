import './supportStaff.css';

let supportStaff = function (InstructorFormActions) {
  return {
    restrict: 'E',
    template: require('./supportStaff.html'),
    replace: true,
    scope: {
      supportStaff: '<',
      instructorPreference: '<?',
      priority: '<',
      active: '<',
      canRaisePriority: '<',
      canLowerPriority: '<'
    },
    link: function (scope) {
      scope.selectSupportStaff = function(supportStaff) {
        InstructorFormActions.selectSupportStaff(supportStaff);
      };

      scope.addPreference = function() {
        InstructorFormActions.addInstructorPreference(scope.supportStaff.supportStaffId);
      };

      scope.deletePreference = function() {
        InstructorFormActions.deleteInstructorPreference(scope.instructorPreference);
      };

      scope.updatePreferencesOrder = function(changeValue) {
        InstructorFormActions.updateInstructorPreferencesOrder(scope.instructorPreference, changeValue);
      };
    }
  };
};

export default supportStaff;
