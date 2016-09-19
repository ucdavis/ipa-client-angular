schedulingApp.directive("termCalendar", this.termCalendar = function($rootScope, $timeout, schedulingActionCreators) {
    return {
        restrict: 'E',
        template: '<div id="calendar"></div>',
        replace: true,
        link: function(scope, element, attrs) {
            scope.view = {};
            // color for calnder
            // Default color: Other (checked) courses
            var defaultEventBackgroundColor = "#DEDEDE";
            var defaultEventTextColor = "#333333";

            // Active (selected) course activities
            var activeEventBackgroundColor = "#54A1C7";
            var activeEventTextColor = "#FFFFFF";

            // The highlighted activity
            var highlightedEventBackgroundColor = "#215569";
            var highlightedEventTextColor = "#FFFFFF";

            // instructor unavailabilities
            var unavailabilityEventBackgroundColor = "#EFF7FA";
            var unavailabilityEventTextColor = "#ACB0B0";

            var refreshCalendar = function() {
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
                    eventColor: defaultEventBackgroundColor,
                    eventTextColor: defaultEventTextColor,
                    eventSources: [
                        getActivities(),
                        getUnavailabilities()
                    ],
                    eventClick: function(calEvent, jsEvent, view) {
                        var activity = scope.view.state.activities.list[calEvent.activityId];
                        schedulingActionCreators.setSelectedActivity(activity);
                        // Important: notify angular since this happends outside of the scope
                        scope.$apply();
                    },
                    dayClick: function(date, jsEvent, view) {
                        schedulingActionCreators.setSelectedActivity();
                        scope.$apply();
                    }
                });
            };

            var getActivities = function() {
                // Each of these If blocks will add to a 'events array'
                // The event making function will color them appropriately
                var calendarActivities = [];

                // Add Selected sectionGroup activities
                if (scope.view.state.uiState.selectedSectionGroupId) {
                    var unstyledEvents = sectionGroupToActivityEvents(scope.view.state.sectionGroups.list[scope.view.state.uiState.selectedSectionGroupId]);
                    calendarActivities = calendarActivities.concat(
                        styleCalendarEvents(unstyledEvents, activeEventBackgroundColor, activeEventTextColor)
                    );
                }

                // Add checked sectionGroups activities
                if (scope.view.state.uiState.checkedSectionGroupIds.length > 0) {
                    scope.view.state.uiState.checkedSectionGroupIds.forEach(function(sgId) {
                        if (sgId !== scope.view.state.uiState.selectedSectionGroupId) {
                            var unstyledEvents = sectionGroupToActivityEvents(scope.view.state.sectionGroups.list[sgId]);
                            calendarActivities = calendarActivities.concat(
                                styleCalendarEvents(unstyledEvents)
                            );
                        }
                    });
                }

                return calendarActivities;
            };

            var activityToEvents = function(activity, title) {
                var calendarActivities = [];
                if (activity.startTime && activity.endTime) {
                    var dayArray = activity.dayIndicator.split('');

                    var start = activity.startTime.split(':').map(Number);
                    var end = activity.endTime.split(':').map(Number);

                    dayArray.forEach(function(d, i) {
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

            var teachingCallResponseToEvents = function(teachingCallResponse, title) {
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
                                teachingCallResponseId: teachingCallResponse.id
                            });
                            unavailabilityStart = null;
                        }
                    }
                }

                return calendarUnavailabilities;
            };

            var sectionGroupToActivityEvents = function(sectionGroup) {
                var calendarActivities = [];
                var title = getCourseTitleByCourseId(sectionGroup.courseId);

                if (sectionGroup.sharedActivityIds) {
                    sectionGroup.sharedActivityIds.forEach(function(sharedActivityId) {
                        calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[sharedActivityId], title));
                    });
                }
                if (sectionGroup.sectionIds) {
                    sectionGroup.sectionIds.forEach(function(sectionId) {
                        var section = scope.view.state.sections.list[sectionId];
                        if (section.activityIds) {
                            section.activityIds.forEach(function(activityId) {
                                calendarActivities = calendarActivities.concat(activityToEvents(scope.view.state.activities.list[activityId], title));
                            });
                        }
                    });
                }

                return calendarActivities;
            };

            var sectionGroupToUnavailabilityEvents = function(sectionGroup) {
                var calendarActivities = [];

                if (sectionGroup.teachingCallResponseIds) {
                    sectionGroup.teachingCallResponseIds.forEach(function(trId) {
                        var teachingCallResponse = scope.view.state.teachingCallResponses.list[trId];
                        var instructor = scope.view.state.instructors.list[teachingCallResponse.instructorId];
                        var instructorName = instructor ? instructor.fullName : "Unknown Instructor";
                        calendarActivities = calendarActivities.concat(teachingCallResponseToEvents(teachingCallResponse, instructorName));
                    });
                }

                return calendarActivities;
            };

            var styleCalendarEvents = function(calendarActivities, backgroundColor, textColor) {
                calendarActivities.forEach(function(event) {
                    event.color = (scope.view.state.uiState.selectedActivityId === event.activityId) ? highlightedEventBackgroundColor : backgroundColor;
                    event.textColor = textColor ? textColor : defaultEventTextColor;
                });
                return calendarActivities;
            };

            var getCourseTitleByCourseId = function(courseId) {
                var course = scope.view.state.courses.list[courseId];
                return course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern;
            };

            var getUnavailabilities = function() {
                var calendarActivities = [];

                // Add Selected sectionGroup unavailabilities
                if (scope.view.state.uiState.selectedSectionGroupId) {
                    var unstyledEvents = sectionGroupToUnavailabilityEvents(scope.view.state.sectionGroups.list[scope.view.state.uiState.selectedSectionGroupId]);
                    calendarActivities = styleCalendarEvents(unstyledEvents, unavailabilityEventBackgroundColor, unavailabilityEventTextColor);
                }

                return calendarActivities;
            };


            $rootScope.$on("schedulingStateChanged", function(event, data) {
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