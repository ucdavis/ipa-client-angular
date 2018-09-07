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
		link: function (scope, element, attrs) {
			scope.isResizeListenerActive = false;

			scope.listenForResize = function() {
				if (scope.isResizeListenerActive) {
					return;
				}

				scope.isResizeListenerActive = true;

				setTimeout(function() {
					$(window).resize(function() {
						$('#room-calendar').fullCalendar('option', 'height', scope.get_calendar_height());
						$('.section-group-container').height(scope.get_calendar_height());
					});

					$('#room-calendar').fullCalendar({
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

			// instructor unavailabilities
			var unavailabilityEventBackgroundColor = "#DFEBEF";
			var unavailabilityEventBorderColor = "#C6D2D6";
			var unavailabilityEventTextColor = "#555555";

			var tagEventTextColor = "#FFFFFF";
			// This will be used to 'darken' the color of a card on the calendar if it has a user specified 'tag' color
			var selectedActivityTintingMultiplier = .6;

			var refreshCalendar = function () {
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
					slotEventOverlap: false,
					visibleRange: {
						start: moment().startOf('week').format('YYYY-MM-DD'),
						end: moment().startOf('week').add(scope.locations.ids.length, 'days')
					},
					columnHeaderText: function(mom) {
						var locationIndex = mom.weekday();
						var locationId = scope.locations.ids[locationIndex];
						var location = scope.locations.list[locationId];
						return location.description;
					},
					eventColor: defaultEventBackgroundColor,
					eventBorderColor: defaultEventBorderColor,
					eventTextColor: defaultEventTextColor,
					eventSources: [
						getActivities()
					],
					eventClick: function (calEvent, jsEvent, view) {
						var closeTarget = angular.element(jsEvent.target).hasClass('activity-remove');
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
					eventMouseover: function (event, jsEvent, view) {
						element.find('a.activity-' + event.activityId).addClass('hover-activity');
						element.find('a.section-group-' + event.sectionGroupId).addClass('hover-section-group');
					},
					eventMouseout: function (event, jsEvent, view) {
						element.find('a.activity-' + event.activityId).removeClass('hover-activity');
						element.find('a.section-group-' + event.sectionGroupId).removeClass('hover-section-group');
					},
					dayClick: function (date, jsEvent, view) {
						SchedulingActionCreators.setSelectedActivity();
						$timeout(function () {
							scope.$apply();
						});
					},
					eventAfterAllRender: function (view) {
						var eventRemove = angular.element('<i class="glyphicon glyphicon-remove hoverable activity-remove"></i>');
						element.find('a.activity-event:not(.selected-activity):not(.selected-section-group) .fc-content').append(eventRemove);
					}
				});
			};

			// Supply a color and amount to shift the color (out of 255)
			// Example to lighten: lightenOrDarkenColor("#F06D06", 1.2);
			// Example to darken: lightenOrDarkenColor("#F06D06", .6);
			var lightenOrDarkenColor = function(hexColor, amt) {
				var rgbValues = hexToRgb(hexColor);

				var r = parseInt(rgbValues.r * amt);
				var g = parseInt(rgbValues.g * amt);
				var b = parseInt(rgbValues.b * amt);

				return rgbToHex(r, g, b);
			};

			// Converts a piece of the rgb value to its hex equivalent
			// Example: rgbComponentToHex(110) -> "6e"
			function rgbComponentToHex(c) {
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}

			function rgbToHex(r, g, b) {
				return "#" + rgbComponentToHex(r) + rgbComponentToHex(g) + rgbComponentToHex(b);
			}

			function hexToRgb(hex) {
				var expandedHex = {
					r: hex.slice(1, 3),
					g: hex.slice(3,5),
					b: hex.slice(5,7)
				};

				return expandedHex ? {
					r: parseInt(expandedHex.r, 16),
					b: parseInt(expandedHex.b, 16),
					g: parseInt(expandedHex.g, 16)
				} : null;
			}

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
				if (scope.view.state.uiState.checkedSectionGroupIds.length > 0) {
					scope.view.state.uiState.checkedSectionGroupIds.forEach(function (sgId) {
						if (sgId !== scope.view.state.uiState.selectedSectionGroupId) {
							var sectionGroup = scope.view.state.sectionGroups.list[sgId];
							var course = scope.view.state.courses.list[sectionGroup.courseId];
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

				return calendarActivities;
			};

			// TODO: alter the activity day to match the index of the locationId
			var activityToEvents = function (activity, courseTitle) {
				var calendarActivities = [];

				if (activity.startTime && activity.endTime) {
					var dayArray = activity.dayIndicator.split('');

					var start = activity.startTime.split(':').map(Number);
					var end = activity.endTime.split(':').map(Number);
					var location = activity.locationDescription || '';
					var locationIndex = scope.locations.ids.indexOf(activity.locationId);
					var activityStart = moment().day(locationIndex).hour(start[0]).minute(start[1]).second(0).format('llll');
					var activityEnd = moment().day(locationIndex).hour(end[0]).minute(end[1]).second(0).format('llll');


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

					calendarActivities.push({
						title: courseTitle + ' (' + activity.activityTypeCode.activityTypeCode + ') ' + location,
						start: activityStart,
						end: activityEnd,
						activityId: activity.id,
						sectionGroupId: activity.sectionGroupId,
						className: activityClasses
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
					if (scope.view.state.uiState.selectedActivityId === event.activityId) {
						if (tagColor) {
							event.color = lightenOrDarkenColor(tagColor, selectedActivityTintingMultiplier);
							event.borderColor = lightenOrDarkenColor(tagColor, selectedActivityTintingMultiplier);
							event.textColor = textColor;
						} else {
							event.color = highlightedEventBackgroundColor;
							event.borderColor = highlightedEventBorderColor;
							event.textColor = highlightedEventTextColor;
						}
					} else {
						event.color = angular.copy(backgroundColor);
						event.borderColor = angular.copy(borderColor);
						event.textColor = angular.copy(textColor);
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

				return ( (activity.locationId > 0) && (activity.dayIndicator[scope.selectedDay] == 1) );
			};

			$rootScope.$on("schedulingStateChanged", function (event, data) {
				scope.view.state = data.state;
				refreshCalendar();
			});

			var neonCalendar = neonCalendar || {};

			neonCalendar.$container = $(".calendar-env");

			$.extend(neonCalendar, {
				isPresent: neonCalendar.$container.length > 0
			});

			scope.get_calendar_height = function () {
				if ($(window).height() < 485) {
					return $(window).height();
				}
			
				return $(window).height() - 178;
			};

			refreshCalendar();
		}
	};
};

export default departmentalRoomCalendar;