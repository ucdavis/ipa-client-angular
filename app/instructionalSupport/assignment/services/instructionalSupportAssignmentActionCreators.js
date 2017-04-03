instructionalSupportApp.service('instructionalSupportAssignmentActionCreators', function ($rootScope, $window, instructionalSupportAssignmentService, instructionalSupportAssignmentStateService) {
	return {
		getInitialState: function (workgroupId, year, termShortCode, tab) {
			instructionalSupportAssignmentService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					tab: tab
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addAssignmentSlots: function (appointmentType, appointmentPercentage, numberOfAppointments, sectionGroupId) {
			instructionalSupportAssignmentService.addAssignmentSlots(appointmentType, appointmentPercentage, numberOfAppointments, sectionGroupId).then(function (payload) {
				$rootScope.$emit('toast', { message: "Added Assignment", type: "SUCCESS" });
				var action = {
					type: ADD_ASSIGNMENT_SLOTS,
					payload: payload
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		toggleSupportStaffSupportCallReview: function (scheduleId, termShortCode) {
			instructionalSupportAssignmentService.toggleSupportStaffSupportCallReview(scheduleId, termShortCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated support staff support call review", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW,
					payload: payload
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		toggleInstructorSupportCallReview: function (scheduleId, termShortCode) {
			instructionalSupportAssignmentService.toggleInstructorSupportCallReview(scheduleId, termShortCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated instructor support call review", type: "SUCCESS" });
				var action = {
					type: UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW,
					payload: payload
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteAssignment: function (instructionalSupportAssignment) {
			instructionalSupportAssignmentService.deleteAssignment(instructionalSupportAssignment).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Assignment", type: "SUCCESS" });
				var action = {
					type: DELETE_ASSIGNMENT,
					payload: instructionalSupportAssignment
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		assignStaffToSlot: function (supportStaffId, assignmentId) {
			instructionalSupportAssignmentService.assignStaffToSlot(supportStaffId, assignmentId).then(function (payload) {
				$rootScope.$emit('toast', { message: "Assigned Instructional Support Staff", type: "SUCCESS" });
				var action = {
					type: ASSIGN_STAFF_TO_SLOT,
					payload: payload
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeStaffFromSlot: function (assignmentId, supportStaffId) {
			instructionalSupportAssignmentService.removeStaffFromSlot(assignmentId).then(function (payload) {
				$rootScope.$emit('toast', { message: "Unassigned Instructional Support Staff", type: "SUCCESS" });
				var action = {
					type: REMOVE_STAFF_FROM_SLOT,
					payload: payload,
					supportStaffId: supportStaffId
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		togglePivotView: function (viewName) {
			var action = {
				type: TOGGLE_ASSIGNMENT_PIVOT_VIEW,
				payload: {viewName: viewName}
			};
			instructionalSupportAssignmentStateService.reduce(action);
		},
		updateTableFilter: function (query) {
			var action = {
				type: UPDATE_TABLE_FILTER,
				payload: {
					query: query
				}
			};
			instructionalSupportAssignmentStateService.reduce(action);
		}
	};
});