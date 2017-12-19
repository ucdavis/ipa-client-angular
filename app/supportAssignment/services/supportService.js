supportAssignmentApp.factory("supportService", this.supportService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
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
		},
		updateSectionGroup: function(sectionGroup) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		toggleSupportStaffSupportCallReview: function(scheduleId, termShortCode) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleSupportStaffSupportCallReview", { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		toggleInstructorSupportCallReview: function(scheduleId, termShortCode) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleInstructorSupportCallReview", { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},

	};
});
