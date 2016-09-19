'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */
summaryApp.service('summaryStateService', function ($rootScope, Course, ScheduleTermState, SectionGroup, Section, Tag, Event) {
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
					for (var i = 0; i < length; i++) {
						var sectionData = action.payload.sectionGroups[i];
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
		_eventReducers: function(action, events) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					events = {
						list: {},
						ids: []
					};

					var eventsList = {};

					// Grab Teaching Calls
					var teachingCallLength = action.payload.teachingCalls ? action.payload.teachingCalls.length : 0;
					var eventListLength = 0;
					for (var i = 0; i < teachingCallLength; i++) {
						var teachingCall = action.payload.teachingCalls[i];
						var date = new Date(teachingCall.startDate);

						// TODO: Swap 20 with workgroupId
						var eventData = {
							'type': "teaching_call",
							'title': "Teaching Call " + date.getFullYear() + " Started",
							'time': date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
							'date': date.toLocaleDateString(),
							'caption': teachingCall.message,
							'link': "/assign/" + 20 + "/" + date.getFullYear() + "/teachingCall"
						}
						eventsList[eventListLength++] = new Event(eventData);

						date = new Date(teachingCall.dueDate);
						eventData = {
							'type': "teaching_call",
							'title': "Teaching Call " + date.getFullYear() + " Ended",
							'time': date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
							'date': date.toLocaleDateString(),
							'caption': teachingCall.message,
							'link': "/assign/" + 20 + "/" + date.getFullYear() + "/teachingCall"
						}
						eventsList[eventListLength++] = new Event(eventData);

					} // end for

					// Grab Terms
					var termLength = action.payload.dwTerm ? action.payload.dwTerm.length : 0;
					for (var i = 0; i < termLength; i++) {
						var term = action.payload.dwTerm[i];
						var startDate = new Date(term.beginDate);
						var endDate = new Date(term.endDate);

						// Start Term notice
						var eventData = {
							'type': "school",
							'title': term.code.getTermCodeDisplayName() + " Started",
							'time': startDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
							'date': startDate.toLocaleDateString(),
							'caption': "",
							'link': ""
						}
						eventsList[eventListLength++] = new Event(eventData);

						// End term notice
						eventData = {
							'type': "school",
							'title': term.code.getTermCodeDisplayName() + " Started",
							'time': endDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
							'date': endDate.toLocaleDateString(),
							'caption': "",
							'link': ""
						}
						eventsList[eventListLength++] = new Event(eventData);

						if (term.maintenanceDate1Start != null) {
							var upload1Start = new Date(term.maintenanceDate1Start);
							var upload1End = new Date(term.maintenanceDate1End);

							// Start Update I notice
							eventData = {
								'type': "notice",
								'title': term.code.getTermCodeDisplayName() + " Upload I Started",
								'time': upload1Start.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
								'date': upload1Start.toLocaleDateString(),
								'caption': "",
								'link': ""
							}
							eventsList[eventListLength++] = new Event(eventData);


							// End Update I notice
							eventData = {
								'type': "notice",
								'title': term.code.getTermCodeDisplayName() + " Upload I Ended",
								'time': upload1End.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
								'date': upload1End.toLocaleDateString(),
								'caption': "",
								'link': ""
							}
							eventsList[eventListLength++] = new Event(eventData);
						}

						if (term.maintenanceDate2Start != null) {
							var upload2Start = new Date(term.maintenanceDate2Start);
							var upload2End = new Date(term.maintenanceDate2End);

							// Start Update II notice
							eventData = {
								'type': "notice",
								'title': term.code.getTermCodeDisplayName() + " Upload II Started",
								'time': upload2Start.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
								'date': upload2Start.toLocaleDateString(),
								'caption': "",
								'link': ""
							}
							eventsList[eventListLength++] = new Event(eventData);


							// End Update II notice
							eventData = {
								'type': "notice",
								'title': term.code.getTermCodeDisplayName() + " Upload II Ended",
								'time': upload2End.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
								'date': upload2End.toLocaleDateString(),
								'caption': "",
								'link': ""
							}
							eventsList[eventListLength++] = new Event(eventData);
						}

					} // end for

					events.list = eventsList;
					console.log("These are the events");
					console.log(events);
					return events;
				default:
					return events;
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

			scope._state = newState;
			$rootScope.$emit('summaryStateChanged', {
				state: scope._state,
				actionType: action.type
			});

			console.debug("Summary state updated:");
			console.debug(scope._state, action.type);
		}
	}
});
