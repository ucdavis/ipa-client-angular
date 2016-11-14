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
				var action = {
					type: ADD_ASSIGNMENT_SLOTS,
					payload: payload
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
		}
	};
});