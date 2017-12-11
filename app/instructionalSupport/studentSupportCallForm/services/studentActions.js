instructionalSupportApp.service('studentActions', function ($rootScope, $window, studentService, studentReducers) {
	return {
		getInitialState: function (workgroupId, year, termShortCode) {
			var self = this;
			studentService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					workgroupId: workgroupId,
					termShortCode: termShortCode
				};
				studentReducers.reduce(action);
				self.calculateFormValid();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load support staff form initial state.", type: "ERROR" });
			});
		},
		addStudentPreference: function (preference) {
			var self = this;
			studentService.addStudentPreference(preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
				var action = {
					type: ADD_STUDENT_PREFERENCE,
					payload: payload,
					preferences: studentReducers._state.preferences,
					supportCallResponse: studentReducers._state.supportCallResponse
				};
				studentReducers.reduce(action);
				self.calculateFormValid();
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
			var self = this;
			studentService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				studentReducers.reduce(action);
				self.calculateFormValid();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
			});
		},
		deleteStudentPreference: function (preference) {
			var self = this;
			studentService.deleteStudentPreference(preference.id).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
				var action = {
					type: DELETE_STUDENT_PREFERENCE,
					payload: preference,
					preferences: studentReducers._state.preferences,
					supportCallResponse: studentReducers._state.supportCallResponse
				};
				studentReducers.reduce(action);
				self.calculateFormValid();
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
			var self = this;
			studentService.updatePreference(scheduleId, preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preference comments", type: "SUCCESS" });

				var preferenceCommentsComplete = studentReducers._state.preferences.ids
				.map(function(preference) {
					preference.comment || "";
				}).
				every(function(comment) {
					comment.length > 0;
				});

				var action = {
					type: UPDATE_PREFERENCE,
					payload: payload,
					preferenceCommentsComplete: preferenceCommentsComplete
				};
				studentReducers.reduce(action);
				self.calculateFormValid();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preference comments.", type: "ERROR" });
			});
		},
		pretendToastMessage: function () {
			$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
			var studentSummaryUrl = "/summary/" + studentReducers._state.misc.workgroupId + "/" + studentReducers._state.misc.year + "?mode=instructionalSupport";
			$window.location.href = studentSummaryUrl;
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
			// TODO
		},
		removeCrnFromAvailability: function(crn, timeSlots, supportCallResponse) {
			// TODO
		},
		calculateFormValid : function() {
			var review = studentReducers._state.ui.review;
			var validationErrorMessage = "";

			var isFormValid = !(
				review.requirePreferenceAmount.required && review.requirePreferenceAmount.complete == false
				|| review.requireEligible.required && review.requireEligible.complete == false
				|| review.requirePreferenceComments.required && review.requirePreferenceComments.complete == false);
				if (review.requirePreferenceAmount.required && review.requirePreferenceAmount.complete == false) {
					validationErrorMessage += "You must provide at least " + studentReducers._state.supportCallResponse.minimumNumberOfPreferences + " preferences";
				}

			if (review.requireEligible.required && review.requireEligible.complete == false) {
				if (validationErrorMessage.length > 0) {
					validationErrorMessage += ", ";
				}

				validationErrorMessage += "you must confirm your eligibility";
			}

			if (review.requirePreferenceComments.required && review.requirePreferenceComments.complete == false) {
				if (validationErrorMessage.length > 0) {
					validationErrorMessage += ", and ";
				}

				validationErrorMessage += "you must provide comments for your preferences";
			}

			studentReducers.reduce({
				type: CALCULATE_FORM_VALID,
				payload: {
					isFormValid: isFormValid,
					validationErrorMessage: validationErrorMessage
				}
			});
		},
		calculateTimesForCrn: function(crn, courses, sectionGroups, sections, activities) {
			var section = null;

			for (var i = 0; i < sections.ids.length; i++) {
				var slotSection = sections.list[sections.ids[i]];

				if (slotSection.crn == crn) {
					section = angular.copy(slotSection);
					break;
				}
			}

			// No crn matched section
			if (section == null) {
				studentReducers.reduce({
					type: CALCULATE_TIMESLOTS_FOR_CRN,
					crn: crn,
					crnSearchFeedback: "No course found",
					scheduledTimes: []
				});
				return;
			}

			// Calculate timeSlots from section - activities
			var timeSlots = activities.ids.filter(function(activityId) {
				activities.list[activityId].sectionId == section.id;
			}).map(function(activityId) {
				var activity = activities.list[activityId];
				//TODO: convert times/days to availability blob
			});

			//TODO: Calculate timeSlots from sectionGroup - activities


			//TODO: combine timeslots

			//TODO: if timeSlots is empty, display 'course suchandsuch has no times available'
			// Calculate description
			var course = courses.list[sectionGroups.list[section.sectionGroupId].courseId];
			var crnSearchFeedback = course.subjectCode + " " + course.courseNumber + " " + section.sequenceNumber;

			studentReducers.reduce({
				type: CALCULATE_TIMESLOTS_FOR_CRN,
				crn: crn,
				crnSearchFeedback: crnSearchFeedback,
				scheduledTimes: scheduledTimes
			});
		}
	};
});