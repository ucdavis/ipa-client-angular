import './studentFormDetail.css';
import studentPreferences from '../../../studentSupportCallForm/directives/studentPreferences/studentPreferences';

/**
 * Provides the main course table in the Courses View
 */
let studentFormDetail = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./studentFormDetail.html'),
		replace: true,
		scope: {
			studentSupportCallResponses: '<',
			studentPreferences: '<',
			supportStaff: '<',
			sectionGroups: '<',
		},
		link: function (scope, element, attrs) {
			$rootScope.$on('instructorFormStateChanged', function(event, data) {
				if (data.misc.activeSupportStaffId) {
					scope.currentSupportStaff = data.supportStaff.list[data.misc.activeSupportStaffId];

					scope.currentSupportStaffResponse = scope.studentSupportCallResponses.array.find(function (supportCallResponse) {
						return supportCallResponse.supportStaffId === scope.currentSupportStaff.id;
					});

					scope.currentSupportStaffPreferences = scope.studentPreferences.array.filter(function (studentPreference) {
						return studentPreference.supportStaffId === scope.currentSupportStaff.id;
					});
				}
			});

      scope.hasFormData = function () {
        if (!scope.currentSupportStaffResponse) { return false; }
        var isGeneralCommentsPresent = scope.currentSupportStaffResponse.generalComments && scope.currentSupportStaffResponse.generalComments.length > 0;
        var isLanguagePresent = scope.currentSupportStaffResponse.languageProficiency && scope.currentSupportStaffResponse.languageProficiency.length > 0;
        var isQualificationsPresent = scope.currentSupportStaffResponse.teachingQualifications && scope.currentSupportStaffResponse.teachingQualifications.length > 0;
        var isPreferencesPresent = scope.currentSupportStaffPreferences && scope.currentSupportStaffPreferences.length > 0;

        return isGeneralCommentsPresent || isLanguagePresent || isQualificationsPresent ||isPreferencesPresent;
      };
		}
	};
};

export default studentFormDetail;
