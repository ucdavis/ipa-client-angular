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
				element.empty();

				// Render the header
				var header = "<div class=\"course-list-row\">";
				header += "<div class=\"course-header description-cell\">Course</div>";

				$.each(scope.view.state.scheduleTermStates.ids, function(i, termCode) {
					if (scope.view.state.scheduleTermStates.list[termCode].isHidden == false) {
						header += "<div class=\"term-header term-cell\">" + termCode.toString().getTermCodeDisplayName(true) + "</div>";
					}
				});

				header += "</div>";

				element.append(header);

				// Render the list of courses
				var coursesHtml = "";
				// TODO: Loop over courses (sectionGroup rows)
				$.each(scope.view.state.courses.ids, function(i, courseId) {
					var course = scope.view.state.courses.list[courseId];
					if (course.isHidden == false) {
						var courseHtml = "";
						courseHtml += "<div class=\"course-list-row\">";
						courseHtml += "<div class=\"description-cell\"><div><div class=\"course-title\">";
						courseHtml += course.subjectCode + " " + course.courseNumber + " " + course.title + " " + course.sequencePattern;
						courseHtml += "</div>";
						courseHtml += "<div class=\"course-units\">";
						courseHtml += "Units: " + course.unitsHigh;
						courseHtml += "</div></div></div>";
						
						// TODO: Loop over active terms
						$.each(scope.view.state.scheduleTermStates.ids, function(i, termCode) {
							if (scope.view.state.scheduleTermStates.list[termCode].isHidden == false) {
								courseHtml += "<div class=\"term-cell\">";
								var sectionGroupId = course.sectionGroupTermCodeIds[termCode];
								if (sectionGroupId) {
									var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];

									courseHtml += "<div class=\"assignment-seats\" data-toggle=\"tooltip\" data-placement=\"top\" data-original-title=\"Seats\" data-container=\"body\">";
									courseHtml += scope.view.state.sectionGroups.list[sectionGroupId].plannedSeats;
									courseHtml += "</div>";

									// TODO: Loop over teachingAssignments that are approved
									$.each(sectionGroup.teachingAssignmentIds, function(i, teachingAssignmentId) {
										var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];

										if (teachingAssignment.approved == true) {
											var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];
											courseHtml += "<div class=\"alert alert-info tile-assignment\">";

											if (instructor == undefined) {
												courseHtml += "instructorId not found: " + teachingAssignment.instructorId;
											} else {
												courseHtml += instructor.fullName;
											}
											courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary\" data-toggle=\"tooltip\"";
											courseHtml += "data-placement=\"top\" data-original-title=\"Unassign\" data-container=\"body\"></i>";
											courseHtml += "</div>"; // Ending Teaching assignment div

											// TODO: Add an assign button to add more instructors
										}
									});
								}
								courseHtml += "</div>"; // Ending term-cell div
							}
						});
						courseHtml += "</div>"; // Ending course-row div
						
						coursesHtml += courseHtml;
					}
				});


				element.append(coursesHtml);

// ----------------- OLD STUFF -----------------
	/*
				// Render the body
				var body = "<tbody></tbody>";

				$.each(data.courses.ids, function(rowIdx, courseId) {
					var course = data.courses.list[courseId];

					var row = "<tr class=\"odd gradeX\" data-course-id=\"" + courseId + "\">";

					// First column
					row += "<td class=\"course-cell\"><strong>" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</strong> <br />" + course.title + "<br />";
					row += "Tags:";
					$.each(course.tagIds, function (i, tagId) {
						var tag = data.tags.list[tagId];
						var bgColor = tag.color ? tag.color : "#333";
						row += "<div class=\"label\" style=\"padding: 3px; margin-left: 3px; background-color: " + bgColor + "\">" + tag.name + "</div>"
					});
					row += "</td>";

					// Term column(s)
					$.each(data.scheduleTermStates.ids, function(i, termCode) {
						var sectionGroup = data.sectionGroups.list[course.sectionGroupTermCodeIds[termCode]];
						var sectionGroupId = sectionGroup ? sectionGroup.id : 0;
						var plannedSeats = sectionGroup ? sectionGroup.plannedSeats : "";

						// Calculate this boolean by comparing the sum of all section seats to the plannedSeats
						var requiresAttention = false;

						row += "<td data-term-code=\"" + termCode + "\" data-section-group-id=\"" + sectionGroupId + "\" class=\"sg-cell\"><div>";

						if(requiresAttention) {
							row += "<div class=\"right-inner-addon form-group\"><i class=\"entypo-attention text-warning\"></i></div>";
						}

						row += "<input value=\"" + plannedSeats + "\" class=\"form-control planned-seats\"></input>";
						row += "</div></td>";
					});

					// Actions column
					row += "<td class=\"ui-overlay\"><i class=\"btn add-before entypo-plus-circled\" onClick=\"addRowForm(" + rowIdx + ")\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"Add a course\"></i>";
					row += "<i class=\"btn delete-sg entypo-minus-circled\" onClick=\"deleteSectionGroup(" + rowIdx + ")\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"Delete...\"></i>";
					row += "<i class=\"btn add-after entypo-plus-circled\" onClick=\"addRowForm(" + (rowIdx + 1) + ")\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"Add a course\"></i></td>";

					row += "</tr>";

					body += row;
				});

				element.append(body);
				// ----------------- OLD STUFF -----------------
			*/
			}); // end on event 'assignmentStateChanged'

		} // end link
	}
});
