schedulingApp.directive("termCalendar", this.termCalendar = function ($rootScope, $timeout, schedulingActionCreators) {
	return {
		restrict: 'E',
		template: '<div id="calendar"></div>',
		replace: true,
		link: function (scope, element, attrs) {
			scope.view = {};

			var refreshCalendar = function () {
				var parentAspectRatio = element.parent().width() / element.parent().height();
				element.fullCalendar('destroy');
				element.fullCalendar({
					defaultView: 'agendaWeek',
					allDaySlot: false,
					allDayDefault: false,
					aspectRatio: parentAspectRatio,
					height: "auto",
					minTime: '07:00',
					maxTime: '22:00',
					header: false,
					slotEventOverlap: false,
					hiddenDays: scope.view.state.filters.hiddenDays,
					eventColor: '#6AA4C1',
					eventSources: [
						// TODO: Add instructor unavailabilities,
						getActivities()
					],
					eventClick: function (calEvent, jsEvent, view) {
						var activity = scope.view.state.activities.list[calEvent.activityId];
						schedulingActionCreators.setSelectedActivity(activity);
						// Important: notify angular since this happends outside of the scope
						scope.$apply();
					},
					dayClick: function (date, jsEvent, view) {
						schedulingActionCreators.setSelectedActivity();
						scope.$apply();
					}
				});
			};

			var getActivities = function () {
				// Each of these If blocks will add to a 'events array'
				// The event making function will color them appropriately
				var calendarActivities = [];

				// Add Selected sectionGroup activities
				if (scope.view.state.uiState.selectedSectionGroupId) {
					calendarActivities = calendarActivities.concat(
						createCalendarEvents(scope.view.state.sectionGroups.list[scope.view.state.uiState.selectedSectionGroupId], null)
					);
				}

				// Add checked sectionGroups activities
				if (scope.view.state.uiState.checkedSectionGroupIds.length > 0) {
					var otherEventsColor = "#7D838E";
					scope.view.state.uiState.checkedSectionGroupIds.forEach(function (sgId) {
						if (sgId !== scope.view.state.uiState.selectedSectionGroupId) {
							calendarActivities = calendarActivities.concat(
								createCalendarEvents(scope.view.state.sectionGroups.list[sgId], otherEventsColor)
							);
						}
					});
				}

				return calendarActivities;
			};

			var activityToEvents = function (activity, title) {
				var calendarActivities = [];
				if (activity.startTime && activity.endTime) {
					var dayArray = activity.dayIndicator.split('');

					var start = activity.startTime.split(':').map(Number);
					var end = activity.endTime.split(':').map(Number);

					dayArray.forEach(function(d,i) {
						if (d === '1') {
							var activityStart = moment().day(i).hour(start[0]).minute(start[1]).second(0).format('llll');
							var activityEnd = moment().day(i).hour(end[0]).minute(end[1]).second(0).format('llll');

							calendarActivities.push({
								title: title,
								start: activityStart,
								end: activityEnd,
								activityId: activity.id
							});
						}
					});
				}
				return calendarActivities;
			};

			var sectionGroupToEvents = function (sectionGroup) {
				var calendarActivities = [];
				var title = getCourseTitleByCourseId(sectionGroup.courseId);

				if (sectionGroup.sharedActivityIds) {
					sectionGroup.sharedActivityIds.forEach(function (sharedActivityId) {
						calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[sharedActivityId], title));
					});
				}
				if (sectionGroup.sectionIds) {
					sectionGroup.sectionIds.forEach(function (sectionId) {
						var section = scope.view.state.sections.list[sectionId];
						if (section.activityIds) {
							section.activityIds.forEach(function (activityId) {
								calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[activityId], title));
							});
						}
					});
				}

				return calendarActivities;
			};

			var createCalendarEvents = function (sectionGroup, color) {
				var hiliteColor = "#3A87AD"
				var calendarActivities = sectionGroupToEvents(sectionGroup);
				calendarActivities.forEach(function (event) {
					event.color = (scope.view.state.uiState.selectedActivityId === event.activityId) ? hiliteColor : color;
				});
				return calendarActivities;
			};

			var getCourseTitleByCourseId = function (courseId) {
				var course = scope.view.state.courses.list[courseId];
				return course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern;
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

		}
	}
});
