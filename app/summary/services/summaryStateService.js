'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */
summaryApp.service('summaryStateService', function ($rootScope, Course, ScheduleTermState, SectionGroup, Section, Tag) {
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
		_instructorCourses: function (action, instructorCourses) {
			var scope = this;
			var data = action.payload;

			switch (action.type) {
				case INIT_STATE:
					var instructorCoursesByTermCode = {};

//					termCodes = [];
//					termCode['2016'].meetings = {};
//					meeting
//					meeting.location;
//					meeting.time;

					terms = [];

					data.sectionGroups.forEach( function(sectionGroup) {
						var termCode = sectionGroup.termCode;

						// If this is the first sectionGroup of a termCode
						if (terms.indexOf(termCode) == -1 ) {
							terms.push(termCode);
							instructorCoursesByTermCode[termCode] = [];
						}

						var slotSectionGroup = {};

						slotSectionGroup.title = "";

						data.courses.forEach( function (course) {
							if (sectionGroup.courseId == course.id) {
								slotSectionGroup.title = course.title;
							}
						});

						slotSectionGroup.meetings = [];

						// Look for meeting data from shared activities
						data.activities.forEach( function(activity) {
							if (activity.sectionGroupId == sectionGroup.id) {
								var slotMeeting = {};

								slotMeeting.startTime = activity.startTime;
								slotMeeting.endTime = activity.endTime;
								if (activity.locationDescription.length == 0) {
									slotMeeting.location = "To Be Announced";
								} else {
									slotMeeting.location = activity.locationDescription;
								}
								slotSectionGroup.meetings.push(slotMeeting);
							}
						});

						// Look for meeting data tied to sections
						data.sections.forEach( function(section) {
							if (section.sectionGroupId == sectionGroup.id) {

								// Collect Location/Time Data
								data.activities.forEach( function(activity) {
									if (activity.sectionId == section.id) {
										var slotMeeting = {};
										slotMeeting.startTime = activity.startTime;
										slotMeeting.endTime = activity.endTime;
										slotMeeting.location = activity.locationDescription;

										slotSectionGroup.meetings.push(slotMeeting);
									}
								});
							}
						});

						instructorCoursesByTermCode[termCode].push(slotSectionGroup);
					});

					var instructorCourses = {};
					instructorCourses.terms = terms;
					instructorCourses.list = instructorCoursesByTermCode;

					return instructorCourses;
				default:
					return instructorCourses;
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
			newState.instructorCourses = scope._instructorCourses(action, scope._state.instructorCourses);

			scope._state = newState;

			$rootScope.$emit('summaryStateChanged',scope._state);
		}
	}
});
