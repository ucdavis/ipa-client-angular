/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
instructionalSupportApp.service('supportStaffFormSelectors', function () {
	return {
/*
		misc
		supportCallResponse
		supportStaffPreferences
			preference
				supportStaffPreference
				courseData
				sectionGroupData
		potentialPreferences (supportAssignments with more data)
			(split into reader, ai, ta groups)
				supportAssignment
				courseData
				sectionGroupData
*/
		generatePreferences: function (preferences, courses, sectionGroups) {
			var self = this;

			var newPreferences = [];

			preferences.ids.forEach( function(preferenceId) {
				var preference = preferences.list[preferenceId];

				preference = self.addSectionGroupData(preference, sectionGroups);
				preference = self.addCourseData(preference, courses);

				newPreferences.push(preference);
			});

			return newPreferences;
		},
		generatePotentialPreferences: function (supportAssignments, courses, sectionGroups, preferences, supportCallResponse) {
			var self = this;

			var potentialPreferences = {
				readers: [],
				associateInstructors: [],
				teachingAssistants: []
			};

			sectionGroups.ids.forEach(function(sectionGroupId) {
				var sectionGroup = sectionGroups.list[sectionGroupId];
				var preference = self.addCourseData(sectionGroup, courses);

				if (sectionGroup.readerAppointments > 0) {
					potentialPreferences.readers.push(preference);
				}
				if (sectionGroup.teachingAssistantAppointments > 0) {
					potentialPreferences.teachingAssistants.push(preference);
				}

				if (sectionGroup.showPlaceholderAI) {
					potentialPreferences.associateInstructors.push(preference);
				}
			});

			return potentialPreferences;
		},
		// Blend the relevant course data
		addCourseData: function (entity, courses) {
			courses.ids.forEach( function (courseId) {
				var course = courses.list[courseId];

				if (entity.courseId == course.id) {
					entity.subjectCode = course.subjectCode;
					entity.sequencePattern = course.sequencePattern;
					entity.courseNumber = course.courseNumber;
					entity.title = course.title;
					entity.units = course.unitsLow;
				}
			});

			return entity;
		},
		// Blend the relevant course data
		addSectionGroupData: function (entity, sectionGroups) {
			sectionGroups.ids.forEach( function (sectionGroupId) {
				var sectionGroup = sectionGroups.list[sectionGroupId];

				if (entity.sectionGroupId == sectionGroup.id) {
					entity.courseId = sectionGroup.courseId;
				}
			});

			return entity;
		},
	};
});