// Stored priorities are numbered across a supportStaff's departments.
// Rank each person's preferences from 1 for display. The original priority is left untouched.
export function addDisplayRanks(preferences) {
	var preferencesByStaffId = {};

	preferences.forEach(function(preference) {
		var staffPreferences = preferencesByStaffId[preference.supportStaffId] || [];
		staffPreferences.push(preference);
		preferencesByStaffId[preference.supportStaffId] = staffPreferences;
	});

	Object.keys(preferencesByStaffId).forEach(function(supportStaffId) {
		var staffPreferences = preferencesByStaffId[supportStaffId].sort(function(a, b) {
			return a.priority - b.priority;
		});

		staffPreferences.forEach(function(preference, index) {
			preference.displayRank = index + 1;
		});
	});

	return preferences;
}
