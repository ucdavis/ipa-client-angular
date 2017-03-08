teachingCallApp.factory("teachingCallStatusService", this.teachingCallStatusService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/teachingCallView/" + workgroupId + "/" + year + "/teachingCallStatus", { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addInstructorsToTeachingCall: function (workgroupId, year, teachingCallConfig) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/teachingCallView/" + workgroupId + "/" + year + "/addInstructors", teachingCallConfig, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		contactInstructors: function (workgroupId, year, receiptsPayload) {
			payload = {};
			payload.receipts = receiptsPayload;
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/teachingCallView/" + workgroupId + "/" + year + "/contactInstructors", payload, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeInstructorFromTeachingCall: function (teachingCallReceiptId) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/teachingCallView/teachingCallReceipts/" + teachingCallReceiptId, { withCredentials: true })
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
