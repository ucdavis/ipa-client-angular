summaryApp.directive("scheduledCourses", this.scheduledCourses = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'scheduledCourses.html',
		replace: true,
		link: function (scope, element, attrs) {
			$rootScope.$on('summaryStateChanged', function (event, data) {
				scope.mapDataToState(data);
			});

			// Will translate a dayIndicator like '0010100' into 'TR'
			scope.dayIndicatorToDayCodes = function (dayIndicator) {
				dayCodes = "";
				// Handle incorrect data
				if (dayIndicator.length === 0) {
					return dayCodes;
				}
				dayStrings = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
				for (var i = 0; i < dayIndicator.length; i++) {
					char = dayIndicator.charAt(i);
					if (Number(char) == 1) {
						dayCodes += dayStrings[i];
					}
				}
				return dayCodes;
			};

			scope.mapDataToState = function(data) {
				scope.view.state = data;

				var scheduledCourses = {
					terms: [],
					list: {}
				};

				data.sectionGroups.ids.forEach(function(sectionGroupId) {
					var sectionGroup = data.sectionGroups.list[sectionGroupId];

					if (!scheduledCourses.list[sectionGroup.termCode]) {
						scheduledCourses.list[sectionGroup.termCode] = [];
						scheduledCourses.terms.push(sectionGroup.termCode);
					}

					var scheduledCourse = scope.generateScheduledCourse(sectionGroup, data);
					scheduledCourses.list[sectionGroup.termCode].push(scheduledCourse);
				});

				scope.view.state.scheduledCourses = scheduledCourses;
			};

			scope.generateScheduledCourse = function(sectionGroup, data) {
				var meetings = scope.generateMeetingsInSectionGroup(sectionGroup, data.sections, data.activities);

				var scheduledCourse = {
					subjectCode: data.courses.list[sectionGroup.courseId].subjectCode,
					courseNumber: data.courses.list[sectionGroup.courseId].courseNumber,
					title: data.courses.list[sectionGroup.courseId].title,
					meetings: meetings,
					teachingAssistants: sectionGroup.teachingAssistants
				};

				return scheduledCourse;
			};

			// Will generate a list of shared meetings followed by distinct meetings.
			scope.generateMeetingsInSectionGroup = function(sectionGroup, sections, activities) {
				sharedMeetings = [];
				distinctMeetings = [];

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
						sharedMeetings.push(meeting);
					// If activity is not shared
				} else if (scope.isSharedActivity(activity, sharedActivities) == false) {
						distinctMeetings.push(meeting);
					}
				});

				return sharedMeetings.concat(distinctMeetings);
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

					if ( !(matchingActivityHash[uniqueKey])) {
						matchingActivityHash[uniqueKey] = [];
						hashKeys.push(uniqueKey);
					}

					matchingActivityHash[uniqueKey].push(activity.id);
				});

				sharedActivities = [];

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
		}
	};
});