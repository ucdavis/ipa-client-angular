let termCalendar = function ($rootScope, $timeout, SchedulingActionCreators) {
	return {
		restrict: 'E',
		template: '<div id="calendar"></div>',
		replace: true,
		scope: {
			state: '='
		},
		link: function (scope, element) {
			scope.isResizeListenerActive = false;

			scope.listenForResize = function() {
				if (scope.isResizeListenerActive) {
					return;
				}

				scope.isResizeListenerActive = true;

				setTimeout(function() {
					$(window).resize(function() { // eslint-disable-line no-undef
						$('#calendar').fullCalendar('option', 'height', scope.get_calendar_height()); // eslint-disable-line no-undef
						$('.section-group-container').height(scope.get_calendar_height()); // eslint-disable-line no-undef
					});

					$('#calendar').fullCalendar({ // eslint-disable-line no-undef
						height: scope.get_calendar_height()
					});
				}, 500);
			};

			scope.listenForResize();

			scope.view = {
				state: scope.state
			};

			// color for calender
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

			var refreshCalendar = function () {
				var eventBorderColor = defaultEventBorderColor;
				var eventTextColor = defaultEventTextColor;
				var eventColor = defaultEventBackgroundColor;

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
					columnHeaderFormat: 'ddd',
					slotEventOverlap: false,
					hiddenDays: scope.view.state.filters.hiddenDays,
					eventColor: eventColor,
					eventBorderColor: eventBorderColor,
					eventTextColor: eventTextColor,
					displayEventTime: false,
					eventSources: [
						getActivities(),
						getUnavailabilities()
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
									styleCalendarEvents(unstyledEvents, tagColor, tagColor, "#ffffff")
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
							var activityStart = moment().day(i).hour(start[0]).minute(start[1]).second(0).format('llll'); // eslint-disable-line no-undef
							var activityEnd = moment().day(i).hour(end[0]).minute(end[1]).second(0).format('llll'); // eslint-disable-line no-undef

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

							var typeCodeText = activity.activityTypeCode.activityTypeCode.getActivityCodeDescription() ? ' (' + activity.activityTypeCode.activityTypeCode + ') ' : ' ';

							calendarActivities.push({
								title: courseTitle + typeCodeText + location,
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
							unavailabilityStart = moment().day(d).hour(h).minute(0).second(0); // eslint-disable-line no-undef
						}

						// If unavailability slot is ending or day is ending...
						if (unavailabilityStart !== null && (slotUnavailable === false || h === 21)) {
							if (h === 21) { h++; } // Unavailabilities must end at 22:00
							var unavailabilityEnd = moment().day(d).hour(h).minute(0).second(0); // eslint-disable-line no-undef
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
					if (activityMatchesSelection(event.activityId)) {
						// Selected activity with tag coloring
						if (tagColor) {
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

			var getUnavailabilities = function () {
				var calendarActivities = [];

				// Add Selected sectionGroup unavailabilities
				if (scope.view.state.uiState.selectedSectionGroupId) {
					var unstyledEvents = sectionGroupToUnavailabilityEvents(scope.view.state.sectionGroups.list[scope.view.state.uiState.selectedSectionGroupId]);
					calendarActivities = styleCalendarEvents(unstyledEvents, unavailabilityEventBackgroundColor, unavailabilityEventBorderColor, unavailabilityEventTextColor);
				}

				return calendarActivities;
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

			var activityMatchesFilters = function(activityId) {
				var passesLocationFilter = false;

				var activity = scope.view.state.activities.list[activityId];
				var sectionGroup = null;

				if (activity.sectionGroupId) {
					sectionGroup = scope.view.state.sectionGroups.list[activity.sectionGroupId];
				} else {
					sectionGroup = scope.view.state.sectionGroups.list[activity.sectionGroupId];
				}

				if (scope.view.state.filters.enabledLocationIds.indexOf(activity.locationId) >= 0 || scope.view.state.filters.enabledLocationIds.length === 0) {
					passesLocationFilter = true;
				}

				var primaryFilter = scope.state.filters.showOnlyPrimaryActivity;
				var passesPrimaryFilter = false;

				if (primaryFilter == false) {
					passesPrimaryFilter = true;
				} else {
					if (activity.category == "01") {
						passesPrimaryFilter = true;
					} else if (activity.shared) {
						passesPrimaryFilter = true;
					} else if (activity.activityTypeCode.activityTypeCode == "A") {
						passesPrimaryFilter = true;
					}
				}

				var selectedSectionGroupId = scope.state.uiState.selectedSectionGroupId;
				var selectedSectionGroup = scope.state.sectionGroups.list[selectedSectionGroupId];

				// If activity is selected, bypass primary filter
				if (selectedSectionGroup == sectionGroup) {
					passesPrimaryFilter = true;
				}

				return (passesLocationFilter && passesPrimaryFilter);
			};

			$rootScope.$on("schedulingStateChanged", function (event, data) {
				scope.view.state = data.state;
				var actionTypesOfInterest = [
					"CALCULATE_SECTION_GROUPS",
					"ACTIVITY_TOGGLED",
					"ACTIVITY_UNSELECTED",
					"UPDATE_ACTIVITY",
					"APPLY_FILTER_TO_SELECTION",
					"RENDER_CALENDAR"
				];

				if (actionTypesOfInterest.indexOf(data.action.type) > -1) {
					refreshCalendar();
				}
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

export default termCalendar;
