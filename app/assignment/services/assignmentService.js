'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
assignmentApp.factory("assignmentService", this.assignmentService = function($http, $q) {
	return {
		getInitialState: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/assignmentView/" + workgroupId + "/" + year, { withCredentials: true })
			.success(function(assignmentView) {
				deferred.resolve(assignmentView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addInstructorAssignment: function (sectionGroup) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/assignmentView/teachingAssignments/", teachingAssignment, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateInstructorAssignment: function (teachingAssignment) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/assignmentView/teachingAssignments/" + teachingAssignment.id, teachingAssignment, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;

		}
/*
		getCoursesByWorkgroupIdAndYear: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/assignmentView/" + workgroupId + "/" + year + "/courses", { withCredentials: true })
			.success(function(courses) {
				deferred.resolve(courses);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		getSectionGroupsByWorkgroupIdAndYear: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/assignmentView/" + workgroupId + "/" + year + "/sectionGroups", { withCredentials: true })
			.success(function(sectionGroups) {
				deferred.resolve(sectionGroups);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
*/
	};
});
