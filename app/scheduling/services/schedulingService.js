/**
 * @ngdoc service
 * @name schedulingApp.schedulingService
 * @description
 * # schedulingService
 * Service in the schedulingApp.
 * schedulingApp specific api calls.
 */
schedulingApp.factory("schedulingService", this.schedulingService = function ($http, $q) {
	return {
		getScheduleByWorkgroupIdAndYearAndTermCode: function (workgroupId, year, termCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/schedulingView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		updateActivity: function (activity) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/schedulingView/activities/" + activity.id, activity, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		removeActivity: function (activityId) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/schedulingView/activities/" + activityId, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		createSharedActivity: function (activityCode, sectionGroupId) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/schedulingView/sectionGroups/" + sectionGroupId + "/activities/" + activityCode, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		createActivity: function (activityCode, sectionId) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/schedulingView/sections/" + sectionId + "/activities/" + activityCode, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		getActivities: function (section) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/schedulingView/sections/" + section.id + "/activities", { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		getCourseActivityTypes: function (course) {
			var deferred = $q.defer();

			$http.get(dwUrl + "/activities?subjectCode=" + course.subjectCode + "&courseNumber=" + course.courseNumber + "&token=" + dwToken)
				.success(function (result) {
					deferred.resolve(result);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		createSection: function (section) {
			var deferred = $q.defer();
			if (!section) { return; }

			$http.post(serverRoot + "/api/courseView/sectionGroups/" + section.sectionGroupId + "/sections", section, { withCredentials: true })
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
