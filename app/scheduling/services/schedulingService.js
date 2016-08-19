'use strict';

/**
 * @ngdoc service
 * @name schedulingApp.schedulingService
 * @description
 * # schedulingService
 * Service in the schedulingApp.
 * schedulingApp specific api calls.
 */
schedulingApp.factory("schedulingService", this.schedulingService = function($http, $q) {
	return {
		getScheduleByWorkgroupIdAndYearAndTermCode: function (workgroupId, year, termCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/schedulingView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		getSectionSectionGroupDetails: function (sectionGroupId) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/schedulingView/sectionGroups/" + sectionGroupId, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateActivity: function (activity) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/schedulingView/activities/" + activity.id, activity, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeActivity: function (activityId) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/schedulingView/activities/" + activityId, { withCredentials: true })
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
