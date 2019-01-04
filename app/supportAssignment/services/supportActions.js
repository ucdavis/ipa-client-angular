import { isNumber } from 'shared/helpers/types';
import { setCharAt } from 'shared/helpers/string';

class SupportActions {
	constructor ($rootScope, $window, SupportService, SupportReducer, ActionTypes, Term, $route) {
		return {
			getInitialState: function () {
				var self = this;
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var shortTermCode = $route.current.params.termShortCode;
				var tab = $route.current.params.tab;

				SupportService.getInitialState(workgroupId, year, shortTermCode).then(function (payload) {
					SupportReducer.reduce({
						type: ActionTypes.INIT_STATE,
						payload: payload,
						year: year,
						tab: tab,
						shortTermCode: shortTermCode
					});
	
					self.performInitCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not get instructional support assignment initial state.", type: "ERROR" });
				});
			},
			toggleStudentSupportCallReview: function () {
				SupportService.toggleSupportStaffSupportCallReview(SupportReducer._state.schedule.id, SupportReducer._state.ui.shortTermCode).then(function (schedule) {
					$rootScope.$emit('toast', { message: "Updated student support call review", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW,
						payload: {
							schedule: schedule,
							shortTermCode: SupportReducer._state.ui.shortTermCode
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not toggle support staff call review.", type: "ERROR" });
				});
			},
			toggleInstructorSupportCallReview: function () {
				SupportService.toggleInstructorSupportCallReview(SupportReducer._state.schedule.id, SupportReducer._state.ui.shortTermCode).then(function (schedule) {
					$rootScope.$emit('toast', { message: "Updated instructor support call review", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW,
						payload: {
							schedule: schedule,
							shortTermCode: SupportReducer._state.ui.shortTermCode
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update instructor support call review.", type: "ERROR" });
				});
			},
			assignStaffToSectionGroup: function (sectionGroupId, supportStaffId, type) {
				SupportService.assignStaffToSectionGroup(sectionGroupId, supportStaffId, type).then(function (supportAssignment) {
					$rootScope.$emit('toast', { message: "Assigned staff", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.ASSIGN_STAFF_TO_SECTION_GROUP,
						payload: {
							supportAssignment: supportAssignment
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not assign staff.", type: "ERROR" });
				});
			},
			assignStaffToSection: function (sectionId, supportStaff, type) {
				SupportService.assignStaffToSection(sectionId, supportStaff, type).then(function (supportAssignment) {
					$rootScope.$emit('toast', { message: "Assigned staff", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.ASSIGN_STAFF_TO_SECTION,
						payload: {
							supportAssignment: supportAssignment
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not assign staff.", type: "ERROR" });
				});
			},
			deleteAssignment: function (supportAssignment) {
				SupportService.deleteAssignment(supportAssignment).then(function () {
					$rootScope.$emit('toast', { message: "Removed Assignment", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.DELETE_ASSIGNMENT,
						payload: supportAssignment,
						sectionId: supportAssignment.sectionId,
						sectionGroupId: supportAssignment.sectionGroupId
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not remove assignment.", type: "ERROR" });
				});
			},
			updateReaderAppointments: function (sectionGroupDTO) {
				// Prepare the original sectionGroup for sending to the server
				// If the front end DTO is sent it generates a server error 413 (Request Entity Too Large)
				var sectionGroup = {
					id: sectionGroupDTO.id,
					courseId: sectionGroupDTO.courseId,
					termCode: sectionGroupDTO.termCode,
					plannedSeats: sectionGroupDTO.plannedSeats,
					teachingAssistantAppointments: sectionGroupDTO.teachingAssistantAppointments,
					readerAppointments: sectionGroupDTO.readerAppointments,
					showTheStaff: sectionGroupDTO.showTheStaff,
					showPlaceholderAI: sectionGroupDTO.showPlaceholderAI
				};
	
				SupportService.updateSectionGroup(sectionGroup).then(function() {
					$rootScope.$emit('toast', { message: "Updated Readers", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.UPDATE_SECTIONGROUP,
						payload: {
							sectionGroup: sectionGroup
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update readers.", type: "ERROR" });
				});
			},
			updateTeachingAssistantAppointments: function (sectionGroupDTO) {
				// Prepare the original sectionGroup for sending to the server
				// If the front end DTO is sent it generates a server error 413 (Request Entity Too Large)
				var sectionGroup = {
					id: sectionGroupDTO.id,
					courseId: sectionGroupDTO.courseId,
					termCode: sectionGroupDTO.termCode,
					plannedSeats: sectionGroupDTO.plannedSeats,
					teachingAssistantAppointments: sectionGroupDTO.teachingAssistantAppointments,
					readerAppointments: sectionGroupDTO.readerAppointments,
					showTheStaff: sectionGroupDTO.showTheStaff,
					showPlaceholderAI: sectionGroupDTO.showPlaceholderAI
				};
	
				sectionGroup.teachingAssistantAppointments = sectionGroupDTO.teachingAssistantAppointments;
	
				
				SupportService.updateSectionGroup(sectionGroup).then(function() {
					$rootScope.$emit('toast', { message: "Updated Teaching Assistants", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.UPDATE_SECTIONGROUP,
						payload: {
							sectionGroup: sectionGroup
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update teaching assistants.", type: "ERROR" });
				});
			},
			updateSupportAppointment: function (supportAppointment) {
				supportAppointment.percentage = parseFloat(supportAppointment.percentage);
				supportAppointment.scheduleId = SupportReducer._state.schedule.id;
				supportAppointment.termCode = SupportReducer._state.ui.termCode;
	
				SupportService.updateSupportAppointment(supportAppointment).then(function(payload) {
					$rootScope.$emit('toast', { message: "Updated Appointment", type: "SUCCESS" });
					SupportReducer.reduce({
						type: ActionTypes.UPDATE_SUPPORT_APPOINTMENT,
						payload: {
							supportAppointment: payload
						}
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update teaching assistants.", type: "ERROR" });
				});
			},
			// Example 'Comments', 'Teaching Assignments'
			setViewPivot: function (tabName) {
				SupportReducer.reduce({
					type: ActionTypes.SET_VIEW_PIVOT,
					payload: {
						tabName: tabName
					}
				});
			},
			// Example 'Reader', 'Teaching Assistants'
			setViewType: function (viewType) {
				SupportReducer.reduce({
					type: ActionTypes.SET_VIEW_TYPE,
					payload: {
						viewType: viewType
					}
				});
			},
			setSupportStaffTab: function(tabName, supportStaffId) {
				SupportReducer.reduce({
					type: ActionTypes.SET_SUPPORT_STAFF_TAB,
					payload: {
						tabName: tabName,
						supportStaffId: supportStaffId
					}
				});
			},
			updateTableFilter: function (query) {
				var action = {
					type: ActionTypes.UPDATE_TABLE_FILTER,
					payload: {
						query: query
					}
				};
				SupportReducer.reduce(action);
			},
			openAvailabilityModal: function(supportStaff) {
				SupportReducer.reduce({
					type: ActionTypes.OPEN_AVAILABILITY_MODAL,
					payload: {
						supportStaff: supportStaff
					}
				});
			},
			closeAvailabilityModal: function() {
				SupportReducer.reduce({
					type: ActionTypes.CLOSE_AVAILABILITY_MODAL,
					payload: {}
				});
			},
			performInitCalculations: function() {
				this.calculateSectionGroupScheduling();
				this.calculateSectionScheduling();
				this.calculateScheduleConflicts();
				this.calculateStaffAssignmentOptions();
			},
	
			calculateScheduleConflicts: function() {
				var self = this;
	
				var conflicts = {
					bySupportStaffId: {},
					bySectionId: [],
					bySectionGroupId: [],
				};
	
				SupportReducer._state.supportStaffList.ids.forEach(function(supportStaffId) {
					var supportStaff = SupportReducer._state.supportStaffList.list[supportStaffId];
					var supportStaffResponse = SupportReducer._state.supportStaffSupportCallResponses.bySupportStaffId[supportStaffId];
	
					var supportConflicts = conflicts.bySupportStaffId[supportStaffId] = {
						sectionIds: [],
						sectionGroupIds: []
					};
	
					// If the support staff has no availability set, then there cannot be conflicts
					if (self.hasAvailability(supportStaffResponse) == false) {
						return;
					}
	
					SupportReducer._state.sections.ids.forEach(function(sectionId) {
						var sectionConflicts = conflicts.bySectionId[sectionId] = [];
	
						var section = SupportReducer._state.sections.list[sectionId];
	
						if (self.hasScheduleConflict(supportStaffResponse.availabilityBlob, section.scheduledBlob)) {
							supportConflicts.sectionIds.push(section.id);
							sectionConflicts.push(supportStaff.id);
						}
					});
	
					SupportReducer._state.sectionGroups.ids.forEach(function(sectionGroupId) {
						var sectionGroupConflicts = conflicts.bySectionGroupId[sectionGroupId] = [];
						var sectionGroup = SupportReducer._state.sectionGroups.list[sectionGroupId];
	
						if (self.hasScheduleConflict(supportStaffResponse.availabilityBlob, sectionGroup.scheduledBlob)) {
							supportConflicts.sectionGroupIds.push(sectionGroup.id);
							sectionGroupConflicts.push(supportStaff.id);
						}
					});
				});
	
				SupportReducer.reduce({
					type: ActionTypes.CALCULATE_SCHEDULE_CONFLICTS,
					payload: {
						conflicts: conflicts
					}
				});
			},
			hasAvailability: function(supportStaffResponse) {
				// Response object is invalid
				if (supportStaffResponse == false || supportStaffResponse == null) { return false; }
	
				// AvailabilityBlob is invalid
				if (supportStaffResponse.availabilityBlob == false
					|| supportStaffResponse.availabilityBlob == null
					|| supportStaffResponse.availabilityBlob.length == 0) {
						return false;
					}
	
				return true;
			},
			// Will return true if support staff is available for all scheduled activities
			hasScheduleConflict: function(supportStaffBlob, scheduleBlob) {
				for (var i = 0; i < supportStaffBlob.length; i++) {
					if (supportStaffBlob[i] == "0" && scheduleBlob[i] == "0") {
						return true;
					}
				}
				return false;
			},
			// Calculate the activity blobs for every sectionGroup
			calculateSectionGroupScheduling: function() {
				var self = this;
				var sectionGroupBlobs = {};
	
				SupportReducer._state.sectionGroups.ids.forEach(function(sectionGroupId) {
					var sectionGroup = SupportReducer._state.sectionGroups.list[sectionGroupId];
					sectionGroupBlobs[sectionGroup.id] = self.sectionGroupIdToBlob(sectionGroup.id);
				});
	
				SupportReducer.reduce({
					type: ActionTypes.CALCULATE_SECTION_GROUP_SCHEDULING,
					payload: {
						sectionGroupBlobs: sectionGroupBlobs
					}
				});
			},
			// Calculate the activity blobs for every section
			calculateSectionScheduling: function() {
				var self = this;
				var sectionBlobs = {};
	
				SupportReducer._state.sections.ids.forEach(function(sectionId) {
					var section = SupportReducer._state.sections.list[sectionId];
					sectionBlobs[section.id] = self.sectionToBlob(section);
				});
	
				SupportReducer.reduce({
					type: ActionTypes.CALCULATE_SECTION_SCHEDULING,
					payload: {
						sectionBlobs: sectionBlobs
					}
				});
			},
			// Calculate the combined activities of all activities in this sectionGroup
			sectionGroupIdToBlob: function (sectionGroupId) {
				var self = this;
				var scheduledBlob = this.getDefaultBlob();
	
				var activities = SupportReducer._state.activities.bySectionGroupIds[sectionGroupId];
	
				if (!activities || activities.length == 0) {
					return scheduledBlob;
				}
	
				activities.forEach(function(activityId) {
					var activity = SupportReducer._state.activities.list[activityId];
					var activityBlob = self.activityToBlob(activity);
					scheduledBlob = self.combineBlobs(scheduledBlob, activityBlob);
				});
	
				return scheduledBlob;
			},
			// Calculate the combined activities of all activities in this section,
			// and shared activities in the parent sectionGroup
			sectionToBlob: function(section) {
				var self = this;
				var sectionBlob = this.getDefaultBlob();
	
				var activities = SupportReducer._state.activities.bySectionIds[section.id];
	
				if (!activities || activities.length == 0) {
					return sectionBlob;
				}
	
				activities.forEach(function(activityId) {
					var activity = SupportReducer._state.activities.list[activityId];
					var activityBlob = self.activityToBlob(activity);
	
					sectionBlob = self.combineBlobs(sectionBlob, activityBlob);
				});
	
				var sectionGroupBlob = this.sectionGroupIdToBlob(section.sectionGroupId);
				this.combineBlobs(sectionBlob, sectionGroupBlob);
	
				return sectionBlob;
			},
			activityToBlob: function(activity) {
				// Set to a default of all '1's, which would indicate nothing scheduled
				var activityBlob = "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1";
	
				// Activity has no time set
				if (!(activity.startTime) || !(activity.endTime)) {
					return activityBlob;
				}
	
				// activity.startTime is expected in the format "15:00:00"
				var startHour = activity.startTime.substring(0,2);
				var startHourIndex = startHour - 7; // 7am should correspond to 0 index.
				var endHour = activity.endTime.substring(0,2);
				var endHourIndex = endHour - 7; // 7am should correspond to 0 index.
	
				for (var i = 0; i < activity.dayIndicator.length; i++) {
					if (activity.dayIndicator[i] == "1") {
						var dayOffset = 30 * i;
	
						for (var j = startHourIndex; j <= endHourIndex; j++) {
							// Multiplying by 2 to skip commas in the serialized format
							var blobIndex = (j * 2) + dayOffset;
							activityBlob = setCharAt(activityBlob, blobIndex, "0");
						}
					}
				}
	
				return activityBlob;
			},
			getDefaultBlob: function() {
				return "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1";
			},
			combineBlobs: function (blobOne, blobTwo) {
				for ( var i = 0; i < blobTwo.length; i = i + 2) {
					if (blobTwo[i] == "0") {
						blobOne = setCharAt(blobOne, i, "0");
					}
				}
	
				return blobOne;
			},
			// Generate the preference options object for support staff assignment dropdown
			calculateStaffAssignmentOptions: function() {
				var self = this;
				let staffAssignmentOptions = {};
	
				/* Example assignmentOption:
				{
					sectionId,
					sectionGroupId,
					description,
					type,
					hasSchedulingConflict
				}
				*/
				SupportReducer._state.supportStaffList.ids.forEach(function(supportStaffId) {
					var supportStaff = SupportReducer._state.supportStaffList.list[supportStaffId];
					let allocatedIds = {
						ta: {
							sectionIds: [],
							sectionGroupIds: []
						},
						reader: {
							sectionIds: [],
							sectionGroupIds: []
						}
					};
	
					var options = staffAssignmentOptions[supportStaffId] = {
						ta: {
							preferences: [],
							instructorPreferences: [],
							other: []
						},
						reader: {
							preferences: [],
							other: []
						}
					};
	
					// Generate assignmentOptions for preferences
					supportStaff.supportStaffPreferences.forEach(function(preference) {
						var assignmentOption = self.generateAssignmentOption(supportStaff.id, null, preference.sectionGroupId, preference.type, preference.priority);
	
						if (preference.type == "teachingAssistant") {
							options.ta.preferences.push(assignmentOption);
						} else {
							options.reader.preferences.push(assignmentOption);
						}
	
						allocatedIds.ta.sectionGroupIds.push(preference.sectionGroupId);
					});
	
					// Generate assignmentOptions for instructorPreferences
					SupportReducer._state.instructorPreferences.ids.forEach(function(instructorPreferenceId) {
						var preference = SupportReducer._state.instructorPreferences.list[instructorPreferenceId];
						// Ensure preference matches support staff
						if (preference.supportStaffId != supportStaff.id) {return;}
	
						var assignmentOption = self.generateAssignmentOption(supportStaff.id, null, preference.sectionGroupId, "teachingAssistant", preference.priority);
	
						options.ta.instructorPreferences.push(assignmentOption);
						allocatedIds.ta.sectionGroupIds.push(preference.sectionGroupId);
					});
	
					// Create assignmentOptions for any sectionGroups that were not already created from preferences
					SupportReducer._state.sectionGroups.ids.forEach(function(sectionGroupId) {
						var sectionGroup = SupportReducer._state.sectionGroups.list[sectionGroupId];
	
						if (allocatedIds.ta.sectionGroupIds.indexOf(sectionGroup.id) == -1) {
							var assignmentOption = self.generateAssignmentOption(supportStaff.id, null, sectionGroup.id, "teachingAssistant", null);
							options.ta.other.push(assignmentOption);
							allocatedIds.ta.sectionGroupIds.push(sectionGroup.id);
						}
						
						if (allocatedIds.reader.sectionGroupIds.indexOf(sectionGroup.id) == -1) {
							var assignmentOption = self.generateAssignmentOption(supportStaff.id, null, sectionGroup.id, "reader", null);
							options.reader.other.push(assignmentOption);
							allocatedIds.reader.sectionGroupIds.push(sectionGroup.id);
						}
	
						// Create assignmentOptions for any sections associated to that sectionGroup (assuming it is a series)
						var sections = SupportReducer._state.sections.bySectionGroupId[sectionGroupId];
						if (sections && sections.length > 0) {
							sections.forEach(function(sectionId) {
								var section = SupportReducer._state.sections.list[sectionId];
	
								if (isNumber(section.sequenceNumber) == false) {
									if (allocatedIds.ta.sectionIds.indexOf(section.id) == -1) {
										var assignmentOption = self.generateAssignmentOption(supportStaff.id, section.id, null, "teachingAssistant", null);
										options.ta.other.push(assignmentOption);
										allocatedIds.ta.sectionIds.push(section.id);
									}
									
									if (allocatedIds.reader.sectionIds.indexOf(section.id) == -1) {
										var assignmentOption = self.generateAssignmentOption(supportStaff.id, section.id, null, "reader", null);
										options.reader.other.push(assignmentOption);
										allocatedIds.reader.sectionIds.push(section.id);
									}
								}
							});
						}
					});
				});
	
				SupportReducer.reduce({
					type: ActionTypes.CALCULATE_STAFF_ASSIGNMENT_OPTIONS,
					payload: {
						staffAssignmentOptions: staffAssignmentOptions
					}
				});
			},
			generateAssignmentOption: function(supportStaffId, sectionId, sectionGroupId, type, priority) {
				if (sectionId) {
					var section = SupportReducer._state.sections.list[sectionId];
					var sectionGroup = SupportReducer._state.sectionGroups.list[section.sectionGroupId];
					var course = SupportReducer._state.courses.list[sectionGroup.courseId];
					return {
						sortKey: course.subjectCode + course.courseNumber + section.sequenceNumber,
						type: type,
						priority: priority,
						description: course.subjectCode + " " + course.courseNumber + " " + section.sequenceNumber + " " + course.title,
						sectionId: sectionId,
						hasSchedulingConflict: (section.supportStaffConflicts.indexOf(supportStaffId) > -1)
					};
				}
	
				var sectionGroup = SupportReducer._state.sectionGroups.list[sectionGroupId];
				var course = SupportReducer._state.courses.list[sectionGroup.courseId];
				return {
					sortKey: course.subjectCode + course.courseNumber + course.sequencePattern,
					type: type,
					priority: priority,
					description: course.subjectCode + " " + course.courseNumber + " " + course.sequencePattern + " " + course.title,
					sectionGroupId: sectionGroupId,
					hasSchedulingConflict: (sectionGroup.supportStaffConflicts.indexOf(supportStaffId) > -1)
				};
			},
			setReadOnlyMode: function() {
				SupportReducer.reduce({
					type: ActionTypes.SET_READ_ONLY_MODE,
					payload: {}
				});
			}
		};
	}
}

SupportActions.$inject = ['$rootScope', '$window', 'SupportService', 'SupportReducer', 'ActionTypes', 'Term', '$route'];

export default SupportActions;
