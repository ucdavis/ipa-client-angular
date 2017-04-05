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
			sectionGroups.forEach( function (sectionGroup) {
				// Add instructor preference data
				sectionGroup.instructorPreferences = self.addInstructorPreferencesToSectionGroup(sectionGroup, instructorPreferences);

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

			courses.forEach( function (course) {
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
		addInstructorPreferencesToSectionGroup: function (sectionGroupDTO, supportStaffDTO, studentPreferencesDTO) {
			var sectionGroup = angular.copy(sectionGroupDTO);
			var supportStaff = angular.copy(supportStaffDTO);
			var studentPreferences = angular.copy(studentPreferencesDTO);

			courses.forEach( function (course) {
				if (sectionGroup.courseId == course.id) {
					sectionGroup.subjectCode = course.subjectCode;
					sectionGroup.sequencePattern = course.sequencePattern;
					sectionGroup.courseNumber = course.courseNumber;
					sectionGroup.title = course.title;
					sectionGroup.units = course.unitsLow;
				}
			});

			return sectionGroup;
		}

	};
});