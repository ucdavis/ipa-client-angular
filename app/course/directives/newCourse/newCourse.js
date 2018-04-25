let newCourse = function (courseActionCreators, courseService) {
	return {
		restrict: 'E',
		template: require('./newCourse.html'),
		replace: true,
		link: function (scope, element, attrs) {

			scope.newCourseIsValid = function () {
				if (scope.view.state.courses.newCourse.title
				&& scope.view.state.courses.newCourse.sequencePattern) {

					var newCourse = scope.view.state.courses.newCourse;

					// Ensure course is unique
					for (var i = 0; i < scope.view.state.courses.ids.length; i++) {
						var slotCourseId = scope.view.state.courses.ids[i];
						var slotCourse = scope.view.state.courses.list[slotCourseId];

						if (slotCourse) {
							if (newCourse.courseNumber == slotCourse.courseNumber
									&& newCourse.subjectCode == slotCourse.subjectCode
									&& newCourse.sequencePattern == slotCourse.sequencePattern) {
										return false;
							}
						}
					}
					return true;
				}

				return false;
			};

			scope.searchCourses = function (query) {
				return courseService.searchCourses(query).then(function (courseSearchResults) {
					return courseSearchResults.slice(0, 20);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not search courses.", type: "ERROR" });
				});
			};

			scope.searchCoursesResultSelected = function ($item, $model, $label, $event) {
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
				if (scope.newCourseIsValid()) {
					courseActionCreators.createCourse(scope.view.state.courses.newCourse, scope.workgroupId, scope.year);
				}
			};

		}
	};
};

export default newCourse;
