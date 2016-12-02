instructionalSupportApp.factory("instructionalSupportCallStatusService", this.instructionalSupportAssignmentService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year + "/supportCallStatus", { withCredentials: true })
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
		deleteAssignment: function(instructionalSupportAssignment) {

			var deferred = $q.defer();
			$http.delete(serverRoot + "/api/instructionalSupportView/instructionalSupportAssignments/" + instructionalSupportAssignment.id, { withCredentials: true })
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
