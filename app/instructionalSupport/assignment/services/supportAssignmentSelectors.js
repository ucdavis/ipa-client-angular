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
			assignments
				supportStaffData
			aiAssignmentOptions
				supportStaffPreferences
					supportStaffData
					preferenceData
				instructorPreferences
					supportStaffData
					preferenceData
				other
					supportStaffData
					preferenceData
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
			supportStaffPreferences (preference)
				courseData
				sectionGroupData
*/
		// Creates structured json corresponding to a 'support staff' centric view of the data

		generateSectionGroups: function (supportAssignments, courses, sectionGroups, supportStaffFromRoles, assignedSupportStaffList, supportStaffPreferences, instructorPreferences) {
			var self = this;

			// Blend the two types of support staff together into a unique listing
			var supportStaffList = {ids: [], list: {}};

			assignedSupportStaffList.ids.forEach(function(supportStaffId) {
				if (supportStaffList.ids.indexOf(supportStaffId) > -1) {
					return;
				}
				var supportStaffDTO = assignedSupportStaffList.list[supportStaffId];
				supportStaffDTO.hasAssignmentOrPreference = true;
				supportStaffList.ids.push(supportStaffId);
				supportStaffList.list[supportStaffId] = supportStaffDTO;
			});

			supportStaffFromRoles.ids.forEach(function(supportStaffId) {
				if (supportStaffList.ids.indexOf(supportStaffId) > -1) {
					return;
				}

				var supportStaffDTO = supportStaffFromRoles.list[supportStaffId];
				supportStaffDTO.hasAssignmentOrPreference = false;
				supportStaffList.ids.push(supportStaffId);
				supportStaffList.list[supportStaffId] = supportStaffDTO;
			});

			// Build sectionGroup DTOs
			var newSectionGroups = [];
			sectionGroups.ids.forEach( function(sectionGroupId) {
				var sectionGroup = sectionGroups.list[sectionGroupId];

				// Add course data
				sectionGroup = self.addCourseData(sectionGroup, courses);

				// Add assignments
				sectionGroup.supportAssignments = [];
				supportAssignments.ids.forEach( function(assignmentId) {
					var supportAssignment = supportAssignments.list[assignmentId];

					// Ensure preference is relevant to supportStaff
					if (supportAssignment.sectionGroupId != sectionGroup.id) {
						return;
					}

					// Add supportStaff data
					var supportAssignment = self.addSupportStaffData(supportAssignment, supportStaffList);

					sectionGroup.supportAssignments.push(supportAssignment);
				});

				// Add teachingAssistantAssignmentOptions
				var processedSupportStaffIds = [];
				sectionGroup.teachingAssistantAssignmentOptions = {};
				sectionGroup.teachingAssistantAssignmentOptions.instructorPreferences = [];
				// Add instructor preferences
				instructorPreferences.ids.forEach( function(preferenceId) {
					var preference = instructorPreferences.list[preferenceId];

					if (preference.sectionGroupId != sectionGroup.id) {
						return;
					}

					preference = self.addSupportStaffData(preference, supportStaffList);
					sectionGroup.teachingAssistantAssignmentOptions.instructorPreferences.push(preference);
					processedSupportStaffIds.push(preference.supportStaffId);
				});

				// Add SupportStaff preferences
				sectionGroup.teachingAssistantAssignmentOptions.supportStaffPreferences = [];
				supportStaffPreferences.ids.forEach( function(preferenceId) {
					var preference = supportStaffPreferences.list[preferenceId];

					if (preference.sectionGroupId != sectionGroup.id
							|| preference.type != "teachingAssistant") {
						return;
					}

					preference = self.addSupportStaffData(preference, supportStaffList);
					sectionGroup.teachingAssistantAssignmentOptions.supportStaffPreferences.push(preference);
					processedSupportStaffIds.push(preference.supportStaffId);
				});

				// Add Other options
				sectionGroup.teachingAssistantAssignmentOptions.other = [];
				supportStaffList.ids.forEach( function(supportStaffId) {
					var supportStaff = supportStaffList.list[supportStaffId];

					if (processedSupportStaffIds.indexOf(supportStaffId) > -1) {
						return;
					}

					supportStaff.supportStaffId = supportStaff.id;
					sectionGroup.teachingAssistantAssignmentOptions.other.push(supportStaff);
				});

				// Add associateInstructorAssignmentOptions
				var processedSupportStaffIds = [];

				// There are no instructor preferences for associateInstructors
				sectionGroup.associateInstructorAssignmentOptions = {};
				sectionGroup.associateInstructorAssignmentOptions.instructorPreferences = [];


				// Add SupportStaff preferences
				sectionGroup.associateInstructorAssignmentOptions.supportStaffPreferences = [];
				supportStaffPreferences.ids.forEach( function(preferenceId) {
					var preference = supportStaffPreferences.list[preferenceId];

					if (preference.sectionGroupId != sectionGroup.id
							|| preference.type != "associateInstructor") {
						return;
					}

					preference = self.addSupportStaffData(preference, supportStaffList);
					sectionGroup.associateInstructorAssignmentOptions.supportStaffPreferences.push(preference);
					processedSupportStaffIds.push(preference.supportStaffId);
				});

				// Add Other options
				sectionGroup.associateInstructorAssignmentOptions.other = [];
				supportStaffList.ids.forEach( function(supportStaffId) {
					var supportStaff = supportStaffList.list[supportStaffId];

					if (processedSupportStaffIds.indexOf(supportStaffId) > -1) {
						return;
					}

					supportStaff.supportStaffId = supportStaff.id;
					sectionGroup.associateInstructorAssignmentOptions.other.push(supportStaff);
				});

				// Add readerAssignmentOptions
				var processedSupportStaffIds = [];

				// There are no instructor preferences for readers
				sectionGroup.readerAssignmentOptions = {};
				sectionGroup.readerAssignmentOptions.instructorPreferences = [];


				// Add SupportStaff preferences
				sectionGroup.readerAssignmentOptions.supportStaffPreferences = [];
				supportStaffPreferences.ids.forEach( function(preferenceId) {
					var preference = supportStaffPreferences.list[preferenceId];

					if (preference.sectionGroupId != sectionGroup.id
							|| preference.type != "associateInstructor") {
						return;
					}

					preference = self.addSupportStaffData(preference, supportStaffList);
					sectionGroup.readerAssignmentOptions.supportStaffPreferences.push(preference);
					processedSupportStaffIds.push(preference.supportStaffId);
				});

				// Add Other options
				sectionGroup.readerAssignmentOptions.other = [];
				supportStaffList.ids.forEach( function(supportStaffId) {
					var supportStaff = supportStaffList.list[supportStaffId];

					if (processedSupportStaffIds.indexOf(supportStaffId) > -1) {
						return;
					}

					supportStaff.supportStaffId = supportStaff.id;
					sectionGroup.readerAssignmentOptions.other.push(supportStaff);
				});

				newSectionGroups.push(sectionGroup);
			});

			return newSectionGroups;
		},
		generateSupportStaffList: function (supportAssignments, courses, sectionGroups, supportStaffFromRoles, assignedSupportStaffList, supportStaffSupportCallResponses, supportStaffPreferences) {
			var self = this;
			var newSupportStaffList = [];

			// Blend the two types of support staff together into a unique listing
			var processedSupportStaffIds = [];
			var supportStaffList = [];
			assignedSupportStaffList.ids.forEach(function(supportStaffId) {
				if (processedSupportStaffIds.indexOf(supportStaffId) > -1) {
					return;
				}
				var supportStaffDTO = assignedSupportStaffList.list[supportStaffId];
				supportStaffDTO.hasAssignment = true;
				processedSupportStaffIds.push(supportStaffId);
				supportStaffList.push(supportStaffDTO);
			});

			supportStaffFromRoles.ids.forEach(function(supportStaffId) {
				if (processedSupportStaffIds.indexOf(supportStaffId) > -1) {
					return;
				}

				var supportStaffDTO = supportStaffFromRoles.list[supportStaffId];
				supportStaffDTO.hasAssignment = false;
				processedSupportStaffIds.push(supportStaffId);
				supportStaffList.push(supportStaffDTO);
			});

			// Build the supportStaff view DTOs
			supportStaffList.forEach( function(supportStaffDTO) {

				// Add supportCallResponse
				supportStaffSupportCallResponses.ids.forEach( function(supportCallResponseId) {
					var supportCallResponse = supportStaffSupportCallResponses.list[supportCallResponseId];
					if (supportStaffDTO.id == supportCallResponse.supportStaffId) {
						supportStaffDTO.supportCallResponse = supportCallResponse;
					}
				});


				// Add supportAssignments
				supportStaffDTO.supportAssignments = [];
				supportAssignments.ids.forEach( function(assignmentId) {
					var supportAssignment = supportAssignments.list[assignmentId];

					// Ensure preference is relevant to supportStaff
					if (supportAssignment.supportStaffId != supportStaffDTO.id) {
						return;
					}

					// Add sectionGroup and course data
					var supportAssignment = self.addSectionGroupData(supportAssignment, sectionGroups);
					var supportAssignment = self.addCourseData(supportAssignment, courses);

					supportStaffDTO.supportAssignments.push(supportAssignment);
				});

				// Add supportStaffPreferences
				supportStaffDTO.supportStaffPreferences = [];
				supportStaffPreferences.ids.forEach( function(preferenceId) {
					var preference = supportStaffPreferences.list[preferenceId];

					// Ensure preference is relevant to supportStaff
					if (preference.supportStaffId != supportStaffDTO.id) {
						return;
					}

					// Add sectionGroup and course data
					var preference = self.addSectionGroupData(preference, sectionGroups);
					var preference = self.addCourseData(preference, courses);

					supportStaffDTO.supportStaffPreferences.push(preference);
				});

				newSupportStaffList.push(supportStaffDTO);
			});

			return newSupportStaffList;
		},
		generateSupportAssignments: function(supportAssignments, sectionGroups, courses) {
			var self = this;
			var newSupportAssignments = [];
			// TODO: add course data to supportAssignments
			supportAssignments.ids.forEach( function(supportAssignmentId) {
				var supportAssignment = supportAssignments.list[supportAssignmentId];
				supportAssignment = self.addSectionGroupData(supportAssignment, sectionGroups);
				supportAssignment = self.addCourseData(supportAssignment, courses);
				newSupportAssignments.push(supportAssignment);
			});

			return newSupportAssignments;
		},
		/* Helper functions */
		// Blend the relevant course data
		addCourseData: function(entity, courses) {
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
		// Blend the relevant sectionGroup data
		addSectionGroupData: function(entity, sectionGroups) {
			sectionGroups.ids.forEach( function (sectionGroupId) {
				var sectionGroup = sectionGroups.list[sectionGroupId];

				if (entity.sectionGroupId == sectionGroup.id) {
					entity.courseId = sectionGroup.courseId;
				}
			});

			return entity;
		},
		// Blend the relevant supportStaff data
		addSupportStaffData: function(entity, supportStaffList) {
			supportStaffList.ids.forEach( function (supportStaffId) {
				var supportStaff = supportStaffList.list[supportStaffId];

				if (entity.supportStaffId == supportStaff.id) {
					entity.firstName = supportStaff.firstName;
					entity.lastName = supportStaff.lastName;
					entity.loginId = supportStaff.loginId;
					entity.fullName = supportStaff.fullName;
					entity.supportStaffid = supportStaff.id;
				}
			});

			return entity;
		}
	};
});