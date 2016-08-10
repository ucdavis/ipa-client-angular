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
		addInstructorAssignment: function (teachingAssignment) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/assignmentView/teachingAssignments/", teachingAssignment, { withCredentials: true })
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
		},
		addScheduleInstructorNote: function (instructorId, year, workgroupId, comment) {
			var deferred = $q.defer();
			var scheduleInstructorNote = {};
			scheduleInstructorNote.instructorId = instructorId;
			scheduleInstructorNote.comment = comment;
			scheduleInstructoNote.assignmentsCompleted = false;

			$http.post(serverRoot + "/api/assignmentView/scheduleInstructorNotes/workgroupId/year", scheduleInstructorNote, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateScheduleInstructorNote: function (scheduleInstructorNote) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/assignmentView/scheduleInstructorNotes/" + scheduleInstructorNote.id, scheduleInstructorNote, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		allTerms: function () {
			var allTerms = {
				'05': 'Summer Session 1',
				'06': 'Summer Special Session',
				'07': 'Summer Session 2',
				'08': 'Summer Quarter',
				'09': 'Fall Semester',
				'10': 'Fall Quarter',
				'01': 'Winter Quarter',
				'02': 'Spring Semester',
				'03': 'Spring Quarter'
			}

			return allTerms;
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
