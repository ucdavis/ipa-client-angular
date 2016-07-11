courseApp.directive("courseTable", this.courseTable = function ($rootScope, courseActionCreators) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			$rootScope.$on('courseStateChanged', function (event, data) {
				// Clear the table
				element.empty();

				// Render the header
				var header = "<thead><tr><th class=\"sorting-asc\">Course</th>";

				$.each(data.scheduleTermStates.ids, function(i, termCode) {
					header += "<th class=\"sorting\">" + termCode + "</th>"
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
					$.each(data.scheduleTermStates.ids, function(i, termCode) {
						var sectionGroup = data.sectionGroups.list[course.sectionGroupTermCodeIds[termCode]];
						var plannedSeats = sectionGroup ? sectionGroup.plannedSeats : "";

						// Calculate this boolean by comparing the sum of all section seats to the plannedSeats
						var requiresAttention = false;

						row += "<td data-term-code=\"" + termCode + "\" class=\"sg-cell\"><div>";

						if(requiresAttention) {
							row += "<div class=\"right-inner-addon form-group\"><i class=\"entypo-attention text-warning\"></i></div>";
						}

						row += "<input value=\"" + plannedSeats + "\" class=\"form-control planned-seats\" data-term-code=\"" + termCode + "\"></input>";
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
				if(e.which == 13) {
					$el = $(e.target);

					if($el.hasClass('planned-seats')) {
						var courseId = $el.closest("tr").data('course-id');
						var termCode = $el.data('term-code');

						courseActionCreators.saveOrCreateSectionGroup(courseId, termCode);
						// Important: notify angular since this happends outside of the scope
						scope.$apply();
					}
				}
			});

			// Emit sg-clicked event whenever a table <td> is clicked.
			element.click(function(e) {
				$el = $(e.target);

				if($el.is('td, td *')) {
					// TODO: termCode and courseId may not be found if clicking on the first column ...
					var courseId = $el.closest("tr").data('course-id');
					var termCode = $el.data('term-code');

					courseActionCreators.setActiveCell(courseId, termCode);
					// Important: notify angular since this happends outside of the scope
					scope.$apply();
				}
			});

		}
	}
});
