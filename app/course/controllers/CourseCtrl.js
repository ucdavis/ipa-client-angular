/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the ipaClientAngularApp
 */
class CourseCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, $timeout, CourseActionCreators, CourseService, Term, AuthService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$timeout = $timeout;
		this.courseActionCreators = CourseActionCreators;
		this.courseService = CourseService;
		this.Term = Term;
		this.authService = AuthService;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.view = { isAssignTagsDropdownOpen: false };

		this.getPayload().then( function() {
			self.initialize();
		});
	}

	initialize () {
		var self = this;
		this.$scope.sequencePatterns = sequencePatterns; // constants.js file
		this.$scope.subjectCodes = subjectCodes.map(function (subjectCode) { return { code: subjectCode }; }); // constants.js file
		this.$scope.massImportSources = [{name: 'IPA'}, {name: 'Banner'}];

		// Generate a few recent academic years for the mass course import mode
		var futureYear = new Date().getFullYear() + 2;
		var recentYears = [];
		for (var i = futureYear; i > futureYear - 12; i--) {
			recentYears.push({
				year: i,
				academicYear: String(i).yearToAcademicYear()
			});
		}

		this.$scope.toggleAssignTagsDropdown = function() {
			if (self.$scope.view.isAssignTagsDropdownOpen) {
				self.$scope.closeAssignTagsDropdown();
			} else {
				self.$scope.view.isAssignTagsDropdownOpen = true;
			}
		};

		this.$scope.closeAssignTagsDropdown = function() {
			self.$scope.view.isAssignTagsDropdownOpen = false;
			self.$scope.clearTagUserChoices();
		};

		this.$scope.clearTagUserChoices = function() {
			self.$scope.view.state.tags.availableIds.forEach(function(tagId) {
				self.$scope.view.tagOccurences[tagId].userChoice = "none";
				self.$scope.view.tagOccurences[tagId].icon = $scope.view.tagOccurences[tagId].presence;
			});
		};

		this.$scope.calculateTagStates = function() {
			var validTagIds = self.$scope.view.state.tags.availableIds;
			var selectedCourseRowIds = self.$scope.view.state.uiState.selectedCourseRowIds;

			if (!self.$scope.view.tagOccurences) {
				self.$scope.view.tagOccurences = {};

				validTagIds.forEach(function(tagId) {
					self.$scope.view.tagOccurences[tagId] = {count: 0, presence: "none", userChoice: "none", icon: ""};
				});
			} else {
				validTagIds.forEach(function(tagId) {
					self.$scope.view.tagOccurences[tagId].count = 0;
				});
			}

			selectedCourseRowIds.forEach(function(courseId) {
				var course = self.$scope.view.state.courses.list[courseId];
				if (!course) { return;}

				course.tagIds.forEach(function(tagId) {
					// Ignore archived tags
					if (validTagIds.indexOf(tagId) == -1) {
						return;
					}

					self.$scope.view.tagOccurences[tagId].count = self.$scope.view.tagOccurences[tagId].count + 1;
				});
			});

			validTagIds.forEach(function(tagId) {
				self.$scope.view.tagOccurences[tagId].presence = self.$scope.calculateTagPresence(tagId);
				self.$scope.view.tagOccurences[tagId].icon = self.$scope.calculateTagIcon(tagId);
			});
		};

		// Each tag can be marked by the user to be applied in different ways to all courses, or to have no change.
		// This method will rotate a tags 'userChoice' through those options, and recalculate the icon to display, each time it is triggered.
		this.$scope.applyUserChoiceToTag = function(tagId) {
			if (!(tagId)) { return null; }

			var tag = self.$scope.view.tagOccurences[tagId];
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

			tag.icon = self.$scope.calculateTagIcon(tagId);
		};

		// Will calculate whether this tag is currently 'present' on all, some or none of the selected courses.
		this.$scope.calculateTagPresence = function(tagId) {
			if (!(tagId)) { return null; }

			var numberOfCourses = self.$scope.view.state.uiState.selectedCourseRowIds.length;
			var count = self.$scope.view.tagOccurences[tagId].count;

			if (count == numberOfCourses) {
				return "all";
			}

			if (count == 0) {
				return "none";
			}

			return "some";
		};

		this.$scope.calculateTagIcon = function(tagId) {
			if (!(tagId)) { return null; }

			var tag = self.$scope.view.tagOccurences[tagId];

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

		this.$scope.submitMassAssignTags = function() {
			self.courseActionCreators.submitMassAssignTags(
				self.$scope.view.tagOccurences,
				self.$scope.view.state.tags.availableIds,
				self.$scope.view.state.uiState.selectedCourseRowIds,
				self.$scope.workgroupId,
				self.$scope.year);

				self.$scope.closeAssignTagsDropdown();
		};

		this.$scope.openCourseDeletionModal = function() {
			self.courseActionCreators.openCourseDeletionModal();
		};

		this.$scope.recentAcademicYears = recentYears;

		this.$scope.tagsSelectConfig = {
			plugins: ['remove_button'],
			maxItems: 10,
			valueField: 'id',
			labelField: 'name',
			searchField: ['name'],
			onItemAdd: function (value) {
				// This method is called for some reason on initialization:
				// This 'if' is to avoid poking the server multiple times on initialization
				var tagIdExists = self.$scope.view.selectedEntity.tagIds.some(function (id) { return id == value; });
				if (tagIdExists === false) {
					self.courseActionCreators.addTagToCourse(self.$scope.view.selectedEntity, self.$scope.view.state.tags.list[value]);
				}
			},
			onItemRemove: function (value) {
				self.courseActionCreators.removeTagFromCourse(self.$scope.view.selectedEntity, self.$scope.view.state.tags.list[value]);
			}
		};

		this.$rootScope.$on('courseStateChanged', function (event, data) {
			self.$scope.view.state = data.state;
			self.$scope.tagsSelectConfig.options = self.$scope.view.state.tags.availableIds.map(function (tagId) {
				return self.$scope.view.state.tags.list[tagId];
			});

			if (data.state.courses.newCourse) {
				// A new course is being created
				self.$scope.view.selectedEntity = self.$scope.view.state.courses.newCourse;
				self.$scope.view.selectedEntityType = "newCourse";
				self.$timeout(function () {
					self.$scope.$apply();
				});
			} else if (data.state.uiState.selectedCourseId && !data.state.uiState.selectedTermCode) {
				// A course is selected
				self.$scope.view.selectedEntity = angular.copy(self.$scope.view.state.courses.list[data.state.uiState.selectedCourseId]);
				self.$scope.view.selectedEntityType = "course";
			} else if (data.state.uiState.selectedCourseId && data.state.uiState.selectedTermCode) {
				// A sectionGroup is selected
				self.$scope.view.selectedEntityType = "sectionGroup";
				var course = self.$scope.view.state.courses.list[data.state.uiState.selectedCourseId];
				self.$scope.view.selectedEntity = self.$scope.view.state.sectionGroups.selectedSectionGroup || self.$scope.view.state.sectionGroups.newSectionGroup;

				// Initialize sectionGroup sections if not done already
				if (self.$scope.view.selectedEntity && self.$scope.view.selectedEntity.id && self.$scope.view.selectedEntity.sectionIds === undefined && self.$scope.view.state.uiState.sectionsFetchInProgress == false) {
					self.courseActionCreators.getSectionsBySectionGroup(self.$scope.view.selectedEntity);
				}

				// Initialize course census if not done already
				if (course.census === undefined && self.$scope.view.state.uiState.censusFetchInProgress == false) {
					self.courseActionCreators.getCourseCensus(course);
				}
			} else {
				delete self.$scope.view.selectedEntity;
			}

			// Update table write state
			var hasAuthorizedRole = self.$scope.sharedState.currentUser.isAdmin() ||
			self.$scope.sharedState.currentUser.hasRole('academicPlanner', self.$scope.sharedState.workgroup.id);

			self.$scope.view.state.uiState.tableLocked = self.$scope.view.state.uiState.tableLocked || !(hasAuthorizedRole);

			self.$scope.calculateTagStates();
		});

		this.$scope.download = function () {
			self.courseService.downloadSchedule(self.$scope.workgroupId, self.$scope.year, self.$scope.view.state.filters.enableUnpublishedCourses);
		};

		this.$scope.closeDetails = function () {
			if (self.$scope.view.state.courses.newCourse) {
				self.courseActionCreators.closeNewCourseDetails();
			} else {
				self.courseActionCreators.closeDetails();
			}
		};

		this.$scope.termToggled = function (id) {
			self.courseActionCreators.toggleTermFilter(id);
		};

		self.$scope.tagToggled = function (tagId) {
			var tagFilters = self.$scope.view.state.filters.enabledTagIds;
			var tagIndex = tagFilters.indexOf(tagId);

			if (tagIndex < 0) {
				tagFilters.push(tagId);
			} else {
				tagFilters.splice(tagIndex, 1);
			}

			self.courseActionCreators.updateTagFilters(tagFilters);
		};

		self.$scope.addTag = function (item, tagId) {
			self.courseActionCreators.addTagToCourse(self.$scope.view.selectedEntity, self.$scope.view.state.tags.list[tagId]);
		};

		self.$scope.removeTag = function (item, tagId) {
			self.courseActionCreators.removeTagFromCourse(self.$scope.view.selectedEntity, self.$scope.view.state.tags.list[tagId]);
		};

		self.$scope.updateCourse = function () {
			self.courseActionCreators.updateCourse(self.$scope.view.selectedEntity);
		};

		self.$scope.updateSection = function (section) {
			self.courseActionCreators.updateSection(section);

			var sectionGroup = self.$scope.view.state.sectionGroups.list[section.sectionGroupId];

			// Will update the sectionGroup plannedSeats using section seats
			// If the section is numeric based (example: 'PSC 040 - 001')
			if (isNumber(section.sequenceNumber) == true) {
				sectionGroup.plannedSeats = section.seats;
				self.courseActionCreators.updateSectionGroup(sectionGroup);

				self.$scope.manuallyUpdatePlannedSeats(sectionGroup);
			}
		};

		self.$scope.manuallyUpdatePlannedSeats = function(sectionGroup) {
			$('[data-course-id="' + sectionGroup.courseId + '"] [data-term-code="' + sectionGroup.termCode + '"] input').val(sectionGroup.plannedSeats);
		};

		self.$scope.deleteSection = function (section) {
			self.courseActionCreators.deleteSection(section);
		};

		self.$scope.addSectionGroup = function () {
			self.courseActionCreators.addSectionGroup(self.$scope.view.state.sectionGroups.newSectionGroup);
		};

		// Triggered by global search field, redraws table based on query
		self.$scope.filterTable = function (query) {
			clearTimeout($scope.timeout);
			self.$scope.timeout = setTimeout(self.courseActionCreators.updateTableFilter, 700, query);
		};

		// Triggered by global search cancel button
		self.$scope.clearSearch = function () {
			self.$scope.view.searchQuery = "";
			self.$scope.filterTable("");
		};

		/**
		 * Begins import mode, which allows for the mass adding of courses.
		 * @return {[type]} [description]
		 */
		self.$scope.beginImportMode = function () {
			self.courseActionCreators.beginImportMode();
		};

		/**
		 * Ends import mode, which allows for the mass adding of courses.
		 * @return {[type]} [description]
		 */
		self.$scope.endImportMode = function () {
			self.courseActionCreators.endImportMode();
		};

		/**
		 * Triggers the action to pull mass import courses from DW that
		 * match the selected subjectCode and academicYear
		 */
		self.$scope.searchImportCourses = function () {
			self.courseActionCreators.searchImportCourses(
				self.$scope.view.state.uiState.massImportCode,
				self.$scope.view.state.uiState.massImportYear,
				self.$scope.view.state.uiState.massImportPrivate);
		};

		// Query for courses from IPA to display in the view as options to import
		self.$scope.searchCoursesFromIPA = function () {
			self.courseActionCreators.searchCoursesFromIPA(
				self.$scope.workgroupId,
				self.$scope.view.state.uiState.massImportYear,
				self.$scope.view.state.uiState.massImportPrivate);
		};

		self.$scope.sectionSeatTotal = function (sectionGroup) {
			return sectionGroup.sectionIds.reduce(function (previousValue, sectionId) {
				return previousValue + self.$scope.view.state.sections.list[sectionId].seats;
			}, 0);
		};

		// Returns true if the form to query courses is valid based on the course source
		self.$scope.importQueryFormValid = function() {
			var subjectCode = self.$scope.view.state.uiState.massImportCode;
			var year = self.$scope.view.state.uiState.massImportYear;
			var isSourceBanner = (self.$scope.view.state.uiState.massImportSource == "Banner");
			var isSourceIPA = (self.$scope.view.state.uiState.massImportSource == "IPA");

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

		self.$scope.unpublishedCoursesToggled = function () {
			self.courseActionCreators.setUnpublishedCoursesFilter(
				self.$scope.workgroupId,
				self.$scope.year,
				!self.$scope.view.state.filters.enableUnpublishedCourses
			);
		};
	}

	getPayload () {
		var self = this;
		return this.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			return self.courseActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year);
		});
	}
}

CourseCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', '$timeout', 'CourseActionCreators', 'CourseService', 'Term', 'AuthService'];

export default CourseCtrl;
