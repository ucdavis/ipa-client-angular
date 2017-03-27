instructionalSupportApp.factory("instructionalSupportCallStatusService", this.instructionalSupportAssignmentService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year +"/" + termShortCode + "/supportCallStatus", { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addStudentSupportCall: function(scheduleId, studentSupportCall) {
			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/schedules/" + scheduleId + "/studentInstructionalSupportCalls", studentSupportCall, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteStudentSupportCall: function(studentSupportCall) {
			var deferred = $q.defer();
			$http.delete(serverRoot + "/api/instructionalSupportView/studentInstructionalSupportCalls/" + studentSupportCall.id, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addInstructorsSupportCall: function(scheduleId, instructorSupportCall) {
			var deferred = $q.defer();
			$http.post(serverRoot + "/api/supportCallView/" + scheduleId + "/addInstructors", instructorSupportCall, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeInstructorFromSupportCall: function(instructor, scheduleId, termCode) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/supportCallView/schedules/" + scheduleId + "/instructorSupportCallResponses/" + instructor.supportCallResponseId, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeStudentFromSupportCall: function(student, scheduleId, termCode) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/supportCallView/schedules/" + scheduleId + "/studentSupportCallResponses/" + student.supportCallResponseId, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
