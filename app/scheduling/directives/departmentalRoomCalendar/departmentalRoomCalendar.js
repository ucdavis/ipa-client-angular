let departmentalRoomCalendar = function ($rootScope, $timeout, SchedulingActionCreators) {
	return {
		restrict: 'E',
		template: '<div id="room-calendar"></div>',
		replace: true,
		scope: {
			state: '=',
			locations: '=',
			selectedDay: '='
		},
		link: function (scope, element) {
			scope.isResizeListenerActive = false;
			scope.startOfWeek = moment().startOf('week').startOf('day'); // eslint-disable-line no-undef

			scope.listenForResize = function() {
				if (scope.isResizeListenerActive) {
					return;
				}

				scope.isResizeListenerActive = true;

				setTimeout(function() {
					$(window).resize(function() { // eslint-disable-line no-undef
						$('#room-calendar').fullCalendar('option', 'height', scope.get_calendar_height()); // eslint-disable-line no-undef
						$('.section-group-container').height(scope.get_calendar_height()); // eslint-disable-line no-undef
					});

					$('#room-calendar').fullCalendar({ // eslint-disable-line no-undef
						height: scope.get_calendar_height()
					});
				}, 500);
			};

			scope.listenForResize();

			scope.view = {
				state: scope.state
			};

			// color for calnder
			// Default color: Other (checked) courses
			var defaultEventBackgroundColor = "#DEDEDE";
			var defaultEventBorderColor = "#DEDEDE";
			var defaultEventTextColor = "#333333";

			// Active (selected) course activities
			var activeEventBackgroundColor = "#DEDEDE";
			var activeEventBorderColor = "#DEDEDE";
			var activeEventTextColor = "#333333";

			// The highlighted activity
			var highlightedEventBackgroundColor = "#3A87AD";
			var highlightedEventBorderColor = "#3A87AD";
			var highlightedEventTextColor = "#FFFFFF";

			var tagEventTextColor = "#FFFFFF";

			var refreshCalendar = function () {
				var eventBorderColor = defaultEventBorderColor;
				var eventTextColor = defaultEventTextColor;
				var eventColor = defaultEventBackgroundColor;

				var parentAspectRatio = element.parent().width() / element.parent().height();
				element.fullCalendar('destroy');

				element.fullCalendar({
					defaultView: 'agenda',
					allDaySlot: false,
					allDayDefault: false,
					aspectRatio: parentAspectRatio,
					height: scope.get_calendar_height(),
					minTime: '07:00',
					maxTime: '22:00',
					header: false,
					eventColor: eventColor,
					eventBorderColor: eventBorderColor,
					eventTextColor: eventTextColor,
					slotEventOverlap: false,
					displayEventTime: false,
					visibleRange: {
						start: moment().startOf('week').format('YYYY-MM-DD'), // eslint-disable-line no-undef
						end: moment().startOf('week').add(scope.locations.ids.length, 'days').format('YYYY-MM-DD') // eslint-disable-line no-undef
					},
					columnHeaderHtml: function(mom) {
						var day = mom.startOf('day');

						// The third param 'true' avoids moments timezone conversion errors and instead gives the raw exact difference in days
						var locationIndex = Math.ceil(day.diff(scope.startOfWeek, 'days', true));

						var locationId = scope.locations.ids[locationIndex];
						var location = scope.locations.list[locationId];

						if (location.hasLocationConflict) {
							location.hasLocationConflict = false;
							return "<span>" + location.description + " <i class=\"entypo-attention activity__event--location-conflict\"></i>" + "</span>";
						} else {
							return "<span>" + location.description + "</span>";
						}
					},
					eventSources: [
						getActivities()
					],
					eventClick: function (calEvent, jsEvent) {
						var closeTarget = angular.element(jsEvent.target).hasClass('activity-remove'); // eslint-disable-line no-undef
						if (closeTarget) {
							SchedulingActionCreators.toggleCheckedSectionGroup(calEvent.sectionGroupId);
						} else {
							var activity = scope.view.state.activities.list[calEvent.activityId];
							SchedulingActionCreators.setSelectedActivity(activity);
						}

						// Important: notify angular since this happends outside of the scope
						$timeout(function () {
							scope.$apply();
						});
					},
					eventMouseover: function (event) {
						element.find('a.activity-' + event.activityId).addClass('hover-activity');
						element.find('a.section-group-' + event.sectionGroupId).addClass('hover-section-group');
					},
					eventMouseout: function (event) {
						element.find('a.activity-' + event.activityId).removeClass('hover-activity');
						element.find('a.section-group-' + event.sectionGroupId).removeClass('hover-section-group');
					},
					dayClick: function () {
						SchedulingActionCreators.setSelectedActivity();
						$timeout(function () {
							scope.$apply();
						});
					},
					eventRender: function(event, element) {
						if (event.hasLocationConflict) {
							element.find(".fc-title").append("<i class=\"entypo-attention activity__event--location-conflict\"></i>");
						}
					},
					eventAfterAllRender: function () {
						var eventRemove = angular.element('<i class="glyphicon glyphicon-remove hoverable activity-remove"></i>'); // eslint-disable-line no-undef
						element.find('a.activity-event:not(.selected-activity):not(.selected-section-group) .fc-content').append(eventRemove);
					}
				});
			};

			var getActivities = function () {
				// Each of these If blocks will add to a 'events array'
				// The event making function will color them appropriately
				var calendarActivities = [];

				// Add Selected sectionGroup activities
				if (scope.view.state.uiState.selectedSectionGroupId) {
					var sectionGroup = scope.view.state.sectionGroups.list[scope.view.state.uiState.selectedSectionGroupId];
					var unstyledEvents = sectionGroupToActivityEvents(sectionGroup);
					var tagColor = scope.view.state.courses.list[sectionGroup.courseId].tagColor;

					var textColor = tagColor ? tagEventTextColor : activeEventTextColor;
					var borderColor = tagColor ? tagColor : activeEventBorderColor;
					var backgroundColor = tagColor ? tagColor : activeEventBackgroundColor;

					calendarActivities = calendarActivities.concat(
						styleCalendarEvents(unstyledEvents, backgroundColor, borderColor, textColor, tagColor)
					);
				}

				// Add checked sectionGroups activities
				if (scope.view.state.uiState.activeSectionGroupIds.length > 0) {
					scope.view.state.uiState.activeSectionGroupIds.forEach(function (sgId) {
						if (sgId !== scope.view.state.uiState.selectedSectionGroupId) {
							var sectionGroup = scope.view.state.sectionGroups.list[sgId];
							var unstyledEvents = sectionGroupToActivityEvents(scope.view.state.sectionGroups.list[sgId]);
							var tagColor = scope.view.state.courses.list[sectionGroup.courseId].tagColor;

							if (tagColor) {
								calendarActivities = calendarActivities.concat(
									styleCalendarEvents(unstyledEvents, tagColor, tagColor, "white")
								);
							} else {
								calendarActivities = calendarActivities.concat(
									styleCalendarEvents(unstyledEvents)
								);
							}
						}
					});
				}

				calendarActivities.forEach(function (calendarActivity) {
					if (scope.view.state.activities.locationConflictActivityIds.includes(calendarActivity.activityId)) {
						calendarActivity.hasLocationConflict = true;
						scope.locations.list[scope.locations.ids[calendarActivity.locationIndex]].hasLocationConflict = true;
					}
				});

				return calendarActivities;
			};

			// TODO: alter the activity day to match the index of the locationId
			var activityToEvents = function (activity, courseTitle) {
				var calendarActivities = [];

				if (activity.startTime && activity.endTime) {
					var start = activity.startTime.split(':').map(Number);
					var end = activity.endTime.split(':').map(Number);
					var locationIndex = scope.locations.ids.indexOf(activity.locationId);
					var activityStart = moment().day(locationIndex).hour(start[0]).minute(start[1]).second(0).format('llll'); // eslint-disable-line no-undef
					var activityEnd = moment().day(locationIndex).hour(end[0]).minute(end[1]).second(0).format('llll'); // eslint-disable-line no-undef


					// Add classes to group events that belong to the same activity
					var activityClasses = [
						'activity-event',
						'activity-' + activity.id,
						'section-group-' + activity.sectionGroupId
					];

					// Add a class to selected activity's meetings
					if (scope.view.state.uiState.selectedActivityId == activity.id) {
						activityClasses.push('selected-activity');
					}

					// Add a class to selected sectionGroup's meetings
					if (scope.view.state.uiState.selectedSectionGroupId == activity.sectionGroupId) {
						activityClasses.push('selected-section-group');
					}

					var instructorIds = scope.state.sectionGroups.list[activity.sectionGroupId].instructorIds;

					var instructors = instructorIds.map(function(instructorId) {
						var firstName = scope.state.instructors.list[instructorId] ? scope.state.instructors.list[instructorId].firstName : "";
						var lastLetter = scope.state.instructors.list[instructorId] ? scope.state.instructors.list[instructorId].lastName[0] : "";

						return firstName + ' ' + lastLetter;
					});

					var instructorText = instructors.join(', ');
					var typeCodeText = activity.activityTypeCode.activityTypeCode.getActivityCodeDescription() ? ' (' + activity.activityTypeCode.activityTypeCode + ') ' : ' ';

					calendarActivities.push({
						title: courseTitle + typeCodeText + instructorText,
						start: activityStart,
						end: activityEnd,
						activityId: activity.id,
						sectionGroupId: activity.sectionGroupId,
						className: activityClasses,
						locationIndex: locationIndex
					});
				}

				return calendarActivities;
			};

			var sectionGroupToActivityEvents = function (sectionGroup) {
				var calendarActivities = [];
				var title = getCourseTitleByCourseId(sectionGroup.courseId);

				if (sectionGroup.sharedActivityIds) {
					sectionGroup.sharedActivityIds.forEach(function (sharedActivityId) {

						if (activityMatchesFilters(sharedActivityId)) {
							calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[sharedActivityId], title));
						}
					});
				}

				if (sectionGroup.sectionIds) {
					sectionGroup.sectionIds.forEach(function (sectionId) {
						var section = scope.view.state.sections.list[sectionId];
						if (section.activityIds) {
							section.activityIds.forEach(function (activityId) {
								if (activityMatchesFilters(activityId)) {
									calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[activityId], title));
								}
							});
						}
					});
				}

				return calendarActivities;
			};

			// Generate a styled calendar event (text/background/border colors)
			// Considers the selectedActivity in the UI, and supplied tag colors
			var styleCalendarEvents = function (calendarActivities, backgroundColor, borderColor, textColor, tagColor) {
				calendarActivities.forEach(function (event) {
					if (activityMatchesSelection(event.activityId)) {
						if (tagColor) {
						// Selected activity with tag coloring
							event.color = tagColor;
							event.borderColor = tagColor;
							event.textColor = textColor;
						} else {
							// Selected activity, no tag coloring
							event.color = highlightedEventBackgroundColor;
							event.borderColor = highlightedEventBorderColor;
							event.textColor = highlightedEventTextColor;
						}
					} else {
						// Not a selected activity
						event.color = backgroundColor;
						event.borderColor = borderColor;
						event.textColor = textColor;
					}
				});
				return calendarActivities;
			};

			var getCourseTitleByCourseId = function (courseId) {
				var course = scope.view.state.courses.list[courseId];
				return course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern;
			};

			// Ensure the activity has a customRoom assignment, and that it matches the selected day
			var activityMatchesFilters = function(activityId) {
				var activity = scope.view.state.activities.list[activityId];

				return ((activity.locationId > 0) && (activity.dayIndicator[scope.selectedDay] == 1));
			};

			var activityMatchesSelection = function (activityId) {
				if (!activityId) { return false; }

				if (activityId == scope.view.state.uiState.selectedActivityId) { return true; }

				var activity = scope.view.state.activities.list[activityId];
				var section = null;
				var sectionGroup = null;
				var course = null;

				if (activity.sectionId) {
					section = scope.view.state.sections.list[activity.sectionId];
					sectionGroup = scope.view.state.sectionGroups.list[section.sectionGroupId];
				} else {
					sectionGroup = scope.view.state.sectionGroups.list[activity.sectionGroupId];
				}

				if (sectionGroup.id == scope.view.state.uiState.selectedSectionGroupId) { return true; }

				course = scope.view.state.courses.list[sectionGroup.courseId];

				if (course.id == scope.view.state.uiState.selectedCourseId) { return true; }

				return false;
			};

			$rootScope.$on("schedulingStateChanged", function (event, data) {
				scope.view.state = data.state;
				var actionTypesOfInterest = [
					"CALCULATE_SECTION_GROUPS",
					"ACTIVITY_TOGGLED",
					"ACTIVITY_UNSELECTED",
					"UPDATE_ACTIVITY",
					"RENDER_CALENDAR"
				];

				if (actionTypesOfInterest.indexOf(data.action.type) > -1) {
					refreshCalendar();
				}
			});

			scope.$watch("selectedDay", function () {
				refreshCalendar();
			});

			var neonCalendar = neonCalendar || {};

			neonCalendar.$container = $(".calendar-env"); // eslint-disable-line no-undef

			$.extend(neonCalendar, { // eslint-disable-line no-undef
				isPresent: neonCalendar.$container.length > 0
			});

			scope.get_calendar_height = function () {
				if ($(window).height() < 485) { // eslint-disable-line no-undef
					return $(window).height(); // eslint-disable-line no-undef
				}
			
				return $(window).height() - 178; // eslint-disable-line no-undef
			};

			refreshCalendar();
		}
	};
};

export default departmentalRoomCalendar;
