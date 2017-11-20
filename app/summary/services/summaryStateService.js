/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */

summaryApp.service('summaryStateService', function ($rootScope, $log, Course, ScheduleTermState, SectionGroup, Section, Tag, Event, Activity, TeachingCall, TeachingCallReceipt) {
	return {
		_state: {},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						ids: [],
						list: {}
					};
					var coursesList = {};
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var courseData = action.payload.courses[i];
						coursesList[courseData.id] = new Course(courseData);
					}
					courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
					courses.list = coursesList;
					return courses;
				default:
					return courses;
			}
		},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						ids: [],
						list: {}
					};

					var supportStaffList = {
						list: {},
						ids: []
					};

					action.payload.supportStaffList.forEach(function(staff) {
						supportStaffList.list[staff.id] = staff;
						supportStaffList.ids.push(staff.id);
					});

					action.payload.sectionGroups.forEach(function(sectionGroup) {
						if (!sectionGroup) { return;}
						sectionGroups.list[sectionGroup.id] = new SectionGroup(sectionGroup);
						sectionGroups.ids.push(sectionGroup.id);

						sectionGroups.list[sectionGroup.id].teachingAssistants = action.payload.supportAssignments.filter(function(supportAssignment) {
							return supportAssignment.appointmentType == "teachingAssistant" && supportAssignment.sectionGroupId == sectionGroup.id;
						}).map(function(supportAssignment) {
							var supportStaff = supportStaffList.list[supportAssignment.supportStaffId];
							return {
								id: supportStaff.id,
								supportStaffId: supportStaff.id,
								supportAssignmentId: supportAssignment.id,
								sectionGroupId: sectionGroup.id,
								firstName: supportStaff.firstName,
								lastName: supportStaff.lastName,
								fullName: supportStaff.fullName,
								loginId: supportStaff.loginId,
								appointmentPercentage: supportAssignment.appointmentPercentage,
								appointmentType: supportAssignment.appointmentType
							};
						});
					});

					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_sectionReducers: function (action, sections) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sections = {
						list: {},
						ids: []
					};

					var sectionsList = {};
					var length = action.payload.sections ? action.payload.sections.length : 0;
					for (var i = 0; i < action.payload.sections.length; i++) {
						var sectionData = action.payload.sections[i];

						sectionsList[sectionData.id] = new SectionGroup(sectionData);
						sections.ids.push(sectionData.id);
					}
					sections.list = sectionsList;

					return sections;
				default:
					return sections;
			}
		},
		_activityReducers: function (action, activities) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					activities = {
						list: {},
						ids: []
					};

					var activitiesList = {};
					var length = action.payload.activities ? action.payload.activities.length : 0;
					for (var i = 0; i < length; i++) {
						var activityData = action.payload.activities[i];
						activitiesList[activityData.id] = new SectionGroup(activityData);
						activities.ids.push(activityData.id);
					}
					activities.list = activitiesList;

					return activities;
				default:
					return activities;
			}
		},
		_eventReducers: function (action, events) {
			var scope = this;
			var i, startDate, endDate, eventData;

			switch (action.type) {
				case INIT_STATE:
					events = {
						list: {},
						ids: []
					};

					var eventsList = [];

					// Append future starting and ending teaching calls to eventsList
					var teachingCallLength = action.payload.teachingCalls ? action.payload.teachingCalls.length : 0;
					for (i = 0; i < teachingCallLength; i++) {
						var teachingCall = action.payload.teachingCalls[i];
						startDate = moment(teachingCall.startDate, "YYYY-MM-DD");
						endDate = moment(teachingCall.dueDate, "YYYY-MM-DD");

						// Build eventData object based on the teachingCall's start date
						var teachingCallType = "";

						// This logic is important because a teaching call may be both, one, or the other.
						if (teachingCall.sentToFederation && teachingCall.sentToSenate) {
							teachingCallType = " Federation and Senate ";
						} else if (teachingCall.sentToFederation) {
							teachingCallType = " Federation ";
						} else {
							teachingCallType = " Senate ";
						}
						eventData = {
							'type': "teaching_call",
							'title': action.year + teachingCallType + "Teaching Call Starts",
							'time': undefined,
							'date': startDate.format("l"),
							'caption': teachingCall.message,
							'link': "/assignments/" + action.workgroupId + "/" + action.year + "/teachingCallStatus"
						};

						// Only add the event if it happens in the future
						if (startDate.isAfter(moment())) {
							eventsList.push(new Event(eventData));
						}

						// Build eventData object based on the teachingCall's end date
						// The type property indicates the icon to be shown in the timeline
						eventData = {
							'type': "teaching_call",
							'title': action.year + teachingCallType + "Teaching Call Ends",
							'time': undefined,
							'date': endDate.format("l"),
							'caption': "",
							'link': "/assignments/" + action.workgroupId + "/" + action.year + "/teachingCallStatus"
						};
						if (endDate.isAfter(moment())) {
							eventsList.push(new Event(eventData));
						}

					} // end loop appending teaching calls

					var futureTerms = action.payload.terms.filter(function (term) {
						// return only terms that will end in the future and exclude the unused '04' terms
						return moment(term.endDate).isAfter(moment()) && term.termCode.slice(-2) != '04';
					});

					// Append future events retrieved from the terms
					var termLength = futureTerms ? futureTerms.length : 0;
					for (i = 0; i < termLength; i++) {
						var term = futureTerms[i];
						startDate = new Date(parseInt(term.startDate));
						endDate = new Date(parseInt(term.endDate));

						// Append future starting quarters / semesters
						eventData = {
							'type': "school",
							'title': term.termCode.getTermCodeDisplayName() + " Starts",
							'time': startDate.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
							'date': startDate.toLocaleDateString(),
							'caption': "",
							'link': ""
						};

						// Only append the event if it is in the future
						if (startDate.getTime() > Date.now()) {
							eventsList.push(new Event(eventData));
						}

						// Append future ending quarters / semesters
						eventData = {
							'type': "school",
							'title': term.termCode.getTermCodeDisplayName() + " Ends",
							'time': endDate.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
							'date': endDate.toLocaleDateString(),
							'caption': "",
							'link': ""
						};
						if (endDate.getTime() > Date.now()) {
							eventsList.push(new Event(eventData));
						}

						// This is wrapped in a if statement because not all terms have this value
						if (term.bannerStartWindow1 != null) {
							var upload1Start = new Date(parseInt(term.bannerStartWindow1));
							var upload1End = new Date(parseInt(term.bannerEndWindow1));

							// Append notice for upload I start time
							eventData = {
								'type': "notice",
								'title': term.termCode.getTermCodeDisplayName() + " Upload I Starts",
								'time': upload1Start.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
								'date': upload1Start.toLocaleDateString(),
								'caption': "",
								'link': ""
							};
							if (upload1Start.getTime() > Date.now()) {
								eventsList.push(new Event(eventData));
							}


							// Append notice for upload I end time
							eventData = {
								'type': "notice",
								'title': term.termCode.getTermCodeDisplayName() + " Upload I Ends",
								'time': upload1End.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
								'date': upload1End.toLocaleDateString(),
								'caption': "",
								'link': ""
							};
							if (upload1End.getTime() > Date.now()) {
								eventsList.push(new Event(eventData));
							}
						}

						if (term.bannerStartWindow2 != null) {
							var upload2Start = new Date(parseInt(term.bannerStartWindow2));
							var upload2End = new Date(parseInt(term.bannerEndWindow2));

							// // Append notice for upload II start time
							eventData = {
								'type': "notice",
								'title': term.termCode.getTermCodeDisplayName() + " Upload II Starts",
								'time': upload2Start.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
								'date': upload2Start.toLocaleDateString(),
								'caption': "",
								'link': ""
							};
							if (upload2Start.getTime() > Date.now()) {
								eventsList.push(new Event(eventData));
							}


							// // Append notice for upload I end time
							eventData = {
								'type': "notice",
								'title': term.termCode.getTermCodeDisplayName() + " Upload II Ends",
								'time': upload2End.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
								'date': upload2End.toLocaleDateString(),
								'caption': "",
								'link': ""
							};
							if (upload2End.getTime() > Date.now()) {
								eventsList.push(new Event(eventData));
							}
						}

					} // end for

					// Sort the eventList from least to greatest time
					eventsList.sort(function (a, b) {
						return new Date(a.date).getTime() - new Date(b.date).getTime();
					});
					events.list = eventsList;

					// Add ids for iterating purposes
					for (i = 0; i < eventsList.length; i++) {
						events.ids.push(i);
					}

					return events;
				default:
					return events;
			}
		},
		_teachingCallReceiptReducers: function (action, teachingCallReceipt) {
			var scope = this;
			var data = action.payload;

			switch (action.type) {
				case INIT_STATE:
				// Return the teachingCallReceipt for the workgroupId and year if it exists
					teachingCallReceipt = null;

					var length = action.payload.teachingCallReceipts ? action.payload.teachingCallReceipts.length : 0;
					for (var i = 0; i < length; i++) {
						var teachingCallReceiptData = action.payload.teachingCallReceipts[i];

						if (teachingCallReceiptData.workgroupId == action.workgroupId
							&& teachingCallReceiptData.academicYear == action.year) {
								if (teachingCallReceiptData.dueDate) {
									teachingCallReceiptData.dueDateDescription = moment(teachingCallReceiptData.dueDate).format("YYYY-MM-DD").toFullDate();
								} else {
									teachingCallReceiptData.dueDateDescription = "";
								}
							return teachingCallReceiptData;
						}
					}

					return teachingCallReceipt;
				default:
					return teachingCallReceipt;
			}
		},
		_instructorSupportCallResponseReducers: function (action, supportCallResponses) {
			switch (action.type) {
				case INIT_STATE:
					var supportCallResponses = {
						ids: [],
						list: [],
						byTerm: {}
					};

					action.payload.instructorSupportCallResponses.forEach(function(response) {
						supportCallResponses.ids.push(response.id);
						supportCallResponses.list[response.id] = response;
						supportCallResponses.byTerm[response.termCode.slice(-2)] = response;
					});

					return supportCallResponses;
				default:
					return supportCallResponses;
			}
		},
		_scheduleReducers: function (action, schedule) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					var schedule = action.payload.schedule;
					return schedule;
				default:
					return schedule;
			}
		},
		_supportStaffListReducers: function (action, supportStaffList) {
			switch (action.type) {
				case INIT_STATE:
					supportStaffList = {
						list: {},
						ids: []
					};

					action.payload.supportStaffList.forEach(function(staff) {
						supportStaffList.list[staff.id] = staff;
						supportStaffList.ids.push(staff.id);
					});

					return supportStaffList;
				default:
					return supportStaffList;
			}
		},
		_supportAssignmentReducers: function (action, supportAssignments) {
			switch (action.type) {
				case INIT_STATE:
					supportAssignments = {
						list: {},
						ids: []
					};

					action.payload.supportAssignments.forEach(function(supportAssignment) {
						supportAssignments.list[supportAssignment.id] = supportAssignment;
						supportAssignments.ids.push(supportAssignment.id);
					});
					return supportAssignments;
				default:
					return supportAssignments;
			}
		},
		_studentSupportCallResponseReducers: function (action, supportCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					var supportCallResponses = action.payload.studentSupportCallResponses;
					supportCallResponses.forEach(function(supportCallResponse) {
						supportCallResponse.dueDate = millisecondsToFullDate(supportCallResponse.dueDate);
					});
					return supportCallResponses;
				default:
					return supportCallResponses;
			}
		},
		_termReducers: function (action, terms) {
			switch (action.type) {
				case INIT_STATE:
					var terms = {
						ids: [],
						list: {}
					};
					action.payload.terms.forEach(function(term) {
						terms.list[term.termCode] = term;
						terms.ids.push(term.termCode);
					});

					return terms;
				default:
					return terms;
			}
		},
		_uiReducers: function (action, ui) {
			switch (action.type) {
				case INIT_STATE:
					var selectedSupportCallTerm = null;
					var allTerms = [];

					if (action.payload.instructorSupportCallResponses && action.payload.instructorSupportCallResponses.length > 0) {
						allTerms = action.payload.instructorSupportCallResponses.map(function(response) { return response.termCode.slice(-2); });
						selectedSupportCallTerm = allTerms[0];
					}

					var allTermNames = allTerms.map(function(term) { return term.getTermDisplayName(); });
					var selectedSupportCallTermDisplay = selectedSupportCallTerm ? selectedSupportCallTerm.getTermDisplayName() : "";

					ui = {
						selectedSupportCallTerm: selectedSupportCallTerm,
						selectedSupportCallTermDisplay: selectedSupportCallTermDisplay,
						allTerms: allTerms,
						allTermNames: allTermNames
					};
					return ui;
				case SELECT_TERM:
					ui.selectedSupportCallTerm = action.payload.selectedTerm;
					ui.selectedSupportCallTermDisplay = action.payload.selectedTerm.getTermDisplayName();

					return ui;
				default:
					return ui;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.sections = scope._sectionReducers(action, scope._state.sections);
			newState.activities = scope._activityReducers(action, scope._state.activities);
			newState.events = scope._eventReducers(action, scope._state.events);
			newState.teachingCallReceipt = scope._teachingCallReceiptReducers(action, scope._state.teachingCallReceipt);
			newState.instructorSupportCallResponses = scope._instructorSupportCallResponseReducers(action, scope._state.instructorSupportCallResponses);
			newState.studentSupportCallResponses = scope._studentSupportCallResponseReducers(action, scope._state.studentSupportCallResponses);
			newState.schedule = scope._scheduleReducers(action, scope._state.schedule);
			newState.supportStaffList = scope._supportStaffListReducers(action, scope._state.supportStaffList);
			newState.supportAssignments = scope._supportAssignmentReducers(action, scope._state.supportAssignments);
			newState.ui = scope._uiReducers(action, scope._state.ui);
			newState.terms = scope._termReducers(action, scope._state.terms);

			scope._state = newState;

			$rootScope.$emit('summaryStateChanged', scope._state);
			$log.debug(newState);
		}
	};
});

millisecondsToFullDate = function(milliseconds) {
	if ( !(milliseconds) ) {
		return "";
	}
	var d = new Date(milliseconds);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var formattedDate = year + "-" + month + "-" + day;
	formattedDate = moment(formattedDate, "YYYY-MM-DD").format('LL');

	return formattedDate;
};
