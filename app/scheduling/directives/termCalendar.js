schedulingApp.directive("termCalendar", this.termCalendar = function ($rootScope, $timeout) {
	return {
		restrict: 'E',
		template: '<div id="calendar"></div>',
		replace: true,
		link: function (scope, element, attrs) {
			scope.calendarEvents = [];
			scope.view = {};

			var refreshCalendar = function () {
				getActivities();
				scope.calendar.fullCalendar('removeEvents');
				scope.calendar.fullCalendar('addEventSource', scope.calendarEvents[0]);
				scope.calendar.fullCalendar('rerenderEvents');
			}

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
					scope.view.state.uiState.checkedSectionGroupIds.forEach(function (sgId) {
						if (sgId !== scope.view.state.uiState.selectedSectionGroupId) {
							calendarActivities = calendarActivities.concat(
								createCalendarEvents(scope.view.state.sectionGroups.list[sgId], "#006600")
							);
						}
					});
				}

				scope.calendarEvents.length = 0;
				scope.calendarEvents.push(calendarActivities);
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
								activityId: activity.id,
								editable: scope.view.state.uiState.selectedActivityId === activity.id
							});
						}
					});
				}
				return calendarActivities;
			};

			var sectionGroupToEvents = function (sectionGroup) {
				var calendarActivities = [];

				if (sectionGroup.sectionIds) {
					sectionGroup.sectionIds.forEach(function (sectionId) {
						scope.view.state.sections.list[sectionId].activityIds.forEach(function (activityId) {
							var title = getCourseTitleByCourseId(sectionGroup.courseId);
							calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[activityId], title));
						});
					});
				}

				return calendarActivities;
			};

			var createCalendarEvents = function (sectionGroup, color) {
				var hiliteColor = "#303641"
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

			$rootScope.$on("sectionGroupSelected", function (event, newSG) {
				refreshCalendar();
			});

			$rootScope.$on("activitySelected", function (event, newActivity) {
				if (newActivity.hasWarning) { return; }
				refreshCalendar();
			});

			$rootScope.$on("checkedSectionGroupsChanged", function (event, checkedSectionGroupIds) {
				refreshCalendar();
			});

			var neonCalendar = neonCalendar || {};

			neonCalendar.$container = $(".calendar-env");

			$.extend(neonCalendar, {
				isPresent: neonCalendar.$container.length > 0
			});

			if($.isFunction($.fn.fullCalendar))
			{
				scope.calendar = element;
				var parentAspectRatio = element.parent().width() / element.parent().height();

				scope.calendar.fullCalendar({
					defaultView: 'agendaWeek',
					allDaySlot: false,
					allDayDefault: false,
					aspectRatio: parentAspectRatio,
					height: "auto",
					minTime: '06:00',
					maxTime: '18:00',
					header: false,
					slotEventOverlap: false,
					eventSources: scope.calendarEvents
				});
			}
		}
	}
});
