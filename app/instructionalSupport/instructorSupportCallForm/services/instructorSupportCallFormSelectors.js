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
		generateSectionGroups: function (sectionGroups, supportStaff, studentPreferences, instructorPreferences, courses) {
			var self = this;

			sectionGroups.ids.forEach( function (sectionGroupId) {
				var sectionGroup = sectionGroups.list[sectionGroupId];
				// Add instructor preference data
				sectionGroup = self.addInstructorPreferencesToSectionGroup(sectionGroup, supportStaff, instructorPreferences);

				// Add course data
				sectionGroup = self.addCourseDataToSectionGroup(sectionGroup, courses);

				// Add support staff data
				sectionGroup = self.addEligibleSupportStaffToSectionGroup(sectionGroup, supportStaff, studentPreferences);
			});
		},

		// Blend the relevant course data into the sectionGroup
		addCourseDataToSectionGroup: function (sectionGroupDTO, coursesDTO) {
			var sectionGroup = angular.copy(sectionGroupDTO);
			var courses = angular.copy(coursesDTO);

			courses.ids.forEach( function (courseId) {
				var course = courses.list[courseId];

				if (sectionGroup.courseId == course.id) {
					sectionGroup.subjectCode = course.subjectCode;
					sectionGroup.sequencePattern = course.sequencePattern;
					sectionGroup.courseNumber = course.courseNumber;
					sectionGroup.title = course.title;
					sectionGroup.units = course.unitsLow;
				}
			});

			return sectionGroup;
		},

		// Add de-normalized instructor preferences to the sectionGroup
		addInstructorPreferencesToSectionGroup: function (sectionGroupDTO, supportStaffDTO, instructorPreferencesDTO) {
			var sectionGroup = angular.copy(sectionGroupDTO);
			var supportStaff = angular.copy(supportStaffDTO);
			var instructorPreferences = angular.copy(instructorPreferencesDTO);

			sectionGroup.instructorPreferences = [];

			instructorPreferences.ids.forEach( function (preferenceId) {
				var preference = instructorPreferences.list[preferenceId];
				sectionGroup.instructorPreferences.push(preference);
			});

			return sectionGroup;
		},

		addEligibleSupportStaffToSectionGroup: function (sectionGroup, supportStaff, studentPreferences) {
			var confirmedSupportStaffIds = [];

			sectionGroup.eligibleSupportStaff = {};

			sectionGroup.instructorPreferences.forEach( function(preference) {
				if (confirmedSupportStaffIds.indexOf(preference.supportStaffId) == -1) {
					confirmedSupportStaffIds.push(preference.supportStaffId);
				}
			});

			sectionGroup.eligibleSupportStaff.preferred = [];

			studentPreferences.ids.forEach( function (preferenceId) {
				var preference = studentPreferences.list[preferenceId];

				if (preference.sectionGroupId == sectionGroup.id
				&& confirmedSupportStaffIds.indexOf(preference.supportStaffId) == -1 ) {
					confirmedSupportStaffIds.push(preference.supportStaffId);
					sectionGroup.eligibleSupportStaff.preferred.push(preference);
				}
			});

			sectionGroup.eligibleSupportStaff.other = [];

			supportStaff.ids.forEach( function(supportStaffId) {
				var staff = supportStaff.list[supportStaffId];

				if (confirmedSupportStaffIds.indexOf(supportStaffId) == -1) {
					sectionGroup.eligibleSupportStaff.other.push(staff);
				}
			});
		}

	};
});