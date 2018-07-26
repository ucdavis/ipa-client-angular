let courseDetails = function (CourseActionCreators, SectionService) {
	return {
		restrict: 'E',
		template: require('./courseDetails.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.originalSequencePattern = angular.copy(scope.view.selectedEntity.sequencePattern);
			scope.sequenceNumberPlaceholder = "Example: '001' or 'A'";
			scope.courseDetails = {
				sequencePatternTooltipMessage: null
			};

			/**
			 * Filters out sequencePatterns based on the current course.
			 * It also filters out patterns that are already used for
			 * other courses of the same subjectCode and courseNumber
			 */
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

			scope.updateSequencePattern = function () {
				let sequencePattern = scope.view.selectedEntity.sequencePattern;

				// Do nothing if sequencePattern is unchanged
				if (sequencePattern == scope.originalSequencePattern) {
					scope.courseDetails.sequencePatternTooltipMessage = null;
					return true;
				}

				if (SectionService.isSequencePatternValid(sequencePattern) == false) {
					scope.courseDetails.sequencePatternTooltipMessage = "Sequence pattern format is incorrect. Valid formats are '3 numbers' (ex: '002') or '1 letter' (ex: 'A').";
					return;
				}

				if (scope.isSequencePatternUnique(sequencePattern) == false ) {
					scope.courseDetails.sequencePatternTooltipMessage = "Sequence pattern already in use";
					return;
				}

				scope.courseDetails.sequencePatternTooltipMessage = null;
				scope.view.selectedEntity.sequencePattern = sequencePattern;

				scope.originalSequencePattern = sequencePattern;
				CourseActionCreators.updateCourse(scope.view.selectedEntity);
			};

			scope.isSequencePatternUnique = function (sequencePattern) {
				let courseDescription = scope.view.selectedEntity.subjectCode + "-" + scope.view.selectedEntity.courseNumber + "-" + sequencePattern;
				let isUnique = true;

				scope.view.state.courses.ids.forEach(function(courseId) {
					let course = scope.view.state.courses.list[courseId];
					let slotCourseDescription = course.subjectCode + "-" + course.courseNumber + "-" + course.sequencePattern;

					if (courseDescription == slotCourseDescription) {
						isUnique = false;
					}
				});

				return isUnique;
			};
		}
	};
};

export default courseDetails;
