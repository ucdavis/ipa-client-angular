import { sequencePatterns } from 'course/constants';

import './newCourse.css';

let newCourse = function (CourseActionCreators, CourseService, SectionService) {
  return {
    restrict: 'E',
    template: require('./newCourse.html'),
    replace: true,
    link: function (scope) {
      scope.sequenceNumberPlaceholder = "Example: '001' or 'A'";
      scope.newCourseValidation = {
        tooltipErrorMessage: "Select a course and enter a sequence pattern"
      };

      scope.isCourseUnique = function () {
        var newCourse = scope.view.state.courses.newCourse;
        var courseDescription = newCourse.subjectCode + " " + newCourse.courseNumber + " - " + newCourse.sequencePattern;

        for (var i = 0; i < scope.view.state.courses.ids.length; i++) {
          var slotCourseId = scope.view.state.courses.ids[i];
          var slotCourse = scope.view.state.courses.list[slotCourseId];

          if (slotCourse) {
            var slotCourseDescription = slotCourse.subjectCode + " " + slotCourse.courseNumber + " - " + slotCourse.sequencePattern;

            // Proposed course already exists
            if (courseDescription == slotCourseDescription) {
              return false;
            }
          }
        }

        return true;
      };

      scope.searchCourses = function (query) {
        return CourseService.searchCourses(query).then(function (courseSearchResults) {
          return courseSearchResults.slice(0, 20);
        }, function () {
          // FIXME
          // $rootScope.$emit('toast', { message: "Could not search courses.", type: "ERROR" });
          console.error("Could not search courses."); // eslint-disable-line no-console
        });
      };

      scope.searchCoursesResultSelected = function ($item) {
        scope.view.state.courses.newCourse.title = $item.title;
        scope.view.state.courses.newCourse.subjectCode = $item.subjectCode;
        scope.view.state.courses.newCourse.courseNumber = $item.courseNumber;
        scope.view.state.courses.newCourse.effectiveTermCode = $item.effectiveTermCode;
        scope.view.state.courses.newCourse.unitsHigh = $item.creditHoursHigh;
        scope.view.state.courses.newCourse.unitsLow = $item.creditHoursLow;

        // Empty the sequencePattern to force checking for conflicts
        delete scope.view.state.courses.newCourse.sequencePattern;
      };

      scope.clearNewCourseSearch = function () {
        scope.view.state.courses.newCourse = {};
        delete scope.view.newCourseSearchQuery;
        delete scope.view.noResults;
      };

      scope.unoccupiedSequencePatterns = function () {
        var occupiedSequencePatterns = scope.view.state.courses.ids
          .filter(function (courseId) {
            return scope.view.state.courses.list[courseId] && scope.view.selectedCourse &&
              scope.view.state.courses.list[courseId].subjectCode == scope.view.selectedCourse.subjectCode &&
              scope.view.state.courses.list[courseId].courseNumber == scope.view.selectedCourse.courseNumber;
          }).map(function (courseId) {
            return scope.view.state.courses.list[courseId].sequencePattern;
          });

        return sequencePatterns.filter(function (pattern) {
          return occupiedSequencePatterns.indexOf(pattern) < 0;
        });
      };

      scope.createCourse = function () {
        if (!scope.newCourseValidation.tooltipErrorMessage) {
          CourseActionCreators.createCourse(scope.view.state.courses.newCourse, scope.workgroupId, scope.year);
          scope.newCourseValidation.tooltipErrorMessage = "Select a course and enter a sequence pattern";
          scope.view.newCourseSearchQuery = null;
          scope.view.state.courses.newCourse = null;
        }
      };
      // returns false if either course of sequenceNumber is missing, and sets relevant validation
      scope.isCourseComplete = function () {
        var newCourse = scope.view.state.courses.newCourse;

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
        var newCourse = scope.view.state.courses.newCourse;

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

export default newCourse;
