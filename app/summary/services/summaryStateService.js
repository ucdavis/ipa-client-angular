/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */

summaryApp.service('summaryStateService', function ($rootScope, $log, Course, ScheduleTermState, SectionGroup, Section, Tag, Event, Activity, TeachingCall) {
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
					var sectionGroupsList = {};
					var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
					for (var i = 0; i < length; i++) {
						var sectionGroupData = action.payload.sectionGroups[i];
						sectionGroupsList[sectionGroupData.id] = new SectionGroup(sectionGroupData);
						sectionGroups.ids.push(sectionGroupData.id);
					}
					sectionGroups.list = sectionGroupsList;
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

					// Filter dwTerm to only use terms for the current school year
					var relevantTerms = action.payload.dwTerms.filter(function (term) {
						// action.year is the academic school year
						// * 100 adds the possible term code
						var academicYearStart = action.year * 100;
						var academicYearEnd = (parseInt(action.year) + 1) * 100;

						return (
							term.code == academicYearStart + 10 ||
							term.code == academicYearStart + 9 ||
							(term.code != academicYearEnd + 4 && term.code >= academicYearEnd + 1 && term.code <= academicYearEnd + 8)
						);
					});

					// Append future events retrieved from the terms
					var termLength = relevantTerms ? relevantTerms.length : 0;
					for (i = 0; i < termLength; i++) {
						var term = relevantTerms[i];
						startDate = new Date(parseInt(term.beginDate));
						endDate = new Date(parseInt(term.endDate));

						// Append future starting quarters / semesters
						eventData = {
							'type': "school",
							'title': term.code.getTermCodeDisplayName() + " Starts",
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
							'title': term.code.getTermCodeDisplayName() + " Ends",
							'time': endDate.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
							'date': endDate.toLocaleDateString(),
							'caption': "",
							'link': ""
						};
						if (endDate.getTime() > Date.now()) {
							eventsList.push(new Event(eventData));
						}

						// This is wrapped in a if statement because not all terms have this value
						if (term.maintenanceDate1Start != null) {
							var upload1Start = new Date(parseInt(term.maintenanceDate1Start));
							var upload1End = new Date(parseInt(term.maintenanceDate1End));

							// Append notice for upload I start time
							eventData = {
								'type': "notice",
								'title': term.code.getTermCodeDisplayName() + " Upload I Starts",
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
								'title': term.code.getTermCodeDisplayName() + " Upload I Ends",
								'time': upload1End.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }),
								'date': upload1End.toLocaleDateString(),
								'caption': "",
								'link': ""
							};
							if (upload1End.getTime() > Date.now()) {
								eventsList.push(new Event(eventData));
							}
						}

						if (term.maintenanceDate2Start != null) {
							var upload2Start = new Date(parseInt(term.maintenanceDate2Start));
							var upload2End = new Date(parseInt(term.maintenanceDate2End));

							// // Append notice for upload II start time
							eventData = {
								'type': "notice",
								'title': term.code.getTermCodeDisplayName() + " Upload II Starts",
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
								'title': term.code.getTermCodeDisplayName() + " Upload II Ends",
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
		_instructorCourses: function (action, instructorCourses) {
			var scope = this;
			var data = action.payload;

			switch (action.type) {
				case INIT_STATE:
					var instructorCoursesByTermCode = {};

					terms = [];

					data.sectionGroups.forEach(function (sectionGroup) {
						var termCode = sectionGroup.termCode;

						// If this is the first sectionGroup of a termCode
						if (terms.indexOf(termCode) == -1) {
							terms.push(termCode);
							instructorCoursesByTermCode[termCode] = [];
						}

						var slotSectionGroup = {};

						slotSectionGroup.title = "";

						data.courses.forEach(function (course) {
							if (sectionGroup.courseId == course.id) {
								slotSectionGroup.title = course.title;
								slotSectionGroup.subjectCode = course.subjectCode;
								slotSectionGroup.courseNumber = course.courseNumber;
							}
						});

						slotSectionGroup.meetings = [];

						// Look for meeting data from shared activities
						data.activities.forEach(function (activity) {
							activity = new Activity(activity);

							if (activity.sectionGroupId == sectionGroup.id) {
								var slotMeeting = {};

								slotMeeting.startTime = activity.startTime;
								slotMeeting.endTime = activity.endTime;
								if (activity.locationDescription.length === 0) {
									slotMeeting.location = "To Be Announced";
								} else {
									slotMeeting.location = activity.locationDescription;
								}
								slotMeeting.activityType = activity.getCodeDescription();
								slotMeeting.dayIndicator = activity.dayIndicator;
								slotMeeting.id = activity.id;

								slotSectionGroup.meetings.push(slotMeeting);
							}
						});

						instructorCoursesByTermCode[termCode].push(slotSectionGroup);
					});

					instructorCourses = {};
					instructorCourses.terms = terms;
					instructorCourses.list = instructorCoursesByTermCode;

					return instructorCourses;
				default:
					return instructorCourses;
			}
		},
		_teachingCallReducers: function (action, teachingCalls) {
			var scope = this;
			var data = action.payload;

			switch (action.type) {
				case INIT_STATE:
					teachingCalls = {
						ids: [],
						list: {}
					};
					var teachingCallsList = {};
					var length = action.payload.teachingCalls ? action.payload.teachingCalls.length : 0;
					for (var i = 0; i < length; i++) {
						var teachingCallData = action.payload.teachingCalls[i];
						teachingCallsList[teachingCallData.id] = new TeachingCall(teachingCallData);
					}
					teachingCalls.ids = _array_sortIdsByProperty(teachingCallsList, ["dueDate"]);
					teachingCalls.list = teachingCallsList;

					return teachingCalls;
				default:
					return teachingCalls;
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
			newState.instructorCourses = scope._instructorCourses(action, scope._state.instructorCourses);
			newState.teachingCalls = scope._teachingCallReducers(action, scope._state.teachingCalls);

			scope._state = newState;

			$rootScope.$emit('summaryStateChanged', scope._state);
			$log.debug(newState);
		}
	};
});
