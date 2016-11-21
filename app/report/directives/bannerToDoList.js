/**
 * example:
 * <banner-to-do-list list-items="toDoItems"></banner-to-do-list>
 */
reportApp.directive("bannerToDoList", this.bannerToDoList = function ($rootScope, reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'bannerToDoList.html',
		scope: true,
		replace: true,
		link: function (scope, element, attrs) {
			scope.view = {
				listItems: []
			};

			scope.toggleBannerToDoItem = function (item) {
				reportActionCreators.toggleBannerToDoItem(
					item.sectionId,
					item.sectionProperty,
					item.childUniqueKey,
					item.childProperty);
			};

			$rootScope.$on('reportStateChanged', function (event, data) {
				// Empty the current list to rescan/rebuild
				scope.view.listItems.length = 0;

				data.state.sections.ids.forEach(function (id) {
					var section = data.state.sections.list[id];
					var changeItem = {};

					// The entire section
					if (section.isToDo) {
						changeItem = {
							sectionId: section.id
						};

						var activities = section.activities.length ? ", and the following meeting(s):<ul>" : "";
						section.activities.forEach(function (activity) {
							var activityDetails = getActivityDetails(activity);
							activities += "<li>" + activity.typeCode.getActivityCodeDescription() + activityDetails + "</li>";
						});
						activities += "</ul>";
						var instructors = section.instructors.length ? "(" + section.instructors.map(function (i) { return i.firstName + " " + i.lastName; }).join(", ") + ")" : "";
						changeItem.description = "Create " + section.subjectCode + " " + section.courseNumber + " section " +
							section.sequenceNumber + " with " + section.seats + " seats " + instructors + activities;

						scope.view.listItems.push(changeItem);
					}


					// Direct properties
					if (section.dwChanges) {
						Object.keys(section.dwChanges).filter(function (propName) {
							return section.dwChanges[propName].isToDo;
						}).forEach(function (propName) {
							changeItem = {
								sectionId: section.id,
								sectionProperty: propName
							};

							var crn = section.crn ? " (" + section.crn + ")" : "";
							changeItem.description = "Change " + section.subjectCode + " " + section.courseNumber + " section " +
								section.sequenceNumber + crn + " " + getHumanName(propName) + " from " + section.dwChanges[propName].value + " to " + section[propName];

							scope.view.listItems.push(changeItem);
						});
					}

					// Whole child objects (activities & instructors)

					// Instructors
					if (section.instructors instanceof Array) {
						section.instructors.filter(function (instructor) {
							return instructor.isToDo;
						}).forEach(function (instructor) {
							changeItem = {
								sectionId: section.id,
								sectionProperty: "instructors",
								childUniqueKey: instructor.uniqueKey
							};

							if (instructor.noRemote) {
								// TODO: Need to assign instructor to all sibling sections
								changeItem.description = "Assign " + instructor.firstName + " " + instructor.lastName + " to " +
									section.subjectCode + " " + section.courseNumber + " - " + getPattern(section.sequenceNumber);

								scope.view.listItems.push(changeItem);
							} else if (instructor.noLocal) {
								// TODO: Need to assign instructor to all sibling sections
								changeItem.description = "Unassign " + instructor.firstName + " " + instructor.lastName + " from " +
									section.subjectCode + " " + section.courseNumber + " - " + getPattern(section.sequenceNumber);

								scope.view.listItems.push(changeItem);
							}
						});
					}

					// Activities
					if (section.activities instanceof Array) {
						section.activities.filter(function (activity) {
							return activity.isToDo;
						}).forEach(function (activity) {
							// Construct activity details
							var activityDetails = getActivityDetails(activity);
							changeItem = {
								sectionId: section.id,
								sectionProperty: "activities",
								childUniqueKey: activity.uniqueKey
							};

							if (activity.noRemote) {
								changeItem.description = "Create " + activity.typeCode.getActivityCodeDescription() + activityDetails + " for " +
									section.subjectCode + " " + section.courseNumber + " section " + section.sequenceNumber;
								scope.view.listItems.push(changeItem);
							} else if (activity.noLocal) {
								changeItem.description = "Remove " + activity.typeCode.getActivityCodeDescription() + activityDetails + " from " +
									section.subjectCode + " " + section.courseNumber + " section " + section.sequenceNumber;
								scope.view.listItems.push(changeItem);
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
								changeItem = {
									sectionId: section.id,
									sectionProperty: "activities",
									childUniqueKey: activity.uniqueKey,
									childProperty: propName
								};

								if (propName == "dayIndicator") {
									oldValue = oldValue.getWeekDays() || 'none';
									newValue = newValue.getWeekDays() || 'none';
								} else if (propName == "startTime" || propName == "endTime") {
									oldValue = oldValue.toStandardTime();
									newValue = newValue.toStandardTime();
								}

								changeItem.description = "Change " + section.subjectCode + " " + section.courseNumber + " section " +
									section.sequenceNumber + crn + " " + activity.typeCode.getActivityCodeDescription() + " " + getHumanName(propName) +
									" from " + oldValue + " to " + newValue;

								scope.view.listItems.push(changeItem);
							});
						});
					}

				});

			});

			function getPattern(sequenceNumber) {
				var firstChar = sequenceNumber.slice(0, 1);
				if (isLetter(firstChar)) {
					return firstChar.toUpperCase() + " Series";
				} else {
					return sequenceNumber;
				}
			}

			function getActivityDetails(activity) {
				var activityDetailsArr = [];
				if (activity.dayIndicator && parseInt(activity.dayIndicator)) { activityDetailsArr.push(activity.dayIndicator.getWeekDays()); }
				if (activity.startTime) { activityDetailsArr.push(activity.startTime.toStandardTime()); }
				if (activity.endTime) { activityDetailsArr.push(activity.endTime.toStandardTime()); }
				if (activity.bannerLocation) { activityDetailsArr.push(activity.bannerLocation); }
				return activityDetailsArr.length ? ": " + activityDetailsArr.join(" - ") + "" : "";
			}

			function getHumanName(property) {
				var map = {
					dayIndicator: "days",
					startTime: "start time",
					endTime: "end time"
				};
				return map[property] || property;
			}
		}
	};
});
