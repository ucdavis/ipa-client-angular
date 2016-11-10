/**
 * example:
 * <banner-to-do-list list-items="toDoItems"></banner-to-do-list>
 */
reportApp.directive("bannerToDoList", this.bannerToDoList = function ($rootScope) {
	return {
		restrict: "E",
		templateUrl: 'bannerToDoList.html',
		scope: true,
		replace: true,
		link: function (scope, element, attrs) {
			// Minimize by default
			element.addClass('sis-todo-minimized');
			scope.view = {
				isMinimized: true,
				listItems: []
			};

			var rerenderStateActions = [
				GET_TERM_COMPARISON_REPORT,
				ADD_BANNER_TODO
			];

			$rootScope.$on('reportStateChanged', function (event, data) {
				// Rerender only if on of the specified state actions
				if (rerenderStateActions.indexOf(data.action.type) < 0) { return; }

				// Empty the current list to rescan/rebuild
				scope.view.listItems.length = 0;

				data.state.sections.ids.forEach(function (id) {
					var section = data.state.sections.list[id];

					// Direct properties
					if (section.dwChanges) {
						Object.keys(section.dwChanges).filter(function (propName) {
							return section.dwChanges[propName].isToDo;
						}).forEach(function (propName) {
							var crn = section.crn ? " (" + section.crn + ")" : "";
							scope.view.listItems.push("Change " + section.subjectCode + " " + section.courseNumber + " section " +
								section.sequenceNumber + crn + " " + propName + " from " + section.dwChanges[propName].value + " to " + section[propName]);
						});
					}

					// Whole child objects (activities & instructors)

					// Instructors
					if (section.instructors instanceof Array) {
						section.instructors.filter(function (instructor) {
							return instructor.isToDo;
						}).forEach(function (instructor) {
							if (instructor.noRemote) {
								// TODO: Need to assign instructor to all sibling sections
								scope.view.listItems.push("Assign " + instructor.firstName + " " + instructor.lastName + " to " +
									section.subjectCode + " " + section.courseNumber + " - " + getPattern(section.sequenceNumber));
							} else if (instructor.noLocal) {
								// TODO: Need to assign instructor to all sibling sections
								scope.view.listItems.push("Unassign " + instructor.firstName + " " + instructor.lastName + " from " +
									section.subjectCode + " " + section.courseNumber + " - " + getPattern(section.sequenceNumber));
							}
						});
					}

					// Activities
					if (section.activities instanceof Array) {
						section.activities.filter(function (activity) {
							return activity.isToDo;
						}).forEach(function (activity) {
							// Construct activity details
							var activityDetailsArr = [];
							if (activity.dayIndicator && parseInt(activity.dayIndicator)) { activityDetailsArr.push(activity.dayIndicator.getWeekDays()); }
							if (activity.startTime) { activityDetailsArr.push(activity.startTime.toStandardTime()); }
							if (activity.endTime) { activityDetailsArr.push(activity.endTime.toStandardTime()); }
							var activityDetails = activityDetailsArr.length ? " (" + activityDetailsArr.join(" - ") + ")" : "";

							if (activity.noRemote) {
								scope.view.listItems.push("Create " + activity.typeCode.getActivityCodeDescription() + activityDetails + " for " +
									section.subjectCode + " " + section.courseNumber + " section " + section.sequenceNumber);
							} else if (activity.noLocal) {
								scope.view.listItems.push("Remove " + activity.typeCode.getActivityCodeDescription() + activityDetails + " from " +
									section.subjectCode + " " + section.courseNumber + " section " + section.sequenceNumber);
							}
						});
					}

					// Child properties (dayIndicator, startTime, endTime, location)
					// Activities
					if (section.activities instanceof Array) {
						section.activities.filter(function (activity) {
							if (activity.dwChanges) {
								return Object.keys(activity.dwChanges).some(function (propName) {
									return activity.dwChanges[propName].isToDo;
								});
							}
						}).forEach(function (activity) {
							Object.keys(activity.dwChanges).filter(function (propName) {
								return activity.dwChanges[propName].isToDo;
							}).forEach(function (propName) {
								var crn = section.crn ? " (" + section.crn + ")" : "";
								var oldValue = activity.dwChanges[propName].value;
								var newValue = activity[propName];

								if (propName == "dayIndicator") {
									oldValue = oldValue.getWeekDays();
									newValue = newValue.getWeekDays();
								} else if (propName == "startTime" || propName == "endTime") {
									oldValue = oldValue.toStandardTime();
									newValue = newValue.toStandardTime();
								}

								scope.view.listItems.push("Change " + section.subjectCode + " " + section.courseNumber + " section " +
									section.sequenceNumber + crn + " " + activity.typeCode.getActivityCodeDescription() + " " + propName +
									" from " + oldValue + " to " + newValue);
							});
						});
					}

				});

			});

			scope.toggleView = function () {
				element.toggleClass('sis-todo-minimized');
				scope.viewMinimized = !scope.viewMinimized;
			};

			function getPattern(sequenceNumber) {
				var firstChar = sequenceNumber.slice(0, 1);
				if (isLetter(firstChar)) {
					return firstChar.toUpperCase() + " Series";
				} else {
					return sequenceNumber;
				}
			}
		}
	};
});
