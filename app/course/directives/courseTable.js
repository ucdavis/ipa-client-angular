import { isNumber } from 'shared/helpers/types';
import { _ } from 'underscore';

/**
 * Provides the main course table in the Courses View
 */
let courseTable = function ($rootScope, $timeout, CourseActionCreators, $compile, ActionTypes) {

  return {
    restrict: 'A',
    template: '<thead><tr><th>&nbsp;</th></tr></thead><tbody><tr><td>' +
    '<div style="width: 100%;" align="center" class="text-muted">' +
    '<img src="/images/ajax-loader.gif" style="width: 32px; height: 32px;" /> &nbsp; Loading schedule</div>' +
    '</td></tr></tbody>',
    link: function (scope, element) {
      var self = this;

      scope.view = {};

      scope.previouslySelectedCourseId = null;
      scope.previouslySelectedTermCode = null;

      // To limit the cases of rerendering the table, this the list of actions that will cause it to do so
      var rerenderStateActions = [
        ActionTypes.INIT_STATE,
        ActionTypes.IMPORT_COURSES,
        ActionTypes.NEW_COURSE,
        ActionTypes.CREATE_COURSE,
        ActionTypes.REMOVE_COURSE,
        ActionTypes.UPDATE_COURSE,
        ActionTypes.CELL_SELECTED,
        ActionTypes.CLOSE_DETAILS,
        ActionTypes.CLOSE_NEW_COURSE_DETAILS,
        ActionTypes.UPDATE_TABLE_FILTER,
        ActionTypes.TOGGLE_TERM_FILTER,
        ActionTypes.BEGIN_IMPORT_MODE,
        ActionTypes.END_IMPORT_MODE,
        ActionTypes.SEARCH_IMPORT_COURSES,
        ActionTypes.UPDATE_TAG_FILTERS,
        ActionTypes.TOGGLE_UNPUBLISHED_COURSES,
        ActionTypes.REMOVE_SECTION_GROUP,
        ActionTypes.ADD_SECTION_GROUP,
        ActionTypes.DELETE_MULTIPLE_COURSES,
        ActionTypes.MASS_ASSIGN_TAGS
      ];

      $rootScope.$on('courseStateChanged', function (event, data) {
        // Rerender only if on of the specified state actions
        if (rerenderStateActions.indexOf(data.action.type) < 0) { return; }

        if (data.action.type == ActionTypes.CLOSE_DETAILS) {
          // Remove existing highlighting
          element.find('tbody > tr').removeClass("selected-tr");
          element.find('tbody > tr > td').removeClass("selected-td");

          return;
        }

        if (data.action.type == ActionTypes.ADD_SECTION_GROUP) {
          // Indicate on the textbox that the sectionGroup is offered
          $('tr[data-course-id="' + data.action.payload.sectionGroup.courseId + '"] td[data-term-code="' + data.action.payload.sectionGroup.termCode + '"]').addClass("is-offered");

          return;
        }

        if (data.action.type == ActionTypes.REMOVE_SECTION_GROUP) {
          // Empty the textbox
          $('tr[data-course-id="' + data.action.payload.sectionGroup.courseId + '"] td[data-term-code="' + data.action.payload.sectionGroup.termCode + '"] input.planned-seats').val("");
          $('tr[data-course-id="' + data.action.payload.sectionGroup.courseId + '"] td[data-term-code="' + data.action.payload.sectionGroup.termCode + '"]').removeClass("is-offered");

          return;
        }

        if (data.action.type == ActionTypes.CELL_SELECTED) {
          if (scope.previouslySelectedCourseId == data.state.uiState.selectedCourseId
              && scope.previouslySelectedTermCode == data.state.uiState.selectedTermCode) {
              return;
          }

          scope.previouslySelectedCourseId = data.state.uiState.selectedCourseId;
          scope.previouslySelectedTermCode = data.state.uiState.selectedTermCode;

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

          scope.manuallyDeselectAllCourseRows();
          scope.manuallyToggleSelectedCourse(data.state.uiState.selectedCourseId);
          CourseActionCreators.deselectAllCourseRows();
          CourseActionCreators.toggleSelectCourse(data.state.uiState.selectedCourseId);

          return;
        }

        scope.view.state = data.state;

        // Clear the table
        element.empty();

        // Lock table if appropriate
        if (data.state.uiState.tableLocked) {
          element.addClass("locked-courses-table");
        } else {
          element.removeClass("locked-courses-table");
        }

        // Gray out table if appropriate
        if (data.state.uiState.tableGrayedOut) {
          element.addClass("grayed-out-courses-table");
        } else {
          element.removeClass("grayed-out-courses-table");
        }

        // Render the header
        // TODO: Add class 'sorting-asc', 'sorting-desc', or 'sorting' to indicate sort direction
        var isChecked = (data.state.courses.ids != 0 && data.state.uiState.selectedCourseRowIds.length == data.state.courses.ids.length);
        var header = '<thead><tr><th class="checkbox-cell">' + scope.getCheckbox(0, "selectAllCourseRows", isChecked) + "</th><th class=\"\">Course</th>";

        // Filter scope.termDefinitions to only those terms which are enabled by the filter.
        // Store this in termsToRender.
        var termsToRender = [];
        $.each(scope.termDefinitions, function (i, term) {
          if (data.state.filters.enabledTerms.indexOf(Number(term.shortCode)) != -1) {
            termsToRender.push(term);
          }
        });

        $.each(termsToRender, function (i, termToRender) {
          header += "<th class=\"\">" + termToRender.description + "</th>";
        });

        header += "<th class=\"ui-overlay\"></th></tr></thead>";

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
              body += scope.getImportCourseRow(course, termsToRender, data.state);
            } else {
              body += scope.getCourseRow(rowIdx, course.id, termsToRender, data.state);
            }
          });
        } else if (data.state.courses.ids.length) {
          var allContentFilteredOut = true;

          $.each(data.state.courses.ids, function (rowIdx, courseId) {
            var row = scope.getCourseRow(rowIdx, courseId, termsToRender, data.state);

            if (row) {
              allContentFilteredOut = false;
            }

            body += row;
          });

          if (allContentFilteredOut) {
            // One for checkbox, and one for course title
            var miscColumns = 2;
            var numberOfColumns = data.state.filters.enabledTerms.length + miscColumns;

            body += "<tr><td class=\"text-center text-muted\" colspan=\"" + numberOfColumns + "\">All courses filtered out</td></tr>";
          }
        } else {
          // One for checkbox, and one for course title
          var miscColumns = 2;
          var numberOfColumns = data.state.filters.enabledTerms.length + miscColumns;
          body += "<tr><td class=\"text-center text-muted\" colspan=\"" + numberOfColumns + "\">No Courses</td></tr>";
        }

        body += scope.getTotalsRow(termsToRender, data.state);
        element.append(header + body);

        $('delete-course').popover();

        element.find('input.planned-seats').blur(function (e) {
          $timeout(function () {
            let $el = $(e.target);
            scope.savePlannedSeats($el, scope, CourseActionCreators);

            // Important: notify angular since this happens outside of the scope
            scope.$apply();
          }, 500);
        }).focus(function (e) {
          // Select the cell when the input is focused (In case user tabs between inputs)
          let $el = $(e.target);
          // Select a cell/row
          let courseId = $el.closest("tr").data('course-id');
          var termCode = $el.closest("td").data('term-code');

          CourseActionCreators.setActiveCell(courseId, termCode);
          // Important: notify angular since this happens outside of the scope
          $timeout(function () {
            scope.$apply();
          });
        });
      });

      // Call this once to set up table events.
      element.keypress(function (e) {
        if (e.which == 13) {
          // ENTER button pressed
          let $el = $(e.target);

          if ($el.hasClass('planned-seats')) {
            scope.savePlannedSeats($el, scope, CourseActionCreators);

            // Important: notify angular since this happens outside of the scope
            $timeout(function () {
              scope.$apply();
            });
          }
        } else if (e.which == 45) {
          // Disallow '-' value
          e.preventDefault();
        }
      });

      // Emit sg-clicked event whenever a table <td> is clicked.
      // I'm sorry. Really.
      element.click(function (e) {
        let $el = $(e.target);
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

          CourseActionCreators.deleteCourse(course);
          // Important: notify angular since this happens outside of the scope
          $timeout(function () {
            scope.$apply();
          });
        } else if ($el.data('event-type') == 'dismissCoursePop') {
          // Dismiss the delete course dialog

          // Make the ui-overlay invisible again
          $el.closest('td.ui-overlay').css('visibility', '');
          $el.closest("div.popover").siblings("i.delete-course").popover('hide');
        } else if ($el.data('event-type') == 'addCourse') {
          // Add a course

          var index = $el.data('index');

          CourseActionCreators.newCourse(index);
          // Important: notify angular since this happens outside of the scope
          $timeout(function () {
            scope.$apply();
          });
        } else if ($el.data('event-type') == 'selectCourseRow') {
          var courseId = $el.data('course-id');
          scope.manuallyToggleSelectedCourse(courseId);
          CourseActionCreators.toggleSelectCourse(courseId);

          $timeout(function () {
            scope.$apply();
          });
        } else if ($el.data('event-type') == 'selectAllCourseRows') {
          var isChecked = $el.data('is-checked');

          if (isChecked) {
            scope.manuallyDeselectAllCourseRows();

            CourseActionCreators.deselectAllCourseRows();
            $timeout(function () {
              scope.$apply();
            });
          } else {
            scope.manuallySelectAllCourseRows();
            CourseActionCreators.selectAllCourseRows(scope.view.state.courses.ids);
            $timeout(function () {
              scope.$apply();
            });
          }
        } else if ($el.is('td:not(.new-course-td):not(.import-course), td:not(.new-course-td):not(.import-course) *')) {
          // Select a cell/row
          courseId = $el.closest("tr").data('course-id');
          var termCode = $el.closest("td").data('term-code');

          CourseActionCreators.setActiveCell(courseId, termCode);
          // Important: notify angular since this happens outside of the scope
          $timeout(function () {
            scope.$apply();
          });
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

          CourseActionCreators.toggleImportCourse(courseSubjectCode, courseNumber, courseSequencePattern);
          // Important: notify angular since this happens outside of the scope
          $timeout(function () {
            scope.$apply();
          });
        }
      });

      element.bind('mousewheel', function (e) {
        let $el = $(e.target);

        // Disable scrolling on number inputs as it might increase accidental changes
        if ($el.hasClass('planned-seats') && $el.is(":focus") ) {
          e.preventDefault();
        }
      });

      // For performance reasons, the 'DESELECT_ALL_COURSE_ROWS' action does not trigger the courses table to re-render from scratch
      // Instead, this method manually modifies the table while the state is updated independently
      scope.manuallyDeselectAllCourseRows = function() {
        $(".courses-table .checkbox-replace").removeClass("checked");
        $('div[data-is-checked]').data('is-checked', false);
      };

      // For performance reasons, the 'TOGGLE_SELECT_COURSE_ROW' action does not trigger the courses table to re-render from scratch
      // Instead, this method manually modifies the table while the state is updated independently
      scope.manuallyToggleSelectedCourse = function(courseId) {
        $('.courses-table .checkbox-container*[data-course-id="' + courseId + '"] .checkbox-replace').first().toggleClass("checked");
      };

      // For performance reasons, the 'SELECT_ALL_COURSE_ROWS' action does not trigger the courses table to re-render from scratch
      // Instead, this method manually modifies the table while the state is updated independently
      scope.manuallySelectAllCourseRows = function() {
        $(".courses-table .checkbox-replace").addClass("checked");
        $('div[data-is-checked]').data('is-checked', true);
      };

      scope.getCheckbox = function(courseId, type, isChecked) {
        var checkedClass = (isChecked == true) ? " checked" : "";
      
        return '' +
        '<div class="checkbox-container" data-event-type="' + type + '" data-course-id="' + courseId + '" data-is-checked="' + isChecked + '">' +
            '<div class="checkbox checkbox-replace color-primary neon-cb-replacement' + checkedClass + '" data-event-type="' + type + '" data-course-id="' + courseId + '" data-is-checked="' + isChecked + '">' +
              '<label class="cb-wrapper" data-event-type="' + type + '" data-course-id="' + courseId + '" data-is-checked="' + isChecked + '">' +
                '<div class="checked" data-event-type="' + type + '" data-course-id="' + courseId + '" data-is-checked="' + isChecked + '"></div>' +
              '</label>' +
            '</div>' +
          '</div>';
      };


      scope.selectAll = function() {
        console.log("select all courses");
      };

      scope.selectCourse = function() {
        console.log("selected course");
      };

      scope.getImportCourseRow = function (course, termsToRender, state) {
        var rowClass = course.import ? "selected-import-course" : "";
        var checkboxClass = course.import ? "fa-check-square-o" : "fa-square-o";
        var row = "<tr class=\"odd gradeX clickable " + rowClass + "\" data-course-subject-code=\"" + course.subjectCode + "\"" +
          "data-course-number=\"" + course.courseNumber + "\" data-course-sequence-pattern=\"" + course.sequencePattern + "\" >";

          var isChecked = false;
          row += '<td class="checkbox-cell">' + scope.getCheckbox(0, "", false) + "</td>";

          row += "<td class=\"import-course course-cell\">" +
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

      // Renders a course row for all courses except when in mass import mode,
      // when the "proposed rows" will be rendered by getImportCourseRow.
      scope.getCourseRow = function (rowIdx, courseId, termsToRender, state) {
        var rowClass = "odd gradeX";

        if (state.uiState.selectedCourseId == courseId) {
          rowClass += " selected-tr";
        }
        var row = "<tr class=\"" + rowClass + "\" data-course-id=\"" + courseId + "\" >";

        var isChecked = (state.uiState.selectedCourseRowIds.indexOf(courseId) > -1);

        row += '<td class="checkbox-cell">' + scope.getCheckbox(courseId, "selectCourseRow", isChecked) + "</td>";

        if (courseId === 0) {
          var numOfColumns = termsToRender.length + 1;
          row += "<td class=\"new-course-td\" colspan=\"" + numOfColumns + "\">Adding a new course</td><td class=\"ui-overlay\"></td>";
        } else {
          var course = state.courses.list[courseId];
          if (course.isFiltered || course.matchesTagFilters === false) { return; }

          // First column
          row += "<td class=\"course-cell\"><strong>" + course.subjectCode + " " + course.courseNumber + " - " + course.sequencePattern + "</strong> <br />" + course.title + "<br />";
          if (course.tagIds.length) {
            row += "<div class=\"hidden-print\">";
            $.each(course.tagIds, function (i, tagId) {
              var tag = state.tags.list[tagId];
              var bgColor = tag.color ? tag.color : "#333";
              row += "<div class=\"label\" style=\"padding: 3px; margin-left: 3px; background-color: " + bgColor + "; color: " + tag.getTextColor() + "; \">" + tag.name + "</div>";
            });
            row += "</div>";
          }
          row += "</td>";

          var courseSgs = _.filter(state.sectionGroups.list, function (sg) { return sg.courseId == courseId; });

          // Term column(s)
          $.each(termsToRender, function (i, termToRender) {
            var termCode = termToRender.code;
            var sectionGroup = _.find(courseSgs, function (sg) { return sg.termCode == termCode; });
            var sectionGroupId = sectionGroup ? sectionGroup.id : 0;
            var plannedSeats = (sectionGroup && sectionGroup.plannedSeats) ? sectionGroup.plannedSeats : "";

            // TODO: Calculate this boolean by comparing the sum of all section seats to the plannedSeats
            var requiresAttention = false;

            // Determine if the term is readonly
            var term = state.terms.list[termCode];
            var cellClass = sectionGroupId ? "sg-cell is-offered" : "sg-cell";

            row += "<td data-term-code=\"" + termCode + "\" class=\"" + cellClass + "\"><div>";
            if (state.uiState.tableLocked) {
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

      scope.savePlannedSeats = function ($el, scope, CourseActionCreators) {
        var courseId = $el.closest("tr").data('course-id');
        var termCode = $el.closest("td").data('term-code').toString();
        var sectionGroup = _.findWhere(scope.view.state.sectionGroups.list, { courseId: courseId, termCode: termCode });
        var plannedSeats = $el.val() === "" ? null : parseInt($el.val());

        if (isNaN(plannedSeats)) { return; }

        if (sectionGroup) {
          // Ignore if unchanged
          if (sectionGroup.plannedSeats == plannedSeats) {
            return;
          }

          // Save existing sectionGroup
          sectionGroup.plannedSeats = plannedSeats;
          CourseActionCreators.updateSectionGroup(sectionGroup);

          // If sequence is numeric sync the seats on the section to the new sectionGroup value
          scope.view.state.sections.ids.forEach(function(sectionId) {
            var section = scope.view.state.sections.list[sectionId];

            if (section.sectionGroupId == sectionGroup.id && isNumber(section.sequenceNumber)) {
              section.seats = sectionGroup.plannedSeats;
              CourseActionCreators.updateSection(section);
            }
          });

        } else if (plannedSeats) {
          // Create a new sectionGroup
          sectionGroup = {
            courseId: courseId,
            termCode: termCode,
            plannedSeats: plannedSeats
          };
          CourseActionCreators.addSectionGroup(sectionGroup);
        }
      };

      /* Generates the final row of the table, containing seat totals */
      /* 248ms-258ms */
      scope.getTotalsRow = function (termsToRender, state) {
        var row = "<tr class=\"term-totals\"><td><!-- checkbox --></td><td>Totals</td>";

        var termCount = {};

        _.each(state.sectionGroups.list, function(sg) {
          if(termCount[sg.termCode] === undefined) {
            termCount[sg.termCode] = sg.plannedSeats;
          } else {
            termCount[sg.termCode] += sg.plannedSeats;
          }
        });

        termsToRender.forEach(function (term) {
          row += "<td>" + termCount[term.code] + "</td>";
        });

        row += "</tr>";

        if (state.courses.ids.length) { return row; }
      };
    }
  };
};

export default courseTable;
