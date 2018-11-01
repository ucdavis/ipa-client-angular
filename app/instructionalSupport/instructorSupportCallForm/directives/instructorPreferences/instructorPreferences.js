import './instructorPreferences.css';

/**
 * Provides the main course table in the Courses View
 */
let instructorPreferences = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./instructorPreferences.html'),
		replace: true,
		scope: {
      sectionGroup: '='
    },
		link: function (scope, element, attrs) {
		}
	};
};

export default instructorPreferences;
