/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
class SupportSelectors {
	constructor () {
		return {
			generateSectionGroups: function (
				supportAssignments,
				courses,
				sectionGroups,
				supportStaffList,
				supportStaffSupportCallResponses,
				supportStaffPreferences,
				instructorPreferences,
				instructorSupportCallResponses,
				sections) {
				var self = this;
	
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
	
						// Ensure preference is relevant to sectionGroup
						if (supportAssignment.sectionGroupId != sectionGroup.id) {
							return;
						}
	
						// Add supportStaff data
						var supportAssignment = self.addSupportStaffData(supportAssignment, supportStaffList);
	
						if (supportAssignment.appointmentType == "teachingAssistant") {
							supportAssignment.viewType = "Teaching Assistants";
						} else if (supportAssignment.appointmentType == "reader") {
							supportAssignment.viewType = "Readers";
						}
	
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
						preference.description = preference.subjectCode + " " + preference.courseNumber + " " + preference.sequencePattern + " " + preference.title;
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
	
					sectionGroup.teachingAssistantAssignmentOptions.other = _array_sortByProperty(sectionGroup.teachingAssistantAssignmentOptions.other, ["lastName"]);

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
								|| preference.type != "reader") {
							return;
						}
	
						preference = self.addSupportStaffData(preference, supportStaffList);
						preference.description = preference.subjectCode + " " + preference.courseNumber + " " + preference.sequencePattern + " " + preference.title;
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
	

					// Add instructor preference comment to sectionGroup by following the relationship
					// sectionGroups -> instructorPreferences -> instructorSupportCallResponses
					instructorPreferences.ids.forEach(function(preferenceId) {
						var preference = instructorPreferences.list[preferenceId];
						if (preference.sectionGroupId == sectionGroup.id) {
							instructorSupportCallResponses.ids.forEach(function(responseId) {
								var response = instructorSupportCallResponses.list[responseId];
								if (response.instructorId == preference.instructorId) {
									sectionGroup.instructorPreferenceComment = response.generalComments;
								}
							});
						}
					});
	
					var generatedSections = self.generateSections(sectionGroup, sections, supportAssignments, supportStaffList);
					sectionGroup.sections = _array_sortByProperty(generatedSections, ["sequenceNumber"]);
	
					newSectionGroups.push(sectionGroup);
				});
	
				var sortedSectionGroups = _array_sortByProperty(newSectionGroups, ["subjectCode", "courseNumber"]);
	
				return sortedSectionGroups;
			},
			generateSections: function(sectionGroup, sections, supportAssignments, supportStaffList) {
				var self = this;
				var generatedSections = [];
	
				sections.ids.forEach(function(sectionId) {
					var section = sections.list[sectionId];
					if (section.sectionGroupId != sectionGroup.id) {
						return;
					}
	
					// Add assignments to section
					section.readerAssignmentOptions = sectionGroup.readerAssignmentOptions;
					section.teachingAssistantAssignmentOptions = sectionGroup.teachingAssistantAssignmentOptions;
	
					if (!supportAssignments.bySectionIds[sectionId]) {
						supportAssignments.bySectionIds[sectionId] = [];
					}
	
					section.supportAssignments = [];
	
					supportAssignments.bySectionIds[sectionId].forEach( function(assignmentId) {
						var supportAssignment = supportAssignments.list[assignmentId];
	
						// Ensure preference is relevant to sectionGroup
						if (supportAssignment.sectionId != section.id) {
							return;
						}
	
						// Add supportStaff data
						supportAssignment = self.addSupportStaffData(supportAssignment, supportStaffList);
	
						if (supportAssignment.appointmentType == "teachingAssistant") {
							supportAssignment.viewType = "Teaching Assistants";
						} else if (supportAssignment.appointmentType == "reader") {
							supportAssignment.viewType = "Readers";
						}
	
						section.supportAssignments.push(supportAssignment);
					});
	
					generatedSections.push(section);
				});
	
				return generatedSections;
			},
			generateSupportStaffList: function (supportAssignments,
																					courses,
																					sectionGroups,
																					sections,
																					supportStaffList,
																					supportStaffSupportCallResponses,
																					supportStaffPreferences,
																					supportAppointments,
																					ui) {
				var self = this;
				var newSupportStaffList = [];
	
				// Build the supportStaff view DTOs
				supportStaffList.ids.forEach( function(supportStaffId) {
					var supportStaffDTO = supportStaffList.list[supportStaffId];
	
					supportStaffDTO.supportCallResponse = self.findSupportCallResponse(supportStaffSupportCallResponses, supportStaffDTO.id);
					supportStaffDTO.supportAssignments = self.generateSupportAssignmentsForSupportStaff(supportStaffDTO.id, supportAssignments, sectionGroups, courses, sections);
					supportStaffDTO.supportStaffPreferences = self.generateSupportStaffPreferences(supportStaffDTO.id, supportStaffPreferences, sectionGroups, courses);
	
					supportStaffDTO.readerPreferenceCount = self.countPreferencesByType(supportStaffDTO.supportStaffPreferences, 'reader');
					supportStaffDTO.taPreferenceCount = self.countPreferencesByType(supportStaffDTO.supportStaffPreferences, 'teachingAssistant');
					supportStaffDTO.readerAssignmentCount = self.countAssignmentsByType(supportStaffDTO.supportAssignments, 'reader');
					supportStaffDTO.taAssignmentCount = self.countAssignmentsByType(supportStaffDTO.supportAssignments, 'teachingAssistant');
	
					supportStaffDTO.appointment = self.findSupportAppointment(supportStaffDTO.id, supportAppointments, ui.viewType);
	
					newSupportStaffList.push(supportStaffDTO);
				});
	
				newSupportStaffList = _array_sortByProperty(newSupportStaffList, "lastName");
	
				return newSupportStaffList;
			},
			countPreferencesByType: function(preferences, type) {
				var count = 0;
	
				preferences.forEach(function(preference) {
					if (preference.type == type) { count++; }
				});
	
				return count;
			},
			countAssignmentsByType: function(preferences, type) {
				var count = 0;
	
				preferences.forEach(function(preference) {
					if (preference.appointmentType == type) { count++; }
				});
	
				return count;
			},
			// Return the appointment for the specified supportStaff if it matches the current page view.
			// Otherwise return an empty object.
			findSupportAppointment: function (supportStaffId, supportAppointments, viewType) {
				var appointment = {};
	
				for (var i = 0; i < supportAppointments.ids.length; i++) {
					var supportAppointment = supportAppointments.list[supportAppointments.ids[i]];
	
					if (supportAppointment.supportStaffId == supportStaffId) {
						if (supportAppointment.type == "teachingAssistant" && viewType == "Teaching Assistants"
						|| supportAppointment.type == "reader" && viewType == "Readers") {
							appointment = supportAppointment;
						}
	
						break;
					}
				}
	
				return appointment;
			},
			generateSupportStaffPreferences: function (supportStaffId, supportStaffPreferences, sectionGroups, courses) {
				var self = this;
				var newPreferences = [];
	
				supportStaffPreferences.ids.forEach( function(preferenceId) {
					var preference = supportStaffPreferences.list[preferenceId];
	
					// Ensure preference is relevant to supportStaff
					if (preference.supportStaffId != supportStaffId) {
						return;
					}
	
					// Add sectionGroup and course data
					var preference = self.getCourseId(preference, sectionGroups);
					preference = self.addCourseData(preference, courses);
	
					newPreferences.push(preference);
				});
	
				return newPreferences;
			},
			generateSupportAssignmentsForSupportStaff: function(supportStaffId, supportAssignments, sectionGroups, courses, sections) {
				var self = this;
				var generatedSupportAssignments = [];
				supportAssignments.ids.forEach( function(assignmentId) {
					var supportAssignment = supportAssignments.list[assignmentId];
	
					// Ensure preference is relevant to supportStaff
					if (supportAssignment.supportStaffId != supportStaffId) {
						return;
					}
	
					// Add sectionGroup and course data
					var supportAssignment = self.getCourseId(supportAssignment, sectionGroups, sections);
					var supportAssignment = self.addCourseData(supportAssignment, courses);
	
					supportAssignment.description = supportAssignment.subjectCode + " " + supportAssignment.courseNumber + " " + supportAssignment.sequenceNumber + " " + supportAssignment.title;
	
					generatedSupportAssignments.push(supportAssignment);
				});
	
				return generatedSupportAssignments;
			},
			findSupportCallResponse: function(supportCallResponses, supportStaffId) {
				var supportCallResponse = null;
	
				supportCallResponses.ids.forEach( function(supportCallResponseId) {
					var slotSupportCallResponse = supportCallResponses.list[supportCallResponseId];
					if (supportStaffId == slotSupportCallResponse.supportStaffId) {
						supportCallResponse = slotSupportCallResponse;
					}
				});
	
				return supportCallResponse;
			},
			generateSupportAssignments: function(supportAssignments, sectionGroups, courses) {
				var self = this;
				var newSupportAssignments = [];
	
				supportAssignments.ids.forEach( function(supportAssignmentId) {
					var supportAssignment = supportAssignments.list[supportAssignmentId];
					supportAssignment = self.getCourseId(supportAssignment, sectionGroups);
					supportAssignment = self.addCourseData(supportAssignment, courses);
					newSupportAssignments.push(supportAssignment);
				});
	
				return newSupportAssignments;
			},
			// Support Assignments that only include one instance of a support assignment 'category'
			// For example, only show one copy of 'ECS 141 - A Series 50% TA Appointment' even though there are 5 identical slots.
			generateSupportAssignmentsUnique: function(supportAssignments, sectionGroups, courses) {
				var uniqueSupportAssignments = [];
				var supportAssignmentDTOs = this.generateSupportAssignments(supportAssignments, sectionGroups, courses);
	
				supportAssignmentDTOs.forEach( function(assignment) {
					var properties = ["courseNumber", "subjectCode", "sequencePattern", "appointmentType", "appointmentPercentage"];
					if(_array_contains_by_properties(uniqueSupportAssignments, properties, assignment)) {
						return;
					}
	
					uniqueSupportAssignments.push(assignment);
				});
	
				return uniqueSupportAssignments;
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
			// Expects a section or sectionGroup, will add the relevant courseId to it
			getCourseId: function(entity, sectionGroups, sections) {
				var derivedSectionGroupId = null;
	
				if (entity.sectionId > 0 && sections) {
					for (var i = 0; i < sections.ids.length; i++) {
						var section = sections.list[sections.ids[i]];
						if (entity.sectionId == section.id) {
							derivedSectionGroupId = section.sectionGroupId;
							break;
						}
					}
				}
	
				var sectionGroupId = derivedSectionGroupId || entity.sectionGroupId;
	
				if (sectionGroupId > 0) {
					for (var i = 0; i < sectionGroups.ids.length; i++) {
						var sectionGroup = sectionGroups.list[sectionGroups.ids[i]];
						if (sectionGroupId == sectionGroup.id) {
							entity.courseId = sectionGroup.courseId;
							break;
						}
					}
				}
	
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
	}
}

SupportSelectors.$inject = [];

export default SupportSelectors;
