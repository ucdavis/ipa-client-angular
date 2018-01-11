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
		addStudentPreference: function (sectionGroupId, type) {
			var self = this;
			studentService.addStudentPreference(sectionGroupId, type).then(function (payload) {
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
		applyCrnToAvailability: function() {
			var self = this;

			var crnBlob = studentReducers._state.ui.crnSearch.blob;
			var supportCallResponse = studentReducers._state.supportCallResponse;
			supportCallResponse.availabilityBlob = supportCallResponse.availabilityBlob ? self.combineBlobs(supportCallResponse.availabilityBlob, crnBlob) : crnBlob;

			self.updateAvailability(supportCallResponse);
			self.clearCrnSearch();
		},
		clearCrnSearch: function() {
			studentReducers.reduce({
				type: CLEAR_CRN_SEARCH,
				payload: {}
			});
		},
		clearAvailability: function() {
			var self = this;
			var supportCallResponse = studentReducers._state.supportCallResponse;
			supportCallResponse.availabilityBlob = null;
			self.updateAvailability(supportCallResponse);
		},
		updateAvailability: function(supportCallResponse) {
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
				$window.location.href = "/summary/" + workgroupId + "/" + year + "?mode=instructionalSupport";
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
		updatePreferenceComment: function (scheduleId, preference) {
			this.updatePreference(scheduleId, preference);
			this.closePreferenceCommentsModal();
		},
		updatePreference: function (scheduleId, preference) {
			var self = this;
			studentService.updatePreference(scheduleId, preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preference comments", type: "SUCCESS" });

				studentReducers._state.preferences.list[payload.id] = payload;
				var preferenceCommentsComplete = true;
				studentReducers._state.preferences.ids.forEach(function(preferenceId) {
					var preference = studentReducers._state.preferences.list[preferenceId];
					if (!(preference.comment) || preference.comment.length == 0) { preferenceCommentsComplete = false; }
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
			$window.location.href = "/summary/" + studentReducers._state.misc.workgroupId + "/" + studentReducers._state.misc.year + "?mode=instructionalSupport";
		},
		openPreferenceCommentsModal: function(preference) {
			studentReducers.reduce({
				type: OPEN_PREFERENCE_COMMENT_MODAL,
				payload: {
					preference: preference
				}
			});
		},
		closePreferenceCommentsModal: function() {
			studentReducers.reduce({
				type: CLOSE_PREFERENCE_COMMENT_MODAL
			});
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

				validationErrorMessage += "You must confirm your eligibility";
			}

			if (review.requirePreferenceComments.required && review.requirePreferenceComments.complete == false) {
				if (validationErrorMessage.length > 0) {
					validationErrorMessage += ", and ";
				}

				validationErrorMessage += "You must provide comments for your preferences";
			}

			studentReducers.reduce({
				type: CALCULATE_FORM_VALID,
				payload: {
					isFormValid: isFormValid,
					validationErrorMessage: validationErrorMessage
				}
			});
		},
		fetchTimesByCrn: function(crn) {
			var self = this;

			studentReducers.reduce({
				type: BEGIN_FETCH_ACTIVITIES_BY_CRN,
				payload: {
					crn: crn
				}
			});

			studentService.getDwActivitiesByCrn(crn, studentReducers._state.misc.termCode).then(function (payload) {
				studentReducers.reduce({
					type: COMPLETE_FETCH_ACTIVITIES_BY_CRN
				});

				self.generateTimesForCrn(payload, crn);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not fetch activities by crn.", type: "ERROR" });
			});
		},
		generateTimesForCrn: function(activities, crn) {
			var self = this;

			if (!activities || activities.length == 0) {
				studentReducers.reduce({
					type: CALCULATE_TIMESLOTS_FOR_CRN,
					payload: {
						crn: crn,
						crnSearchFeedback: "No course found",
						crnSearchTimes: null,
						crnSearchBlob: null
					}
				});

				return;
			}

			// Default availability value, where '1' denotes 'available'
			var crnSearchBlob = "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1";
			var crnSearchFeedback = "";
			var crnSearchTimes = "";

			activities.forEach(function(activity) {
				crnSearchFeedback = "Course found: " + activity.ssbsect_subj_code + " " + activity.ssbsect_crse_numb + " " + activity.ssbsect_seq_numb + " " + activity.scbcrse_title;
				var activityTimes = self.calculateTimes(activity);
				crnSearchTimes += activityTimes.description + " ";
				crnSearchBlob = self.combineBlobs(crnSearchBlob, activityTimes.blob);
			});

			studentReducers.reduce({
				type: CALCULATE_TIMESLOTS_FOR_CRN,
				payload: {
					crn: crn,
					crnSearchFeedback: crnSearchFeedback,
					crnSearchBlob: crnSearchBlob,
					crnSearchTimes: crnSearchTimes
				}
			});
		},
		// Converts an activity from data-warehouse into an availability blob with a human readable text description of days/times
		calculateTimes: function(activity) {
			var activityTimes = {
				blob: "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1",
				description: ""
			};

			if (!activity.ssrmeet_begin_time || !activity.ssrmeet_end_time) {
				return activityTimes;
			}

			var startHour = activity.ssrmeet_begin_time.substring(0, 2);
			var startHourIndex = startHour - 7; // 7am should correspond to 0 index.
			var endHour = activity.ssrmeet_end_time.substring(0, 2);
			var endHourIndex = endHour - 7; // 7am should correspond to 0 index.

			// If end minutes is zero, do not block out that hour. Example 0810-0900 should only block out the 8am-9am block
			var endMinute = activity.ssrmeet_end_time.substring(2, 4);

			if (endMinute == "00") {
				endHourIndex--;
			}

			if (activity.ssrmeet_mon_day) {
				activityTimes.description += "M";

				var dayOffset = 0; // Monday starts at 0 in the blob
				for (var i = startHourIndex; i <= endHourIndex; i++) {
					var blobIndex = (i * 2) + dayOffset;
					activityTimes.blob = setCharAt(activityTimes.blob, blobIndex, "0");
				}
			}
			if (activity.ssrmeet_tue_day) {
				activityTimes.description += "T";

				var dayOffset = 30; // Tuesday starts at 30 in the blob
				for (var i = startHourIndex; i <= endHourIndex; i++) {
					var blobIndex = (i * 2) + dayOffset;
					activityTimes.blob = setCharAt(activityTimes.blob, blobIndex, "0");
				}
			}
			if (activity.ssrmeet_wed_day) {
				activityTimes.description += "W";

				var dayOffset = 60; // Wednesday starts at 60 in the blob
				for (var i = startHourIndex; i <= endHourIndex; i++) {
					var blobIndex = (i * 2) + dayOffset;
					activityTimes.blob = setCharAt(activityTimes.blob, blobIndex, "0");
				}
			}
			if (activity.ssrmeet_thu_day) {
				activityTimes.description += "R";

				var dayOffset = 90; // Thursday starts at 90 in the blob
				for (var i = startHourIndex; i <= endHourIndex; i++) {
					var blobIndex = (i * 2) + dayOffset;
					activityTimes.blob = setCharAt(activityTimes.blob, blobIndex, "0");
				}
			}
			if (activity.ssrmeet_fri_day) {
				activityTimes.description += "F";
				var dayOffset = 120; // Friday starts at 120 in the blob
				for (var i = startHourIndex; i <= endHourIndex; i++) {
					var blobIndex = (i * 2) + dayOffset;
					activityTimes.blob = setCharAt(activityTimes.blob, blobIndex, "0");
				}
			}

			activityTimes.description += " " + activity.ssrmeet_begin_time + "-" + activity.ssrmeet_end_time;

			return activityTimes;
		},
		setCharAt: function(str, index, chr) {
			if (index > str.length - 1) { return str; }

			return str.substr(0, index) + chr + str.substr(index + 1);
		},
		combineBlobs: function (blobOne, blobTwo) {
			for( var i = 0; i < blobTwo.length; i = i + 2) {
				if (blobTwo[i] == "0" || blobOne[i] == "0") {
					blobOne = setCharAt(blobOne, i, "0");
				}
			}

			return blobOne;
		}
	};
});