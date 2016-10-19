/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the ipaClientAngularApp
 */
courseApp.controller('CourseCtrl', ['$scope', '$rootScope', '$routeParams', 'courseActionCreators', 'courseService', 'Term',
		this.CourseCtrl = function ($scope, $rootScope, $routeParams, courseActionCreators, courseService, Term) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.view = {};
		$scope.sequencePatterns = sequencePatterns; // constants.js file
		$scope.subjectCodes = subjectCodes.map(function (subjectCode) { return { code: subjectCode }; }); // constants.js file

		// Generate a few recent academic years for the mass course import mode
		var currentYear = new Date().getFullYear();
		var recentYears = [];
		for (i = currentYear; i > currentYear - 10; i--) {
			recentYears.push({
				year: i,
				academicYear: String(i).yearToAcademicYear()
			});
		}
		$scope.recentAcademicYears = recentYears;

		$scope.tagsSelectConfig = {
			plugins: ['remove_button'],
			maxItems: 10,
			valueField: 'id',
			labelField: 'name',
			searchField: ['name'],
			onItemAdd: function (value) {
				// This method is called for some reason on initialization:
				// This 'if' is to avoid poking the server multiple times on initialization
				var tagIdExists = $scope.view.selectedEntity.tagIds.some(function (id) { return id == value; });
				if (tagIdExists === false) {
					courseActionCreators.addTagToCourse($scope.view.selectedEntity, $scope.view.state.tags.list[value]);
				}
			},
			onItemRemove: function (value) {
				courseActionCreators.removeTagFromCourse($scope.view.selectedEntity, $scope.view.state.tags.list[value]);
			}
		};

		$rootScope.$on('courseStateChanged', function (event, data) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termDefinitions = Term.prototype.generateTable($scope.year);

			$scope.view.state = data.state;
			$scope.tagsSelectConfig.options = $scope.view.state.tags.availableIds.map(function (tagId) {
				return $scope.view.state.tags.list[tagId];
			});

			if (data.state.courses.newCourse) {
				// A new course is being created
				$scope.view.selectedEntity = $scope.view.state.courses.newCourse;
				$scope.view.selectedEntityType = "newCourse";
				$scope.$apply();
			} else if (data.state.uiState.selectedCourseId && !data.state.uiState.selectedTermCode) {
				// A course is selected
				$scope.view.selectedEntity = angular.copy($scope.view.state.courses.list[data.state.uiState.selectedCourseId]);
				$scope.view.selectedEntityType = "course";
			} else if (data.state.uiState.selectedCourseId && data.state.uiState.selectedTermCode) {
				// A sectionGroup is selected
				$scope.view.selectedEntityType = "sectionGroup";
				var course = $scope.view.state.courses.list[data.state.uiState.selectedCourseId];
				$scope.view.selectedEntity = $scope.view.state.sectionGroups.selectedSectionGroup || $scope.view.state.sectionGroups.newSectionGroup;

				// Initialize sectionGroup sections if not done already
				if ($scope.view.selectedEntity && $scope.view.selectedEntity.id && $scope.view.selectedEntity.sectionIds === undefined) {
					courseActionCreators.getSectionsBySectionGroup($scope.view.selectedEntity);
				}

				// Initialize course census if not done already
				if (course.census === undefined) {
					courseActionCreators.getCourseCensus(course);
				}

			} else {
				delete $scope.view.selectedEntity;
			}

			// Set table write state
			var hasAuthorizedRole = $scope.sharedState.currentUser.isAdmin() ||
				$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);

			var someTermsActive = $scope.termDefinitions.some(function (term) {
				return !$scope.view.state.terms.list[term.code].isLocked();
			});

			$scope.view.courseTableWritable = hasAuthorizedRole && someTermsActive;

		});

		$scope.download = function () {
			courseService.downloadSchedule($scope.workgroupId, $scope.year, $scope.view.state.filters.enableUnpublishedCourses);
		};

		$scope.closeDetails = function () {
			if ($scope.view.state.courses.newCourse) {
				courseActionCreators.closeNewCourseDetails();
			} else {
				courseActionCreators.closeDetails();
			}
		};

		$scope.termToggled = function (id) {
			courseActionCreators.toggleTermFilter(id);
		};

		$scope.tagToggled = function (tagId) {
			var tagFilters = $scope.view.state.filters.enabledTagIds;
			var tagIndex = tagFilters.indexOf(tagId);

			if (tagIndex < 0) {
				tagFilters.push(tagId);
			} else {
				tagFilters.splice(tagIndex, 1);
			}

			courseActionCreators.updateTagFilters(tagFilters);
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

		$scope.updateSection = function (section) {
			courseActionCreators.updateSection(section);
		};

		$scope.deleteSection = function (section) {
			courseActionCreators.deleteSection(section);
		};

		$scope.addSectionGroup = function () {
			courseActionCreators.addSectionGroup($scope.view.state.sectionGroups.newSectionGroup);
		};

		// Triggered by global search field, redraws table based on query
		$scope.filterTable = function (query) {
			clearTimeout($scope.timeout);
			$scope.timeout = setTimeout(courseActionCreators.updateTableFilter, 700, query);
		};

		// Triggered by global search cancel button
		$scope.clearSearch = function () {
			$scope.view.searchQuery = "";
			$scope.filterTable("");
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

		/**
		 * Triggers the action to pull mass import courses from DW that
		 * match the selected subjectCode and academicYear
		 */
		$scope.searchImportCourses = function () {
			$scope.view.state.courses.importList = null;
			$scope.view.searchingCourseToImport = true;
			courseActionCreators.searchImportCourses(
				$scope.view.state.uiState.massImportCode,
				$scope.view.state.uiState.massImportYear,
				$scope.view.state.uiState.massImportPrivate);
		};

		$scope.sectionSeatTotal = function (sectionGroup) {
			return sectionGroup.sectionIds.reduce(function (previousValue, sectionId) {
				return previousValue + $scope.view.state.sections.list[sectionId].seats;
			}, 0);
		};

		$scope.unpublishedCoursesToggled = function () {
			courseActionCreators.setUnpublishedCoursesFilter(
				$scope.workgroupId,
				$scope.year,
				!$scope.view.state.filters.enableUnpublishedCourses
			);
		};

		}
]);

CourseCtrl.getPayload = function (authService, $route, courseActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return courseActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};
