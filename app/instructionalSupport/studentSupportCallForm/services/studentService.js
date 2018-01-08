instructionalSupportApp.factory("studentService", this.studentService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year, termShortCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/instructionalSupportStudentFormView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		getDwActivitiesByCrn: function (crn, termCode) {
			var deferred = $q.defer();
			$http.get(dwUrl + "/sections/search/crn?termCode=" + termCode + "&crn=" + crn + "&token=" + dwToken)
				.success(function (result) {
					deferred.resolve(result);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		addStudentPreference: function(sectionGroupId, type) {
			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportStudentFormView/sectionGroups/" + sectionGroupId + "/preferenceType/" + type, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateSupportCallResponse: function(supportCallResponse) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportStudentFormView/studentSupportCallResponses/" + supportCallResponse.id, supportCallResponse, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updatePreferencesOrder: function(preferenceIds, scheduleId, termCode) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportStudentFormView/schedules/" + scheduleId + "/terms/" + termCode, preferenceIds, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updatePreference: function(scheduleId, preference) {
			var deferred = $q.defer();
			$http.put(serverRoot + "/api/instructionalSupportStudentFormView/schedules/" + scheduleId + "/preferences/" + preference.id, preference, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteStudentPreference: function(preferenceId) {
			var deferred = $q.defer();
			$http.delete(serverRoot + "/api/instructionalSupportStudentFormView/studentInstructionalSupportPreferences/" + preferenceId, { withCredentials: true })
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
