instructionalSupportApp.service('studentActions', function ($rootScope, $window, studentService, studentReducers) {
	return {
		getInitialState: function (workgroupId, year, termShortCode) {
			studentService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load support staff form initial state.", type: "ERROR" });
			});
		},
		addStudentPreference: function (preference) {
			studentService.addStudentPreference(preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
				var action = {
					type: ADD_STUDENT_PREFERENCE,
					payload: payload
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add preference.", type: "ERROR" });
			});
		},
		updateStudentComments: function(supportCallResponse) {
			studentService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated comments.", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update comments.", type: "ERROR" });
			});
		},
		updateStudentQualifications: function(supportCallResponse) {
			studentService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated qualifications.", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update qualifications.", type: "ERROR" });
			});
		},
		updateAvailability: function(supportCallResponse) {
			console.log("update avail");
			studentService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated availability.", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update qualifications.", type: "ERROR" });
			});
		},
		updateSupportCallResponse: function (supportCallResponse) {
			studentService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
			});
		},
		deleteStudentPreference: function (preference) {
			studentService.deleteStudentPreference(preference.id).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
				var action = {
					type: DELETE_STUDENT_PREFERENCE,
					payload: preference
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove preference.", type: "ERROR" });
			});
		},
		submitPreferences: function (supportCallResponse, workgroupId, year) {
			studentService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var studentSummaryUrl = "/summary/" + workgroupId + "/" + year + "?mode=instructionalSupport";
				$window.location.href = studentSummaryUrl;
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
			});
		},
		updatePreferencesOrder: function (preferenceIds, scheduleId, termCode) {
			studentService.updatePreferencesOrder(preferenceIds, scheduleId, termCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_PREFERENCES_ORDER,
					payload: payload
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preference order.", type: "ERROR" });
			});
		},
		updatePreference: function (scheduleId, preference) {
			studentService.updatePreference(scheduleId, preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preference comments", type: "SUCCESS" });
				var action = {
					type: UPDATE_PREFERENCE,
					payload: payload
				};
				studentReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preference comments.", type: "ERROR" });
			});
		},
		pretendToastMessage: function () {
			$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
		},
		openPreferenceCommentsModal: function() {
			studentReducers.reduce({
				type: OPEN_PREFERENCE_COMMENT_MODAL
			});
		},
		closePreferenceCommentsModal: function() {
			studentReducers.reduce({
				type: CLOSE_PREFERENCE_COMMENT_MODAL
			});
		},
		addCrnToAvailability: function(crn, appliedCrns, supportCallResponse) {
			debugger;
		},
		removeCrnFromAvailability: function(crn, timeSlots, supportCallResponse) {
			debugger;
		},
		calculateTimesForCrn: function(crn, courses, sectionGroups, sections, activities) {
			var section = null;

			for (var i = 0; i < sections.ids.length; i++) {
				var slotSection = sections.list[sections.ids[i]];

				if (section.crn == crn) {
					section = angular.copy(slotSection);
					break;
				}
			}

			// No crn matched section
			if (section == null) {
				studentReducers.reduce({
					type: CALCULATE_TIMESLOTS_FOR_CRN,
					crn: crn
				});
				return;
			}

			// Calculate timeSlots from section - activities
			var timeSlots = activities.ids.filter(function(activityId) {
				activities.list[activityId].sectionId == section.id;
			}).map(function(activityId) {
				var activity = activities.list[activityId];
				debugger;
			});
			debugger;
			//TODO: Calculate timeSlots from sectionGroup - activities


			//TODO: combine timeslots

			// Calculate description
			var course = courses.list[sectionGroups.list[section.sectionGroupId].courseId];
			var description = course.subjectCode + " " + course.courseNumber + " " + section.sequenceNumber;

			studentReducers.reduce({
				type: CALCULATE_TIMESLOTS_FOR_CRN,
				crn: crn,
				timeslots: timeSlots,
				description: description
			});
		}
	};
});