instructionalSupportApp.factory("instructionalSupportStudentFormService", this.instructionalSupportStudentFormService = function($http, $q, $window) {
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
		addStudentPreference: function(preference, supportCallId) {

			var deferred = $q.defer();
			$http.post(serverRoot + "/api/instructionalSupportStudentFormView/supportCalls/" + supportCallId + "/sectionGroups/" + preference.sectionGroupId + "/preferenceType/" + preference.type, { withCredentials: true })
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
