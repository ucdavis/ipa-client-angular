import './instructorPreferenceSelector.css';

/**
 * Provides the main course table in the Courses View
 */
let instructorPreferenceSelector = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./InstructorPreferenceSelector.html'),
		replace: true,
		scope: false,
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
};

export default instructorPreferenceSelector;
