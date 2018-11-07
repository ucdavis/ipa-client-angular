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
      sectionGroup: '=',
      supportStaffList: '<',
      activeSupportStaffId: '<'
    },
		link: function (scope, element, attrs) {
      scope.filteredSupportStaff = scope.sectionGroup.eligibleSupportStaff.other;

      $rootScope.$on('instructorFormStateChanged', function (event, data) {
        scope.sectionGroup = data.sectionGroups.list[data.misc.activeSectionGroupId];
        scope.filteredSupportStaff = scope.sectionGroup.eligibleSupportStaff.other;
      });

      scope.filterSupportStaff = function (searchQuery) {
        if (searchQuery.length >= 1) {
          var options = {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            includeScore: false,
            keys: [
              "fullName"
            ]
          };

          var fuse = new Fuse(scope.supportStaffList.sorted, options);
          var results = fuse.search(searchQuery);
          scope.filteredSupportStaff = results;
        } else {
          scope.filteredSupportStaff = scope.sectionGroup.eligibleSupportStaff.other;
        }
      };

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
