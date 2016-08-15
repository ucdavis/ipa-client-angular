schedulingApp.directive("termCalendar", this.termCalendar = function ($rootScope, $timeout) {
	return {
		restrict: 'E',
		template: '<div id="calendar"></div>',
		replace: true,
		link: function (scope, element, attrs) {
			scope.calendarEvents = [];
			scope.selectedSectionGroup = {};
			scope.selectedActivity = {};
			scope.checkedSectionGroupIds = [];

			var refreshCalendar = function () {
				scope.calendar.fullCalendar('removeEvents');
				scope.calendar.fullCalendar('addEventSource', scope.calendarEvents[0]);
				scope.calendar.fullCalendar('rerenderEvents');
			}

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
								editable: scope.selectedActivity.id === activity.id
							});
						}
					});
				}
				return calendarActivities;
			};

			var sectionGroupToEvents = function (sectionGroup) {
				var calendarActivities = [];

				if (sectionGroup.id) {
					sectionGroup.sharedActivities.forEach(function (activity) {
						var title = getActivityTitle(sectionGroup, activity);
						calendarActivities = calendarActivities.concat(activityToEvents(activity, title));
					});
					sectionGroup.sections.forEach(function (section) {
						section.activities.forEach(function (activity) {
							var title = getActivityTitle(sectionGroup, activity);
							calendarActivities = calendarActivities.concat(activityToEvents(activity, title));
						});
					});
				}

				return calendarActivities;
			};

			var createCalendarEvents = function (sectionGroup, color) {
				var hiliteColor = "#303641"
				var calendarActivities = sectionGroupToEvents(sectionGroup);
				calendarActivities.forEach(function (event) {
					event.color = (scope.selectedActivity.id === event.activityId) ? hiliteColor : color;
				});
				return calendarActivities;
			};

			var getActivityTitle = function(sectionGroup, activity) {
				return sectionGroup.subjectCode + " " + sectionGroup.courseNumber + " - " + activity.sequence;
			};

			$rootScope.$on("sectionGroupSelected", function (event, newSG) {
				scope.selectedSectionGroup = newSG;
				refreshCalendar();
			});

			$rootScope.$on("activitySelected", function (event, newActivity) {
				if (newActivity.hasWarning) { return; }
				scope.selectedActivity = newActivity;
				refreshCalendar();
			});

			$rootScope.$on("checkedSectionGroupsChanged", function (event, checkedSectionGroupIds) {
				scope.checkedSectionGroupIds = checkedSectionGroupIds;
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
