instructionalSupportApp.service('instructionalSupportAssignmentStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term) {
	return {
		_state: {},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						ids: []
					};
					var sectionGroupsList = {};

					var coursesLength = action.payload.courses ? action.payload.courses.length : 0;
					var sectionGroupsLength = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;

					// For every course, find the relevant sectionGroup and add metadata to it from the course
					for (var i = 0; i < coursesLength; i++) {
						var courseData = action.payload.courses[i];

						for (var j = 0; j < sectionGroupsLength; j++) {
							var sectionGroupData = action.payload.sectionGroups[j];
							if (sectionGroupData.courseId === courseData.id) {
								sectionGroup = new SectionGroup(sectionGroupData);
								sectionGroup.subjectCode = courseData.subjectCode;
								sectionGroup.sequencePattern = courseData.sequencePattern;
								sectionGroup.courseNumber = courseData.courseNumber;
								sectionGroup.title = courseData.title;
								sectionGroup.units = courseData.unitsLow;

								sectionGroupsList[sectionGroupData.id] = sectionGroup;
								sectionGroups.ids.push(sectionGroupData.id);
								sectionGroup.instructionalSupportAssignmentIds = [];

								// Add assignment options
								sectionGroup.taAssignmentOptions = {};
								sectionGroup.taAssignmentOptions.phdStudentIds = action.payload.phdStudentIds;
								sectionGroup.taAssignmentOptions.mastersStudentIds = action.payload.mastersStudentIds;
								sectionGroup.taAssignmentOptions.instructionalSupportIds = action.payload.instructionalSupportIds;
								sectionGroup.taAssignmentOptions.studentPreferences = [];

								sectionGroup.readerAssignmentOptions = {};
								sectionGroup.readerAssignmentOptions.phdStudentIds = action.payload.phdStudentIds;
								sectionGroup.readerAssignmentOptions.mastersStudentIds = action.payload.mastersStudentIds;
								sectionGroup.readerAssignmentOptions.instructionalSupportIds = action.payload.instructionalSupportIds;
								sectionGroup.readerAssignmentOptions.studentPreferences = [];

								sectionGroup.aiAssignmentOptions = {};
								sectionGroup.aiAssignmentOptions.phdStudentIds = action.payload.phdStudentIds;
								sectionGroup.aiAssignmentOptions.mastersStudentIds = action.payload.mastersStudentIds;
								sectionGroup.aiAssignmentOptions.instructionalSupportIds = action.payload.instructionalSupportIds;
								sectionGroup.aiAssignmentOptions.studentPreferences = [];

								for (var k = 0; k < action.payload.studentInstructionalSupportPreferences.length; k++) {
									var slotPreference = action.payload.studentInstructionalSupportPreferences[k];
									if (slotPreference.sectionGroupId == sectionGroup.id) {

										if (slotPreference.type == "teachingAssistant") {
											sectionGroup.taAssignmentOptions.studentPreferences.push(slotPreference);
										} else if (slotPreference.type == "readerAssignmentOptions") {
											sectionGroup.readerAssignmentOptions.studentPreferences.push(slotPreference);
										} else if (slotPreference.type == "associateInstructor") {
											sectionGroup.aiAssignmentOptions.studentPreferences.push(slotPreference);
										}
									}
								}
							}
						}
					}

					// Add instructionalSupportAssignment associations to parent sectionGroups
					var instructionalSupportAssignmentsLength = action.payload.instructionalSupportAssignments ? action.payload.instructionalSupportAssignments.length : 0;

					for (var k = 0; k < instructionalSupportAssignmentsLength; k++) {
						var instructionalSupportAssignmentData = action.payload.instructionalSupportAssignments[k];
						var sectionGroupId = instructionalSupportAssignmentData.sectionGroupId;

						sectionGroupsList[sectionGroupId].instructionalSupportAssignmentIds.push(instructionalSupportAssignmentData.id);
					}

					// Put together sectionGroup state data
					sectionGroups.ids = sortCourseIds(sectionGroups.ids, sectionGroupsList);
					sectionGroups.list = sectionGroupsList;

					return sectionGroups;
				case ADD_ASSIGNMENT_SLOTS:
					var instructionalSupportAssignmentsLength = action.payload ? action.payload.length : 0;

					for (var k = 0; k < instructionalSupportAssignmentsLength; k++) {
						var instructionalSupportAssignmentData = action.payload[k];
						var sectionGroupId = instructionalSupportAssignmentData.sectionGroupId;

						sectionGroups.list[sectionGroupId].instructionalSupportAssignmentIds.push(instructionalSupportAssignmentData.id);
					}

					return sectionGroups;

				case DELETE_ASSIGNMENT:

					sectionGroupId = action.payload.sectionGroupId;
					assignmentId = action.payload.id;

					var index = sectionGroups.list[sectionGroupId].instructionalSupportAssignmentIds.indexOf(assignmentId);

					if (index > -1) {
						sectionGroups.list[sectionGroupId].instructionalSupportAssignmentIds.splice(index,1);
					}

					return sectionGroups;
				case ASSIGN_STAFF_TO_SLOT:
					// Remove the user as an option in sectionGroup assignmentOptions where appropriate
					return sectionGroups;
				case REMOVE_STAFF_FROM_SLOT:
					// Add the user as an option in sectionGroup assignmentOptions where appropriate
					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_instructionalSupportAssignmentsReducers: function (action, instructionalSupportAssignments) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructionalSupportAssignments = {
						ids: []
					};

					var instructionalSupportAssignmentsList = {};

					var instructionalSupportAssignmentsLength = action.payload.instructionalSupportAssignments ? action.payload.instructionalSupportAssignments.length : 0;

					for (var i = 0; i < instructionalSupportAssignmentsLength; i++) {
						var instructionalSupportAssignmentData = action.payload.instructionalSupportAssignments[i];

						instructionalSupportAssignmentsList[instructionalSupportAssignmentData.id] = instructionalSupportAssignmentData;
						instructionalSupportAssignments.ids.push(instructionalSupportAssignmentData.id);
					}

					instructionalSupportAssignments.list = instructionalSupportAssignmentsList;

					return instructionalSupportAssignments;
				case DELETE_ASSIGNMENT:
					var index = instructionalSupportAssignments.ids.indexOf(action.payload.id)

					if (index > -1) {
						instructionalSupportAssignments.list[index] = null;
						instructionalSupportAssignments.ids.splice(index, 1);
					}

					return instructionalSupportAssignments;
					case ADD_ASSIGNMENT_SLOTS:
						instructionalSupportAssignmentsList = {};

						instructionalSupportAssignmentsLength = action.payload ? action.payload.length : 0;

						for (var i = 0; i < instructionalSupportAssignmentsLength; i++) {
							var instructionalSupportAssignmentData = action.payload[i];

							instructionalSupportAssignments.list[instructionalSupportAssignmentData.id] = instructionalSupportAssignmentData;
							instructionalSupportAssignments.ids.push(instructionalSupportAssignmentData.id);
						}

						return instructionalSupportAssignments;
					case REMOVE_STAFF_FROM_SLOT:
						var supportAssignment = action.payload;
						instructionalSupportAssignments.list[supportAssignment.id] = supportAssignment;

						return instructionalSupportAssignments;
					case ASSIGN_STAFF_TO_SLOT:
						var supportAssignment = action.payload;
						instructionalSupportAssignments.list[supportAssignment.id] = supportAssignment;
						return instructionalSupportAssignments;
				default:
					return instructionalSupportAssignments;
			}
		},
		_instructionalSupportStaffsReducers: function (action, instructionalSupportStaffs) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructionalSupportStaffs = {
						ids: [],
						list: {}
					};

					var instructionalSupportStaffsLength = action.payload.instructionalSupportStaffList ? action.payload.instructionalSupportStaffList.length : 0;

					for (var i = 0; i < instructionalSupportStaffsLength; i++) {
						var instructionalSupportStaffData = action.payload.instructionalSupportStaffList[i];

						// Find assignments made to this support staff
						instructionalSupportStaffData.supportAssignmentIds = [];
						for (var j = 0; j < action.payload.instructionalSupportAssignments.length; j++) {
							slotInstructionalSupportAssignment = action.payload.instructionalSupportAssignments[j];

							if (slotInstructionalSupportAssignment.instructionalSupportStaffId == instructionalSupportStaffData.id) {
								instructionalSupportStaffData.supportAssignmentIds.push(slotInstructionalSupportAssignment.id);
							}
						}

						// Find preferences made by this support staff
						instructionalSupportStaffData.preferenceIds = [];
						for (var j = 0; j < action.payload.studentInstructionalSupportPreferences.length; j++) {
							slotPreference = action.payload.studentInstructionalSupportPreferences[j];

							if (slotPreference.instructionalSupportStaffId == instructionalSupportStaffData.id) {
								instructionalSupportStaffData.preferenceIds.push(slotPreference.id);
							}
						}

						instructionalSupportStaffs.list[instructionalSupportStaffData.id] = instructionalSupportStaffData;
						instructionalSupportStaffs.ids.push(instructionalSupportStaffData.id);
					}

					return instructionalSupportStaffs;
				case REMOVE_STAFF_FROM_SLOT:
					var supportStaffAssignments = instructionalSupportStaffs.list[action.supportStaffId].supportAssignmentIds;
					var supportAssignmentId = action.payload.id;

					var index = supportStaffAssignments.indexOf(supportAssignmentId);

					if (index > -1) {
						supportStaffAssignments.splice(index);
					}
					return instructionalSupportStaffs;
				case ASSIGN_STAFF_TO_SLOT:
					var supportStaffId = action.payload.instructionalSupportStaffId;
					var assignmentId = action.payload.id;

					instructionalSupportStaffs.list[supportStaffId].supportAssignmentIds.push(assignmentId);
					return instructionalSupportStaffs;
				default:
					return instructionalSupportStaffs;
			}
		},
		_preferenceReducers: function (action, preferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					preferences = {
						ids: [],
						list: {}
					};

					var preferencesLength = action.payload.studentInstructionalSupportPreferences ? action.payload.studentInstructionalSupportPreferences.length : 0;

					for (var i = 0; i < preferencesLength; i++) {
						var preferenceData = action.payload.studentInstructionalSupportPreferences[i];

						preferences.list[preferenceData.id] = preferenceData;
						preferences.ids.push(preferenceData.id);
					}

					return preferences;
				default:
					return preferences;
			}
		},
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					userInterface = {};

					userInterface.displayCoursePivot = true;
					userInterface.displaySupportStaffPivot = false;

					return userInterface;
				case TOGGLE_ASSIGNMENT_PIVOT_VIEW:
					userInterface.displayCoursePivot = false;
					userInterface.displaySupportStaffPivot = false;

					switch(action.payload.viewName) {
						case "course":
							userInterface.displayCoursePivot = true;
							return userInterface;
						case "supportStaff":
						default:
							userInterface.displaySupportStaffPivot = true;
							return userInterface;
					}
				default:
					return userInterface;
			}
		},

		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.instructionalSupportAssignments = scope._instructionalSupportAssignmentsReducers(action, scope._state.instructionalSupportAssignments);
			newState.preferences = scope._preferenceReducers(action, scope._state.preferences);
			newState.instructionalSupportStaffs = scope._instructionalSupportStaffsReducers(action, scope._state.instructionalSupportStaffs);
			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
			scope._state = newState;

			$rootScope.$emit('instructionalSupportAssignmentStateChanged', {
				state: scope._state
			});

			$log.debug("Instructional Support state updated:");
			$log.debug(scope._state);
		}
	};
});

// Sort the course Ids by subject Code and then course number
sortCourseIds = function(courseIds, courses) {

		courseIds.sort(function (aId, bId) {
			a = courses[aId];
			b = courses[bId];
			// Use subject codes to sort
			if (a.subjectCode > b.subjectCode) {
				return 1;
			}

			if (a.subjectCode < b.subjectCode) {
				return -1;
			}

			// Subject codes matched, use course numbers to sort
			if (a.courseNumber > b.courseNumber) {
				return 1;
			}

			if (a.courseNumber < b.courseNumber) {
				return -1;
			}

			// Course numbers matched, use sequencePattern to sort
			if (a.sequencePattern > b.sequencePattern) {
				return 1;
			}

			if (a.sequencePattern < b.sequencePattern) {
				return -1;
			}

			return -1;
		});

	return courseIds;
};