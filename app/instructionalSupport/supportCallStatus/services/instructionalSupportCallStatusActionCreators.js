instructionalSupportApp.service('instructionalSupportCallStatusActionCreators', function ($rootScope, $window, instructionalSupportCallStatusService, instructionalSupportCallStatusStateService) {
	return {
		getInitialState: function (workgroupId, year) {
			instructionalSupportCallStatusService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addStudentSupportCall: function (scheduleId, studentSupportCall) {
			instructionalSupportCallStatusService.addStudentSupportCall(scheduleId, studentSupportCall).then(function (payload) {
				var action = {
					type: ADD_STUDENT_SUPPORT_CALL,
					payload: payload
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteStudentSupportCall: function (studentSupportCall) {
			instructionalSupportCallStatusService.deleteStudentSupportCall(studentSupportCall).then(function (payload) {
				var action = {
					type: DELETE_STUDENT_SUPPORT_CALL,
					payload: payload
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});