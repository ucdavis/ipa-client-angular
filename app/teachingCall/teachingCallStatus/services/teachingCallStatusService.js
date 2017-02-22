teachingCallApp.factory("teachingCallStatusService", this.teachingCallStatusService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/assignmentView/" + workgroupId + "/" + year, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		download: function (workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/assignmentView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
			.success(function(payload) {
				$window.location.href = payload.redirect;
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createTeachingCall: function (workgroupId, year, teachingCallConfig) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/assignmentView/" + workgroupId + "/" + year + "/teachingCalls", teachingCallConfig, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteTeachingCall: function (teachingCall) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/assignmentView/teachingCalls/" + teachingCall.id, { withCredentials: true })
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
