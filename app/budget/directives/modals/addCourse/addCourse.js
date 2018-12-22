import { isNumber } from 'shared/helpers/types';

import './addCourse.css';

let addCourse = function ($rootScope, BudgetActions, BudgetService, SectionService, TermService) {
  return {
    restrict: 'E',
    template: require('./addCourse.html'),
    replace: true,
    scope: {
      state: '<',
      isVisible: '='
    },
    link: function (scope) {
      scope.newCourse = {};
      scope.view = {};
      scope.sequenceNumberPlaceholder = "Example: '001' or 'A'";
      scope.termCode = TermService.termToTermCode(scope.state.ui.termNav.activeTerm, scope.state.ui.year);

      scope.newCourseValidation = {
        tooltipErrorMessage: "Select a course and enter a sequence pattern"
      };

      scope.submit = function () {
          BudgetActions.addCourse(scope.newCourse);
      };

      scope.close = function() {
        scope.isVisible = false;
      };

      scope.searchCourses = function (query) {
        return BudgetService.searchCourses(query).then(function (courseSearchResults) {
          return courseSearchResults.slice(0, 20);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not search courses.", type: "ERROR" });
        });
      };

      scope.isCourseUnique = function () {
        var newCourse = scope.newCourse;
        var courseDescription = newCourse.subjectCode + newCourse.courseNumber + newCourse.sequencePattern + scope.termCode;

        for (var i = 0; i < scope.state.calculatedCourseList.length; i++) {
          var slotCourseId = scope.state.courses.ids[i];
          var slotCourse = scope.state.courses.list[slotCourseId];

          if (slotCourse) {
            var slotCourseDescription = slotCourse.subjectCode + slotCourse.courseNumber + slotCourse.sequencePattern + slotCourse.termCode;

            // Proposed course already exists
            if (courseDescription == slotCourseDescription) {
              return false;
            }
          }
        }

        return true;
      };

      scope.searchCoursesResultSelected = function ($item) {
        scope.newCourse.title = $item.title;
        scope.newCourse.subjectCode = $item.subjectCode;
        scope.newCourse.courseNumber = $item.courseNumber;
        scope.newCourse.effectiveTermCode = $item.effectiveTermCode;
        scope.newCourse.unitsHigh = $item.creditHoursHigh;
        scope.newCourse.unitsLow = $item.creditHoursLow;

        delete scope.newCourse.sequencePattern;
        delete scope.newCourse.rawSequencePattern;
        scope.setDefaultSequencePattern();
      };

      scope.clearNewCourseSearch = function () {
        scope.newCourse = {};
        delete scope.view.newCourseSearchQuery;
        delete scope.view.noResults;
      };

      scope.unoccupiedSequencePatterns = function () {
        var occupiedSequencePatterns = scope.state.courses.ids
          .filter(function (courseId) {
            return scope.state.courses.list[courseId] && scope.view.selectedCourse &&
              scope.state.courses.list[courseId].subjectCode == scope.view.selectedCourse.subjectCode &&
              scope.state.courses.list[courseId].courseNumber == scope.view.selectedCourse.courseNumber;
          }).map(function (courseId) {
            return scope.state.courses.list[courseId].sequencePattern;
          });

        return sequencePatterns.filter(function (pattern) {
          return occupiedSequencePatterns.indexOf(pattern) < 0;
        });
      };

      scope.setDefaultSequencePattern = function () {
        var key = scope.newCourse.subjectCode + scope.newCourse.courseNumber + scope.termCode;
        var usedSequencePatterns = [];

        scope.state.calculatedCourseList.forEach(function(course) {
          var slotKey = course.subjectCode + course.courseNumber + course.termCode;

          if (key == slotKey) {
            usedSequencePatterns.push(course.sequencePattern);
          }
        });

        if (usedSequencePatterns.length == 0) {
          scope.newCourse.sequencePattern = "001";
          scope.newCourse.rawSequencePattern = "001";
        } else {
          scope.newCourse.sequencePattern = scope.generateNextSequencePattern(usedSequencePatterns);
          scope.newCourse.rawSequencePattern = angular.copy(scope.newCourse.sequencePattern); // eslint-disable-line no-undef
        }

        scope.validateCourse();
      };

      scope.generateNextSequencePattern = function (usedSequencePatterns) {
        if (!usedSequencePatterns || usedSequencePatterns.length == 0) { return "001"; }

        if (isNumber(usedSequencePatterns[0])) {
          var newSequencePattern = SectionService.formatSequenceNumber(parseInt(usedSequencePatterns[0]) + 1);

          for (var i = 1; usedSequencePatterns.indexOf(newSequencePattern) != -1; i++) {
            newSequencePattern = SectionService.formatSequenceNumber(parseInt(usedSequencePatterns[i]) + 1);
          }
        } else {
          var newSequencePattern = SectionService.formatSequenceNumber(String.fromCharCode(usedSequencePatterns[0] + 1));

          for (var i = 1; usedSequencePatterns.indexOf(newSequencePattern) != -1; i++) {
            newSequencePattern = SectionService.formatSequenceNumber(String.fromCharCode(usedSequencePatterns[i] + 1));
          }
        }

        return newSequencePattern;
      };

      scope.createCourse = function () {
        if (!scope.newCourseValidation.tooltipErrorMessage) {
          BudgetActions.createSectionGroupCost(scope.newCourse);
          scope.newCourseValidation.tooltipErrorMessage = "Select a course and enter a sequence pattern";
          scope.view.newCourseSearchQuery = null;
          scope.newCourse = null;
          scope.close();
        }
      };
      // returns false if either course of sequenceNumber is missing, and sets relevant validation
      scope.isCourseComplete = function () {
        var newCourse = scope.newCourse;

        if (newCourse.title && newCourse.sequencePattern) { return true; }

        // Select appropriate error message
        if (!newCourse.title && newCourse.sequencePattern) {
          scope.newCourseValidation.tooltipErrorMessage = "Select a course";
        } else if (newCourse.title && !newCourse.sequencePattern) {
          scope.newCourseValidation.tooltipErrorMessage = "Enter a sequence pattern";
        } else if (!newCourse.title && !newCourse.sequencePattern) {
          scope.newCourseValidation.tooltipErrorMessage = "Select a course and enter a sequence pattern";
        }

        return false;
      };

      // Will validate the course and set an error message if needed
      scope.validateCourse = function () {
        var newCourse = scope.newCourse;

        // Automatically perform zero padding and letter capitalizing for user
        newCourse.sequencePattern = SectionService.formatSequenceNumber(newCourse.rawSequencePattern);

        var courseDescription = newCourse.subjectCode + " " + newCourse.courseNumber + " - " + newCourse.sequencePattern;

        // Ensure both course and sequence number have been filled out
        if (scope.isCourseComplete() == false) { return; }

        if (SectionService.isSequencePatternValid(newCourse.sequencePattern) == false) {
          scope.newCourseValidation.tooltipErrorMessage = "Sequence pattern format is incorrect. Valid formats are '3 numbers' (ex: '002') or 'a letter' ('ex: 'A').";
          return;
        }

        if (scope.isCourseUnique() == false) {
          scope.newCourseValidation.tooltipErrorMessage = "Course " + courseDescription + " is already present on this schedule.";
          return;
        }

        // Is valid
        scope.newCourseValidation.tooltipErrorMessage = null;
      };
    }
  };
};

export default addCourse;
