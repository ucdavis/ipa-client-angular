let massImportSummary = function (CourseActionCreators) {
  return {
    restrict: 'E',
    template: require('./massImportSummary.html'),
    replace: true,
    link: function (scope, element, attrs) {
      /**
       * Sends the selected courses to IPA-WEB to be imported to the schedule
       */
      scope.importCoursesAndSectionGroups = function () {
        var selectedCourseIds = scope.view.state.courses.importList
          .filter(function (c) { return c.import;})
          .map(function (c) { return c.subjectCode + c.courseNumber + c.sequencePattern + c.effectiveTermCode; });

        var sectionGroupImports = scope.view.state.sectionGroups.importList.filter(function (sg) {
          var sgCourseId = sg.subjectCode + sg.courseNumber + sg.sequencePattern + sg.effectiveTermCode;
          return selectedCourseIds.indexOf(sgCourseId) >= 0;
        });

        scope.view.state.uiState.massImportInProgress = true;

        var importTimes = scope.view.state.uiState.massImportTimes;
        var importAssignments = scope.view.state.uiState.massImportInstructors;

        if (scope.view.state.uiState.massImportSource == 'IPA') {
          ipa_analyze_event('courses', 'mass import from IPA');
          CourseActionCreators.importCoursesAndSectionGroupsFromIPA(
            sectionGroupImports, scope.workgroupId, scope.year, selectedCourseIds.length, importTimes, importAssignments);
        } else {
          ipa_analyze_event('courses', 'mass import from Banner');
          CourseActionCreators.importCoursesAndSectionGroups(
            sectionGroupImports, scope.workgroupId, scope.year, selectedCourseIds.length, importTimes, importAssignments);
        }
      };
    }
  };
};

export default massImportSummary;
