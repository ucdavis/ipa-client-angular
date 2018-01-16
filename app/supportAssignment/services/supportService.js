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
		assignStaffToSectionGroup: function(sectionGroupId, supportStaffId, type) {
			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/sectionGroups/" + sectionGroupId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		assignStaffToSection: function(sectionId, supportStaffId, type) {
			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/sections/" + sectionId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId, { withCredentials: true })
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
		updateSupportAppointment: function (supportAppointment) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportView/schedules/" + supportAppointment.scheduleId, supportAppointment, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		updateSectionGroup: function (sectionGroup) {
			var deferred = $q.defer();
			if (!sectionGroup) { return; }

			$http.put(serverRoot + "/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		}
	};
});
