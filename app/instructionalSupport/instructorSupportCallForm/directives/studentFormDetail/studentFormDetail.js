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
			sectionGroups: '<'
		},
		link: function (scope, element, attrs) {
			scope.currentSupportStaff = null;
			scope.currentSupportStaffResponse = null;
			scope.currentSupportStaffPreferences = null;

			scope.selectSupportStaff = function (supportStaff) {
				scope.currentSupportStaff = supportStaff;

				scope.currentSupportStaffResponse = scope.studentSupportCallResponses.array.find(function (supportCallResponse) {
					return supportCallResponse.supportStaffId === supportStaff.id;
				});

				scope.currentSupportStaffPreferences = scope.studentPreferences.array.filter(function (studentPreference) {
					return studentPreference.supportStaffId === supportStaff.id;
				});
			};
		}
	};
};

export default studentFormDetail;
