class ScheduleSummaryReportStateService {
	constructor ($rootScope, $log, Term, SectionGroup, ActionTypes, TeachingAssignmentService) {
		return {
			_state: {},
			_sectionGroupReducers: function (action, sectionGroups) {
				var section;
				switch (action.type) {
					case ActionTypes.INIT_STATE:

						// Build courses metadata for searching
						let courses = {
							ids: [],
							list: {}
						};

						action.payload.courses.forEach( function(slotCourse) {
							courses.ids.push(slotCourse.id);
							courses.list[slotCourse.id] = slotCourse;
						});

						let supportStaffList = {
							ids: [],
							list: {}
						};

						action.payload.supportStaffList.forEach( function(supportStaff) {
							supportStaffList.ids.push(supportStaff.id);
							supportStaffList.list[supportStaff.id] = supportStaff;
						});

						let instructorTypes = {
							ids: [],
							list: {}
						};

						action.payload.instructorTypes.forEach( function(instructorType) {
							instructorTypes.ids.push(instructorType.id);
							instructorTypes.list[instructorType.id] = instructorType;
						});

						// Build sectionGroups metadata
						let sectionGroups = {
							ids: [],
							list: {}
						};

						action.payload.sectionGroups.forEach( function(slotSectionGroup) {
							// Get course data
							var courseId = slotSectionGroup.courseId;
							var slotCourse = courses.list[courseId];

							slotSectionGroup.subjectCode = slotCourse.subjectCode;
							slotSectionGroup.courseNumber = slotCourse.courseNumber;
							slotSectionGroup.title = slotCourse.title;
							slotSectionGroup.sequencePattern = slotCourse.sequencePattern;

							// Set units value
							if (slotCourse.unitsLow && slotCourse.unitsLow > 0) {
								slotSectionGroup.units = slotCourse.unitsLow;
							} else if (slotCourse.unitsHigh && slotCourse.unitsHigh > 0) {
								slotSectionGroup.units = slotCourse.unitsHigh;
							} else {
								slotSectionGroup.units = 0;
							}

							sectionGroups.ids.push(slotSectionGroup.id);
							sectionGroups.list[slotSectionGroup.id] = slotSectionGroup;
						});

						sectionGroups.ids = _array_sortIdsByProperty(sectionGroups.list, ["subjectCode", "courseNumber", "sequencePattern"]);

						// Build instructors metadata for searching
						let instructors = {
							ids: [],
							list: {}
						};

						action.payload.instructors.forEach( function(slotInstructor) {
							instructors.ids.push(slotInstructor.id);
							instructors.list[slotInstructor.id] = slotInstructor;
						});

						// Build teachingAssignment metadata for searching
						let teachingAssignments = {
							ids: [],
							list: {}
						};

						// Add assigned instructor data to sectionGroups
						action.payload.teachingAssignments.forEach( function(slotTeachingAssignment) {
							// Non-sectiongroup based assignments are irrelevant here.
							// TeachingAssignments that are unapproved are preferences and not assignments.
							if (!slotTeachingAssignment.sectionGroupId || slotTeachingAssignment.approved == false) { return; }

							teachingAssignments.ids.push(slotTeachingAssignment.id);
							teachingAssignments.list[slotTeachingAssignment.id] = slotTeachingAssignment;

							var slotSectionGroup = sectionGroups.list[slotTeachingAssignment.sectionGroupId];

							if (slotSectionGroup) {
								slotSectionGroup.instructors = slotSectionGroup.instructors || [];
								var slotInstructor = instructors.list[slotTeachingAssignment.instructorId];
								var slotInstructorType = instructorTypes.list[slotTeachingAssignment.instructorTypeId];
								var instructorName = TeachingAssignmentService.getInstructorDescription(slotTeachingAssignment, slotInstructor, slotInstructorType);

								slotSectionGroup.instructors.push(instructorName);
							}
						});

						// Build sections metadata for searching
						let sections = {
							ids: [],
							list: {}
						};

						action.payload.sections.forEach( function(slotSection) {
							sections.ids.push(slotSection.id);
							sections.list[slotSection.id] = slotSection;
						});

						// Calculate a list of TA names for each sectionGroup/section
						action.payload.supportAssignments.forEach( function(supportAssignment) {
							// Ensure supportAssignment is relevant
							if (supportAssignment.appointmentType != "teachingAssistant" || !supportAssignment.supportStaffId) { return; }

							// Support Assignments can be tied to either a specific section or a sectionGroup
							if (supportAssignment.sectionGroupId > 0) {
								sectionGroups.list[supportAssignment.sectionGroupId].teachingAssistants = sectionGroups.list[supportAssignment.sectionGroupId].teachingAssistants || [];

								var supportStaff = supportStaffList.list[supportAssignment.supportStaffId];
								var displayName = supportStaff.firstName + " " + supportStaff.lastName;
								var index = sectionGroups.list[supportAssignment.sectionGroupId].teachingAssistants.indexOf(displayName);

								if (index == -1) {
									sectionGroups.list[supportAssignment.sectionGroupId].teachingAssistants.push(displayName);
								}
							} else if (supportAssignment.sectionId > 0) {
								sections.list[supportAssignment.sectionId].teachingAssistants = sections.list[supportAssignment.sectionId].teachingAssistants || [];

								var supportStaff = supportStaffList.list[supportAssignment.supportStaffId];
								var displayName = supportStaff.firstName + " " + supportStaff.lastName;
								var index = sections.list[supportAssignment.sectionId].teachingAssistants.indexOf(displayName);

								if (index == -1) {
									sections.list[supportAssignment.sectionId].teachingAssistants.push(displayName);
								}
							}
						});

						// Build activities metadata for searching and add metadata to sections
						let activities = {
							ids: [],
							list: {}
						};

						action.payload.activities.forEach( function(slotActivity) {
							let slotSection = sections.list[slotActivity.sectionId];

							if (slotSection) {
								if (slotSection.activities == null) {
									slotSection.activities = [];
								}

								slotSection.activities.push(slotActivity);
							}

							activities.ids.push(slotActivity.id);
							activities.list[slotActivity.id] = slotActivity;
						});

						let slotSectionGroup = null;

						// Add the combined sections to sectionGroups
						sections.ids.forEach( function(slotSectionId) {
							let slotSection = sections.list[slotSectionId];
							slotSectionGroup = sectionGroups.list[slotSection.sectionGroupId];

							if (slotSectionGroup.sections == null) {
								slotSectionGroup.sections = [];
							}

							slotSectionGroup.sections.push(slotSection);
						});

						if (slotSectionGroup) {
							slotSectionGroup.sections = _array_sortByProperty(slotSectionGroup.sections, ["sequenceNumber"]);
						}

						// Add any shared activities to the appropriate sections
						action.payload.activities.forEach( function(slotActivity) {
							let slotSection = sections.list[slotActivity.sectionId];
							slotSectionGroup = sectionGroups.list[slotActivity.sectionGroupId];

							// Check if this activity is a shared activity
							if (!slotSection && slotSectionGroup) {
								
								slotSectionGroup.sections.forEach ( function (slotSection) {
									// Scaffold section activities if necessary
									if (slotSection.activities == null) {
										slotSection.activities = [];
									}

									slotSection.activities.push(slotActivity);
								});
							}

							activities.ids.push(slotActivity.id);
							activities.list[slotActivity.id] = slotActivity;
						});

						sectionGroups.ids.forEach( function (sectionGroupId) {
							var sectionGroup = sectionGroups.list[sectionGroupId];

							if (sectionGroup.sections == null && sectionGroup.plannedSeats > 0) {
								sectionGroup.sections = [];
								sectionGroup.sections.push({id: 0});
							}
						});

						return sectionGroups;
					default:
						return sectionGroups;
				}
			},
			reduce: function (action) {
				var scope = this;

				if (!action || !action.type) {
					return;
				}

				let newState = {};
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);

				scope._state = newState;
				$rootScope.$emit('reportStateChanged', {
					state: scope._state,
					action: action
				});

				$log.debug("Report state updated:");
				$log.debug(scope._state, action.type);
			}
		};
	}
}

ScheduleSummaryReportStateService.$inject = ['$rootScope', '$log', 'Term', 'SectionGroup', 'ActionTypes', 'TeachingAssignmentService'];

export default ScheduleSummaryReportStateService;
