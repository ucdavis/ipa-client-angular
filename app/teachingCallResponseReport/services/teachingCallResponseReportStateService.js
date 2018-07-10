class TeachingCallResponseReportStateService {
	constructor ($rootScope, $log, Term, SectionGroup, ActionTypes, StringService) {
		var self = this;
		this.$rootScope = $rootScope;
		this.$log = $log;
		this.Term = Term;
		this.SectionGroup = SectionGroup;
		this.ActionTypes = ActionTypes;

		return {
			_state: {},
			_instructorReducers: function (action, instructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						// Root state object
						let instructors = action.payload.instructors;
	
						// Get availability blobs and put on instructor in an associative array by termCode
						let teachingCallResponses = action.payload.teachingCallResponses;
	
						teachingCallResponses.forEach( function(teachingCallResponse) {
							instructors.forEach( function(instructor) {
								if (instructor.id == teachingCallResponse.instructorId) {
									if (!instructor.availabilityByTermCode) {
										instructor.availabilityByTermCode = {};
									}
	
									instructor.availabilityByTermCode[teachingCallResponse.termCode] = self.availabilityBlobToDescriptions(teachingCallResponse.availabilityBlob);
								}
							});
						});
	
						// Get isDone (submitted) and comments and put them on instructor
						let teachingCallReceipts = action.payload.teachingCallReceipts;
	
						teachingCallReceipts.forEach( function(teachingCallReceipt) {
							instructors.forEach( function(instructor) {
								if (instructor.id == teachingCallReceipt.instructorId) {
									instructor.submitted = teachingCallReceipt.isDone;
									instructor.comment = teachingCallReceipt.comment;
								}
							});
						});
	
						// Make courses and sectionGroups indexable for easy teachingAssignment translation
						let sectionGroups = {
							list: {},
							ids: []
						};
	
						action.payload.sectionGroups.forEach( function(sectionGroup) {
							sectionGroups.ids.push(sectionGroup.id);
							sectionGroups.list[sectionGroup.id] = sectionGroup;
						});
	
						let courses = {
							list: {},
							ids: []
						};
	
						action.payload.courses.forEach( function(course) {
							courses.ids.push(course.id);
							courses.list[course.id] = course;
						});
	
						// Look for unique instances of assignments (there are duplicates for multiple sectionGroups)
						// then look for associated course data, and add that assignment to the instructor
						action.payload.teachingAssignments.forEach( function(teachingAssignment) {
							// Ignore teachingAssignments that aren't people based
							if (teachingAssignment.instructorId == null) { return; }
	
							// Ignore assignments from the academic coordinator
							if (teachingAssignment.fromInstructor) {
								// Find the relevant instructor
								var instructor = null;
	
								for (var j = 0; j < instructors.length; j++) {
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
								var description = "Unknown";
	
								// Is this a non-sectionGroup based preference, e.g. buyout, sabbatical, etc.?
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
									} else if (teachingAssignment.leaveOfAbsence) {
										description = "Leave of Absence";
									} else if (teachingAssignment.sabbaticalInResidence) {
										description = "Sabbatical In Residence";
									} else if (teachingAssignment.suggestedSubjectCode != null && teachingAssignment.suggestedCourseNumber != null) {
										description = teachingAssignment.suggestedSubjectCode + " " + teachingAssignment.suggestedCourseNumber;
									} else {
										console.error("Unhandled teachingAssignment type.");
										console.dir(teachingAssignment);
										description = "Unknown";
									}
	
									preferences.push({
										courseId: null,
										description: description,
										order: teachingAssignment.priority
									});
								} else {
									// Which course is this preference ultimately associated to
									var sectionGroupId = teachingAssignment.sectionGroupId;
									var courseId = sectionGroups.list[sectionGroupId].courseId;
									var course = courses.list[courseId];
	
									// Do we already have that course listed for this term?
									var alreadyExists = preferences.find( function (preference) {
										return preference.effectiveTermCode == course.effectiveTermCode
										&& preference.subjectCode == course.subjectCode
										&& preference.courseNumber == course.courseNumber; });
	
									alreadyExists = (alreadyExists !== undefined);
	
									if (alreadyExists == false) {
										preferences.push({
											description: course.subjectCode + " " + course.courseNumber + ": " + course.title,
											order: teachingAssignment.priority,
											effectiveTermCode: course.effectiveTermCode,
											subjectCode: course.subjectCode,
											courseNumber: course.courseNumber
										});
									}
								}
							}
						});
	
						return instructors;
					default:
						return instructors;
				}
			},
			_termCodeReducers: function (action, termCodes) {
				var self = this;

				switch (action.type) {
					case ActionTypes.INIT_STATE:
						var collapsedTermsBlob = "0000000000";
	
						// Collapse the teachingCall termsBlobs into one
						let teachingCallReceipts = action.payload.teachingCallReceipts;
	
						teachingCallReceipts.forEach( function(teachingCallReceipt) {
							// Loop through blobFlags in teachingCalls termBlob
							for (var i = 0; i < teachingCallReceipt.termsBlob.length; i++) {
								var blobFlag = teachingCallReceipt.termsBlob[i];
								if (blobFlag == "1") {
									// Change the relevant flag to 1
									collapsedTermsBlob = StringService.setCharAt(collapsedTermsBlob, i, "1");
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
	
				scope._state = {
					instructors: scope._instructorReducers(action, scope._state.instructors),
					termCodes: scope._termCodeReducers(action, scope._state.termCodes)
				};
	
				$rootScope.$emit('reportStateChanged', {
					state: scope._state,
					action: action
				});
			}
		};	
	}

	/**
	 * @param  {array} blob A 75 length array representing unavailabilities
	 */
	availabilityBlobToDescriptions (blob) {
		var self = this;
		var hoursArray = blob.split(',');

		if (hoursArray.length != 75) {
			return null;
		}

		var descriptions = [];
		descriptions.push(self.describeDayArray(hoursArray.slice(0,14), "M"));
		descriptions.push(self.describeDayArray(hoursArray.slice(15,29), "T"));
		descriptions.push(self.describeDayArray(hoursArray.slice(30,44), "W"));
		descriptions.push(self.describeDayArray(hoursArray.slice(45,59), "R"));
		descriptions.push(self.describeDayArray(hoursArray.slice(60,74), "F"));

		return descriptions;
	}

	describeDayArray (dayArray, dayCode) {
		var self = this;
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
				blocks.push(self.blockDescription(startTimeBlock, endTimeBlock));
				startTimeBlock = null;
			}
		});

		if (startTimeBlock != null) {
			blocks.push(self.blockDescription(startTimeBlock, endTimeBlock));
		}

		if(blocks.length == 0) {
			// No availabilities were indicated
			blocks.push("Not available");
		}

		descriptions.times = blocks.join(", ");

		return descriptions;
	}

	blockDescription (startTime, endTime) {
		var start = (startTime > 12 ? (startTime - 12) + "pm" : startTime + "am" );
		var end = (endTime > 12 ? (endTime - 12) + "pm" : endTime + "am" );

		return start + "-" + end;
	}
}

TeachingCallResponseReportStateService.$inject = ['$rootScope', '$log', 'Term', 'SectionGroup', 'ActionTypes', 'StringService'];

export default TeachingCallResponseReportStateService;
