'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the ipaClientAngularApp
 */
courseApp.controller('CourseCtrl', ['$scope', '$rootScope', '$routeParams', 'courseActionCreators', 'courseService',
		this.CourseCtrl = function ($scope, $rootScope, $routeParams, courseActionCreators, courseService) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};
			$scope.sequencePatterns = sequencePatterns;
			$scope.subjectCodes = subjectCodes;

			// Generate a few recent academic years for the mass course import mode
			var currentYear = new Date().getFullYear();
			var recentYears = [];
			for(i = currentYear; i > currentYear - 10; i--) {
				recentYears.push(i + "-" + String(i + 1).slice(2));
			}
			$scope.recentAcademicYears = recentYears;

			$rootScope.$on('courseStateChanged', function (event, data) {
				$scope.view.state = data.state;

				if (data.state.courses.newCourse) {
					// A new course is being created
					$scope.view.selectedEntity = $scope.view.state.courses.newCourse;
					$scope.view.selectedEntityType = "newCourse";
				} else if (data.state.uiState.selectedCourseId && !data.state.uiState.selectedTermCode) {
					// A course is selected
					$scope.view.selectedEntity = $scope.view.state.courses.list[data.state.uiState.selectedCourseId];
					$scope.view.selectedEntityType = "course";
				} else if (data.state.uiState.selectedCourseId && data.state.uiState.selectedTermCode) {
					// A sectionGroup is selected
					var course = $scope.view.state.courses.list[data.state.uiState.selectedCourseId];
					$scope.view.selectedEntity = _.find($scope.view.state.sectionGroups.list, function (sg) { return (sg.termCode == data.state.uiState.selectedTermCode) && (sg.courseId == data.state.uiState.selectedCourseId) });

					// Initialize sectionGroup sections if not done already
					if ($scope.view.selectedEntity && $scope.view.selectedEntity.sectionIds == undefined) {
						courseActionCreators.getSectionsBySectionGroup($scope.view.selectedEntity);
					}

					// Initialize course census if not done already
					if (course.census == undefined) {
						courseActionCreators.getCourseCensus(course);
					}

					$scope.view.selectedEntityType = "sectionGroup";
				} else {
					delete $scope.view.selectedEntity;
				}

				$scope.view.massImportMode = data.state.uiState.massImportMode;
			});

			$scope.closeDetails = function () {
				delete $scope.view.selectedEntity;
				if ($scope.view.state.courses.newCourse) {
					courseActionCreators.closeNewCourseDetails();
				} else {
					courseActionCreators.closeDetails();
				}
			};

			$scope.termToggled = function (id) {
				courseActionCreators.toggleTermFilter(id);
			};

			$scope.createCourse = function () {
				if ($scope.newCourseIsValid()) {
					courseActionCreators.createCourse($scope.view.state.courses.newCourse, $scope.workgroupId, $scope.year);
				}
			};

			$scope.newCourseIsValid = function () {
				return $scope.view.state.courses.newCourse.title && $scope.view.state.courses.newCourse.sequencePattern;
			};

			$scope.searchCourses = function (query) {
				return courseService.searchCourses(query).then(function (courseSearchResults) {
					return courseSearchResults.slice(0, 20);
				}, function (err) {
					$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
				});
			};

			$scope.searchCoursesResultSelected = function ($item, $model, $label, $event) {
				$scope.view.state.courses.newCourse.title = $item.title;
				$scope.view.state.courses.newCourse.subjectCode = $item.subjectCode;
				$scope.view.state.courses.newCourse.courseNumber = $item.courseNumber;
				$scope.view.state.courses.newCourse.effectiveTermCode = $item.effectiveTermCode;
			};

			$scope.addTag = function (item, tagId) {
				courseActionCreators.addTagToCourse($scope.view.selectedEntity, $scope.view.state.tags.list[tagId]);
			};

			$scope.removeTag = function (item, tagId) {
				courseActionCreators.removeTagFromCourse($scope.view.selectedEntity, $scope.view.state.tags.list[tagId]);
			};

			$scope.updateCourse = function () {
				courseActionCreators.updateCourse($scope.view.selectedEntity);
			};

			$scope.addSection = function () {
				var sequenceNumber = $scope.nextSequence();
				var sectionGroupId = $scope.view.selectedEntity.id;
				var section = {
					sectionGroupId: sectionGroupId,
					sequenceNumber: sequenceNumber
				};
				courseActionCreators.createSection(section);
			};

			$scope.updateSection = function (section) {
				courseActionCreators.updateSection(section);
			};

			$scope.deleteSection = function (section) {
				courseActionCreators.deleteSection(section);
			};

			/**
			 * For a given sectionGroup this returns the next sequence number if applicable.
			 * Possible cases:
			 * Numeric:
			 * - no section -> the parent course sequencePattern
			 * - section exists -> null
			 * Alpha:
			 * - no sections -> the parent course sequencePattern + 01
			 * - sections exists -> increments the last section
			 */
			$scope.nextSequence = function () {
				var sg = $scope.view.selectedEntity;
				var course = $scope.view.state.courses.list[sg.courseId];
				if (course.isSeries() == false) {
					// Numeric sections
					if (sg.sectionIds && sg.sectionIds.length > 0) { return null; }
					else { return course.sequencePattern; }
				} if (sg.sectionIds && sg.sectionIds.length > 0) {
					var lstSectionId = sg.sectionIds[sg.sectionIds.length - 1];
					var lastSection = $scope.view.state.sections.list[lstSectionId]
					var number = parseInt(lastSection.sequenceNumber.slice(-1)) + 1;
					var character = lastSection.sequenceNumber.slice(0, 1);
					return character + "0" + number;
				} else {
					return course.sequencePattern + "01";
				}
			};

			// Triggered by global search field, redraws table based on query
			$scope.filterTable = function (query) {
				clearTimeout($scope.timeout);
				$scope.timeout = setTimeout(courseActionCreators.updateTableFilter, 700, query);
			};

			/**
			 * Begins import mode, which allows for the mass adding of courses.
			 * @return {[type]} [description]
			 */
			$scope.beginImportMode = function () {
				courseActionCreators.beginImportMode();
			};

			/**
			 * Ends import mode, which allows for the mass adding of courses.
			 * @return {[type]} [description]
			 */
			$scope.endImportMode = function () {
				courseActionCreators.endImportMode();
			};

			$scope.sectionSeatTotal = function (sectionGroup) {
				return sectionGroup.sectionIds.reduce(function (previousValue, sectionId) {
					return previousValue + $scope.view.state.sections.list[sectionId].seats;
				}, 0);
			};
		}
]);

CourseCtrl.getPayload = function (authService, $route, courseActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return courseActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
}
