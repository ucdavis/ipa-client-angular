import './studentPreferenceSelector.css';

let studentPreferenceSelector = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./studentPreferenceSelector.html'),
		replace: true,
		link: function (scope) {
			scope.addPreference = function(preference, type) {
				StudentFormActions.addStudentPreference(preference.id, type);
			};
		}
	};
};

export default studentPreferenceSelector;
