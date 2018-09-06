let termCalendar = function ($rootScope, $timeout, SchedulingActionCreators) {
	return {
		restrict: 'E',
		template: '<div id="calendar"></div>',
		replace: true,
		scope: {
			state: '='
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
						$('#calendar').fullCalendar('option', 'height', scope.get_calendar_height());
						$('.section-group-container').height(scope.get_calendar_height());
					});

					$('#calendar').fullCalendar({
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
					defaultView: 'agendaWeek',
					allDaySlot: false,
					allDayDefault: false,
					aspectRatio: parentAspectRatio,
					height: scope.get_calendar_height(),
					minTime: '07:00',
					maxTime: '22:00',
					header: false,
					slotEventOverlap: false,
					hiddenDays: scope.view.state.filters.hiddenDays,
					eventColor: defaultEventBackgroundColor,
					eventBorderColor: defaultEventBorderColor,
					eventTextColor: defaultEventTextColor,
					eventSources: [
						getActivities(),
						getUnavailabilities()
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

			var activityToEvents = function (activity, courseTitle) {
				var calendarActivities = [];

				if (activity.startTime && activity.endTime && activity.dayIndicator) {
					var dayArray = activity.dayIndicator.split('');

					var start = activity.startTime.split(':').map(Number);
					var end = activity.endTime.split(':').map(Number);
					var location = activity.locationDescription || '';

					dayArray.forEach(function (d, i) {
						if (d === '1') {
							var activityStart = moment().day(i).hour(start[0]).minute(start[1]).second(0).format('llll');
							var activityEnd = moment().day(i).hour(end[0]).minute(end[1]).second(0).format('llll');

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
					});
				}
				return calendarActivities;
			};

			var teachingCallResponseToEvents = function (teachingCallResponse, title) {
				var calendarUnavailabilities = [];
				var unavailabilitiesArr = teachingCallResponse.availabilityBlob.split(',');

				for (var d = 1; d < 6; d++) { // Blob starts on Monday and ends on Friday by definition
					var unavailabilityStart = null;
					for (var h = 7; h < 22; h++) { // Blob starts at 7am and ends at 10pm by definition
						var slotUnavailable = unavailabilitiesArr[15 * (d - 1) + (h - 7)] === '0';
						if (unavailabilityStart === null && slotUnavailable) {
							unavailabilityStart = moment().day(d).hour(h).minute(0).second(0);
						}

						// If unavailability slot is ending or day is ending...
						if (unavailabilityStart !== null && (slotUnavailable === false || h === 21)) {
							if (h === 21) { h++; } // Unavailabilities must end at 22:00
							var unavailabilityEnd = moment().day(d).hour(h).minute(0).second(0);
							calendarUnavailabilities.push({
								title: title,
								start: unavailabilityStart,
								end: unavailabilityEnd,
								teachingCallResponseId: teachingCallResponse.id,
								className: ['unavailability-event']
							});
							unavailabilityStart = null;
						}
					}
				}

				return calendarUnavailabilities;
			};

			var sectionGroupToActivityEvents = function (sectionGroup) {
				var calendarActivities = [];
				var title = getCourseTitleByCourseId(sectionGroup.courseId);

				if (sectionGroup.sharedActivityIds) {
					sectionGroup.sharedActivityIds.forEach(function (sharedActivityId) {
						if (activityMatchesLocationFilters(sharedActivityId)) {
							calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[sharedActivityId], title));
						}
					});
				}

				if (sectionGroup.sectionIds) {
					sectionGroup.sectionIds.forEach(function (sectionId) {
						var section = scope.view.state.sections.list[sectionId];
						if (section.activityIds) {
							section.activityIds.forEach(function (activityId) {
								if (activityMatchesLocationFilters(activityId)) {
									calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[activityId], title));
								}
							});
						}
					});
				}

				return calendarActivities;
			};

			var sectionGroupToUnavailabilityEvents = function (sectionGroup) {
				var calendarActivities = [];

				if (sectionGroup.teachingCallResponseIds) {
					sectionGroup.teachingCallResponseIds.forEach(function (trId) {
						var teachingCallResponse = scope.view.state.teachingCallResponses.list[trId];
						var instructor = scope.view.state.instructors.list[teachingCallResponse.instructorId];
						var instructorName = instructor ? instructor.fullName : "Unknown Instructor";
						calendarActivities = calendarActivities.concat(teachingCallResponseToEvents(teachingCallResponse, instructorName));
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

			var getUnavailabilities = function () {
				var calendarActivities = [];

				// Add Selected sectionGroup unavailabilities
				if (scope.view.state.uiState.selectedSectionGroupId) {
					var unstyledEvents = sectionGroupToUnavailabilityEvents(scope.view.state.sectionGroups.list[scope.view.state.uiState.selectedSectionGroupId]);
					calendarActivities = styleCalendarEvents(unstyledEvents, unavailabilityEventBackgroundColor, unavailabilityEventBorderColor, unavailabilityEventTextColor);
				}

				return calendarActivities;
			};

			var activityMatchesLocationFilters = function(activityId) {
				if (scope.view.state.filters.enabledLocationIds.length === 0) {
					return true;
				}

				var locationId = scope.view.state.activities.list[activityId].locationId;

				return (scope.view.state.filters.enabledLocationIds.indexOf(locationId) >= 0);
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

export default termCalendar;
