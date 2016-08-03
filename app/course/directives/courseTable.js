/**
 * Provides the main course table in the Courses View
 */
courseApp.directive("courseTable", this.courseTable = function ($rootScope, courseActionCreators) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.view = {};

			$rootScope.$on('courseStateChanged', function (event, data) {
				scope.view.state = data;

				// Clear the table
				element.empty();

				// Render the header
				var header = "<thead><tr><th class=\"sorting-asc\">Course</th>";

				// Filter scope.termDefinitions to only those terms which are enabled by the filter.
				// Store this in termsToRender.
				var termsToRender = [];
				$.each(scope.termDefinitions, function(i, term) {
					if(data.filters.enabledTerms.indexOf(Number(term.shortCode)) != -1) {
						termsToRender.push(term);
					}
				});
				
				$.each(termsToRender, function(i, term) {
					header += "<th class=\"sorting\">" + term.description + "</th>"
				});

				header += "<th class=\"ui-overlay\"></th></tr></thead>";

				element.append(header);

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
					$.each(termsToRender, function(i, term) {
						var termCode = term.code;
						var sectionGroup = _.find(data.sectionGroups.list, function(sg) { return (sg.termCode == termCode) && (sg.courseId == courseId) });
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
					row += "<i class=\"btn delete-sg entypo-minus-circled\" data-event-type=\"deleteCourse\" data-course-id=\"" + courseId + "\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"Delete...\"></i>";
					row += "<i class=\"btn add-after entypo-plus-circled\" onClick=\"addRowForm(" + (rowIdx + 1) + ")\" data-toggle=\"tooltip\" data-placement=\"right\" data-original-title=\"Add a course\"></i></td>";

					row += "</tr>";

					body += row;
				});

				element.append(body);
			});

			$rootScope.$on('cellChanged', function (event, data) {
				// Remove existing highlighting
				element.find('tbody > tr').removeClass("selected-tr");
				element.find('tbody > tr > td').removeClass("selected-td");

				if (data.courseId && !data.termCode) {
					// Highlight row if a course is selected
					$('tr[data-course-id="' + data.courseId + '"]').addClass("selected-tr");
				} else if (data.courseId && data.termCode) {
					// Highlight single cell if a sectionGroup is selected
					$('tr[data-course-id="' + data.courseId + '"] td[data-term-code="' + data.termCode + '"]').addClass("selected-td");
				}
			});

			// Call this once to set up table events.
			element.keypress(function (e) {
				if (e.which == 13) {
					$el = $(e.target);

					if ($el.hasClass('planned-seats')) {
						var courseId = $el.closest("tr").data('course-id');
						var termCode = $el.closest("td").data('term-code').toString();
						var sectionGroupId = $el.closest("td").data('section-group-id');
						var plannedSeats = parseInt($el.val());

						if (sectionGroupId) {
							// Save existing sectionGroup
							var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
							sectionGroup.plannedSeats = plannedSeats;
							courseActionCreators.updateSectionGroup(sectionGroup);
						} else {
							// Create a new sectionGroup
							var sectionGroup = {
								courseId: courseId,
								termCode: termCode,
								plannedSeats: plannedSeats
							};
							courseActionCreators.addSectionGroup(sectionGroup);
						}

						// Important: notify angular since this happends outside of the scope
						scope.$apply();
					}
				}
			});

			// Emit sg-clicked event whenever a table <td> is clicked.
			// I'm sorry. Really.
			element.click(function(e) {
				$el = $(e.target);

				if ($el.data('event-type') == 'deleteCourse') {
					var courseId = $el.data('course-id');
					var course = scope.view.state.courses.list[courseId];

					courseActionCreators.deleteCourse(course);
					// Important: notify angular since this happends outside of the scope
					scope.$apply();
				} else if ($el.is('td, td *')) {
					// TODO: termCode and courseId may not be found if clicking on the first column ...
					var courseId = $el.closest("tr").data('course-id');
					var termCode = $el.closest("td").data('term-code');

					courseActionCreators.setActiveCell(courseId, termCode);
					// Important: notify angular since this happends outside of the scope
					scope.$apply();
				}
			});

		}
	}
});
