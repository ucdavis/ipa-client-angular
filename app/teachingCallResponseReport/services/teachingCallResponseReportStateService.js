teachingCallResponseReportApp.service('teachingCallResponseReportStateService', function ($rootScope, $log, Term, SectionGroup) {
	return {
		_state: {},
		_instructorReducers: function (action, instructors) {
			switch (action.type) {
				case INIT_STATE:
					// Root state object
					instructors = action.payload.instructors;

					// Get availability blobs and put on instructor in an associative array by termCode
					teachingCallResponses = action.payload.teachingCallResponses;

					teachingCallResponses.forEach( function(teachingCallResponse) {
						instructors.forEach( function(instructor) {
							if (instructor.id == teachingCallResponse.instructorId) {
								if (!instructor.availabilityByTermCode) {
									instructor.availabilityByTermCode = {};
								}

								instructor.availabilityByTermCode[teachingCallResponse.termCode] = availabilityBlobToDescriptions(teachingCallResponse.availabilityBlob);
							}
						});
					});

					// Get isDone (submitted) and comments and put them on instructor
					teachingCallReceipts = action.payload.teachingCallReceipts;

					teachingCallReceipts.forEach( function(teachingCallReceipt) {
						instructors.forEach( function(instructor) {
							if (instructor.id == teachingCallReceipt.instructorId) {
								instructor.submitted = teachingCallReceipt.isDone;
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
						if (teachingAssignment.fromInstructor) {
							// Find the relevant instructor
							var instructor = null;

							for (var j=0; j < instructors.length; j++) {
								var slotInstructor = instructors[j];

								if (teachingAssignment.instructorId == slotInstructor.id) {
									instructor = slotInstructor;
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
								} else if (teachingAssignment.workLifeBalance) {
									description = "Work Life Balance";
								} else if (teachingAssignment.sabbatical) {
									description = "Sabbatical";
								} else {
									description = teachingAssignment.suggestedSubjectCode + " " + teachingAssignment.suggestedCourseNumber;
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
								if (preference.effectiveTermCode == course.effectiveTermCode
										&& preference.subjectCode == course.subjectCode
										&& preference.courseNumber == course.courseNumber) {
									alreadyExists = true;
									break;
								}
							}

							if (alreadyExists == false) {
								var newPreference = {};
								newPreference.courseId = course.id;
								newPreference.subjectCode = course.subjectCode;
								newPreference.courseNumber = course.courseNumber;
								newPreference.effectiveTermCode = course.effectiveTermCode;
								newPreference.description = course.subjectCode + " " + course.courseNumber;
								newPreference.order = teachingAssignment.priority;
								preferences.push(newPreference);
							}
						}
					});

					return instructors;
				default:
					return instructors;
			}
		},
		_termCodeReducers: function (action, termCodes) {
			switch (action.type) {
				case INIT_STATE:

					var collapsedTermsBlob = "0000000000";

					// Collapse the teachingCall termsBlobs into one
					teachingCallReceipts = action.payload.teachingCallReceipts;

					teachingCallReceipts.forEach( function(teachingCallReceipt) {

						// Loop through blobFlags in teachingCalls termBlob
						for (var i = 0; i < teachingCallReceipt.termsBlob.length; i++) {
							var blobFlag = teachingCallReceipt.termsBlob[i];
							if (blobFlag == "1") {
								// Change the relevant flag to 1
								collapsedTermsBlob = setCharAt(collapsedTermsBlob,i,"1");
							}
						}
					});

					// Convert termsBlob to terms
					var allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10'];
					var relevantTerms = [];

					for (var i = 0; i < collapsedTermsBlob.length; i++) {
						var blobFlag = collapsedTermsBlob[i];
						if (blobFlag == "1") {
							var termCode = allTerms[i];
							relevantTerms.push(termCode);
						}
					}

					// sort terms Chronologically
					var chronologicallyOrderedTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
					var sortedTerms = [];
					chronologicallyOrderedTerms.forEach( function(term) {
						if (relevantTerms.indexOf(term) > -1) {
							sortedTerms.push(term);
						}
					});

					var relevantTermCodes = [];
					// Convert terms to termCodes
					for (var i = 0; i < sortedTerms.length; i++) {
						var term = sortedTerms[i];
						var termYear = action.year;

						if (parseInt(term) < 4) {
							termYear++;
						}

						var termCode = termYear + term;
						relevantTermCodes.push(termCode);
					}

					return relevantTermCodes;
				default:
					return termCodes;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.instructors = scope._instructorReducers(action, scope._state.instructors);
			newState.termCodes = scope._termCodeReducers(action, scope._state.termCodes);

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

/**
 * @param  {array} blob A 75 length array representing unavailabilities
 */
availabilityBlobToDescriptions = function(blob) {
	var hoursArray = blob.split(',');

	console.log('hoursArray');
	console.dir(hoursArray);

	if (hoursArray.length != 75) {
		return null;
	}

	var descriptions = [];
	var mondayDescriptions = dayArrayToDescriptions(hoursArray.slice(0,14), "M");
	if (mondayDescriptions.times.length > 0) {
		var descriptions = descriptions.concat(mondayDescriptions);
	}

	var tuesdayDescriptions = dayArrayToDescriptions(hoursArray.slice(15,29), "T");
	if (tuesdayDescriptions.times.length > 0) {
		var descriptions = descriptions.concat(tuesdayDescriptions);
	}

	var wednesdayDescriptions = dayArrayToDescriptions(hoursArray.slice(30,44), "W");
	if (wednesdayDescriptions.times.length > 0) {
		var descriptions = descriptions.concat(wednesdayDescriptions);
	}

	var thursdayDescriptions = dayArrayToDescriptions(hoursArray.slice(45,59), "R");
	if (thursdayDescriptions.times.length > 0) {
		var descriptions = descriptions.concat(thursdayDescriptions);
	}

	var fridayDescriptions = dayArrayToDescriptions(hoursArray.slice(60,74), "F");
	if (fridayDescriptions.times.length > 0) {
		var descriptions = descriptions.concat(fridayDescriptions);
	}

	return descriptions;
};

dayArrayToDescriptions = function(dayArray, dayCode) {
	var descriptions = {
		day: dayCode,
		times: ""
	};

	var startHour = 7;

	var startTimeBlock = null;
	var endTimeBlock = null;
	var blocks = [];

	dayArray.forEach( function(hourFlag, i) {
		if (hourFlag == "1") {
			if (startTimeBlock == null) {
				startTimeBlock = startHour + i;
				endTimeBlock = startHour + i + 1;
			} else {
				endTimeBlock++;
			}
		} else if (hourFlag == "0" && startTimeBlock != null) {
			blocks.push(blockDescription(startTimeBlock, endTimeBlock));
			startTimeBlock = null;
		}
	});

	if (startTimeBlock != null) {
		blocks.push(blockDescription(startTimeBlock, endTimeBlock));
	}

	descriptions.times = blocks.join(", ");

	return descriptions;
};

blockDescription = function(startTime, endTime) {
	var start = (startTime > 12 ? (startTime - 12) + "pm" : startTime + "am" );
	var end = (endTime > 12 ? (endTime - 12) + "pm" : endTime + "am" );

	return start + "-" + end;
};
