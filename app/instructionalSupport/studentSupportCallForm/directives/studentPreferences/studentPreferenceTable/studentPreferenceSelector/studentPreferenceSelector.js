let studentPreferenceSelector = function (studentActions) {
	return {
		restrict: 'E',
		template: require('./studentPreferenceSelector.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.addPreference = function(preference, type) {
				studentActions.addStudentPreference(preference.id, type);
			};
		}
	};
};

export default studentPreferenceSelector;
