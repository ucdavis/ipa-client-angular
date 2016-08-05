'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseService
 * @description
 * # courseService
 * Service in the courseApp.
 * courseApp specific api calls.
 */
courseApp.factory("courseService", this.courseService = function($http, $q) {
	return {
		getScheduleByWorkgroupIdAndYear: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/courseView/workgroups/" + workgroupId + "/years/" + year, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addSectionGroup: function (sectionGroup) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/courseView/sectionGroups/", sectionGroup, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateSectionGroup: function (sectionGroup) {
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
		deleteCourse: function(course) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/courseView/courses/" + course.id, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		searchCourses: function(query) {
			var deferred = $q.defer();

			$http.get(dwUrl + "/courses/search?q=" + query + "&token=" + dwToken)
			.success(function(result) {
				deferred.resolve(result);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
