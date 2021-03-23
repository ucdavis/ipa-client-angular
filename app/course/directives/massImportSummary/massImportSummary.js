let massImportSummary = function (CourseActionCreators) {
  return {
    restrict: 'E',
    template: require('./massImportSummary.html'),
    replace: true,
    link: function (scope) {
      /**
       * Sends the selected courses to IPA-WEB to be imported to the schedule
       */
      scope.importCoursesAndSectionGroups = function () {
        var selectedCourses = scope.view.state.courses.importList.filter(function (c) { return c.import;});

        var sectionGroupImports = scope.view.state.sectionGroups.importList.filter(function (sg) {
          const course = selectedCourses.find(c => c.subjectCode === sg.subjectCode && c.courseNumber === sg.courseNumber && c.sequencePattern === sg.sequencePattern);

          // use existing course on the schedule if SG effectiveTermCode differs
          if (course !== undefined && sg.effectiveTermCode !== course.effectiveTermCode) {
            sg.effectiveTermCode = course.effectiveTermCode;
          }

          return course !== undefined;
        });

        scope.view.state.uiState.massImportInProgress = true;

        var importTimes = scope.view.state.uiState.massImportTimes;
        var importAssignments = scope.view.state.uiState.massImportInstructors;

        if (scope.view.state.uiState.massImportSource == 'IPA') {
          CourseActionCreators.importCoursesAndSectionGroupsFromIPA(
            sectionGroupImports, scope.workgroupId, scope.year, selectedCourses.length, importTimes, importAssignments);
        } else {
          CourseActionCreators.importCoursesAndSectionGroups(
            sectionGroupImports, scope.workgroupId, scope.year, selectedCourses.length, importTimes, importAssignments);
        }
      };
    }
  };
};

export default massImportSummary;
