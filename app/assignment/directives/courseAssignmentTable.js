/**
 * Provides the main course table in the Courses View
 */
assignmentApp.directive("courseAssignmentTable", this.courseAssignmentTable = function ($rootScope, assignmentActionCreators) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				scope.view.state = data;
				// Clear the table
				$('.tooltip').remove();
				element.empty();
				// Render the header
				var header = "<div class=\"course-list-row\">";
				header += "<div class=\"course-header course-description-cell\">Course</div>";

				$.each(scope.view.state.userInterface.enabledTerms.ids, function(i, termCodeId) {

					var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];
					header += "<div class=\"term-header term-cell\">" + termCode.getTermCodeDisplayName(true) + "</div>";
				});

				header += "</div>";
				element.append(header);

				var coursesHtml = "";

				// Loop over courses (sectionGroup rows)
				$.each(scope.view.state.courses.ids, function(i, courseId) {
					var course = scope.view.state.courses.list[courseId];
					if (course.isHidden == false && course.isFiltered == false) {
						var courseHtml = "";
						courseHtml += "<div class=\"course-list-row\">";
						courseHtml += "<div class=\"course-description-cell\"><div><div class=\"course-title\">";
						courseHtml += course.subjectCode + " " + course.courseNumber + " " + course.title + " " + course.sequencePattern;
						courseHtml += "</div>";
						courseHtml += "<div class=\"course-units\">";
						courseHtml += "Units: " + course.unitsLow;
						courseHtml += "</div></div></div>";
						
						// Loop over active terms
						$.each(scope.view.state.userInterface.enabledTerms.ids, function(i, termCodeId) {
							var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];

							courseHtml += "<div class=\"term-cell\">";
							
							var sectionGroupId = course.sectionGroupTermCodeIds[termCode];
							if (sectionGroupId) {
								var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];

								// Adding sectionGroup Seats
								courseHtml += "<div class=\"assignment-seats-container\">";
								courseHtml += "<span class=\"assignment-seats\" data-toggle=\"tooltip\" data-placement=\"top\"";
								courseHtml += "data-original-title=\"Seats\" data-container=\"body\">";
								courseHtml += scope.view.state.sectionGroups.list[sectionGroupId].plannedSeats + "</span>";
								courseHtml += "</div>";

								// Loop over teachingAssignments that are approved
								$.each(sectionGroup.teachingAssignmentIds, function(i, teachingAssignmentId) {
									var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];

									if (teachingAssignment.approved == true) {
										var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];
										// Add approved teachingAssignment to term
										courseHtml += "<div class=\"alert alert-info tile-assignment\">";

										if (instructor == undefined) {
											courseHtml += "instructorId not found: " + teachingAssignment.instructorId;
										} else {
											courseHtml += instructor.fullName;
										}

										courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary\" data-toggle=\"tooltip\"";
										courseHtml += " data-placement=\"top\" data-original-title=\"Unassign\" data-container=\"body\""
										courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"></i>";
										courseHtml += "</div>"; // Ending Teaching assignment div
									}
								});

								// Add an assign button to add more instructors
								courseHtml += "<div class=\"dropdown assign-dropdown\">";
								courseHtml += "<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">";
								courseHtml += "Assign..<span class=\"caret\"></span></button>";
								courseHtml += "<ul class=\"dropdown-menu scrollable-menu\" aria-labelledby=\"dropdownMenu1\">";

								var interestedInstructorIds = [];

								if (sectionGroup.teachingAssignmentIds.length > 0) {
									courseHtml += "<li><div class=\"dropdown-assign-header\">Interested</div></li>";

									// Loop over instructors who are interested in this course
									$.each(sectionGroup.teachingAssignmentIds, function(i, teachingAssignmentId) {
										var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];

										if (teachingAssignment.approved == false) {
											var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];
											if (instructor) {
												interestedInstructorIds.push(instructor.id);

												courseHtml += "<li><a";
												courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
												courseHtml += " data-instructor-id=\"" + teachingAssignment.instructorId + "\"";
												courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"";

												courseHtml += " href=\"#\">" + instructor.fullName + "</a></li>";
											}
										}
									});
									courseHtml += "<li><div class=\"dropdown-assign-header\">Other</div></li>";
								}

								// Loop over instructors who are not interested in this course
								$.each(scope.view.state.instructors.ids, function(i, instructorId) {
									var instructor = scope.view.state.instructors.list[instructorId];
									if (interestedInstructorIds.indexOf(instructor.id) < 0) {
										courseHtml += "<li><a";
										courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
										courseHtml += " data-instructor-id=\"" + instructorId + "\"";
										courseHtml += " href=\"#\">" + instructor.fullName + "</a></li>";
									}
								});

								courseHtml += "</ul></div>";
							} else {
								courseHtml += "Not Offered";
							}
							courseHtml += "</div>"; // Ending term-cell div
						});
						courseHtml += "</div>"; // Ending course-row div
						
						coursesHtml += courseHtml;
					}
				}); // Ending loop over courses

				element.append(coursesHtml);

				// Manually activate bootstrap tooltip triggers
				$('body').tooltip({
    			selector: '[data-toggle="tooltip"]'
				});
			}); // end on event 'assignmentStateChanged'

			// Handle Instructor UI events
			element.click(function(e) {
				$el = $(e.target);

				// Approving a teachingAssignment or creating a new one
				if ($el.is('a')) {
					var sectionGroupId = $el.data('section-group-id');
					var instructorId = $el.data('instructor-id');
					var teachingAssignmentId = $el.data('teaching-assignment-id');
					// Approving an existing teachingAssignment
					if (teachingAssignmentId) {
						var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
						assignmentActionCreators.approveInstructorAssignment(teachingAssignment);
					} else { // Creating a new teachingAssignment, and then approving it
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						var teachingAssignment = {
							sectionGroupId: sectionGroupId,
							instructorId: instructorId,
							termCode: sectionGroup.termCode,
							priority: 1,
							approved: true
						}

						assignmentActionCreators.addAndApproveInstructorAssignment(teachingAssignment);
					}
				}
				// Unapproving a teachingAssignment
				else if ($el.hasClass('assignment-remove')) {
						var teachingAssignmentId = $el.data('teaching-assignment-id');
						var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
						assignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
				}
			}); // end UI event handler
		} // end link
	}
});
