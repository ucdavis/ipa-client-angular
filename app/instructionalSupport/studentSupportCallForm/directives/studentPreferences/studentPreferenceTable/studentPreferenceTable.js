instructionalSupportApp.directive("studentPreferenceTable", this.studentPreferenceTable = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'studentPreferenceTable.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.deletePreference = function(preference) {
				studentActions.deleteStudentPreference(preference);
			};

			scope.openPreferenceCommentsModal = function(preference) {
				studentActions.openPreferenceCommentsModal(preference);
			};

			// Will reorder the preferenceIds
			// Negative changeValue will raise the priority, positive changeValue will lower priority
			scope.updatePreferencesOrder = function(preference, changeValue) {
				var preferenceIds = _array_sortByProperty(scope.state.preferences, "priority");
				preferenceIds = preferenceIds.map(function(preference) { return preference.id; });

				var index = preferenceIds.indexOf(preference.id);
				preferenceIds = scope.swapPositions(preferenceIds, index, index + changeValue);
				var termCode = scope.state.supportCallResponse.termCode;

				studentActions.updatePreferencesOrder(preferenceIds, scope.state.misc.scheduleId, termCode);
			};

			scope.swapPositions = function (array, indexA, indexB) {
				var valA = array[indexA];
				array[indexA] = array[indexB];
				array[indexB] = valA;

				return array;
			};
		}
	};
});