instructionalSupportApp.factory("instructionalSupportAssignmentService", this.instructionalSupportAssignmentService = function($http, $q, $window) {
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
		addAssignmentSlots: function(appointmentType, appointmentPercentage, numberOfAssignments, sectionGroupId) {

			var instructionalSupportAssignment = {appointmentPercentage : appointmentPercentage, appointmentType: appointmentType};

			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/sectionGroups/" + sectionGroupId + "/instructionalSupportAssignments/" + numberOfAssignments, instructionalSupportAssignment, { withCredentials: true })
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
		assignStaffToSlot: function(supportStaffId, assignmentId) {

			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportView/instructionalSupportAssignments/" + assignmentId + "/supportStaff/" + supportStaffId, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeStaffFromSlot: function(assignmentId) {

			var deferred = $q.defer();
			$http.delete(serverRoot + "/api/instructionalSupportView/instructionalSupportAssignments/" + assignmentId + "/unassign", { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		openStudentSupportCallReview: function(scheduleId) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportView/schedules/" + scheduleId + "/openStudentSupportCallReview", { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		openInstructorSupportCallReview: function(scheduleId) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportView/schedules/" + scheduleId + "/openInstructorSupportCallReview", { withCredentials: true })
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
