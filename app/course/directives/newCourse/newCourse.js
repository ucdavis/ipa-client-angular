import './newCourse.css';

let newCourse = function (CourseActionCreators, CourseService) {
	return {
		restrict: 'E',
		template: require('./newCourse.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.sequenceNumberPlaceholder = "Example: '001' or 'A02'";
			scope.newCourseValidation = {
				isValid: false,
				errorMessage: null,
				tooltipErrorMessage: null
			};

			scope.newCourseIsValid = function () {
				var newCourse = scope.view.state.courses.newCourse;

				// If new course is incomplete, don't attempt to validate
				if (!newCourse.title || !newCourse.sequencePattern) { return false; }

				// Sequence pattern is malformed
				if (scope.isSequencePatternFormatValid(newCourse.sequencePattern) == false) {
					return false;
				}

				var courseDescription = newCourse.subjectCode + " " + newCourse.courseNumber + " " + newCourse.formattedSequencePattern;

				for (var i = 0; i < scope.view.state.courses.ids.length; i++) {
					var slotCourseId = scope.view.state.courses.ids[i];
					var slotCourse = scope.view.state.courses.list[slotCourseId];

					if (slotCourse) {
						var slotCourseDescription = slotCourse.subjectCode + " " + slotCourse.courseNumber + " " + slotCourse.sequencePattern;

						// Proposed course already exists
						if (courseDescription == slotCourseDescription) {
							return false;
						}
					}
				}

				return true;
			};

			scope.zeroPadSequencePatttern = function (sequencePattern) {
				// Can't help with formatting of letter based sequence numbers
				if (isNumber(sequencePattern) == false) { return sequencePattern; }

				if (sequencePattern.toString().length == 2) {
					return "0" + sequencePattern;
				}

				if (sequencePattern.toString().length == 1) {
					return "00" + sequencePattern;
				}

				return sequencePattern;
			};

			scope.isSequencePatternFormatValid = function (sequencePattern) {
				// Must exist to be valid
				if (!sequencePattern) { return false; }

				var stringSequencePattern = String(sequencePattern);

				// Sequence pattern must be 3 characters
				if (stringSequencePattern.length != 3) { return false; }

				// First character must be a letter or number
				if (isNumber(stringSequencePattern[0]) == false && isLetter(stringSequencePattern[0]) == false) { return false; }

				// Second character must be a number
				if (isNumber(stringSequencePattern[1]) == false) { return false; }

				// Third character must be a number
				if (isNumber(stringSequencePattern[1]) == false) { return false; }

				return true;
			};

			scope.searchCourses = function (query) {
				return CourseService.searchCourses(query).then(function (courseSearchResults) {
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
				if (scope.newCourseValidation.isValid) {
					CourseActionCreators.createCourse(scope.view.state.courses.newCourse, scope.workgroupId, scope.year);
					scope.resetNewCourseValidation();
				}
			};


			// Will only 'positively' validate, not reject (while user is editing the sequence pattern)
			scope.validateCourseDuringEdit = function () {
				var newCourse = scope.view.state.courses.newCourse;
				var courseDescription = newCourse.subjectCode + " " + newCourse.courseNumber + " " + newCourse.formattedSequencePattern;

				// Automatically perform zero padding for user
				newCourse.sequencePattern = scope.zeroPadSequencePatttern(newCourse.rawSequencePattern);

				// Cannot validate sequencePattern without a course
				if (!newCourse.title) {
					scope.newCourseValidation.isValid = false;
					scope.tooltipErrorMessage = "Please select a course.";
					return;
				}

				if (scope.isSequencePatternFormatValid(newCourse.sequencePattern) == false) {
					scope.newCourseValidation.isValid = false;
					scope.newCourseValidation.tooltipErrorMessage = "Sequence pattern format is incorrect. Valid formats are '3 numbers' (ex: '002') or 'a letter and 2 numbers' ('ex: 'A05'.";
					return;
				}

				if (scope.newCourseIsValid() == false) {
					scope.newCourseSearchQuery.isValid = false;
					scope.newCourseValidation.tooltipErrorMessage = "Course " + courseDescription + " is already present on this schedule.";
				} else {
					scope.newCourseValidation.isValid = true;
					scope.newCourseValidation.errorMessage = null;
					scope.newCourseValidation.tooltipErrorMessage = null;
				}
			};

			// Will validate the course and set an error message if needed
			scope.validateCourse = function () {
				debugger;

				// Incomplete course is invalid
				if (!newCourse.title || !newCourse.sequencePattern) {
					scope.resetNewCourseValidation();
					return;
				}

				if (scope.isSequencePatternFormatValid(newCourse.sequencePattern) == false) {
					scope.newCourseValidation.isValid = false;
					scope.newCourseValidation.errorMessage = "Sequence pattern format is incorrect. Valid formats are '3 numbers' (ex: '002') or 'a letter and 2 numbers' ('ex: 'A05'.";
					scope.newCourseValidation.tooltipErrorMessage = "Sequence pattern format is incorrect. Valid formats are '3 numbers' (ex: '002') or 'a letter and 2 numbers' ('ex: 'A05'.";

					return;
				}

				if (scope.newCourseIsValid() == false) {
					scope.newCourseSearchQuery.isValid = false;
					scope.newCourseValidation.errorMessage = "Course " + courseDescription + " is already present on this schedule.";
					scope.newCourseValidation.tooltipErrorMessage = "Course " + courseDescription + " is already present on this schedule.";
				}

				// Is valid
				scope.newCourseValidation.isValid = true;
				scope.newCourseValidation.errorMessage = null;
				scope.newCourseValidation.tooltipErrorMessage = null;
			};

			scope.resetNewCourseValidation = function () {
				scope.newCourseValidation = {
					isValid: false,
					errorMessage: null,
					tooltipErrorMessage: null
				};
			};
		}
	};
};

export default newCourse;
