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
		}
	};
});