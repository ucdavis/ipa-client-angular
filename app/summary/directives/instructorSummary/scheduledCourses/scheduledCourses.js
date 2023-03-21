import { isCurrentTerm } from 'shared/helpers/dates';

import './scheduledCourses.css';

let scheduledCourses = function ($rootScope, TeachingAssignmentService) {
	return {
		restrict: 'E',
		template: require('./scheduledCourses.html'),
		replace: true,
		link: function (scope) {
			$rootScope.$on('summaryStateChanged', function (event, data) {
				scope.calculateAssignments(data);
			});

			scope.isCurrentTerm = function (termCode) {
				if (scope.state.terms) {
					var term = scope.state.terms.list[termCode];
					return isCurrentTerm(term.startDate, term.endDate);
				}
			};

			// Will translate a dayIndicator like '0010100' into 'TR'
			scope.dayIndicatorToDayCodes = function (dayIndicator) {
				let dayCodes = "";
				// Handle incorrect data
				if (!dayIndicator || dayIndicator.length === 0) {
					return dayCodes;
				}

				let dayStrings = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

				for (var i = 0; i < dayIndicator.length; i++) {
					let char = dayIndicator.charAt(i);
					if (Number(char) == 1) {
						dayCodes += dayStrings[i];
					}
				}

				return dayCodes;
			};

			scope.calculateAssignments = function(data) {
				scope.instructorAssignments = [];
				scope.termCodes = [];

				data.teachingAssignments.ids.forEach(function(teachingAssignmentId) {
					var teachingAssignment = data.teachingAssignments.list[teachingAssignmentId];
					var sectionGroup = teachingAssignment.sectionGroupId ? data.sectionGroups.list[teachingAssignment.sectionGroupId] : null;
					var course = sectionGroup ? data.courses.list[sectionGroup.courseId] : null;
					var description = TeachingAssignmentService.getDescription (teachingAssignment, course);
					description = course ? description += " - " + course.title + " - " + course.sequencePattern : description;
					var meetings = sectionGroup ? scope.generateMeetingsInSectionGroup(sectionGroup, data.sections, data.activities) : null;
					let scheduledTermCode = sectionGroup?.termCode || teachingAssignment.termCode;

					var instructorAssignment = {
						description: description,
						termCode: scheduledTermCode,
						meetings: meetings,
						sectionGroupId: sectionGroup ? sectionGroup.id : null,
						teachingAssistants: sectionGroup.teachingAssistants
					};

					scope.instructorAssignments.push(instructorAssignment);

					if (scope.termCodes.indexOf(scheduledTermCode) == -1) {
						scope.termCodes.push(scheduledTermCode);
					}
				});

				scope.state.scheduledCourses = scheduledCourses;
			};

			scope.generateScheduledCourse = function(sectionGroup, data) {
				var meetings = scope.generateMeetingsInSectionGroup(sectionGroup, data.sections, data.activities);
				var course = data.courses.list[sectionGroup.courseId];

				var scheduledCourse = {
					subjectCode: course.subjectCode,
					courseNumber: course.courseNumber,
					title: course.title,
					meetings: meetings,
					teachingAssistants: sectionGroup.teachingAssistants,
					sequencePattern: course.sequencePattern
				};

				return scheduledCourse;
			};

			// Will generate a list of shared meetings followed by distinct meetings.
			scope.generateMeetingsInSectionGroup = function(sectionGroup, sections, activities) {
				let lectureMeetings = [];
				let sharedMeetings = [];
				let distinctMeetings = [];

				var sharedActivities = scope.calculateSharedActivitiesInSectionGroup(
					sectionGroup,
					sections,
					activities
				);

				activities.ids.forEach(function(activityId) {
					var activity = activities.list[activityId];

					if (scope.activityBelongsToSectionGroup(activity, sectionGroup, sections) == false) { return;}

					var meeting = {
						startTime: activity.startTime,
						endTime: activity.endTime,
						activityType: activity.activityTypeCode.activityTypeCode.getActivityCodeDescription(),
						dayIndicator: activity.dayIndicator,
						location: activity.locationDescription || "To Be Announced"
					};

					// If activity is the first instance of the shared activity
					if (scope.isFirstInstanceOfSharedActivity(activity, sharedActivities)) {
						if (meeting.activityType == "Lecture") {
							lectureMeetings.push(meeting);
						} else {
							sharedMeetings.push(meeting);
						}
					// If activity is not shared
					} else if (scope.isSharedActivity(activity, sharedActivities) == false) {
						if (meeting.activityType == "Lecture") {
							lectureMeetings.push(meeting);
						} else {
							distinctMeetings.push(meeting);
						}
					}
				});

				var meetings = lectureMeetings.concat(sharedMeetings);
				meetings = meetings.concat(distinctMeetings);

				return meetings;
			};

			// Return true if activity matches the first instance in one of the shared activity arrays in sharedActivities
			scope.isFirstInstanceOfSharedActivity = function (activity, sharedActivities) {
				for (var i = 0; i < sharedActivities.length; i++) {
					if (sharedActivities[i].length > 0 && sharedActivities[i][0] == activity.id) {
						return true;
					}
				}

				return false;
			};

			// Return true if activityId is found in any of the shared activity arrays in sharedActivities
			scope.isSharedActivity = function(activity, sharedActivities) {
				for (var i = 0; i < sharedActivities.length; i++) {
					if (sharedActivities[i].indexOf(activity.id) > -1) {
						return true;
					}
				}

				return false;

			};

			// Creates an array of arrays of activityIds, grouped by having identical properties which make them 'shared'
			scope.calculateSharedActivitiesInSectionGroup = function(sectionGroup, sections, activities) {
				// Uses activity-unique-identifier as a key, stores an array of activity ids that fit the key
				var matchingActivityHash = {};
				var hashKeys = [];
				var numSectionsInSectionGroup = 0;

				sections.ids.forEach(function(sectionId) {
					if (sections.list[sectionId].sectionGroupId == sectionGroup.id) {
						numSectionsInSectionGroup++;
					}
				});

				activities.ids.forEach(function(activityId) {
					var activity = activities.list[activityId];

					if (scope.activityBelongsToSectionGroup(activity, sectionGroup, sections) == false) {
						return;
					}

					var type = activity.activityTypeCode.activityTypeCode;
					var location = activity.locationId;
					var days = activity.dayIndicator;
					var start = activity.startTime;
					var end = activity.endTime;
					var uniqueKey = type + "," + location + "," + days + "," + start + "," + end;

					if (!days && !start & !end) { return; }

					if (!(matchingActivityHash[uniqueKey])) {
						matchingActivityHash[uniqueKey] = [];
						hashKeys.push(uniqueKey);
					}

					matchingActivityHash[uniqueKey].push(activity.id);
				});

				var sharedActivities = [];

				hashKeys.forEach(function(key) {
					if (matchingActivityHash[key].length == numSectionsInSectionGroup) {
						sharedActivities.push(matchingActivityHash[key]);
					}
				});

				return sharedActivities;
			};

			// Will calculate if activity is connected to a sectionGroup directly or through a section
			scope.activityBelongsToSectionGroup = function (activity, sectionGroup, sections) {
				if (!activity || !sectionGroup) { return null; }

				if (activity.sectionGroupId && activity.sectionGroupId === sectionGroup.id) {
					return true;
				}

				if (sections.list[activity.sectionId]) {
					if (sections.list[activity.sectionId].sectionGroupId === sectionGroup.id) {
						return true;
					}
				}

				return false;
			};

			if (scope.state) {
				scope.calculateAssignments(scope.state);
			}
		}
	};
};

export default scheduledCourses;
