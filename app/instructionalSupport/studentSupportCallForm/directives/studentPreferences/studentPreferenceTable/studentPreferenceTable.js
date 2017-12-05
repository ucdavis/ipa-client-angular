instructionalSupportApp.directive("studentPreferenceTable", this.studentPreferenceTable = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'studentPreferenceTable.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.deletePreference = function(preference) {
				studentActions.deleteStudentPreference(preference);
			};

			scope.lowerStudentPreferencePriority = function(preference) {

			};

			scope.raiseStudentPreferencePriority = function(preference) {

			};
		}
	};
});