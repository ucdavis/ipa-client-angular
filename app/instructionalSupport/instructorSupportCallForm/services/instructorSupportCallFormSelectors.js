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
		generateSectionGroups: function (sectionGroupsDTO, supportStaffDTO, studentPreferencesDTO, instructorPreferencesDTO, coursesDTO) {
			var sectionGroups = angular.copy(sectionGroupsDTO);
			var supportStaff = angular.copy(supportStaffDTO);
			var studentPreferences = angular.copy(studentPreferencesDTO);
			var instructorPreferences = angular.copy(instructorPreferencesDTO);
			var courses = angular.copy(coursesDTO);

			var self = this;

			newSectionGroups = [];

			sectionGroups.ids.forEach( function (sectionGroupId) {
				var sectionGroup = sectionGroups.list[sectionGroupId];
				// Add instructor preference data
				sectionGroup = self.addInstructorPreferencesToSectionGroup(sectionGroup, supportStaff, instructorPreferences);

				// Add course data
				sectionGroup = self.addCourseDataToSectionGroup(sectionGroup, courses);

				// Add support staff data
				sectionGroup = self.addEligibleSupportStaffToSectionGroup(sectionGroup, supportStaff, studentPreferences);

				newSectionGroups.push(sectionGroup);
			});

			return newSectionGroups;
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

				if (preference.sectionGroupId != sectionGroup.id) {
					return;
				}

				supportStaff.ids.forEach( function(supportStaffId) {
					var staff = supportStaff.list[supportStaffId];
					if (preference.supportStaffId == staff.id) {
						preference.firstName = staff.firstName;
						preference.lastName = staff.lastName;
						preference.fullName = staff.fullName;
					}
				});

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
				var slotSupportStaff = supportStaff.list[preference.supportStaffId];

				if (preference.sectionGroupId == sectionGroup.id
				&& confirmedSupportStaffIds.indexOf(preference.supportStaffId) == -1 ) {
					confirmedSupportStaffIds.push(preference.supportStaffId);

					preference.firstName = slotSupportStaff.firstName;
					preference.lastName = slotSupportStaff.lastName;
					preference.fullName = slotSupportStaff.fullName;

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

			return sectionGroup;
		}

	};
});