sharedApp.directive("newCourse", this.newCourse = function (courseActionCreators, courseService) {
	return {
		restrict: 'E',
		templateUrl: 'newCourse.html',
		replace: true,
		link: function (scope, element, attrs) {

			scope.newCourseIsValid = function () {
				return scope.view.state.courses.newCourse.title && scope.view.state.courses.newCourse.sequencePattern;
			};

			scope.searchCourses = function (query) {
				return courseService.searchCourses(query).then(function (courseSearchResults) {
					return courseSearchResults.slice(0, 20);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
				});
			};

			scope.searchCoursesResultSelected = function ($item, $model, $label, $event) {
				scope.view.state.courses.newCourse.title = $item.title;
				scope.view.state.courses.newCourse.subjectCode = $item.subjectCode;
				scope.view.state.courses.newCourse.courseNumber = $item.courseNumber;
				scope.view.state.courses.newCourse.effectiveTermCode = $item.effectiveTermCode;

				// Empty the sequencePattern to force checking for conflicts
				delete scope.view.state.courses.newCourse.sequencePattern;
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
				if (scope.newCourseIsValid()) {
					courseActionCreators.createCourse(scope.view.state.courses.newCourse, scope.workgroupId, scope.year);
				}
			};

		}
	};
});