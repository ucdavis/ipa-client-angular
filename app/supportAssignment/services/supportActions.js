supportAssignmentApp.service('supportActions', function ($rootScope, $window, supportService, supportReducer) {
	return {
		getInitialState: function (workgroupId, year, shortTermCode, tab) {
			var self = this;

			supportService.getInitialState(workgroupId, year, shortTermCode).then(function (payload) {
				supportReducer.reduce({
					type: INIT_STATE,
					payload: payload,
					year: year,
					tab: tab,
					shortTermCode: shortTermCode
				});

				self.performInitCalculations();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not get instructional support assignment initial state.", type: "ERROR" });
			});
		},
		toggleStudentSupportCallReview: function () {
			supportService.toggleSupportStaffSupportCallReview(supportReducer._state.schedule.id, supportReducer._state.ui.shortTermCode).then(function (schedule) {
				$rootScope.$emit('toast', { message: "Updated student support call review", type: "SUCCESS" });
				supportReducer.reduce({
					type: UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW,
					payload: {
						schedule: schedule,
						shortTermCode: supportReducer._state.ui.shortTermCode
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not toggle support staff call review.", type: "ERROR" });
			});
		},
		toggleInstructorSupportCallReview: function (scheduleId, termShortCode) {
			supportService.toggleInstructorSupportCallReview(supportReducer._state.schedule.id, supportReducer._state.ui.shortTermCode).then(function (schedule) {
				$rootScope.$emit('toast', { message: "Updated instructor support call review", type: "SUCCESS" });
				supportReducer.reduce({
					type: UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW,
					payload: {
						schedule: schedule,
						shortTermCode: supportReducer._state.ui.shortTermCode
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor support call review.", type: "ERROR" });
			});
		},
		assignStaffToSectionGroup: function (sectionGroup, supportStaffId, type) {
			supportService.assignStaffToSectionGroup(sectionGroup, supportStaffId, type).then(function (supportAssignment) {
				$rootScope.$emit('toast', { message: "Assigned staff", type: "SUCCESS" });
				supportReducer.reduce({
					type: ASSIGN_STAFF_TO_SECTION_GROUP,
					payload: {
						supportAssignment: supportAssignment
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not assign staff.", type: "ERROR" });
			});
		},
		assignStaffToSection: function (section, supportStaff, type) {
			supportService.assignStaffToSection(section, supportStaff, type).then(function (supportAssignment) {
				$rootScope.$emit('toast', { message: "Assigned staff", type: "SUCCESS" });
				supportReducer.reduce({
					type: ASSIGN_STAFF_TO_SECTION,
					payload: {
						supportAssignment: supportAssignment
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not assign staff.", type: "ERROR" });
			});
		},
		deleteAssignment: function (supportAssignment) {
			supportService.deleteAssignment(supportAssignment).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Assignment", type: "SUCCESS" });
				supportReducer.reduce({
					type: DELETE_ASSIGNMENT,
					payload: supportAssignment,
					sectionId: supportAssignment.sectionId,
					sectionGroupId: supportAssignment.sectionGroupId
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove assignment.", type: "ERROR" });
			});
		},
		updateReaderAppointments: function (sectionGroup) {
			supportService.updateSectionGroup(sectionGroup).then(function(payload) {
				$rootScope.$emit('toast', { message: "Updated Readers", type: "SUCCESS" });
				supportReducer.reduce({
					type: UPDATE_SECTIONGROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update readers.", type: "ERROR" });
			});
		},
		updateTeachingAssistantAppointments: function (sectionGroup) {
			supportService.updateSectionGroup(sectionGroup).then(function(payload) {
				$rootScope.$emit('toast', { message: "Updated Teaching Assistants", type: "SUCCESS" });
				supportReducer.reduce({
					type: UPDATE_SECTIONGROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update teaching assistants.", type: "ERROR" });
			});
		},
		updateSupportAppointment: function (supportAppointment) {
			supportAppointment.percentage = parseFloat(supportAppointment.percentage);

			supportService.updateSupportAppointment(supportAppointment, supportReducer._state.schedule.id).then(function(payload) {
				$rootScope.$emit('toast', { message: "Updated Appointment", type: "SUCCESS" });
				supportReducer.reduce({
					type: UPDATE_SUPPORT_APPOINTMENT,
					payload: {
						supportAppointment: supportAppointment
					}
				});
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update teaching assistants.", type: "ERROR" });
			});
		},
		// Example 'Comments', 'Teaching Assignments'
		setViewPivot: function (tabName) {
			supportReducer.reduce({
				type: SET_VIEW_PIVOT,
				payload: {
					tabName: tabName
				}
			});
		},
		// Example 'Reader', 'Teaching Assistants'
		setViewType: function (viewType) {
			supportReducer.reduce({
				type: SET_VIEW_TYPE,
				payload: {
					viewType: viewType
				}
			});
		},
		setSupportStaffTab: function(tabName, supportStaffId) {
			supportReducer.reduce({
				type: SET_SUPPORT_STAFF_TAB,
				payload: {
					tabName: tabName,
					supportStaffId: supportStaffId
				}
			});
		},
		updateTableFilter: function (query) {
			var action = {
				type: UPDATE_TABLE_FILTER,
				payload: {
					query: query
				}
			};
			supportReducer.reduce(action);
		},
		openAvailabilityModal: function(supportStaff) {
			supportReducer.reduce({
				type: OPEN_AVAILABILITY_MODAL,
				payload: {
					supportStaff: supportStaff
				}
			});
		},
		closeAvailabilityModal: function(supportStaff) {
			supportReducer.reduce({
				type: CLOSE_AVAILABILITY_MODAL,
				payload: {}
			});
		},
		performInitCalculations: function() {
			this.calculateSectionGroupScheduling();
			this.calculateSectionScheduling();
		},
		// Calculate the activity blobs for every sectionGroup
		calculateSectionGroupScheduling: function() {
			var self = this;
			var sectionGroupBlobs = {};

			supportReducer._state.sectionGroups.ids.forEach(function(sectionGroupId) {
				var sectionGroup = supportReducer._state.sectionGroups.list[sectionGroupId];
				sectionGroupBlobs[sectionGroup.id] = self.sectionGroupIdToBlob(sectionGroup.id);
			});

			supportReducer.reduce({
				type: CALCULATE_SECTION_GROUP_SCHEDULING,
				payload: {
					sectionGroupBlobs: sectionGroupBlobs
				}
			});
		},
		// Calculate the activity blobs for every section
		calculateSectionScheduling: function() {
			var self = this;
			var sectionBlobs = {};

			supportReducer._state.sections.ids.forEach(function(sectionId) {
				var section = supportReducer._state.sections.list[sectionId];
				sectionBlobs[section.id] = self.sectionToBlob(section);
			});

			supportReducer.reduce({
				type: CALCULATE_SECTION_SCHEDULING,
				payload: {
					sectionBlobs: sectionBlobs
				}
			});
		},
		// Calculate the combined activities of all activities in this sectionGroup
		sectionGroupIdToBlob: function (sectionGroupId) {
			var self = this;
			var scheduledBlob = this.getDefaultBlob();

			var activities = supportReducer._state.activities.bySectionGroupIds[sectionGroupId];

			if (!activities || activities.length == 0) {
				return scheduledBlob;
			}

			activities.forEach(function(activityId) {
				var activity = supportReducer._state.activities.list[activityId];
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

			var activities = supportReducer._state.activities.bySectionIds[section.id];

			if (!activities || activities.length == 0) {
				return sectionBlob;
			}

			activities.forEach(function(activityId) {
				var activity = supportReducer._state.activities.list[activityId];
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
		setCharAt: function(str, index, chr) {
			if (index > str.length-1) { return str;}

			return str.substr(0,index) + chr + str.substr(index + 1);
		},
		combineBlobs: function (blobOne, blobTwo) {
			for( var i = 0; i < blobTwo.length; i = i + 2) {
				if (blobTwo[i] == "0") {
					blobOne = setCharAt(blobOne, i, "0");
				}
			}

			return blobOne;
		}
	};
});