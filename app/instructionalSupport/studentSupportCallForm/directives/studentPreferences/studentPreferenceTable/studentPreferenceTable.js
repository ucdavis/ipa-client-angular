instructionalSupportApp.directive("studentPreferenceTable", this.studentPreferenceTable = function () {
	return {
		restrict: 'E',
		templateUrl: 'studentPreferenceTable.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.addPreference = function(preference) {
				studentActions.addStudentPreference(preference);
			};

			scope.deletePreference = function(preference) {
				studentActions.deleteStudentPreference(preference);
			};
		}
	};
});