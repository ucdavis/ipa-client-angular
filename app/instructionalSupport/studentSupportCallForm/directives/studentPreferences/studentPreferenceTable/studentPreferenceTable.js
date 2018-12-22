import { _array_sortByProperty } from 'shared/helpers/array';

import './studentPreferenceTable.css';

let studentPreferenceTable = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./studentPreferenceTable.html'),
		replace: true,
		link: function (scope) {
			scope.deletePreference = function(preference) {
				StudentFormActions.deleteStudentPreference(preference);
			};

			scope.openPreferenceCommentsModal = function(preference) {
				StudentFormActions.openPreferenceCommentsModal(preference);
			};

			// Will reorder the preferenceIds
			// Negative changeValue will raise the priority, positive changeValue will lower priority
			scope.updatePreferencesOrder = function(preference, changeValue) {
				var preferenceIds = _array_sortByProperty(scope.state.preferences, "priority");
				preferenceIds = preferenceIds.map(function(preference) { return preference.id; });

				var index = preferenceIds.indexOf(preference.id);
				preferenceIds = scope.swapPositions(preferenceIds, index, index + changeValue);
				var termCode = scope.state.supportCallResponse.termCode;

				StudentFormActions.updatePreferencesOrder(preferenceIds, scope.state.misc.scheduleId, termCode);
			};

			scope.swapPositions = function (array, indexA, indexB) {
				var valA = array[indexA];
				array[indexA] = array[indexB];
				array[indexB] = valA;

				return array;
			};
		}
	};
};

export default studentPreferenceTable;
