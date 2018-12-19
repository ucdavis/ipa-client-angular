/**
 * Provides the main course table in the Courses View
 */
let courseAssignmentTable = function ($rootScope, AssignmentActionCreators) {
	return {
		restrict: 'A',
		template: '<div class=\"course-list-row\">' +
		'<div class=\"course-header course-description-cell\">&nbsp;</div></div>' +
		'<div style="display: flex; justify-content: center; padding-top: 20px;">' +
		'<div><img src="/images/ajax-loader.gif" style="width: 32px; height: 32px;" /> <span class="text-muted">&nbsp; Loading assignments</span></div>' +
		'</div>',
		link: function (scope, element, attrs) {
			scope.view = {};

			/** 
			 * When a teaching preference is created, a single course can have multiple teaching assignments created for each section group,
			 * with each teaching assignment getting a incremental priority.
			 * e.g. CHE002A has priority 1 through 6. The next preference added will be stored with priority 7.
			 * This function checks for duplicate teaching assignments of a course and returns the adjusted priority.
			 */
			scope.calculatePriority = function(teachingAssignment, instructor) {
				var termCode = teachingAssignment.termCode;
				var courseId = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId].courseId;
				var course = scope.view.state.courses.list[courseId];
				var courseDescription = course.subjectCode + course.courseNumber;

				if (instructor === undefined) {
					// TBD assignment e.g. "Associate Instructor"
					return teachingAssignment.priority;
				}

				var teachingAssignmentIds = instructor.teachingAssignmentTermCodeIds[termCode];
				var assignmentsHash = {};
				for (var slotTeachingAssignmentId of teachingAssignmentIds) {
					var slotTeachingAssignment = scope.view.state.teachingAssignments.list[slotTeachingAssignmentId];

					if (slotTeachingAssignment.approved === true) {
						// skip approved assignments
						continue;
					}

					if (slotTeachingAssignment.sectionGroupId === 0 || slotTeachingAssignment.sectionGroupId === null) {
						// A Suggested Course or non-course option
						var slotCourseDescription = slotTeachingAssignment.suggestedSubjectCode + slotTeachingAssignment.suggestedCourseNumber;

						if (slotCourseDescription === 0) {
							// non-course option
								if (slotTeachingAssignment.buyout) {
									assignmentsHash["Buyout"] = { priority: slotTeachingAssignment.priority };
								} else if (slotTeachingAssignment.courseRelease) {
									assignmentsHash["CourseRelease"] = { priority: slotTeachingAssignment.priority };
								} else if (slotTeachingAssignment.sabbatical) {
									assignmentsHash["Sabbatical"] = { priority: slotTeachingAssignment.priority };
								} else if (slotTeachingAssignment.inResidence) {
									assignmentsHash["InResidence"] = { priority: slotTeachingAssignment.priority };
								} else if (slotTeachingAssignment.sabbaticalInResidence) {
									assignmentsHash["SabbaticalInResidence"] = {  priority: slotTeachingAssignment.priority };
								} else if (slotTeachingAssignment.leaveOfAbsense) {
									assignmentsHash["LeaveOfAbsense"] = { priority: slotTeachingAssignment.priority };
								} else if (slotTeachingAssignment.workLifeBalance) {
									assignmentsHash["WorkLifeBalance"] = { priority: slotTeachingAssignment.priority };
								} else {
									continue;
								}
							continue;
						}

						assignmentsHash[slotCourseDescription] = { description: slotCourseDescription, priority: slotTeachingAssignment.priority };
						continue;
					}

					var slotCourse = scope.view.state.courses.list[scope.view.state.sectionGroups.list[slotTeachingAssignment.sectionGroupId].courseId];
					var slotCourseDescription = slotCourse.subjectCode + slotCourse.courseNumber;

					if (!assignmentsHash[slotCourseDescription]) {
						assignmentsHash[slotCourseDescription] = { description: slotCourseDescription, priority: slotTeachingAssignment.priority} ;
					}
				}

				var sortedPriorityList = _array_sortByProperty(assignmentsHash, "priority");
				var priorityIndex = sortedPriorityList.findIndex(function (priority) {
					return priority.description === courseDescription;
				});

				return priorityIndex + 1;
			};

			scope.userCanEdit = function () {
				var hasAuthorizedRole = scope.sharedState.currentUser.isAdmin() ||
					scope.sharedState.currentUser.hasRole('academicPlanner', scope.sharedState.workgroup.id);

					return hasAuthorizedRole;
			};

			// Build a string of html to display a column header (course, terms, etc.)
			scope.renderHeader = function () {
				// Render the header
				var header = "<div class=\"course-list-row\">";
				header += "<div class=\"course-header course-description-cell\"></div>";

				$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) {

					var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];
					header += "<div class=\"term-header term-cell\">" + termCode.getTermCodeDisplayName(true) + "</div>";
				});

				header += "</div>";

				return header;
			};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				scope.view.state = data;

				// If courses is undefined do nothing
				// The app is in the process of re-routing to a valid url
				if (scope.view.state.courses) {
					// Clear the table
					$('.tooltip').remove();
					element.empty();

					var header = scope.renderHeader();
					element.append(header);

					var coursesHtml = "";
					var rowsSinceHeaderWasAdded = 0;

					// Loop over courses (sectionGroup rows)

					// Display message if table is empty
					if (scope.view.state.courses.ids == 0) {
						coursesHtml += "<div class=\"course-list-row\">";
						coursesHtml += "<div class=\"course-description-cell empty-table-message\">";
						coursesHtml += "No courses have been added to the schedule";
						coursesHtml += "</div>";
					}
					else {
						$.each(scope.view.state.courses.ids, function (i, courseId) {
							var course = scope.view.state.courses.list[courseId];
							if (course.isHidden === false && course.isFiltered === false && course.matchesTagFilters === true) {
								var courseHtml = "";
								courseHtml += "<div class=\"course-list-row\">";
								courseHtml += "<div class=\"course-description-cell\"><div>";

								courseHtml += "<div class=\"course-title\">";
								courseHtml += course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + " - " + course.title;
								courseHtml += "</div>";

								courseHtml += "<div class=\"course-units\">";
								courseHtml += "Units: " + course.unitsLow;
								courseHtml += "</div>";

								courseHtml += "<div class=\"course-tags hidden-print\">";
								courseHtml += "Tags: ";

								// Display tags
								$.each(course.tagIds, function (i, tagId) {
									var tag = scope.view.state.tags.list[tagId];
									courseHtml += '<div class="label course-tag" style="background-color:' + tag.color + '">' + tag.name + "</div>";
								});

								courseHtml += "</div>"; // End tags

								// Add input for course notes
								courseHtml += '<hr />';
								courseHtml += "<div class='course-assignments__course-note hidden-print'>";
								courseHtml += '<textarea maxlength="750" class="form-control add-note__text-area" placeholder="Add Note" data-course-id="' + course.id + '" data-event-type="setCourseNote">' + (course.note || "")+ '</textarea>';
								courseHtml += "</div>";
								courseHtml += "<div class='visible-print'>";
								courseHtml += course.note || "";
								courseHtml += "</div>";

								courseHtml += "</div></div>"; // End course-description-cell

								// Loop over active terms
								$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) {
									var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];

									courseHtml += "<div class=\"term-cell\">";

									var sectionGroupId = course.sectionGroupTermCodeIds[termCode];
									if (sectionGroupId) {
										var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
										// Adding sectionGroup Seats
										courseHtml += "<div class=\"assignment-seats-container\">";
										courseHtml += "<span class=\"assignment-seats\" data-toggle=\"tooltip\" data-placement=\"top\"";
										courseHtml += "data-original-title=\"Seats\" data-container=\"body\">";

										// Display nothing if plannedSeats is not set
										var plannedSeats = scope.view.state.sectionGroups.list[sectionGroupId].plannedSeats || "";
										courseHtml += plannedSeats + "</span>";
										courseHtml += "</div>";

										// Display placeholder AI
										if (sectionGroup.showPlaceholderAI == true) {
											courseHtml += "<div class=\"alert alert-info tile-assignment\">";
											courseHtml += '<span class="course-assignment-table__assignment-title">';
											courseHtml += '<span class="course-assignment-table__assignment-header">AI Placeholder</span>';

											var popoverTemplate = "Are you sure you want to remove the AI Placeholder? <br /><br />" +
												"<div class='text-center'><button class='btn btn-red' data-event-type='deletePlaceholderAI' data-section-group-id='" + sectionGroup.id + "'>Remove</button>" +
												"<button class='btn btn-white' data-event-type='dismissDeletePlaceholderAIPop'>Cancel</button></div>";

											courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary hidden-print\"";
											courseHtml += " data-section-group-id=\"" + sectionGroup.id + "\" data-event-type=\"deletePlaceholderAIPop\" " +
												"data-toggle=\"popover\" data-placement='left' data-html=\"true\" data-content=\"" + popoverTemplate + "\"></i>";
											courseHtml += "</span></div>";
										}

										// Display The Staff placeholder
										if (sectionGroup.showTheStaff == true) {
											courseHtml += "<div class=\"alert alert-info tile-assignment\">";
											courseHtml += '<span class="course-assignment-table__assignment-title">';
											courseHtml += '<span class="course-assignment-table__assignment-header">The Staff</span>';

											var popoverTemplate = "Are you sure you want to remove The Staff? <br /><br />" +
												"<div class='text-center'><button class='btn btn-red' data-event-type='deleteTheStaff' data-section-group-id='" + sectionGroup.id + "'>Delete</button>" +
												"<button class='btn btn-white' data-event-type='dismissDeleteTheStaffPop'>Cancel</button></div>";

											courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary hidden-print\"";
											courseHtml += " data-section-group-id=\"" + sectionGroup.id + "\" data-event-type=\"deleteTheStaffPop\" " +
												"data-toggle=\"popover\" data-placement='left' data-html=\"true\" data-content=\"" + popoverTemplate + "\"></i>";
											courseHtml += "</span></div>"; // Ending Teaching assignment div
										}

										// Loop over teachingAssignments that are approved
										$.each(sectionGroup.teachingAssignmentIds, function (i, teachingAssignmentId) {
											var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];

											if (teachingAssignment.approved === true) {
												var instructor = scope.view.state.instructorMasterList.list[teachingAssignment.instructorId];
												var instructorType = scope.view.state.instructorTypes.list[teachingAssignment.instructorTypeId];

												// Add approved teachingAssignment to term
												courseHtml += "<div class=\"alert alert-info tile-assignment\">";
												courseHtml += '<span class="course-assignment-table__assignment-title">';
												courseHtml += '<span class="course-assignment-table__assignment-description">';

												if (instructor) {
													courseHtml += instructor.fullName + '<div class="course-assignment-table__instructor-type">' + instructorType.description + '</div>';
												} else {
													courseHtml += instructorType.description;
												}

												courseHtml += '</span>';

												if (scope.userCanEdit()) {
													var popoverTemplate = "Are you sure you want to delete this assignment? <br /><br />" +
														"<div class='text-center'><button class='btn btn-red' data-event-type='deleteAssignment' data-teaching-assignment-id='" + teachingAssignment.id + "'>Delete</button>" +
														"<button class='btn btn-white' data-event-type='dismissDeleteAssignmentPop'>Cancel</button></div>";

													courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary hidden-print\"";
													courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\" data-event-type=\"deleteAssignmentPop\" " +
														"data-toggle=\"popover\" data-placement='left' data-html=\"true\" data-content=\"" + popoverTemplate + "\"></i>";
												}

												courseHtml += "</span></div>"; // Ending Teaching assignment div
											}
										});

										if (scope.userCanEdit()) {

											// Add an assign button to add more instructors
											courseHtml += "<div class=\"dropdown assign-dropdown hidden-print\">";
											courseHtml += "<button class=\"btn btn-default dropdown-toggle assign-dropdown-btn\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">";
											courseHtml += "<div>Assign..</div><div class=\"caret\"></div></button>";
											courseHtml += "<ul class=\"dropdown-menu dropdown-menu-right assign-instructor-dropdown scrollable-menu\" aria-labelledby=\"dropdownMenu1\">";

											if (sectionGroup.showPlaceholderAI == false) {
												courseHtml += "<li><a";
												courseHtml += ' data-is-placeholder-ai="true"';
												courseHtml += ' data-section-group-id="' + sectionGroup.id + '"';
												courseHtml += ' href="#">AI Placeholder</a></li>';
											}

											// Display 'The Staff' as an option when no assignments have been made
											var showStaffOption = true;

											if (sectionGroup.showTheStaff == true) {
												showStaffOption = false;
											}

											sectionGroup.teachingAssignmentIds.forEach(function(assignmentId) {
												var assignment = scope.view.state.teachingAssignments.list[assignmentId];
												if (assignment.approved) {
													showStaffOption = false;
												}
											});

											if (showStaffOption) {
												courseHtml += "<li><a";
												courseHtml += ' data-is-placeholder-staff="true"';
												courseHtml += ' data-section-group-id="' + sectionGroup.id + '"';
												courseHtml += ' href="#">The Staff</a></li>';
											}

											scope.view.state.instructorTypes.ids.forEach(function(instructorTypeId) {
												var instructorType = scope.view.state.instructorTypes.list[instructorTypeId];
												courseHtml += "<li><a";
												courseHtml += ' data-is-instructor-type="true"';
												courseHtml += ' data-section-group-id="' + sectionGroup.id + '"';
												courseHtml += ' data-instructor-type-id="' + instructorType.id + '"';
												courseHtml += ' href="#">' + instructorType.description + '</a>';
												courseHtml += '</li>';
											});

											courseHtml += "<li role=\"presentation\" class=\"divider courses-separator\"></li>";

											var interestedInstructorIds = [];
											var firstInstructorAdded = false;
											var numberOfInstructorsAdded = 0;
											if (sectionGroup.teachingAssignmentIds.length > 0) {

												// Loop over instructors who are interested in this course
												$.each(sectionGroup.teachingAssignmentIds, function (i, teachingAssignmentId) {
													var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
													var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];
													var priority = scope.calculatePriority(teachingAssignment, instructor);

													if (instructor) {
														interestedInstructorIds.push(instructor.id);
													}

													if (teachingAssignment.approved === false && instructor) {
														// Ensure header is aded only if there is appropriate to display
														if (firstInstructorAdded === false) {
															courseHtml += "<li><div class=\"dropdown-assign-header\">Interested</div></li>";
															firstInstructorAdded = true;
															numberOfInstructorsAdded++;
														}

														courseHtml += "<li><a";
														courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
														courseHtml += " data-instructor-id=\"" + teachingAssignment.instructorId + "\"";
														courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"";

														courseHtml += " href=\"#\">" + instructor.fullName + " (" + priority + ")" + "</a></li>";

														numberOfInstructorsAdded++;
													}
												});
												if (firstInstructorAdded) {
													courseHtml += "<li><div class=\"dropdown-assign-header\">Other</div></li>";
												}
											}

											// Loop over instructors who are not interested in this course
											$.each(scope.view.state.instructors.ids, function (i, instructorId) {
												var instructor = scope.view.state.instructors.list[instructorId];
												if (interestedInstructorIds.indexOf(instructor.id) < 0) {
													courseHtml += "<li><a";
													courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
													courseHtml += " data-instructor-id=\"" + instructorId + "\"";
													courseHtml += " href=\"#\">" + instructor.fullName + "</a></li>";
													numberOfInstructorsAdded++;
												}
											});

											// Display Message if there are no unused courses available
											if (numberOfInstructorsAdded == 0) {
												courseHtml += '<li style="padding-left: 20px; cursor: default;">No unused instructors</li>';
											}

											if (sectionGroup.aiAssignmentOptions.preferences.length > 0 || sectionGroup.aiAssignmentOptions.other.length > 0) {
												courseHtml += "<li><div class=\"dropdown-assign-header\">Associate Instructor</div></li>";
											}

											sectionGroup.aiAssignmentOptions.preferences.forEach(function(supportStaff) {
												courseHtml += '<li><a';
												courseHtml += ' data-section-group-id="' + sectionGroupId + '"';
												courseHtml += ' data-support-staff-id="' + supportStaff.id + '"';
												courseHtml += ' href="#">' + supportStaff.fullName + ' (' + supportStaff.priority + ')</a></li>';
											});

											sectionGroup.aiAssignmentOptions.other.forEach(function(supportStaff) {
												courseHtml += '<li><a';
												courseHtml += ' data-section-group-id="' + sectionGroupId + '"';
												courseHtml += ' data-support-staff-id="' + supportStaff.id + '"';
												courseHtml += ' href="#">' + supportStaff.fullName + '</a></li>';
											});

											courseHtml += "</ul></div>";
										} // End scope.userCanEdit check

									} else {
										courseHtml += "Not Offered";
									}
									courseHtml += "</div>"; // Ending term-cell div
								});
								courseHtml += "</div>"; // Ending course-row div

								coursesHtml += courseHtml;

								// Add a header after each 10 displayed course rows
								if (rowsSinceHeaderWasAdded == 10) {
									coursesHtml += scope.renderHeader();
									rowsSinceHeaderWasAdded = 0;
								}
								rowsSinceHeaderWasAdded++;

							}

						}); // Ending loop over courses
					}

					element.append(coursesHtml);

					// Manually activate bootstrap tooltip triggers
					$('body').tooltip({
						selector: '[data-toggle="tooltip"]'
					});
				}
			}); // end on event 'assignmentStateChanged'

			// Handle input box edits
			element.on("change", function(e) {
				var $el = $(e.target);
				if ($el.data('event-type') != 'setCourseNote') { return; }

				var courseId = $el.data('course-id');
				var note = e.target.value;

				AssignmentActionCreators.updateCourseNote(courseId, note);
			});

			// Handle Instructor UI events
			element.click(function (e) {
				let $el = $(e.target);

				var teachingAssignmentId, teachingAssignment;
				// Approving a teachingAssignment or creating a new one
				if ($el.is('a')) {
					var sectionGroupId = $el.data('section-group-id');
					var instructorId = $el.data('instructor-id');
					var supportStaffId = $el.data('support-staff-id');
					var instructorTypeId = $el.data('instructor-type-id');
					var teachingAssignmentId = $el.data('teaching-assignment-id');

					var isAssignPlaceholderAI = $el.data('is-placeholder-ai');
					var isAssignPlaceholderStaff = $el.data('is-placeholder-staff');
					var isInstructorType = $el.data('is-instructor-type');

					if (isInstructorType) {
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];

						let newTeachingAssignment = {
							sectionGroupId: sectionGroupId,
							termCode: sectionGroup.termCode,
							priority: 1,
							approved: true,
							instructorTypeId: instructorTypeId
						};

						// Remove The Staff if necessary
						if (sectionGroup) {
							sectionGroup.showTheStaff = false;
						}

						AssignmentActionCreators.assignInstructorType(newTeachingAssignment);
					} else if (isAssignPlaceholderStaff) {
						// Create a 'The Staff' placeholder
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						sectionGroup.showTheStaff = true;
						AssignmentActionCreators.createPlaceholderStaff(sectionGroup);
					} else if (isAssignPlaceholderAI) {
						// Create a support assignment for an AI
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						sectionGroup.showPlaceholderAI = true;
						AssignmentActionCreators.createPlaceholderAI(sectionGroup);
					} else if (sectionGroupId && supportStaffId) {
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						var supportStaff = scope.view.state.supportStaffList.list[supportStaffId];

						AssignmentActionCreators.assignStudentToAssociateInstructor(sectionGroup, supportStaff);
						// Remove 'The Staff' if necessary
						sectionGroup.showPlaceholderAI = false;
					} else if (teachingAssignmentId) {
						// Approving an existing teachingAssignment
						teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
						AssignmentActionCreators.approveInstructorAssignment(teachingAssignment);

						// Remove The Staff if necessary
						var sectionGroup = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];
						if (sectionGroup) {
							sectionGroup.showTheStaff = false;
						}
					} else { // Creating a new teachingAssignment, and then approving it
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						teachingAssignment = {
							sectionGroupId: sectionGroupId,
							instructorId: instructorId,
							termCode: sectionGroup.termCode,
							priority: 1,
							approved: true
						};

						// Remove The Staff if necessary
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						if (sectionGroup) {
							sectionGroup.showTheStaff = false;
						}

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
				else if ($el.data('event-type') == 'deleteTheStaffPop') {
					// Delete course confirmation
					$el.popover('show');
				}

				// Open Placeholder AI deletion confirmation popover
				else if ($el.data('event-type') == 'deletePlaceholderAIPop') {
					// Delete course confirmation
					$el.popover('show');
				}
				// User has confirmed deletion of The Staff
				else if ($el.data('event-type') == 'deleteTheStaff') {
					sectionGroupId = $el.data('section-group-id');
					sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
					sectionGroup.showTheStaff = false;
					AssignmentActionCreators.removePlaceholderStaff(sectionGroup);
				}
				// User has confirmed deletion of Placeholder AI
				else if ($el.data('event-type') == 'deletePlaceholderAI') {
					sectionGroupId = $el.data('section-group-id');
					sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
					sectionGroup.showPlaceholderAI = false;
					AssignmentActionCreators.removePlaceholderAI(sectionGroup);
				}
				// Close The Staff deletion confirmation popover
				else if ($el.data('event-type') == 'dismissDeleteTheStaffPop') {
					// Dismiss the delete course dialog
					$el.closest("div.popover").popover('hide');
				}
				// Close Placeholder AI deletion confirmation popover
				else if ($el.data('event-type') == 'dismissDeletePlaceholderAIPop') {
					// Dismiss the delete course dialog
					$el.closest("div.popover").popover('hide');
				}
			}); // end UI event handler
		} // end link
	};
};

export default courseAssignmentTable;
