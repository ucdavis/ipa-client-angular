/**
 * example:
 * <sync-action-list></sync-action-list>
 */
reportApp.directive("syncActionList", this.syncActionList = function ($rootScope, $log, reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'syncActionList.html',
		scope: true,
		replace: true,
		link: function (scope, element, attrs) {
			scope.view = {
				listItems: [],
				hasAccess: scope.sharedState.currentUser.isAdmin() ||
				scope.sharedState.currentUser.hasRole('academicPlanner', scope.sharedState.workgroup.id)
			};

			scope.deleteBannerToDoItem = function (item) {
				reportActionCreators.deleteBannerToDoItem(item);
			};

			scope.download = function () {
				var blob = new Blob([
					scope.view.listItems.map(function (li) {
						return '- ' + li.description
							.replace(/<\/?ul>|<\/li>?/g, '')
							.replace(/<li>?/g, '\r\n  - ');
					}).join('\r\n\r\n')
				], {
						type: "text/plain;charset=utf-8;",
					});
				saveAs(blob, "banner-to-do.txt");
			};

			$rootScope.$on('reportStateChanged', function (event, data) {

				// Empty the current list to rescan/rebuild
				scope.view.listItems.length = 0;

				data.state.syncActions.ids.forEach(function (id) {
					var syncAction = data.state.syncActions.list[id];
					var section = data.state.sections.list[syncAction.sectionId];
					var activity;

					if (syncAction.sectionProperty && syncAction.childUniqueKey && syncAction.childProperty) {
						// Child property isTodo (examples: update dayIndicator, startTime...)
						activity = section.activities.find(function (a) { return a.uniqueKey == syncAction.childUniqueKey; });
						if (!(activity.dwChanges && activity.dwChanges[syncAction.childProperty])) {
							$log.debug("Activity with uniqueKey " + syncAction.childUniqueKey + " property (" + syncAction.childProperty + ") no longer differs");
							return;
						}
						var oldValue = activity.dwChanges[syncAction.childProperty].value;
						var newValue = activity[syncAction.childProperty];

						if (syncAction.childProperty == "dayIndicator") {
							oldValue = oldValue.getWeekDays() || 'none';
							newValue = newValue.getWeekDays() || 'none';
						} else if (syncAction.childProperty == "startTime" || syncAction.childProperty == "endTime") {
							oldValue = oldValue.toStandardTime() || 'none';
							newValue = newValue.toStandardTime() || 'none';
						} else {
							$log.debug("Unknown child property in a syncAction", syncAction.childProperty);
						}

						var crn = section.crn ? " (" + section.crn + ")" : "";
						syncAction.description = "Change " + section.subjectCode + " " + section.courseNumber + " section " +
							section.sequenceNumber + crn + " " + activity.typeCode.getActivityCodeDescription() + " " + getHumanName(syncAction.childProperty) +
							" from " + oldValue + " to " + newValue;

						scope.view.listItems.push(syncAction);
					} else if (syncAction.sectionProperty && syncAction.childUniqueKey) {
						// Child isTodo (examples: add/remove entire instructor/activity)
						if (syncAction.sectionProperty == "instructors") {
							// Instructors
							var instructor = section.instructors.find(function (i) {
								var keyMatches = (i.uniqueKey == syncAction.childUniqueKey);
								var hasChanges = (i.noLocal || i.noRemote);
								return keyMatches && hasChanges;
							});

							if (instructor.noRemote) {
								// TODO: Need to assign instructor to all sibling sections
								syncAction.description = "Assign " + instructor.firstName + " " + instructor.lastName + " to " +
									section.subjectCode + " " + section.courseNumber + " - " + getPattern(section.sequenceNumber);

								scope.view.listItems.push(syncAction);
							} else if (instructor.noLocal) {
								// TODO: Need to assign instructor to all sibling sections
								syncAction.description = "Unassign " + instructor.firstName + " " + instructor.lastName + " from " +
									section.subjectCode + " " + section.courseNumber + " - " + getPattern(section.sequenceNumber);

								scope.view.listItems.push(syncAction);
							}
						} else if (syncAction.sectionProperty == "activities") {
							// Activities
							activity = section.activities.find(function (a) {
								var keyMatches = (a.uniqueKey == syncAction.childUniqueKey);
								var hasChanges = (a.noLocal || a.noRemote);
								return keyMatches && hasChanges;
							});
							if (!activity) {
								$log.debug("Activity with uniqueKey " + syncAction.childUniqueKey + " no longer exists in section " + section.uniqueKey);
								return;
							}
							var activityDetails = getActivityDetails(activity);

							if (activity.noRemote) {
								syncAction.description = "Create " + activity.typeCode.getActivityCodeDescription() + activityDetails + " for " +
									section.subjectCode + " " + section.courseNumber + " section " + section.sequenceNumber;
								scope.view.listItems.push(syncAction);
							} else if (activity.noLocal) {
								syncAction.description = "Remove " + activity.typeCode.getActivityCodeDescription() + activityDetails + " from " +
									section.subjectCode + " " + section.courseNumber + " section " + section.sequenceNumber;
								scope.view.listItems.push(syncAction);
							}
						} else {
							$log.debug("Unknown section property in a syncAction", syncAction.sectionProperty);
						}
					} else if (syncAction.sectionProperty) {
						// Section property as todo (example: update seats)
						if (!(section.dwChanges && section.dwChanges[syncAction.sectionProperty])) {
							$log.debug("Section with uniqueKey " + section.uniqueKey + " property (" + syncAction.sectionProperty + ") no longer differs");
							return;
						}
						var crn = section.crn ? " (" + section.crn + ")" : "";
						syncAction.description = "Change " + section.subjectCode + " " + section.courseNumber + " section " +
							section.sequenceNumber + crn + " " + getHumanName(syncAction.sectionProperty) + " from " +
							section.dwChanges[syncAction.sectionProperty].value + " to " + section[syncAction.sectionProperty];

						scope.view.listItems.push(syncAction);
					} else {
						// The section itself is a todo
						var activities = section.activities.length ? ", and the following meeting(s):<ul>" : "";
						section.activities.forEach(function (activity) {
							var activityDetails = getActivityDetails(activity);
							activities += "<li>" + activity.typeCode.getActivityCodeDescription() + activityDetails + "</li>";
						});
						activities += "</ul>";
						var instructors = section.instructors.length ? "(" + section.instructors.map(function (i) { return i.firstName + " " + i.lastName; }).join(", ") + ")" : "";
						syncAction.description = "Create " + section.subjectCode + " " + section.courseNumber + " section " +
							section.sequenceNumber + " with " + section.seats + " seats " + instructors + activities;

						scope.view.listItems.push(syncAction);
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
