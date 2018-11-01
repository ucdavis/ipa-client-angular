import './instructorPreferences.css';

/**
 * Provides the main course table in the Courses View
 */
let instructorPreferences = function ($rootScope, InstructorFormActions) {
	return {
		restrict: 'E',
		template: require('./instructorPreferences.html'),
		replace: true,
		scope: {
      sectionGroup: '='
    },
		link: function (scope, element, attrs) {
      scope.addPreference = function(sectionGroupId, supportStaffId) {
        InstructorFormActions.addInstructorPreference(sectionGroupId, supportStaffId);
      };

      scope.deleteInstructorPreference = function(preference) {
        InstructorFormActions.deleteInstructorPreference(preference);
      };
		}
	};
};

export default instructorPreferences;
