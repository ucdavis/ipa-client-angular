teachingCallApp.service('teachingCallStatusActionCreators', function (teachingCallStatusStateService, teachingCallStatusService, $rootScope, $window, Role) {
	return {
		getInitialState: function (workgroupId, year, tab) {
			teachingCallStatusService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_ASSIGNMENT_VIEW,
					payload: payload,
					year: year,
					tab: tab
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		getInitialTeachingCallState: function (workgroupId, year) {
			teachingCallStatusService.getInitialTeachingCallState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_TEACHING_CALL_VIEW,
					payload: payload,
					year: year
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createTeachingCall: function (workgroupId, year, teachingCallConfig) {
			teachingCallStatusService.createTeachingCall(workgroupId, year, teachingCallConfig).then(function (teachingCall) {
				$rootScope.$emit('toast', { message: "Started Teaching Call", type: "SUCCESS" });
				var action = {
					type: CREATE_TEACHING_CALL,
					payload: {
						teachingCall: teachingCall
					}
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteTeachingCall: function (teachingCall) {
			teachingCallStatusService.deleteTeachingCall(teachingCall).then(function (teachingCall) {
				$rootScope.$emit('toast', { message: "Removed Teaching Call", type: "SUCCESS" });
				var action = {
					type: DELETE_TEACHING_CALL,
					payload: {
						teachingCall: teachingCall
					}
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});