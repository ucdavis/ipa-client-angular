instructionalSupportApp.directive("studentPreferenceSelector", this.studentPreferenceSelector = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'studentPreferenceSelector.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.addPreference = function(preference) {
				studentActions.addStudentPreference(preference);
			};		}
	};
});
