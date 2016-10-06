/**
 * Provides the main course table in the Courses View
 */
courseApp.directive("courseTable", this.courseTable = function ($rootScope, courseActionCreators) {
	return {
		restrict: 'A',
		template: '<thead><tr><th>&nbsp;</th></tr></thead><tbody><tr><td>' +
		'<div style="width: 100%;" align="center" class=\"text-muted\">' +
		'<img src="/images/ajax-loader.gif" /> &nbsp; Loading schedule</div>' +
		'</td></tr></tbody>',
		link: function (scope, element, attrs) {
			scope.view = {};
			var rerenderStateActions = [
				INIT_STATE,
				IMPORT_COURSES,
				NEW_COURSE,
				CREATE_COURSE,
				REMOVE_COURSE,
				UPDATE_COURSE,
				CELL_SELECTED,
				CLOSE_DETAILS,
				CLOSE_NEW_COURSE_DETAILS,
				UPDATE_TABLE_FILTER,
				TOGGLE_TERM_FILTER,
				BEGIN_IMPORT_MODE,
				END_IMPORT_MODE,
				SEARCH_IMPORT_COURSES,
				ADD_SECTION_GROUP,
				UPDATE_TAG_FILTERS,
				TOGGLE_UNPUBLISHED_COURSES
			];

			$rootScope.$on('courseStateChanged', function (event, data) {
				// Rerender only if on of the specified state actions
				if (rerenderStateActions.indexOf(data.actionType) < 0) { return; }

				if (data.actionType == CLOSE_DETAILS) {
					// Remove existing highlighting
					element.find('tbody > tr').removeClass("selected-tr");
					element.find('tbody > tr > td').removeClass("selected-td");

					return;
				}

				if (data.actionType == CELL_SELECTED) {
					// Remove existing highlighting
					element.find('tbody > tr').removeClass("selected-tr");
					element.find('tbody > tr > td').removeClass("selected-td");

					if (data.state.uiState.selectedCourseId && !data.state.uiState.selectedTermCode) {
						// Highlight row if a course is selected
						$('tr[data-course-id="' + data.state.uiState.selectedCourseId + '"]').addClass("selected-tr");
					} else if (data.state.uiState.selectedCourseId && data.state.uiState.selectedTermCode) {
						// Highlight single cell if a sectionGroup is selected
						$('tr[data-course-id="' + data.state.uiState.selectedCourseId + '"] td[data-term-code="' + data.state.uiState.selectedTermCode + '"]').addClass("selected-td");
					}

					return;
				}

				// Set the correct section-group-id on the newly created sectionGroup cell
				if (data.actionType == ADD_SECTION_GROUP) {
					var sectionGroup = _.find(scope.view.state.sectionGroups.list, function (sg) {
						return (sg.termCode == data.state.uiState.selectedTermCode) && (sg.courseId == data.state.uiState.selectedCourseId);
					});

					if (sectionGroup) {
						$('tr[data-course-id="' + data.state.uiState.selectedCourseId + '"] td[data-term-code="' + data.state.uiState.selectedTermCode + '"]')
							.data('section-group-id', sectionGroup.id);
					} else {
						// Throw an exception with more details for further debugging: https://github.com/ucdavis/ipa-client-angular/issues/441
						var message = "Could not find a sectionGroup for termCode: " +
							data.state.uiState.selectedTermCode + ", and courseId: " +
							data.state.uiState.selectedCourseId + ". Current sectionGroupIds are: " +
							scope.view.state.sectionGroups.ids.join();
						var stack = "app/course/directives/courseTable.js";

						throw ({
							"message": message,
							"stack": stack
						});
					}

					return;
				}

				scope.view.state = data.state;

				if (data.state.uiState.tableLocked) {
					element.addClass("disabled-courses-table");
				} else {
					element.removeClass("disabled-courses-table");
				}

				// Clear the table
				element.empty();

				// Render the header
				// TODO: Add class 'sorting-asc', 'sorting-desc', or 'sorting' to indicate sort direction
				var header = "<thead><tr><th class=\"\">Course</th>";

				// Filter scope.termDefinitions to only those terms which are enabled by the filter.
				// Store this in termsToRender.
				var termsToRender = [];
				$.each(scope.termDefinitions, function (i, term) {
					if (data.state.filters.enabledTerms.indexOf(Number(term.shortCode)) != -1) {
						termsToRender.push(term);
					}
				});

				$.each(termsToRender, function (i, term) {
					// TODO: Add class 'sorting-asc', 'sorting-desc', or 'sorting' to indicate sort direction
					var termState = data.state.scheduleTermStates.list[term.code];
					var lockedIcon = "";
					if (termState && termState.isLocked) {
						lockedIcon = "<i class=\"fa fa-lock term-lock\"></i>";
					}

					header += "<th class=\"\">" + term.description + lockedIcon + "</th>";
				});

				header += "<th class=\"ui-overlay\"></th></tr></thead>";

				element.append(header);

				// Render the body
				var body = "<tbody></tbody>";

				if (data.state.courses.importList) {
					var coursesArray = data.state.courses.ids.map(function (id) { return data.state.courses.list[id]; });
					var blendedCoursesArray = coursesArray.concat(data.state.courses.importList);
					// TODO: handle different sorting options here
					var sortedBlendedCoursesArray = _.sortBy(blendedCoursesArray, function (course) {
						return course.subjectCode + course.courseNumber + course.sequenceNumber;
					});

					$.each(sortedBlendedCoursesArray, function (rowIdx, course) {
						if (course.id === undefined) {
							body += getImportCourseRow(course, termsToRender, data.state);
						} else {
							body += getCourseRow(rowIdx, course.id, termsToRender, data.state);
						}
					});
				} else if (data.state.courses.ids.length) {
					$.each(data.state.courses.ids, function (rowIdx, courseId) {
						body += getCourseRow(rowIdx, courseId, termsToRender, data.state);
					});
				} else {
					var numberOfColumns = data.state.filters.enabledTerms.length + 1;
					body += "<tr><td class=\"text-center text-muted\" colspan=\"" + numberOfColumns + "\">No Courses</td></tr>";
				}

				body += getTotalsRow(termsToRender, data.state);
				element.append(body);
				$('delete-course').popover();
				element.find('input.planned-seats').blur(function (e) {
					$el = $(e.target);
					savePlannedSeats($el, scope, courseActionCreators);
				});
			});

			// Call this once to set up table events.
			element.keypress(function (e) {
				if (e.which == 13) {
					// ENTER button pressed
					$el = $(e.target);

					if ($el.hasClass('planned-seats')) {
						savePlannedSeats($el, scope, courseActionCreators);
					}
				} else if (e.which == 45) {
					// Disallow '-' value
					e.preventDefault();
				}
			});

			// Emit sg-clicked event whenever a table <td> is clicked.
			// I'm sorry. Really.
			element.click(function (e) {
				$el = $(e.target);
				var courseId;

				if ($el.data('event-type') == 'deleteCoursePop') {
					// Delete course confirmation

					// Make the overlay td always visible to keep the popover visible
					$el.closest('td.ui-overlay').css('visibility', 'visible');
					$el.popover('show');
				} else if ($el.data('event-type') == 'deleteCourse') {
					// Delete the course after the action is confirmed

					courseId = $el.data('course-id');
					var course = scope.view.state.courses.list[courseId];

					courseActionCreators.deleteCourse(course);
					// Important: notify angular since this happends outside of the scope
					scope.$apply();
				} else if ($el.data('event-type') == 'dismissCoursePop') {
					// Dismiss the delete course dialog

					// Make the ui-overlay invisible again
					$el.closest('td.ui-overlay').css('visibility', '');
					$el.closest("div.popover").siblings("i.delete-course").popover('hide');
				} else if ($el.data('event-type') == 'addCourse') {
					// Add a course

					var index = $el.data('index');

					courseActionCreators.newCourse(index);
					// Important: notify angular since this happends outside of the scope
					scope.$apply();
				} else if ($el.is('td:not(.new-course-td):not(.import-course), td:not(.new-course-td):not(.import-course) *')) {
					// Select a cell/row

					// TODO: termCode and courseId may not be found if clicking on the first column ...
					courseId = $el.closest("tr").data('course-id');
					var termCode = $el.closest("td").data('term-code');

					courseActionCreators.setActiveCell(courseId, termCode);
					// Important: notify angular since this happends outside of the scope
					scope.$apply();
				} else if ($el.is('td.import-course, td.import-course *')) {
					// Toggle import flag on the mass import courses list

					var row = $el.closest("tr");
					var courseSubjectCode = row.data('course-subject-code');
					var courseNumber = row.data('course-number');
					var courseSequencePattern = row.data('course-sequence-pattern');
					var checkBox = row.find('div.import-course-check i');

					if (checkBox.hasClass('fa-square-o')) {
						checkBox.removeClass('fa-square-o').addClass('fa-check-square-o');
						row.addClass('selected-import-course');
					} else {
						checkBox.removeClass('fa-check-square-o').addClass('fa-square-o');
						row.removeClass('selected-import-course');
					}

					courseActionCreators.toggleImportCourse(courseSubjectCode, courseNumber, courseSequencePattern);
					// Important: notify angular since this happends outside of the scope
					scope.$apply();
				}
			});

		}
	};
});

var getImportCourseRow = function (course, termsToRender, state) {
	var rowClass = course.import ? "selected-import-course" : "";
	var checkboxClass = course.import ? "fa-check-square-o" : "fa-square-o";
	var row = "<tr class=\"odd gradeX clickable " + rowClass + "\" data-course-subject-code=\"" + course.subjectCode + "\"" +
		"data-course-number=\"" + course.courseNumber + "\" data-course-sequence-pattern=\"" + course.sequencePattern + "\" >" +
		"<td class=\"import-course course-cell\">" +
		"<div class=\"import-course-check\"><i class=\"fa " + checkboxClass + "\"></i></div>" +
		"<div class=\"import-course-description\"><strong>" +
		course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern +
		"</strong><br />" + course.title + "</div></td>";
	$.each(termsToRender, function (i, term) {
		var termCode = term.code;
		var once = true;
		var sectionGroup = _.find(state.sectionGroups.importList, function (sg) {
			return (sg.termCode.slice(-2) == termCode.slice(-2)) &&
				(sg.subjectCode == course.subjectCode) &&
				(sg.courseNumber == course.courseNumber) &&
				(sg.sequencePattern == course.sequencePattern);
		});
		var plannedSeats = sectionGroup ? sectionGroup.plannedSeats : "";

		row += "<td data-term-code=\"" + termCode + "\" class=\"sg-cell import-course\"><div>" + plannedSeats + "</div></td>";
	});
	row += "</tr>";
	return row;
};

var getCourseRow = function (rowIdx, courseId, termsToRender, state) {
	var rowClass = "odd gradeX";
	if (state.uiState.selectedCourseId == courseId) {
		rowClass += " selected-tr";
	}
	var row = "<tr class=\"" + rowClass + "\" data-course-id=\"" + courseId + "\" >";

	if (courseId === 0) {
		var numOfColumns = termsToRender.length + 1;
		row += "<td class=\"new-course-td\" colspan=\"" + numOfColumns + "\">Adding a new course</td><td class=\"ui-overlay\"></td>";
	} else {
		var course = state.courses.list[courseId];
		if (course.isFiltered || course.matchesTagFilters === false) { return; }

		// First column
		row += "<td class=\"course-cell\"><strong>" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</strong> <br />" + course.title + "<br />";
		if (course.tagIds.length) {
			row += "<div class=\"hidden-print\">Tags:";
			$.each(course.tagIds, function (i, tagId) {
				var tag = state.tags.list[tagId];
				var bgColor = tag.color ? tag.color : "#333";
				row += "<div class=\"label\" style=\"padding: 3px; margin-left: 3px; background-color: " + bgColor + "; color: " + tag.getTextColor() + "; \">" + tag.name + "</div>";
			});
			row += "</div>";
		}
		row += "</td>";

		// Term column(s)
		$.each(termsToRender, function (i, term) {
			var termCode = term.code;
			var sectionGroup = _.find(state.sectionGroups.list, function (sg) { return (sg.termCode == termCode) && (sg.courseId == courseId); });
			var sectionGroupId = sectionGroup ? sectionGroup.id : 0;
			var plannedSeats = sectionGroup ? sectionGroup.plannedSeats : "";

			// TODO: Calculate this boolean by comparing the sum of all section seats to the plannedSeats
			var requiresAttention = false;

			// Determine if the term is readonly
			var termState = state.scheduleTermStates.list[termCode];
			var isLocked = termState ? termState.isLocked : true;

			row += "<td data-term-code=\"" + termCode + "\" data-section-group-id=\"" + sectionGroupId + "\" class=\"sg-cell\"><div>";
			if (isLocked) {
				row += plannedSeats;
			} else {
				if (requiresAttention) {
					row += "<div class=\"right-inner-addon form-group\"><i class=\"entypo-attention text-warning\"></i></div>";
				}
				row += "<input type=\"number\" min=\"0\" value=\"" + plannedSeats + "\" class=\"form-control planned-seats\"></input>";
			}

			row += "</div></td>";
		});

		// Actions column
		var popoverTemplate = "Are you sure you want to delete " + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "? <br />" +
			"<div class='text-center'><button class='btn btn-red' data-event-type='deleteCourse' data-course-id='" + courseId + "'>Delete</button>" +
			"<button class='btn btn-white' data-event-type='dismissCoursePop'>Cancel</button></div>";
		row += "<td class=\"ui-overlay\"><i class=\"btn add-before entypo-plus-circled\" data-event-type=\"addCourse\" data-index=\"" + rowIdx + "\" ></i>";
		row += "<i class=\"btn delete-sg entypo-minus-circled delete-course\" data-event-type=\"deleteCoursePop\" " +
			"data-toggle=\"popover\" data-html=\"true\" data-content=\"" + popoverTemplate + "\"></i>";
		row += "<i class=\"btn add-after entypo-plus-circled\" data-event-type=\"addCourse\" data-index=\"" + (rowIdx + 1) + "\" ></i></td>";
	}

	row += "</tr>";
	return row;
};

var savePlannedSeats = function ($el, scope, courseActionCreators) {
	var courseId = $el.closest("tr").data('course-id');
	var termCode = $el.closest("td").data('term-code').toString();
	var sectionGroupId = $el.closest("td").data('section-group-id');
	var plannedSeats = parseInt($el.val());
	var sectionGroup;

	if (isNaN(plannedSeats)) { return; }

	if (sectionGroupId) {
		// Ignore if unchanged
		if (scope.view.state.sectionGroups.list[sectionGroupId].plannedSeats == plannedSeats) {
			return;
		}

		// Save existing sectionGroup
		sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
		sectionGroup.plannedSeats = plannedSeats;
		courseActionCreators.updateSectionGroup(sectionGroup);
	} else {
		// Create a new sectionGroup
		sectionGroup = {
			courseId: courseId,
			termCode: termCode,
			plannedSeats: plannedSeats
		};
		courseActionCreators.addSectionGroup(sectionGroup);
	}

	// Important: notify angular since this happends outside of the scope
	scope.$apply();
};

var getTotalsRow = function (termsToRender, state) {
	var row = "<tr class=\"term-totals\"><td>Totals</td>";
	var coursesArray = state.courses.ids.map(function (id) { return state.courses.list[id]; });

	termsToRender.forEach(function (term) {
		var termTotal = state.courses.ids.reduce(function (total, courseId) {
			var sectionGroup = _.find(state.sectionGroups.list, function (sg) { return (sg.termCode == term.code) && (sg.courseId == courseId); });
			var sectionGroupId = sectionGroup ? sectionGroup.id : 0;
			var plannedSeats = sectionGroup ? sectionGroup.plannedSeats : 0;

			return total + plannedSeats;
		}, 0);
		row += "<td>" + termTotal + "</td>";
	});

	row += "</tr>";

	if (state.courses.ids.length) { return row; }
};