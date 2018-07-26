import './courseDetails.css';

let courseDetails = function (CourseActionCreators) {
	return {
		restrict: 'E',
		template: require('./courseDetails.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.sequenceNumberPlaceholder = "Example: '001' or 'A02'";
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

				if (SectionService.isSequencePatternFormatValid(scope.view.selectedEntity.sequencePattern) == false) {
					scope.courseDetails.sequencePatternTooltipMessage = "Sequence pattern format is incorrect. Valid formats are '3 numbers' (ex: '002') or 'a letter and 2 numbers' ('ex: 'A05').";
					return;
				}

				if (scope.isSequencePatternUnique() == false ) {
					scope.courseDetails.sequencePatternTooltipMessage = "Sequence pattern already in use";
					return;
				}

				scope.courseDetails.sequencePatternTooltipMessage = null;
				// Otherwise save
				// This is the route we need to fire, assuming sequence pattern was valid
				CourseActionCreators.updateCourse(scope.view.selectedEntity);
			};

			scope.isSequencePatternUnique = function () {
//			var taco = scope.sequencePatternsScopedByCurrentType();
				debugger;
			}
		}
	};
};

export default courseDetails;