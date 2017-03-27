instructionalSupportApp.factory("instructionalSupportInstructorFormService", this.instructionalSupportInstructorFormService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/instructionalSupportInstructorFormView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addInstructorPreference: function(sectionGroupId, supportStaffId) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/instructionalSupportInstructorFormView/sectionGroups/" + sectionGroupId + "/supportStaff/" + supportStaffId, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateSupportCallResponse: function(supportCallResponse) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/instructionalSupportInstructorFormView/instructorSupportCallResponses/" + supportCallResponse.id, supportCallResponse, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updatePreferencesOrder: function(preferenceIds, scheduleId, termCode) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/instructionalSupportInstructorFormView/schedules/" + scheduleId + "/terms/" + termCode, preferenceIds, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteInstructorPreference: function(preferenceId) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/instructionalSupportInstructorFormView/instructorInstructionalSupportPreferences/" + preferenceId, { withCredentials: true })
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
