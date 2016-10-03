sharedApp.directive("massImportSummary", this.massImportSummary = function (courseActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'massImportSummary.html',
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
				courseActionCreators.importCoursesAndSectionGroups(
					sectionGroupImports, scope.workgroupId, scope.year, selectedCourseIds.length);
			};
		}
	};
});