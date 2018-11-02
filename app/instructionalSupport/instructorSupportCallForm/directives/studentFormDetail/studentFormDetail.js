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
			studentSupportCallResponses: '=',
			studentPreferences: '='
		},
		link: function (scope, element, attrs) {
			scope.selectedResponse = scope.studentSupportCallResponses[1];
		}
	};
};

export default studentFormDetail;
