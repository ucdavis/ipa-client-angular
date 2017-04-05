/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
instructionalSupportApp.service('instructorSupportCallFormSelectors', function () {
	return {
/*
		misc
		supportCallResponse
		sectionGroups
			sectionGroup
				original data
				courseMetaData
				preferences
				eligibleSupportStaff
					preferred
					other
*/			
		generateSectionGroups: function (sectionGroups, supportStaff, studentPreferences, instructorPreferences) {
			return null;
		}
	};
});