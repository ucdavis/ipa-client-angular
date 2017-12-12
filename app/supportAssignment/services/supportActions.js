supportAssignmentApp.service('supportActions', function ($rootScope, $window, supportService, supportReducer) {
	return {
		getInitialState: function (workgroupId, year, termShortCode, tab) {
			supportService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					tab: tab
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not get instructional support assignment initial state.", type: "ERROR" });
			});
		},
		addAssignmentSlots: function (appointmentType, appointmentPercentage, numberOfAppointments, sectionGroupId) {
			supportService.addAssignmentSlots(appointmentType, appointmentPercentage, numberOfAppointments, sectionGroupId).then(function (payload) {
				$rootScope.$emit('toast', { message: "Added Assignment", type: "SUCCESS" });
				var action = {
					type: ADD_ASSIGNMENT_SLOTS,
					payload: payload
				};
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add assignment slot.", type: "ERROR" });
			});
		},
		toggleSupportStaffSupportCallReview: function (scheduleId, termShortCode) {
			supportService.toggleSupportStaffSupportCallReview(scheduleId, termShortCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated support staff support call review", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW,
					payload: payload
				};
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not toggle support staff call review.", type: "ERROR" });
			});
		},
		toggleInstructorSupportCallReview: function (scheduleId, termShortCode) {
			supportService.toggleInstructorSupportCallReview(scheduleId, termShortCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated instructor support call review", type: "SUCCESS" });
				var action = {
					type: UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW,
					payload: payload
				};
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor support call review.", type: "ERROR" });
			});
		},
		deleteAssignment: function (instructionalSupportAssignment) {
			supportService.deleteAssignment(instructionalSupportAssignment).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Assignment", type: "SUCCESS" });
				var action = {
					type: DELETE_ASSIGNMENT,
					payload: instructionalSupportAssignment
				};
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove assignment.", type: "ERROR" });
			});
		},
		assignStaffToSlot: function (supportStaffId, assignmentId) {
			supportService.assignStaffToSlot(supportStaffId, assignmentId).then(function (payload) {
				$rootScope.$emit('toast', { message: "Assigned Support Staff", type: "SUCCESS" });
				var action = {
					type: ASSIGN_STAFF_TO_SLOT,
					payload: payload
				};
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not assign support staff.", type: "ERROR" });
			});
		},

		assignStaffToSectionGroupSlot: function (supportStaffId, sectionGroupId, type) {
			supportService.assignStaffToSectionGroupSlot(supportStaffId, sectionGroupId, type).then(function (payload) {
				$rootScope.$emit('toast', { message: "Assigned Support Staff", type: "SUCCESS" });
				var action = {
					type: ASSIGN_STAFF_TO_SECTION_GROUP_SLOT,
					payload: payload
				};
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not assign support staff.", type: "ERROR" });
			});
		},

		removeStaffFromSlot: function (assignmentId, supportStaffId) {
			supportService.removeStaffFromSlot(assignmentId).then(function (payload) {
				$rootScope.$emit('toast', { message: "Unassigned Instructional Support Staff", type: "SUCCESS" });
				var action = {
					type: REMOVE_STAFF_FROM_SLOT,
					payload: payload,
					supportStaffId: supportStaffId
				};
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not unassign support staff.", type: "ERROR" });
			});
		},
		togglePivotView: function (viewName) {
			var action = {
				type: TOGGLE_ASSIGNMENT_PIVOT_VIEW,
				payload: {viewName: viewName}
			};
			supportReducer.reduce(action);
		},
		updateTableFilter: function (query) {
			var action = {
				type: UPDATE_TABLE_FILTER,
				payload: {
					query: query
				}
			};
			supportReducer.reduce(action);
		}
	};
});