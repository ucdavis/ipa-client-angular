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
		deleteAssignment: function(supportAssignment) {
			var deferred = $q.defer();
			$http.delete(serverRoot + "/api/instructionalSupportView/instructionalSupportAssignments/" + supportAssignment.id, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		assignStaffToSectionGroup: function(sectionGroup, supportStaffId, type) {
			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/sectionGroups/" + sectionGroup.id + "/assignmentType/" + type + "/supportStaff/" + supportStaffId, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		assignStaffToSection: function(supportStaff, section, type) {
			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/sections/" + section.id + "/assignmentType/" + type + "/supportStaff/" + supportStaff.id, { withCredentials: true })
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
		}
	};
});
