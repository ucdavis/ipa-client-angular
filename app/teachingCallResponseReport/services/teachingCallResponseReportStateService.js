teachingCallResponseReportApp.service('teachingCallResponseReportStateService', function ($rootScope, $log, Term, SectionGroup) {
	return {
		_state: {},
		_instructorReducers: function (action, instructors) {
			switch (action.type) {
				case INIT_STATE:

					var collapsedTermsBlob = "0000000000";

					// Collapse the teachingCall termsBlobs into one
					teachingCalls = action.payload.teachingCalls;

					teachingCalls.forEach( function(teachingCall) {

						// Loop through blobFlags in teachingCalls termBlob
						for (var i = 0; i < teachingCall.termsBlob.length; i++) {
							var blobFlag = teachingCall.termsBlob[i];
							if (blobFlag == "1") {
								// Change the relevant flag to 1
								collapsedTermsBlob = setCharAt(collapsedTermsBlob,i,"1");
							}
						}
					});

					// Get relevant termCodes for report from collapsed termsBlob
					var relevantTermCodes = [];

					var allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10'];

					for (var i = 0; i < collapsedTermsBlob.length; i++) {
						var blobFlag = collapsedTermsBlob[i];
						if (blobFlag == "1") {
							var termCode = allTerms[i];
							relevantTermCodes.push(termCode);
						}
					}

					// Root state object
					instructors = action.payload.instructors;

					// Get availability blobs and put on instructor in an associative array by termcode
					teachingCallResponses = action.payload.teachingCallResponses;

					teachingCallResponses.forEach( function(teachingCallResponse) {

						instructors.forEach( function(instructor) {
							if (instructor.id == teachingCallResponse.instructorId) {
								if (!instructor.availabilityByTermCode) {
									instructor.availabilityByTermCode = {};
								}

								instructor.availabilityByTermCode[teachingCallResponse.termCode] = teachingCallResponse.availabilityBlob;
							}
						});
					});

					// Get isDone (submitted) and comments and put them on instructor
					teachingCallReceipts = action.payload.teachingCallReceipts;

					teachingCallReceipts.forEach( function(teachingCallReceipt) {
						instructors.forEach( function(instructor) {
							if (instructor.id == teachingCallReceipt.instructorId) {
								instructor.isDone = teachingCallReceipt.isDone;
								instructor.comment = teachingCallReceipt.comment;
							}
						});
					});

					// Make courses and sectionGroups indexable for easy teachingAssignment translation
					sectionGroups = {
						list: {},
						ids: []
					};

					action.payload.sectionGroups.forEach( function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});

					courses = {
						list: {},
						ids: []
					};

					action.payload.courses.forEach( function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});

					teachingAssignments = action.payload.teachingAssignments;

					// Look for unique instances of assignments (there are duplicates for multiple sectionGroups)
					// then look for associated course data, and add that assignment to the instructor
					teachingAssignments = action.payload.teachingAssignments;

					teachingAssignments.forEach( function(teachingAssignment) {
						// Ignore assignments from the academic coordinator


						// TODO: why is this never true?
						if (teachingAssignment.fromInstructor == false) {
							// Find the relevant instructor
							var instructor = null;

							for (var j=0; j < instructors.length; j++) {
								if (teachingAssignment.instructorId = instructors[j].id) {
									instructor = instructors[j];
									break;
								}
							}

							// Ensure an array exists for this termCode
							if (!instructor.preferencesByTermCode) {
								instructor.preferencesByTermCode = {};
							}

							if(!instructor.preferencesByTermCode[teachingAssignment.termCode]) {
								instructor.preferencesByTermCode[teachingAssignment.termCode] = [];
							}

							var preferences = instructor.preferencesByTermCode[teachingAssignment.termCode];

							// Is this a non-sectionGroup based preference?
							if (teachingAssignment.sectionGroupId == 0) {
								if (teachingAssignment.courseRelease) {
									description = "Course Release";
								} else if (teachingAssignment.buyout) {
									description = "Buyout";
								} else if (teachingAssignment.inResidence) {
									description = "In Residence";
								} else if (teachingAssignment.sabbatical) {
									description = "Sabbatical";
								}

								var newPreference = {};
								newPreference.courseId = null;
								newPreference.description = description;
								newPreference.order = teachingAssignment.priority;
								preferences.push(newPreference);

								return;
							}

							// Which course is this preference ultimately associated to
							var sectionGroupId = teachingAssignment.sectionGroupId;
							var courseId = sectionGroups.list[sectionGroupId].courseId;
							var course = courses.list[courseId];

							// Do we already have that course listed for this term?
							var alreadyExists = false;

							for (var i = 0; i < preferences.length; i++) {
								var preference = preferences[i];
								if (preference.courseId == course.id) {
									alreadyExists = true;
									break;
								}
							}

							if (alreadyExists == false) {
								var newPreference = {};
								newPreference.courseId = course.id;
								newPreference.description = course.subjectCode + " " + course.courseNumber;
								newPreference.order = teachingAssignment.priority;
								preferences.push(newPreference);
							}
						}
					});

					instructors;
					debugger;
					
					return instructors;
				default:
					return instructors;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.instructors = scope._instructorReducers(action, scope._state.instructors);

			scope._state = newState;
			$rootScope.$emit('reportStateChanged', {
				state: scope._state,
				action: action
			});

			$log.debug("Report state updated:");
			$log.debug(scope._state, action.type);
		}
	};
});

sortSections = function(sections) {
	sections.sort(function (a, b) {
		// Use subject codes to sort if they don't match
		if (a.sequenceNumber > b.sequenceNumber) {
			return 1;
		}

		if (a.sequenceNumber < b.sequenceNumber) {
			return -1;
		}

		return -1;
	});

	return sections;
};
