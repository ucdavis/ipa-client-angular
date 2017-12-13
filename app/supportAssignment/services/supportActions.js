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
				supportReducer.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not get instructional support assignment initial state.", type: "ERROR" });
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
		setViewPivot: function (tabName) {
			supportReducer.reduce({
				type: SET_VIEW_PIVOT,
				payload: {
					tabName: tabName
				}
			});
		},
		setViewReader: function () {
			supportReducer.reduce({
				type: SET_VIEW_READER,
				payload: {
					viewType: "reader"
				}
			});
		},
		setViewTA: function () {
			supportReducer.reduce({
				type: SET_VIEW_TA,
				payload: {
					viewType: "ta"
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
		}
	};
});