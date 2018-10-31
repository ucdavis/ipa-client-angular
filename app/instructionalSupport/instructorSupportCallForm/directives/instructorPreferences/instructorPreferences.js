import './instructorPreferences.css';

/**
 * Provides the main course table in the Courses View
 */
let instructorPreferences = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./instructorPreferences.html'),
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
};

export default instructorPreferences;
