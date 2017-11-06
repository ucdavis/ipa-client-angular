/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the ipaClientAngularApp
 */
courseApp.controller('CourseCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', 'courseActionCreators', 'courseService', 'Term',
		this.CourseCtrl = function ($scope, $rootScope, $routeParams, $timeout, courseActionCreators, courseService, Term) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.view = { isAssignTagsDropdownOpen: false };
		$scope.sequencePatterns = sequencePatterns; // constants.js file
		$scope.subjectCodes = subjectCodes.map(function (subjectCode) { return { code: subjectCode }; }); // constants.js file
		$scope.massImportSources = [{name: 'IPA'}, {name: 'Banner'}];

		// Generate a few recent academic years for the mass course import mode
		var futureYear = new Date().getFullYear() + 2;
		var recentYears = [];
		for (i = futureYear; i > futureYear - 12; i--) {
			recentYears.push({
				year: i,
				academicYear: String(i).yearToAcademicYear()
			});
		}

		$scope.toggleAssignTagsDropdown = function() {
			if ($scope.view.isAssignTagsDropdownOpen) {
				$scope.closeAssignTagsDropdown();
			} else {
				$scope.view.isAssignTagsDropdownOpen = true;
			}
		};

		$scope.closeAssignTagsDropdown = function() {
			$scope.view.isAssignTagsDropdownOpen = false;
			$scope.clearTagUserChoices();
		};

		$scope.clearTagUserChoices = function() {
			$scope.view.state.tags.availableIds.forEach(function(tagId) {
				$scope.view.tagOccurences[tagId].userChoice = "none";
				$scope.view.tagOccurences[tagId].icon = $scope.view.tagOccurences[tagId].presence;
			});
		};

		$scope.calculateTagStates = function() {
			var validTagIds = $scope.view.state.tags.availableIds;
			var selectedCourseRowIds = $scope.view.state.uiState.selectedCourseRowIds;

			if (!$scope.view.tagOccurences) {
				$scope.view.tagOccurences = {};

				validTagIds.forEach(function(tagId) {
					$scope.view.tagOccurences[tagId] = {count: 0, presence: "none", userChoice: "none", icon: ""};
				});
			} else {
				validTagIds.forEach(function(tagId) {
					$scope.view.tagOccurences[tagId].count = 0;
				});
			}

			selectedCourseRowIds.forEach(function(courseId) {
				var course = $scope.view.state.courses.list[courseId];
				if (!course) { return;}

				course.tagIds.forEach(function(tagId) {
					// Ignore archived tags
					if (validTagIds.indexOf(tagId) == -1) {
						return;
					}

					$scope.view.tagOccurences[tagId].count = $scope.view.tagOccurences[tagId].count + 1;
				});
			});

			validTagIds.forEach(function(tagId) {
				$scope.view.tagOccurences[tagId].presence = $scope.calculateTagPresence(tagId);
				$scope.view.tagOccurences[tagId].icon = $scope.calculateTagIcon(tagId);
			});
		};

		// Each tag can be marked by the user to be applied in different ways to all courses, or to have no change.
		// This method will rotate a tags 'userChoice' through those options, and recalculate the icon to display, each time it is triggered.
		$scope.applyUserChoiceToTag = function(tagId) {
			if (!(tagId)) { return null; }

			var tag = $scope.view.tagOccurences[tagId];
			if (!(tag)) { return null; }

			if (tag.presence == "all") {
				if (tag.userChoice == "none") {
					tag.userChoice = "remove";
				} else {
					tag.userChoice = "none";
				}
			} else if (tag.presence == "none") {
				if (tag.userChoice == "none") {
					tag.userChoice = "add";
				} else {
					tag.userChoice = "none";
				}
			} else if (tag.presence == "some") {
				if (tag.userChoice == "none") {
					tag.userChoice = "add";
				} else if (tag.userChoice == "add") {
					tag.userChoice = "remove";
				} else {
					tag.userChoice = "none";
				}
			}

			tag.icon = $scope.calculateTagIcon(tagId);
		};

		// Will calculate whether this tag is currently 'present' on all, some or none of the selected courses.
		$scope.calculateTagPresence = function(tagId) {
			if (!(tagId)) { return null; }

			var numberOfCourses = $scope.view.state.uiState.selectedCourseRowIds.length;
			var count = $scope.view.tagOccurences[tagId].count;

			if (count == numberOfCourses) {
				return "all";
			}

			if (count == 0) {
				return "none";
			}

			return "some";
		};

		$scope.calculateTagIcon = function(tagId) {
			if (!(tagId)) { return null; }

			var tag = $scope.view.tagOccurences[tagId];

			if (tag.userChoice == "none") {
				return tag.presence;
			}

			if (tag.userChoice == "add") {
				return "all";
			}

			if (tag.userChoice == "remove") {
				return "none";
			}
		};

		$scope.submitMassAssignTags = function() {
			courseActionCreators.submitMassAssignTags(
				$scope.view.tagOccurences,
				$scope.view.state.tags.availableIds,
				$scope.view.state.uiState.selectedCourseRowIds,
				$scope.workgroupId,
				$scope.year);

				$scope.closeAssignTagsDropdown();
		};

		$scope.openCourseDeletionModal = function() {
			courseActionCreators.openCourseDeletionModal();
		};

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
			$scope.view.state = data.state;
			$scope.tagsSelectConfig.options = $scope.view.state.tags.availableIds.map(function (tagId) {
				return $scope.view.state.tags.list[tagId];
			});

			if (data.state.courses.newCourse) {
				// A new course is being created
				$scope.view.selectedEntity = $scope.view.state.courses.newCourse;
				$scope.view.selectedEntityType = "newCourse";
				$timeout(function () {
					$scope.$apply();
				});
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
				if ($scope.view.selectedEntity && $scope.view.selectedEntity.id && $scope.view.selectedEntity.sectionIds === undefined && $scope.view.state.uiState.sectionsImportInProgress == false) {
					courseActionCreators.getSectionsBySectionGroup($scope.view.selectedEntity);
				}

				// Initialize course census if not done already
				if (course.census === undefined && $scope.view.state.uiState.censusImportInProgress == false) {
					courseActionCreators.getCourseCensus(course);
				}
			} else {
				delete $scope.view.selectedEntity;
			}

			// Update table write state
			var hasAuthorizedRole = $scope.sharedState.currentUser.isAdmin() ||
				$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);

			$scope.view.state.uiState.tableLocked = $scope.view.state.uiState.tableLocked || !(hasAuthorizedRole);

			$scope.calculateTagStates();
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
			courseActionCreators.searchImportCourses(
				$scope.view.state.uiState.massImportCode,
				$scope.view.state.uiState.massImportYear,
				$scope.view.state.uiState.massImportPrivate);
		};

		// Query for courses from IPA to display in the view as options to import
		$scope.searchCoursesFromIPA = function () {
			courseActionCreators.searchCoursesFromIPA(
				$scope.workgroupId,
				$scope.view.state.uiState.massImportYear,
				$scope.view.state.uiState.massImportPrivate);
		};

		$scope.sectionSeatTotal = function (sectionGroup) {
			return sectionGroup.sectionIds.reduce(function (previousValue, sectionId) {
				return previousValue + $scope.view.state.sections.list[sectionId].seats;
			}, 0);
		};

		// Returns true if the form to query courses is valid based on the course source
		$scope.importQueryFormValid = function() {
			var subjectCode = $scope.view.state.uiState.massImportCode;
			var year = $scope.view.state.uiState.massImportYear;
			var isSourceBanner = ($scope.view.state.uiState.massImportSource == "Banner");
			var isSourceIPA = ($scope.view.state.uiState.massImportSource == "IPA");

			if (isSourceIPA) {
				if (year && year.length > 0) {
					return true;
				}
			}

			if (isSourceBanner) {
				if (year && year.length > 0 && subjectCode && subjectCode.length > 0) {
					return true;
				}
			}

			return false;
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
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return courseActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};
