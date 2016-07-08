courseApp.directive("courseTable", this.courseTable = function () {
	return {
		restrict: 'A',
		scope: {
			data: '='
		},
		link: function (scope, element, attrs) {
			scope.$watch("data", function () {
				if (scope.data == undefined) { return; }

				// Clear the table
				element.empty();

				// Render the header
				var header = "<thead><tr><th class=\"sorting-asc\">Course</th>";

				$.each(scope.data.scheduleTermStates.ids, function(i, termCode) {
					header += "<th class=\"sorting\">" + termCode + "</th>"
				});

				header += "<th class=\"ui-overlay\"></th></tr></thead>";

				element.append(header);

				// Render the body
				var body = "<tbody></tbody>";

				$.each(scope.data.courses.ids, function(rowIdx, courseId) {
					var course = scope.data.courses.list[courseId];

					var row = "<tr class=\"odd gradeX\" data-course-id=\"" + courseId + "\">";

					// First column
					row += "<td><strong>" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</strong> <br />" + course.title + "<br />";
					row += "Tags:";
					$.each(course.tags, function(i, tag) {
						row += "<div class=\"label\" style=\"padding: 3px; margin-left: 3px; background-color: " + tag.color + "\">" + tag.name + "</div>"
					});
					row += "</td>";

					// Term column(s)
					$.each(scope.data.scheduleTermStates.ids, function(i, termCode) {
						var sectionGroup = scope.data.sectionGroups.list[course.sectionGroupTermCodeIds[termCode]];
						var plannedSeats = sectionGroup ? sectionGroup.plannedSeats : "";

						// Calculate this boolean by comparing the sum of all section seats to the plannedSeats
						var requiresAttention = false;

						row += "<td data-term-code=\"" + termCode + "\"><div>";

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


			// Call this once to set up table events.
			element.keypress(function (e, $el) {
				if(e.which == 13) {
					$el = $(e.target);

					if($el.hasClass('planned-seats')) {
						var termCode = $el.data('term-code');
						var courseId = $el.closest("tr").data('course-id');

						// TODO: Save here.
						console.log(termCode, courseId);
					}
				}
			});

			// Emit sg-clicked event whenever a table <td> is clicked.
			element.click(function(e, $el) {
				$el = $(e.target);

				if($el.is('td, td *')) {
					// TODO: termCode and courseId may not be found if clicking on the first column ...
					var termCode = $el.data('term-code');
					var courseId = $el.closest("tr").data('course-id');

					$(document).trigger( "sg-clicked", [ termCode, courseId ] );
					console.log(termCode, courseId);
				}
			});

		}
	}
});
