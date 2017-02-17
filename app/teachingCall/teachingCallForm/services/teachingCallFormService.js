teachingCallApp.factory("assignmentSerteachingCallFormServicevice", this.teachingCallFormService = function($http, $q, $window) {
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
		download: function (workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/assignmentView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
			.success(function(payload) {
				$window.location.href = payload.redirect;
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createTeachingCall: function (workgroupId, year, teachingCallConfig) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/assignmentView/" + workgroupId + "/" + year + "/teachingCalls", teachingCallConfig, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addPreference: function (teachingAssignment) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/assignmentView/preferences/" + teachingAssignment.schedule.id, teachingAssignment, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removePreference: function (teachingAssignment) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/assignmentView/preferences/" + teachingAssignment.id, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteTeachingCall: function (teachingCall) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/assignmentView/teachingCalls/" + teachingCall.id, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addInstructorAssignment: function (teachingAssignment, scheduleId) {
			var deferred = $q.defer();
			teachingAssignment.termCode = String(teachingAssignment.termCode);
			$http.post(serverRoot + "/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments/", teachingAssignment, { withCredentials: true })
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
		addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
			var deferred = $q.defer();
			var scheduleInstructorNote = {};
			scheduleInstructorNote.instructorComment = comment;
			scheduleInstructorNote.assignmentsCompleted = assignmentsCompleted;

			$http.post(serverRoot + "/api/assignmentView/scheduleInstructorNotes/" + instructorId + "/" + workgroupId + "/" + year, scheduleInstructorNote, { withCredentials: true })
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
		updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments" , sortedTeachingAssignmentIds, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateTeachingCallResponse: function (teachingCallResponse) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/assignmentView/teachingCallResponses/" + teachingCallResponse.id, teachingCallResponse, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createTeachingCallResponse: function (teachingCallResponse) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/assignmentView/teachingCallResponses/" + teachingCallResponse.scheduleId  + "/" + teachingCallResponse.instructorId, teachingCallResponse, { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateTeachingCallReceipt: function (teachingCallReceipt) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/assignmentView/teachingCallReceipts/" + teachingCallReceipt.id, teachingCallReceipt, { withCredentials: true })
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
			};

			return allTerms;
		}
	};
});
