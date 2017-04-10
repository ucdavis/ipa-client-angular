/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
instructionalSupportApp.service('supportAssignmentSelectors', function () {
	return {
/*
	Page State Schema:
		userInterface
			displayCoursePivot
			displaySupportStaffPivot
		schedule
		sectionGroups
			courseData
			sectionGroupData
			aiAssignmentOptions
				supportStaffPreferences
				instructorPreferences
				other
			readerAssignmentOptions
				supportStaffPreferences
				instructorPreferences
				other
			taAssignmentOptions
				supportStaffPreferences
				instructorPreferences
				other
		supportStaff (supportStaff)
			supportCallResponse
			supportAssignments (assignment)
				courseData
				sectionGroupData
			studentPreferences (preference)
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

			var potentialPreferences = {};
			potentialPreferences.readers = [];
			potentialPreferences.associateInstructors = [];
			potentialPreferences.teachingAssistants = [];

			supportAssignments.ids.forEach( function(supportAssignmentId) {
				var supportAssignment = supportAssignments.list[supportAssignmentId];

				supportAssignment = self.addSectionGroupData(supportAssignment, sectionGroups);
				supportAssignment = self.addCourseData(supportAssignment, courses);

				// Ensure assignment is the right type
				if (self.isAssignmentRelevantToSupportCall(supportAssignment, supportCallResponse) == false) {
					return;
				}

				// Ensure assignment does not match an existing preference
				if (self.isPotentialPreference(supportAssignment, preferences) == false) {
					return;
				}

				// Identify relevant potential preferenceGroup
				var group = null;
				if (supportAssignment.appointmentType == "reader") {
					group = potentialPreferences.readers;
				}
				if (supportAssignment.appointmentType == "teachingAssistant") {
					group = potentialPreferences.teachingAssistants;
				}
				if (supportAssignment.appointmentType == "associateInstructor") {
					group = potentialPreferences.associateInstructors;
				}

				// Ensure assignment does not match an existing potentialPreference
				for (var i = 0; i < group.length; i++) {
					var potentialPreference = group[i];

					if (potentialPreference.courseNumber == supportAssignment.courseNumber
					&& potentialPreference.subjectCode == supportAssignment.subjectCode
					&& potentialPreference.sequencePattern == supportAssignment.sequencePattern
					&& potentialPreference.appointmentPercentage == supportAssignment.appointmentPercentage) {
						return;
					}
				}

				// Add assignment
				group.push(supportAssignment);
			});

			return potentialPreferences;
		},
		// Determine if a supportAssignment has already been selected as a preference
		isPotentialPreference: function(supportAssignment, preferences) {
			for (var i = 0; i < preferences.ids.length; i++) {
				var preferenceId = preferences.ids[i];
				var preference = preferences.list[preferenceId];

				if (preference.subjectCode == supportAssignment.subjectCode
					&& preference.courseNumber == supportAssignment.courseNumber
					&& preference.type == supportAssignment.appointmentType
					&& preference.sequencePattern == supportAssignment.sequencePattern) {

					return false;
				}
			}

			return true;
		},
		// Returns true if assignment type matches a type being collected in the support call
		isAssignmentRelevantToSupportCall: function(supportAssignment, supportCallResponse) {
			if (supportCallResponse.collectReaderPreferences && supportAssignment.appointmentType == "reader") {
				return true;
			}
			if (supportCallResponse.collectTeachingAssistantPreferences && supportAssignment.appointmentType == "teachingAssistant") {
				return true;
			}
			if (supportCallResponse.collectAssociateInstructorPreferences && supportAssignment.appointmentType == "associateInstructor") {
				return true;
			}

			return false;
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