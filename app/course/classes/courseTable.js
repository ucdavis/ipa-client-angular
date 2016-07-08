var _CourseTable = function() {
	// Re-renders the table with the given 'data'.
	this.render = function(data) {
		$coursesTable = $("table.courses-table");

		// Clear the table
		$coursesTable.empty();

		// Render the header
		header = "<thead><tr><th class=\"sorting-asc\">Course</th>";
		
		$.each(data.scheduleTermStates.ids, function(i, termCode) {
			header += "<th class=\"sorting\">" + termCode + "</th>"
		});
		
		header += "<th class=\"ui-overlay\"></th></tr></thead>";

		$coursesTable.append(header);

		// Render the body
		body = "<tbody></tbody>";

		$.each(data.courses.ids, function(rowIdx, courseId) {
			var course = data.courses.list[courseId];

			var row = "<tr class=\"odd gradeX\" data-course-id=\"" + courseId + "\">";

			// First column
			row += "<td><strong>" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</strong> <br />" + course.title + "<br />";
			row += "Tags:";
			$.each(course.tags, function(i, tag) {
				row += "<div class=\"label\" style=\"padding: 3px; margin-left: 3px; background-color: " + tag.color + "\">" + tag.name + "</div>"
			});
			row += "</td>";

			// Term column(s)
			$.each(data.scheduleTermStates.ids, function(i, termCode) {
				var sectionGroup = data.sectionGroups.list[course.sectionGroupTermCodeIds[termCode]];
				var plannedSeats = sectionGroup ? sectionGroup.plannedSeats : "";
				var requiresAttention = false;

				row += "<td><div>";

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

		$coursesTable.append(body);
	}

	// Call this once to set up table events.
	this.registerEvents = function() {
		$("table.courses-table").keypress(function(e, $el) {
			if(e.which == 13) {
				$el = $(e.target);

				if($el.hasClass('planned-seats')) {
					termCode = $el.data('term-code');
					courseId = $el.closest("tr").data('course-id');

					// TODO: Save here.

				}
			}
		});

		// Emit sg-clicked event whenever a table <td> is clicked.
		$("table.courses-table").click(function(e, $el) {
			$el = $(e.target);

			if($el.is('td')) {
				// TODO: termCode and courseId may not be found if clicking on the first column ...
				termCode = $el.data('term-code');
				courseId = $el.closest("tr").data('course-id');

				$(document).trigger( "sg-clicked", [ termCode, courseId ] );
			}
		});
	}
};

// Don't judge me.
CourseTable = new _CourseTable();