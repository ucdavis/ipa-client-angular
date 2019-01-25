import { _array_sortByProperty } from 'shared/helpers/array';

/**
 * Provides the main course table in the Courses View
 */
let instructorAssignmentTable = function ($rootScope, AssignmentActionCreators, AuthService, $routeParams) {
	return {
		restrict: 'A',
		scope: {
			state: '=',
			showInstructorUndeterminedTable: '=',
			instructorTypeId: '=',
			sharedState: '=',
			openCommentModal: '&?',
			openUnavailabilityModal: '&?'
		},
		link: function (scope, element) {
			scope.sharedState = scope.sharedState || AuthService.getSharedState();
			scope.workgroupId = $routeParams.workgroupId;
			scope.year = $routeParams.year;

			scope.view = {};
			scope.view.state = scope.state;

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				scope.view.state = data;
				scope.renderTable();
			});

			// Filter instructors with assignmentsCompleted if filter is active
			scope.showCompletedInstructor = function (instructor) {
				var scheduleInstructorNote = scope.view.state.scheduleInstructorNotes.list[instructor.scheduleInstructorNoteId];
				var assignmentsCompleted = false;
				if (scheduleInstructorNote) {
					assignmentsCompleted = scheduleInstructorNote.assignmentsCompleted;
				}
				if (scope.view.state.filters.showCompletedInstructors && assignmentsCompleted) {
					return false;
				}

				return true;
			};

			scope.userCanEdit = function () {
				var hasAuthorizedRole = scope.sharedState.currentUser.isAdmin() ||
					scope.sharedState.currentUser.hasRole('academicPlanner', scope.sharedState.workgroup.id);

					return hasAuthorizedRole;
			};

			scope.isValidCourseBased = function(teachingAssignment) {
				if (!teachingAssignment) {
					return false;
				}

				// Is it sectionGroup based?
				if (teachingAssignment.sectionGroupId != 0) {
					return true;
				}

				// Is it suggested?
				if (teachingAssignment.suggestedSubjectCode
					&& teachingAssignment.suggestedSubjectCode.length > 0
					&& teachingAssignment.suggestedCourseNumber
					&& teachingAssignment.suggestedCourseNumber.length > 0) {
					return true;
				}

				// Is it non-course based?
				if (teachingAssignment.buyout == true
				|| teachingAssignment.sabbatical == true
				|| teachingAssignment.courseRelease == true
				|| teachingAssignment.workLifeBalance == true
				|| teachingAssignment.leaveOfAbsence == true
				|| teachingAssignment.sabbaticalInResidence == true
				|| teachingAssignment.inResidence == true) {
					return true;
				}

				return false;
			};

			scope.findOrCreateScheduleInstructorNote = function (instructorId) {
				let instructorNote = scope.view.state.scheduleInstructorNotes.byInstructorId[instructorId];

				if (instructorNote) { return instructorNote; }

				return {
					scheduleId: scope.view.state.userInterface.scheduleId,
					instructorId: instructorId,
					instructorComment: ""
				};
			};

			scope.getUserByLoginId = function (loginId) {
				var users = scope.view.state.users;
				for (var i = 0; i < users.ids.length; i++) {
					var user = users.list[users.ids[i]];
					if (user.loginId == loginId) {
						return user;
					}
				}
				return null;
			};

			// Build a string of html to display a column header (course, terms, etc.)
			scope.renderHeader = function () {
				// Render the header
				var header = "<div class=\"course-list-row\">";
				header += "<div class=\"course-header course-description-cell\"></div>";

				if (scope.view.state.userInterface.enabledTerms) {
					$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) { // eslint-disable-line no-undef

						var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];
						header += "<div class=\"term-header term-cell\">" + termCode.getTermCodeDisplayName(true) + "</div>";
					});
				}

				header += "</div>";

				return header;
			};

			scope.isNonCourseBasedAssignment = function (teachingAssignment) {
				return (teachingAssignment.buyout
				|| teachingAssignment.courseRelease
				|| teachingAssignment.inResidence
				|| teachingAssignment.workLifeBalance
				|| teachingAssignment.leaveOfAbsence
				|| teachingAssignment.sabbaticalInResidence
				|| teachingAssignment.sabbatical);
			};

			scope.sortCourses = function (array) {
				var sortedArray = _.sortBy(array, function (sectionGroupId) { // eslint-disable-line no-undef
					var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
					var course = scope.view.state.courses.list[sectionGroup.courseId];

					return course.subjectCode + course.courseNumber + course.sequencePattern;
				});
				return sortedArray;
			};

			scope.renderTable = function () {
				// If courses is undefined do nothing
				// The app is in the process of re-routing to a valid url
				if (!scope.view.state.courses) { return; }

				// Clear the table
				$('.tooltip').remove(); // eslint-disable-line no-undef
				element.empty();

				var coursesHtml = "";

				if (scope.showInstructorUndeterminedTable == true) {
					var unassignedTermCodes = {};

					scope.view.state.sectionGroups.ids.forEach(function(sectionGroupId) {
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						if (!sectionGroup.isAssigned) {
							// Scaffold assignments array if this is the first in the termCode
							if (!unassignedTermCodes[sectionGroup.termCode]) {
								unassignedTermCodes[sectionGroup.termCode] = [];
							}

							unassignedTermCodes[sectionGroup.termCode].push(sectionGroup.id);
						}
					});

					var theStaffLength = _.keys(scope.view.state.theStaff.termCodes).length; // eslint-disable-line no-undef
					var unassignedLength = _.keys(unassignedTermCodes).length; // eslint-disable-line no-undef

					if ((theStaffLength == 0) && (unassignedLength == 0)) {
						// Nothing to show for 'Instructors TBD'
						return;
					}

					var instructorTypeHeader = '<div class="type-header"><h5>Instructors TBD</h5></div>';
					element.append(instructorTypeHeader);

					var header = scope.renderHeader();
					element.append(header);

					if (theStaffLength > 0) {
						coursesHtml += "<div class=\"course-list-row\">";
						coursesHtml += "<div class=\"description-cell\">";
						coursesHtml += "<div>";
						coursesHtml += "<span style=\"margin-right:5px;\"></span>";

						// Instructor assignmentCompleted UI
						coursesHtml += "<div><strong>The Staff</strong></div>";

						// Instructor Comment UI
						coursesHtml += "<div class=\"description-cell__comment-btn-container hidden-print\"></div>";

						// If they don't have any teachingCallResponses, there won't be any unavailabilities to show
						coursesHtml += "<div class=\"description-cell__avail-btn-container\"></div>";
						coursesHtml += "</div>";
						coursesHtml += "</div>"; // end description-cell

							// Loop over active terms
							$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) { // eslint-disable-line no-undef
								var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];

								coursesHtml += "<div class=\"term-cell\">";

								// Loop over sectionGroups within a term
								if (scope.view.state.theStaff.termCodes[termCode]) {
									var sortedTheStaff = scope.sortCourses(scope.view.state.theStaff.termCodes[termCode]);

									sortedTheStaff.forEach(function(sectionGroupId) {
										var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
										var displayTitle = "";
										var plannedSeatsHtml = "";
										var unitsLow = "";

										var course = scope.view.state.courses.list[sectionGroup.courseId];

										displayTitle += course.subjectCode + " " + course.courseNumber + "-" + course.sequencePattern;
										var plannedSeats = sectionGroup.plannedSeats || "0";
										plannedSeatsHtml = "<small>Seats: " + plannedSeats + "</small>";
										unitsLow = "<small>Units: " + course.unitsLow + "</small>";

										coursesHtml += "<div class=\"alert alert-info tile-assignment\">";
										coursesHtml += "<p>" + displayTitle + "</p>";
										coursesHtml += "<div class=\"tile-assignment-details\">";
										coursesHtml += plannedSeatsHtml;
										coursesHtml += "<br />";
										coursesHtml += unitsLow;
										coursesHtml += "</div>";

										var popoverTemplate = "Are you sure you want to delete this assignment? <br /><br />" +
											"<div class='text-center'><button class='btn btn-red' data-event-type='removeTheStaff' data-section-group-id='" + sectionGroup.id + "'>Delete</button>" +
											"<button class='btn btn-white' data-event-type='dismissRemoveTheStaffPop'>Cancel</button></div>";

										coursesHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary hidden-print\"";
										coursesHtml += " data-section-group-id=\"" + sectionGroup.id + "\" data-event-type=\"removeTheStaffPop\" " +
											"data-toggle=\"popover\" data-placement='left' data-html=\"true\" data-content=\"" + popoverTemplate + "\"></i>";

										coursesHtml += "</div>";
									});
								}
								coursesHtml += "</div>"; // Ending term-cell div
							});
						coursesHtml += "</div>"; // Ending course-row div
					}
					if (unassignedLength > 0) {
						coursesHtml += "<div class=\"course-list-row\">";
						coursesHtml += "<div class=\"description-cell\">";
						coursesHtml += "<div>";
						coursesHtml += "<span style=\"margin-right:5px;\"></span>";

						// Instructor assignmentCompleted UI
						coursesHtml += "<div><strong>Unassigned</strong></div>";

						// Instructor Comment UI
						coursesHtml += "<div class=\"description-cell__comment-btn-container hidden-print\"></div>";

						// If they don't have any teachingCallResponses, there won't be any unavailabilities to show
						coursesHtml += "<div class=\"description-cell__avail-btn-container\"></div>";
						coursesHtml += "</div>";
						coursesHtml += "</div>"; // end description-cell

						// Loop over active terms
						$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) { // eslint-disable-line no-undef
							var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];
							var sortedUnassigned = scope.sortCourses(unassignedTermCodes[termCode]);

							coursesHtml += "<div class=\"term-cell\">";

							sortedUnassigned.forEach(function(sectionGroupId) {
								var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];

								if (sectionGroup.termCode != termCode) { return; }
								if (sectionGroup.isAssigned == true) { return; }

								var displayTitle = "";
								var plannedSeatsHtml = "";
								var unitsLow = "";

								var course = scope.view.state.courses.list[sectionGroup.courseId];

								displayTitle += course.subjectCode + " " + course.courseNumber + "-" + course.sequencePattern;
								var plannedSeats = sectionGroup.plannedSeats || "0";
								plannedSeatsHtml = "<small>Seats: " + plannedSeats + "</small>";
								unitsLow = "<small>Units: " + course.unitsLow + "</small>";

								coursesHtml += "<div class=\"alert alert-info tile-assignment\">";
								coursesHtml += "<p>" + displayTitle + "</p>";
								coursesHtml += "<div class=\"tile-assignment-details\">";
								coursesHtml += plannedSeatsHtml;
								coursesHtml += "<br />";
								coursesHtml += unitsLow;
								coursesHtml += "</div>";
								coursesHtml += "</div>";
							});
							coursesHtml += "</div>"; // Ending term-cell div
						});
						coursesHtml += "</div>"; // Ending course-row div
					}
				} else {
					if (!scope.instructorTypeId) { return; }

					var relevantInstructors = 0;

					$.each(scope.view.state.instructors.ids, function (i, instructorId) { // eslint-disable-line no-undef
						var instructor = scope.view.state.instructors.list[instructorId];

						if (scope.instructorTypeId == instructor.instructorTypeId) {
							relevantInstructors += 1;
						}
					});

					if (relevantInstructors == 0) { return; }

					var instructorTypeHeader = "";

					if (scope.view.state.instructorTypes.list[scope.instructorTypeId]) {
						var instructorType = scope.view.state.instructorTypes.list[scope.instructorTypeId].description;

						if (instructorType == "Emeriti - Recalled" || instructorType == "Ladder Faculty" || instructorType == "Lecturer SOE") {
							instructorTypeHeader = '<div class="type-header"><h5>' + instructorType + '</h5></div>';
						}
						else {
							instructorTypeHeader = '<div class="type-header"><h5>' + instructorType + 's' + '</h5></div>';
						}
					}

					element.append(instructorTypeHeader);

					// Render the header
					var header = scope.renderHeader();
					element.append(header);

					var rowsSinceHeaderWasAdded = 0;

					// Display message if table is empty
					if (scope.view.state.courses.ids == 0) {
						coursesHtml += "<div class=\"course-list-row\">";
						coursesHtml += "<div class=\"course-description-cell empty-table-message\">";
						coursesHtml += "No courses have been added to the schedule";
						coursesHtml += "</div>";
					} else {
						// Loop over instructors
						$.each(scope.view.state.instructors.ids, function (i, instructorId) { // eslint-disable-line no-undef
							var instructor = scope.view.state.instructors.list[instructorId];

							if (scope.instructorTypeId != instructor.instructorTypeId) { return; }

							if (instructor.isFiltered === false && scope.showCompletedInstructor(instructor)) {
								var scheduleInstructorNote = scope.view.state.scheduleInstructorNotes.list[instructor.scheduleInstructorNoteId];
								var teachingCallReceipt = scope.view.state.teachingCallReceipts.list[instructor.teachingCallReceiptId];

								var courseHtml = "";
								courseHtml += "<div class=\"course-list-row\">";
								courseHtml += "<div class=\"description-cell\">";
								courseHtml += "<div>";

								courseHtml += "<span style=\"margin-right:5px;\">";

								// Instructor assignmentCompleted UI
								courseHtml += "<i class=\"glyphicon";
								if (scheduleInstructorNote && scheduleInstructorNote.assignmentsCompleted) {
									courseHtml += " glyphicon-check";
								} else {
									courseHtml += " glyphicon-unchecked";
								}
								courseHtml += " assignments-complete clickable\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"Toggle completed assigning instructor\" data-container=\"body\"";
								courseHtml += " data-instructor-id=" + instructor.id + " data-schedule-instructor-note-id=" + instructor.scheduleInstructorNoteId + "></i>";
								courseHtml += "</span>";
								courseHtml += "<div class=\"instructor-title\">";
								if (instructor) {
									courseHtml += instructor.fullName;
								}

								courseHtml += "</div>";

								// Instructor Comment UI
								var teachingCallReceipt = scope.view.state.teachingCallReceipts.list[instructor.teachingCallReceiptId];
								var comment = teachingCallReceipt ? teachingCallReceipt.comment : null;

								courseHtml += "<div class=\"description-cell__comment-btn-container hidden-print\">";
								if (comment) {
									// Instructor Availabilities UI
									courseHtml += "<i class=\"glyphicon comment-btn glyphicon-comment\" data-instructor-id=" + instructor.id;
									courseHtml += " data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"Instructor comments\" data-container=\"body\"></i>";
								} else {
									courseHtml += "<div data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"No comments\" data-container=\"body\">";
									courseHtml += "<i class=\" disabled-calendar glyphicon glyphicon-comment hidden-print\"></i></div>";
								}

								courseHtml += "</div>";

								// If they don't have any teachingCallResponses, there won't be any unavailabilities to show
								courseHtml += "<div class=\"description-cell__avail-btn-container\">";

								if (instructor.teachingCallResponses.length > 0) {
									// Instructor Availabilities UI
									courseHtml += "<i class=\"glyphicon avail-btn glyphicon-calendar hidden-print\" data-instructor-id=" + instructor.id;
									courseHtml += " data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"Instructor unavailabilities\" data-container=\"body\"></i>";
								} else {
									courseHtml += "<div data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"No unavailabilities\" data-container=\"body\">";
									courseHtml += "<i class=\" disabled-calendar glyphicon glyphicon-calendar hidden-print\"></i>";
									courseHtml += "</div>";
								}

								courseHtml += "</div>";
								courseHtml += "</div>";

								// Instructor TeachingCall submitted preferences checkmark
								if (teachingCallReceipt && teachingCallReceipt.isDone) {
									courseHtml += "<div style=\"color:#B3B3B3; display: flex;\">";
									courseHtml += "Preferences Submitted";
									courseHtml += "</div>";
								}

								var scheduleInstructorNote = scope.findOrCreateScheduleInstructorNote(instructorId);
								// Add input for instructor notes
								courseHtml += '<hr />';
								courseHtml += "<div class='course-assignments__course-note hidden-print'>";
								courseHtml += '<textarea maxlength="750" class="form-control add-note__text-area" placeholder="Add Note" data-schedule-instructor-note-id="' + scheduleInstructorNote.id + '" data-instructor-id="' + instructor.id + '" data-schedule-id="' + scope.view.state.userInterface.scheduleId + '" data-event-type="setScheduleInstructorNote">' + scheduleInstructorNote.instructorComment + '</textarea>';
								courseHtml += "</div>";

								courseHtml += "<div class='visible-print'>";
								courseHtml += scheduleInstructorNote.instructorComment || "";
								courseHtml += "</div>";

								courseHtml += "</div>"; // end description-cell

								// Loop over active terms
								$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) { // eslint-disable-line no-undef
									var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];

									courseHtml += "<div class=\"term-cell\">";

									// Loop over teachingAssignments within a term
									$.each(scope.view.state.instructors.list[instructor.id].teachingAssignmentTermCodeIds[termCode], function (j, teachingAssignmentId) { // eslint-disable-line no-undef
										// Ensure it is approved already
										if (scope.view.state.teachingAssignments.list[teachingAssignmentId].approved) {
											var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
											var sectionGroup = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];
											var displayTitle = "";
											var plannedSeatsHtml = "";
											var unitsLow = "";
											var subTitle = "";

											if (sectionGroup) {
												var course = scope.view.state.courses.list[sectionGroup.courseId];
												if (course) {
													displayTitle += '<span><span class="instructor-assignment-table__course-definition">' + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + '</span> <span class="instructor-assignment-table__course-title">' + '' + "</span></span>";
													subTitle = course.title;
													var plannedSeats = sectionGroup.plannedSeats || "0";
													plannedSeatsHtml = "<small>Seats: " + plannedSeats + "</small>";
													unitsLow = "<small>Units: " + course.unitsLow + "</small>";
												}
											} else {
												if (teachingAssignment.buyout) {
													displayTitle += "BUYOUT";
												} else if (teachingAssignment.courseRelease) {
													displayTitle += "COURSE RELEASE";
												} else if (teachingAssignment.inResidence) {
													displayTitle += "IN RESIDENCE";
												} else if (teachingAssignment.workLifeBalance) {
													displayTitle += "WORK LIFE BALANCE";
												} else if (teachingAssignment.leaveOfAbsence) {
													displayTitle += "LEAVE OF ABSENCE";
												} else if (teachingAssignment.sabbaticalInResidence) {
													displayTitle += "SABBATICAL IN RESIDENCE";
												} else if (teachingAssignment.sabbatical) {
													displayTitle += "SABBATICAL";
												}
											}

											if (firstInterestedCourseAdded) {
												courseHtml += "<li><div class=\"dropdown-assign-header\">Other</div></li>";
											}

											if (displayTitle.replace(/ /g, '').length == 0) {
												displayTitle += teachingAssignment.suggestedSubjectCode + " " + teachingAssignment.suggestedCourseNumber + " - 001 - " + teachingAssignment.suggestedTitle;
												plannedSeatsHtml = "<small>Seats: 0</small>";
												unitsLow = "<small>Units: 4</small>";
											}
											courseHtml += "<div class=\"alert alert-info tile-assignment";

											if (scope.isNonCourseBasedAssignment(teachingAssignment)) {
												courseHtml += " non-course-assignment";
											}

											courseHtml += "\">";
											courseHtml += "<p class='instructors-table__preference-title'>" + displayTitle;

											if (scope.userCanEdit()) {
												var popoverTemplate = "Are you sure you want to delete this assignment? <br /><br />" +
													"<div class='text-center'><button class='btn btn-red' data-event-type='deleteAssignment' data-teaching-assignment-id='" + teachingAssignment.id + "'>Delete</button>" +
													"<button class='btn btn-white' data-event-type='dismissDeleteAssignmentPop'>Cancel</button></div>";

												courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary hidden-print\"";
												courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\" data-event-type=\"deleteAssignmentPop\" " +
													"data-toggle=\"popover\" data-placement='left' data-html=\"true\" data-content=\"" + popoverTemplate + "\"></i>";
											}
											courseHtml += "</p>";
											courseHtml += '<div class="instructor-assignment-table__course-title">' + subTitle + '</div>';
											courseHtml += "<div class=\"tile-assignment-details\">";
											courseHtml += plannedSeatsHtml;
											courseHtml += "<br />";
											courseHtml += unitsLow;
											courseHtml += "</div>";

											courseHtml += "</div>";
										}
									});

									if (scope.userCanEdit()) {
										// Add an assign button to add more instructors
										courseHtml += "<div class=\"dropdown assign-dropdown hidden-print\">";
										courseHtml += "<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">";
										courseHtml += "Assign..<span class=\"caret\"></span></button>";
										courseHtml += "<ul class=\"dropdown-menu assign-instructor-dropdown scrollable-menu\" aria-labelledby=\"dropdownMenu1\">";

										// Track courses that were already present in 'interested', and should be filtered from 'other'
										var interestedCourseIds = [];
										var firstInterestedCourseAdded = false;
										var firstCourseInGroup = [];
										var nonCoursePreferences = {buyout: false, sabbatical: false, inResidence: false, workLifeBalance: false, leaveOfAbsence: false, courseRelease: false, sabbaticalInResidence: false};

										// If the instructor has teachingAssignments in this term, show them first
										if (instructor.teachingAssignmentTermCodeIds[termCode] && instructor.teachingAssignmentTermCodeIds[termCode].length > 0) {
											var currentTermTeachingAssignments = instructor.teachingAssignmentTermCodeIds[termCode].map(function (teachingAssignmentId) {
												return scope.view.state.teachingAssignments.list[teachingAssignmentId];
											});
											var currentTermTeachingAssignmentsByPriority = _array_sortByProperty(currentTermTeachingAssignments, 'adjustedPriority');

											$.each(currentTermTeachingAssignmentsByPriority, function (i, teachingAssignment) { // eslint-disable-line no-undef
												var sectionGroup = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];

												// This teachingAssignment is a buyout/sabb/release
												if ((teachingAssignment.buyout || teachingAssignment.courseRelease || teachingAssignment.inResidence || teachingAssignment.workLifeBalance || teachingAssignment.leaveOfAbsence || teachingAssignment.sabbaticalInResidence || teachingAssignment.sabbatical)) {
													let preferenceDisplayText = "";

													if (teachingAssignment.buyout) {
														preferenceDisplayText = "Buyout";
														nonCoursePreferences.buyout = true;
													} else if (teachingAssignment.courseRelease) {
														preferenceDisplayText = "Course Release";
														nonCoursePreferences.courseRelease = true;
													} else if (teachingAssignment.inResidence) {
														preferenceDisplayText = "In Residence";
														nonCoursePreferences.inResidence = true;
													} else if (teachingAssignment.workLifeBalance) {
														preferenceDisplayText = "Work Life Balance";
														nonCoursePreferences.workLifeBalance = true;
													} else if (teachingAssignment.leaveOfAbsence) {
														preferenceDisplayText = "Leave of Absence";
														nonCoursePreferences.leaveOfAbsence = true;
													} else if (teachingAssignment.sabbaticalInResidence) {
														preferenceDisplayText = "Sabbatical In Residence";
														nonCoursePreferences.sabbaticalInResidence = true;
													} else if (teachingAssignment.sabbatical) {
														preferenceDisplayText = "Sabbatical";
														nonCoursePreferences.sabbatical = true;
													}

													if (firstInterestedCourseAdded === false) {
														courseHtml += "<li><div class=\"dropdown-assign-header\">Preferred</div></li>";
														firstInterestedCourseAdded = true;
													}

													if (teachingAssignment.fromInstructor) {
														if (teachingAssignment.approved) {
															courseHtml += "<li><div class=\"instructor-assignment__dropdown--option-used\">" + (firstCourseInGroup.length + 1) + ". ";
															courseHtml += preferenceDisplayText + "</div></li>";
														} else {
															courseHtml += "<li class=\"instructor-assignment__dropdown--option\"><a";
															courseHtml += " data-teaching-assignment-id=\"" + teachingAssignment.id + "\"";
															courseHtml += " href=\"#\">" + (firstCourseInGroup.length + 1) + ". " + preferenceDisplayText + "</a></li>";
														}
														firstCourseInGroup.push(preferenceDisplayText);
													}
													return true;
												}

												// This teachingAssignment can't be displayed here
												if (scope.isValidCourseBased(teachingAssignment) == false) {
													return true;
												}

												var course;

												if (teachingAssignment.suggestedSubjectCode && teachingAssignment.suggestedCourseNumber) {
													course = {};
													course.subjectCode = teachingAssignment.suggestedSubjectCode;
													course.courseNumber = teachingAssignment.suggestedCourseNumber;
													course.title = teachingAssignment.suggestedTitle;
													course.sequencePattern = "001";
												} else {
													if (sectionGroup) {
														course = scope.view.state.courses.list[sectionGroup.courseId];
														if (course) {
															interestedCourseIds.push(course.id);
														}
													}
												}

												// Preferred TeachingAssignments
												if (teachingAssignment.fromInstructor && course) {
													if (firstInterestedCourseAdded === false) {
														courseHtml += "<li><div class=\"dropdown-assign-header\">Preferred</div></li>";
														firstInterestedCourseAdded = true;
													}

													if (firstCourseInGroup.indexOf(course.subjectCode + course.courseNumber) < 0) {
														if (teachingAssignment.relatedCourseApproved === true) {
															courseHtml += "<li><div class=\"instructor-assignment__dropdown--option-used\">" + (firstCourseInGroup.length + 1) + ". ";
															courseHtml += course.subjectCode + course.courseNumber + " - " + course.title;
															courseHtml += "</div></li>";
															firstCourseInGroup.push(course.subjectCode + course.courseNumber);
															return;
														}

														if (teachingAssignment.relatedAssignmentIds && teachingAssignment.relatedAssignmentIds.length <= 1) {
															courseHtml += "<li class=\"instructor-assignment__dropdown--option\"><a";
															courseHtml += " data-teaching-assignment-id=\"" + teachingAssignment.id + "\"";
															courseHtml += " href=\"#\">" + (firstCourseInGroup.length + 1) + ". " + course.subjectCode + " " + course.courseNumber + " - " + course.title + "</a></li>";
															firstCourseInGroup.push(course.subjectCode + course.courseNumber);
															return;
														}

														courseHtml += "<li><div class=\"instructor-assignment__dropdown--option-header\">" + (firstCourseInGroup.length + 1) + ". ";
														courseHtml += course.subjectCode + course.courseNumber + " - " + course.title;
														courseHtml += "</div></li>";
														firstCourseInGroup.push(course.subjectCode + course.courseNumber);
													}

													// Skip sub-option if there's only one option
													if (teachingAssignment.relatedAssignmentIds && teachingAssignment.relatedAssignmentIds.length <= 1) {
														return;
													}

													if (teachingAssignment.relatedCourseApproved) {
														return;
													}

													courseHtml += "<li class=\"instructor-assignment__dropdown--sub-option\"><a";
													courseHtml += " data-teaching-assignment-id=\"" + teachingAssignment.id + "\"";
													courseHtml += " href=\"#\">" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</a></li>";
												}
											});
											if (firstInterestedCourseAdded) {
												courseHtml += "<li role=\"presentation\" class=\"divider courses-separator\"></li>";
												courseHtml += "<li><div class=\"dropdown-assign-header\">Other</div></li>";
											}
										}

										// Add Buyout, Sabbatical, Course Release options
										if (nonCoursePreferences.buyout == false) {
											courseHtml += "<li><a";
											courseHtml += " data-is-buyout=\"true\"";
											courseHtml += " data-term-code=\"" + termCode + "\"";
											courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
											courseHtml += " href=\"#\">Buyout</a></li>";
										}

										if (nonCoursePreferences.sabbatical == false) {
											courseHtml += "<li><a";
											courseHtml += " data-is-sabbatical=\"true\"";
											courseHtml += " data-term-code=\"" + termCode + "\"";
											courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
											courseHtml += " href=\"#\">Sabbatical</a></li>";
										}
										if (nonCoursePreferences.inResidence == false) {
											courseHtml += "<li><a";
											courseHtml += " data-is-in-residence=\"true\"";
											courseHtml += " data-term-code=\"" + termCode + "\"";
											courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
											courseHtml += " href=\"#\">In Residence</a></li>";
										}
										if (nonCoursePreferences.workLifeBalance == false) {
											courseHtml += "<li><a";
											courseHtml += " data-is-work-life-balance=\"true\"";
											courseHtml += " data-term-code=\"" + termCode + "\"";
											courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
											courseHtml += " href=\"#\">Work Life Balance</a></li>";
										}
										if (nonCoursePreferences.leaveOfAbsence == false) {
											courseHtml += "<li><a";
											courseHtml += " data-is-leave-of-absence=\"true\"";
											courseHtml += " data-term-code=\"" + termCode + "\"";
											courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
											courseHtml += " href=\"#\">Leave of Absence</a></li>";
										}
										if (nonCoursePreferences.sabbaticalInResidence == false) {
											courseHtml += "<li><a";
											courseHtml += " data-is-sabbatical-in-residence=\"true\"";
											courseHtml += " data-term-code=\"" + termCode + "\"";
											courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
											courseHtml += " href=\"#\">Sabbatical In Residence</a></li>";
										}
										if (nonCoursePreferences.courseRelease == false) {
											courseHtml += "<li><a";
											courseHtml += " data-is-course-release=\"true\"";
											courseHtml += " data-term-code=\"" + termCode + "\"";
											courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
											courseHtml += " href=\"#\">Course Release</a></li>";
										}

										courseHtml += "<li role=\"presentation\" class=\"divider courses-separator\"></li>";

										// Loop over all other courses
										$.each(scope.view.state.courses.ids, function (i, courseId) { // eslint-disable-line no-undef
											var course = scope.view.state.courses.list[courseId];
											// Show option if course has a sectionGroup in this term, and course did not already show up in the interested section
											if (course.sectionGroupTermCodeIds[termCode] && interestedCourseIds.indexOf(course.id) < 0) {
												var sectionGroupId = course.sectionGroupTermCodeIds[termCode];
												var instructor = scope.view.state.instructors.list[instructorId];
												courseHtml += "<li><a";
												courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
												courseHtml += " data-term-code=\"" + termCode + "\"";
												courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
												courseHtml += " href=\"#\">" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</a></li>";
											}
										});

										courseHtml += "</ul></div>"; // End dropdown assign list
									} // end userCanEdit
									courseHtml += "</div>"; // Ending term-cell div
								});
								courseHtml += "</div>"; // Ending course-row div

								coursesHtml += courseHtml;

								// Add a header after each 10 displayed instructor rows
								if (rowsSinceHeaderWasAdded == 10) {
									coursesHtml += scope.renderHeader();
									rowsSinceHeaderWasAdded = 0;
								}
								rowsSinceHeaderWasAdded++;
							}
						}); // Ending loop over courses
					}
				}

				element.append(coursesHtml);

				// Manually activate bootstrap tooltip triggers
				$('body').tooltip({ // eslint-disable-line no-undef
					selector: '[data-toggle="tooltip"]'
				});
			};

			// end on event 'assignmentStateChanged'

			// Handle input box edits
			element.on("change", function(e) {
				var $el = $(e.target); // eslint-disable-line no-undef
				if ($el.data('event-type') != 'setScheduleInstructorNote') { return; }

				var instructorId = $el.data('instructor-id');
				var scheduleId = $el.data('schedule-id');
				var scheduleInstructorNoteId = $el.data('schedule-instructor-note-id');

				var note = e.target.value;

				AssignmentActionCreators.createOrUpdateScheduleInstructorNote(instructorId, scheduleId, note, scheduleInstructorNoteId);
			});

			// Handle Instructor UI events
			element.click(function (e) {
				let $el = $(e.target); // eslint-disable-line no-undef
				var teachingAssignment, teachingAssignmentId, instructorId;
				// Approving a teachingAssignment or creating a new one
				if ($el.is('a')) {
					var sectionGroupId = $el.data('section-group-id');
					var isCourseRelease = $el.data('is-course-release');
					var isSabbatical = $el.data('is-sabbatical');
					var isInResidence = $el.data('is-in-residence');
					var isWorkLifeBalance = $el.data('is-work-life-balance');
					var isLeaveOfAbsence = $el.data('is-leave-of-absence');
					var isSabbaticalInResidence = $el.data('is-sabbatical-in-residence');
					var isBuyout = $el.data('is-buyout');
					var termCode = $el.data('term-code');

					instructorId = $el.data('instructor-id');
					teachingAssignmentId = $el.data('teaching-assignment-id');

					// Approving an existing teachingAssignment
					if (teachingAssignmentId) {
						teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];

						AssignmentActionCreators.approveInstructorAssignment(teachingAssignment, scope.workgroupId, scope.year);
					} else { // Creating a new teachingAssignment, and then approving it
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						teachingAssignment = {
							sectionGroupId: sectionGroupId,
							instructorId: instructorId,
							termCode: termCode,
							priority: 1,
							approved: true,
							buyout: isBuyout,
							courseRelease: isCourseRelease,
							inResidence: isInResidence,
							workLifeBalance: isWorkLifeBalance,
							leaveOfAbsence: isLeaveOfAbsence,
							sabbaticalInResidence: isSabbaticalInResidence,
							sabbatical: isSabbatical
						};

						AssignmentActionCreators.addAndApproveInstructorAssignment(teachingAssignment, scope.view.state.userInterface.scheduleId);
					}
				}
				// Open Assignment deletion confirmation popover
				else if ($el.data('event-type') == 'deleteAssignmentPop') {
					// Delete course confirmation
					$el.popover('show');
				}

				// User has confirmed deletion of the assignment
				else if ($el.data('event-type') == 'deleteAssignment') {
					teachingAssignmentId = $el.data('teaching-assignment-id');
					teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
					AssignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
				}

				// Close Assignment deletion confirmation popover
				else if ($el.data('event-type') == 'dismissDeleteAssignmentPop') {
					// Dismiss the delete course dialog
					$el.closest("div.popover").popover('hide');
				}

				// Open The Staff deletion confirmation popover
				else if ($el.data('event-type') == 'removeTheStaffPop') {
					// Delete course confirmation
					$el.popover('show');
				}

				// User has confirmed deletion of the assignment
				else if ($el.data('event-type') == 'removeTheStaff') {
					sectionGroupId = $el.data('section-group-id');
					sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];

					sectionGroup.showTheStaff = false;
					AssignmentActionCreators.removePlaceholderStaff(sectionGroup);
				}

				// Close Assignment deletion confirmation popover
				else if ($el.data('event-type') == 'dismissRemoveTheStaffPop') {
					// Dismiss the delete course dialog
					$el.closest("div.popover").popover('hide');
				}

				else if ($el.hasClass('comment-btn')) {
					instructorId = $el.data('instructor-id');
					scope.openComment(instructorId);
				}
				else if ($el.hasClass('avail-btn')) {
					instructorId = $el.data('instructor-id');
					scope.openUnavailability(instructorId);
				}

				else if ($el.hasClass('assignments-complete')) {
					var scheduleInstructorNoteId = $el.data('schedule-instructor-note-id');
					instructorId = $el.data('instructor-id');
					var scheduleInstructorNote = scope.view.state.scheduleInstructorNotes.list[scheduleInstructorNoteId];

					// Properly toggle assignmentsCompleted of existing scheduleInstructorNote
					if (scheduleInstructorNote) {
						if ($el.hasClass('glyphicon-unchecked')) {
							scheduleInstructorNote.assignmentsCompleted = true;
							AssignmentActionCreators.markInstructorComplete(scheduleInstructorNote);
						} else {
							scheduleInstructorNote.assignmentsCompleted = false;
							AssignmentActionCreators.markInstructorIncomplete(scheduleInstructorNote);
						}
					}
					// Make a new scheduleInstructorNote
					else {
						AssignmentActionCreators.addScheduleInstructorNote(instructorId, scope.year, scope.workgroupId, "", true);
					}
				}
			}); // end UI event handler

			scope.openComment = function (instructorId) {
				scope.openCommentModal({ instructorId: instructorId });
			};

			scope.openUnavailability = function (instructorId) {
				scope.openUnavailabilityModal({ instructorId: instructorId });
			};

			scope.renderTable();
		} // end link
	};
};

export default instructorAssignmentTable;
