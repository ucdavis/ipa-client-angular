/**
 * Provides the main course table in the Courses View
 */
assignmentApp.directive("instructorAssignmentTable", this.instructorAssignmentTable = function ($rootScope, assignmentActionCreators) {
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
				header += "<div class=\"course-header description-cell\">Instructor</div>";

				$.each(scope.view.state.scheduleTermStates.ids, function(i, termCode) {
					if (scope.view.state.scheduleTermStates.list[termCode].isHidden == false) {
						header += "<div class=\"term-header term-cell\">" + termCode.toString().getTermCodeDisplayName(true) + "</div>";
					}
				});

				header += "</div>";
				element.append(header);

				var coursesHtml = "";

				// Loop over instructors
				$.each(scope.view.state.instructors.ids, function(i, instructorId) {
					var instructor = scope.view.state.instructors.list[instructorId];
					var courseHtml = "";
					courseHtml += "<div class=\"course-list-row\">";
					courseHtml += "<div class=\"description-cell\"><div><strong>";
					courseHtml += instructor.fullName;
					courseHtml += "</strong></div></div>";
					
					// Loop over active terms
					$.each(scope.view.state.scheduleTermStates.ids, function(i, termCode) {
						if (scope.view.state.scheduleTermStates.list[termCode].isHidden == false) {
							courseHtml += "<div class=\"term-cell\">";

							// Loop over teachingAssignments within a term
							$.each(scope.view.state.instructors.list[instructor.id].teachingAssignmentTermCodeIds[termCode], function(j, teachingAssignmentId) {
								// Ensure it is approved already
								if (scope.view.state.teachingAssignments.list[teachingAssignmentId].approved) {
									var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId]
									var sectionGroup = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];
									var course = scope.view.state.courses.list[sectionGroup.courseId];

									courseHtml += "<div class=\"alert alert-info tile-assignment\">";
									courseHtml += "<p>" + course.subjectCode + " " + course.courseNumber + "-" + course.sequencePattern + "</p>";
									courseHtml += "<div class=\"tile-assignment-details\">";
									courseHtml += "<small>Seats: " + sectionGroup.plannedSeats + "</small>";
									courseHtml += "<br />";
									courseHtml += "<small>Units: " + course.unitsLow + "</small>";
									courseHtml += "</div>";
									courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary\" data-toggle=\"tooltip\" data-placement=\"top\"";
									courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"";
									courseHtml += "data-original-title=\"Unassign\" data-container=\"body\"></i>";
									courseHtml += "</div>";
								}
							});

							// Add an assign button to add more instructors
							courseHtml += "<div class=\"dropdown assign-dropdown\">";
							courseHtml += "<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">";
							courseHtml += "Assign..<span class=\"caret\"></span></button>";
							courseHtml += "<ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\">";

							// If the instructor has teachingAssignments in this term, show them first
							if (instructor.teachingAssignmentTermCodeIds[termCode].length > 0) {
								courseHtml += "<li><div class=\"dropdown-assign-header\">Interested</div></li>";

								// Loop over teachingAssignments
								$.each(instructor.teachingAssignmentTermCodeIds[termCode], function(i, teachingAssignmentId) {
									var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
									var sectionGroup = scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];
									var course = scope.view.state.courses.list[sectionGroup.courseId];

									// Show option if the TeachingAssignments parent Course is not being suppressed and Assignment is not already approved
									if (teachingAssignment.approved == false && course.isHidden == false) {
										var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];
										courseHtml += "<li><a";
										courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"";

										courseHtml += " href=\"#\">" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</a></li>";
									}
								});
							}

							courseHtml += "<li><div class=\"dropdown-assign-header\">Other</div></li>";

							// Loop over all other courses
							$.each(scope.view.state.courses.ids, function(i, courseId) {
								var course = scope.view.state.courses.list[courseId]
								// Show option if course has a sectionGroup in this term
								if (course.sectionGroupTermCodeIds[termCode]) {
									var sectionGroupId = course.sectionGroupTermCodeIds[termCode];
									var instructor = scope.view.state.instructors.list[instructorId];
									courseHtml += "<li><a";
									courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
									courseHtml += " data-instructor-id=\"" + instructor.id + "\"";
									courseHtml += " href=\"#\">" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</a></li>";
								}
							});

							courseHtml += "</ul></div>"; // End dropdown assign list
							courseHtml += "</div>"; // Ending term-cell div
						}
					});
					courseHtml += "</div>"; // Ending course-row div

					coursesHtml += courseHtml;
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
