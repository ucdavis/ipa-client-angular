sharedApp.directive("courseDetails", this.courseDetails = function () {
	return {
		restrict: 'E',
		templateUrl: 'courseDetails.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.sequencePatternsScopedByCurrentType = function () {
				var course = scope.view.state.courses.list[scope.view.selectedEntity.id];
				var occupiedSequencePatterns = scope.view.state.courses.ids
					.filter(function (courseId) {
						return scope.view.state.courses.list[courseId].id != course.id &&
							scope.view.state.courses.list[courseId].subjectCode == course.subjectCode &&
							scope.view.state.courses.list[courseId].courseNumber == course.courseNumber;
					}).map(function (courseId) {
						return scope.view.state.courses.list[courseId].sequencePattern;
					});

				if (course.sequencePattern) {
					if (course.isSeries()) {
						return alphaSequencePatterns.filter(function (pattern) {
							return occupiedSequencePatterns.indexOf(pattern) < 0;
						});
					} else {
						return numericSequencePatterns.filter(function (pattern) {
							return occupiedSequencePatterns.indexOf(pattern) < 0;
						});
					}
				} else {
					return sequencePatterns.filter(function (pattern) {
						return occupiedSequencePatterns.indexOf(pattern) < 0;
					});
				}
			};

		}
	};
});