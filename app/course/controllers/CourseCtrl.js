import { isNumber } from 'shared/helpers/types';
import { sequencePatterns, subjectCodes } from 'course/constants';

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
    self.initialize();
  }

  initialize () {
    var _self = this;
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
      if (_self.$scope.view.isAssignTagsDropdownOpen) {
        _self.$scope.closeAssignTagsDropdown();
      } else {
        _self.$scope.view.isAssignTagsDropdownOpen = true;
      }
    };

    this.$scope.closeAssignTagsDropdown = function() {
      _self.$scope.view.isAssignTagsDropdownOpen = false;
      _self.$scope.clearTagUserChoices();
    };

    this.$scope.clearTagUserChoices = function() {
      _self.$scope.view.state.tags.availableIds.forEach(function(tagId) {
        _self.$scope.view.tagOccurences[tagId].userChoice = "none";
        _self.$scope.view.tagOccurences[tagId].icon = _self.$scope.view.tagOccurences[tagId].presence;
      });
    };

    this.$scope.calculateTagStates = function() {
      var validTagIds = _self.$scope.view.state.tags.availableIds;
      var selectedCourseRowIds = _self.$scope.view.state.uiState.selectedCourseRowIds;

      if (!_self.$scope.view.tagOccurences) {
        _self.$scope.view.tagOccurences = {};

        validTagIds.forEach(function(tagId) {
          _self.$scope.view.tagOccurences[tagId] = {count: 0, presence: "none", userChoice: "none", icon: ""};
        });
      } else {
        validTagIds.forEach(function(tagId) {
          _self.$scope.view.tagOccurences[tagId].count = 0;
        });
      }

      selectedCourseRowIds.forEach(function(courseId) {
        var course = _self.$scope.view.state.courses.list[courseId];
        if (!course) { return;}

        course.tagIds.forEach(function(tagId) {
          // Ignore archived tags
          if (validTagIds.indexOf(tagId) == -1) {
            return;
          }

          _self.$scope.view.tagOccurences[tagId].count = _self.$scope.view.tagOccurences[tagId].count + 1;
        });
      });

      validTagIds.forEach(function(tagId) {
        _self.$scope.view.tagOccurences[tagId].presence = _self.$scope.calculateTagPresence(tagId);
        _self.$scope.view.tagOccurences[tagId].icon = _self.$scope.calculateTagIcon(tagId);
      });
    };

    // Each tag can be marked by the user to be applied in different ways to all courses, or to have no change.
    // This method will rotate a tags 'userChoice' through those options, and recalculate the icon to display, each time it is triggered.
    this.$scope.applyUserChoiceToTag = function(tagId) {
      if (!(tagId)) { return null; }

      var tag = _self.$scope.view.tagOccurences[tagId];
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

      tag.icon = _self.$scope.calculateTagIcon(tagId);
    };

    // Will calculate whether this tag is currently 'present' on all, some or none of the selected courses.
    this.$scope.calculateTagPresence = function(tagId) {
      if (!(tagId)) { return null; }

      var numberOfCourses = _self.$scope.view.state.uiState.selectedCourseRowIds.length;
      var count = _self.$scope.view.tagOccurences[tagId].count;

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

      var tag = _self.$scope.view.tagOccurences[tagId];

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
      _self.courseActionCreators.submitMassAssignTags(
        _self.$scope.view.tagOccurences,
        _self.$scope.view.state.tags.availableIds,
        _self.$scope.view.state.uiState.selectedCourseRowIds,
        _self.$scope.workgroupId,
        _self.$scope.year);

        _self.$scope.closeAssignTagsDropdown();
    };

    this.$scope.openCourseDeletionModal = function() {
      _self.courseActionCreators.openCourseDeletionModal();
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
        var tagIdExists = _self.$scope.view.selectedEntity.tagIds.some(function (id) { return id == value; });
        if (tagIdExists === false) {
          _self.courseActionCreators.addTagToCourse(_self.$scope.view.selectedEntity, _self.$scope.view.state.tags.list[value]);
        }
      },
      onItemRemove: function (value) {
        _self.courseActionCreators.removeTagFromCourse(_self.$scope.view.selectedEntity, _self.$scope.view.state.tags.list[value]);
      }
    };

    this.$rootScope.$on('courseStateChanged', function (event, data) {
      _self.$scope.view.state = data.state;
      _self.$scope.tagsSelectConfig.options = _self.$scope.view.state.tags.availableIds.map(function (tagId) {
        return _self.$scope.view.state.tags.list[tagId];
      });

      if (data.state.courses.newCourse) {
        // A new course is being created
        _self.$scope.view.selectedEntity = _self.$scope.view.state.courses.newCourse;
        _self.$scope.view.selectedEntityType = "newCourse";
        _self.$timeout(function () {
          _self.$scope.$apply();
        });
      } else if (data.state.uiState.selectedCourseId && !data.state.uiState.selectedTermCode) {
        // A course is selected
        _self.$scope.view.selectedEntity = angular.copy(_self.$scope.view.state.courses.list[data.state.uiState.selectedCourseId]); // eslint-disable-line no-undef
        _self.$scope.view.selectedEntityType = "course";
      } else if (data.state.uiState.selectedCourseId && data.state.uiState.selectedTermCode) {
        // A sectionGroup is selected
        _self.$scope.view.selectedEntityType = "sectionGroup";
        var course = _self.$scope.view.state.courses.list[data.state.uiState.selectedCourseId];
        _self.$scope.view.selectedEntity = _self.$scope.view.state.sectionGroups.selectedSectionGroup || _self.$scope.view.state.sectionGroups.newSectionGroup;

        // Initialize sectionGroup sections if not done already
        if (_self.$scope.view.selectedEntity && _self.$scope.view.selectedEntity.id && _self.$scope.view.selectedEntity.sectionIds === undefined && _self.$scope.view.state.uiState.sectionsFetchInProgress == false) {
          _self.courseActionCreators.getSectionsBySectionGroup(_self.$scope.view.selectedEntity);
        }

        // Initialize course census if not done already
        if (course.census === undefined && _self.$scope.view.state.uiState.censusFetchInProgress == false) {
          _self.courseActionCreators.getCourseCensus(course);
        }
      } else {
        delete _self.$scope.view.selectedEntity;
      }

      // Update table write state
      var hasAuthorizedRole = _self.$scope.sharedState.currentUser.isAdmin() ||
      _self.$scope.sharedState.currentUser.hasRole('academicPlanner', _self.$scope.sharedState.workgroup.id);

      _self.$scope.view.state.uiState.tableLocked = _self.$scope.view.state.uiState.tableLocked || !(hasAuthorizedRole);

      _self.$scope.calculateTagStates();
    });

    this.$scope.download = function () {
      _self.courseService.downloadSchedule(_self.$scope.workgroupId, _self.$scope.year, _self.$scope.view.state.filters.enableUnpublishedCourses);
    };

    this.$scope.closeDetails = function () {
      if (_self.$scope.view.state.courses.newCourse) {
        _self.courseActionCreators.closeNewCourseDetails();
      } else {
        _self.courseActionCreators.closeDetails();
      }

      _self.$scope.view.newCourseSearchQuery = null;
      _self.$scope.view.state.courses.newCourse = null;
    };

    this.$scope.termToggled = function (id) {
      _self.courseActionCreators.toggleTermFilter(id);
    };

    _self.$scope.tagToggled = function (tagId) {
      var tagFilters = _self.$scope.view.state.filters.enabledTagIds;
      var tagIndex = tagFilters.indexOf(tagId);

      if (tagIndex < 0) {
        tagFilters.push(tagId);
      } else {
        tagFilters.splice(tagIndex, 1);
      }

      _self.courseActionCreators.updateTagFilters(tagFilters);
    };

    _self.$scope.addTag = function (item, tagId) {
      _self.courseActionCreators.addTagToCourse(_self.$scope.view.selectedEntity, _self.$scope.view.state.tags.list[tagId]);
    };

    _self.$scope.removeTag = function (item, tagId) {
      _self.courseActionCreators.removeTagFromCourse(_self.$scope.view.selectedEntity, _self.$scope.view.state.tags.list[tagId]);
    };

    _self.$scope.updateCourse = function () {
      _self.courseActionCreators.updateCourse(_self.$scope.view.selectedEntity);
    };

    _self.$scope.updateSection = function (section) {
      _self.courseActionCreators.updateSection(section);

      var sectionGroup = _self.$scope.view.state.sectionGroups.list[section.sectionGroupId];

      // Will update the sectionGroup plannedSeats using section seats
      // If the section is numeric based (example: 'PSC 040 - 001')
      if (isNumber(section.sequenceNumber) == true) {
        sectionGroup.plannedSeats = section.seats;
        _self.courseActionCreators.updateSectionGroup(sectionGroup);

        _self.$scope.manuallyUpdatePlannedSeats(sectionGroup);
      }
    };

    _self.$scope.manuallyUpdatePlannedSeats = function(sectionGroup) {
      $('[data-course-id="' + sectionGroup.courseId + '"] [data-term-code="' + sectionGroup.termCode + '"] input').val(sectionGroup.plannedSeats); // eslint-disable-line no-undef
    };

    _self.$scope.deleteSection = function (section) {
      _self.courseActionCreators.deleteSection(section);
    };

    _self.$scope.addSectionGroup = function () {
      _self.courseActionCreators.addSectionGroup(_self.$scope.view.state.sectionGroups.newSectionGroup);
    };

    // Triggered by global search field, redraws table based on query
    _self.$scope.filterTable = function (query) {
      clearTimeout(_self.$scope.timeout);
      _self.$scope.timeout = setTimeout(_self.courseActionCreators.updateTableFilter, 700, query);
    };

    // Triggered by global search cancel button
    _self.$scope.clearSearch = function () {
      _self.$scope.view.searchQuery = "";
      _self.$scope.filterTable("");
    };

    /**
     * Begins import mode, which allows for the mass adding of courses.
     * @return {[type]} [description]
     */
    _self.$scope.beginImportMode = function () {
      _self.courseActionCreators.beginImportMode();
    };

    /**
     * Ends import mode, which allows for the mass adding of courses.
     * @return {[type]} [description]
     */
    _self.$scope.endImportMode = function () {
      _self.courseActionCreators.endImportMode();
    };

    /**
     * Triggers the action to pull mass import courses from DW that
     * match the selected subjectCode and academicYear
     */
    _self.$scope.searchImportCourses = function () {
      _self.courseActionCreators.searchImportCourses(
        _self.$scope.view.state.uiState.massImportCode,
        _self.$scope.view.state.uiState.massImportYear,
        _self.$scope.view.state.uiState.massImportPrivate);
    };

    // Query for courses from IPA to display in the view as options to import
    _self.$scope.searchCoursesFromIPA = function () {
      _self.courseActionCreators.searchCoursesFromIPA(
        _self.$scope.workgroupId,
        _self.$scope.view.state.uiState.massImportYear,
        _self.$scope.view.state.uiState.massImportPrivate);
    };

    _self.$scope.sectionSeatTotal = function (sectionGroup) {
      return sectionGroup.sectionIds.reduce(function (previousValue, sectionId) {
        return previousValue + _self.$scope.view.state.sections.list[sectionId].seats;
      }, 0);
    };

    // Returns true if the form to query courses is valid based on the course source
    _self.$scope.importQueryFormValid = function() {
      var subjectCode = _self.$scope.view.state.uiState.massImportCode;
      var year = _self.$scope.view.state.uiState.massImportYear;
      var isSourceBanner = (_self.$scope.view.state.uiState.massImportSource == "Banner");
      var isSourceIPA = (_self.$scope.view.state.uiState.massImportSource == "IPA");

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

    _self.$scope.unpublishedCoursesToggled = function () {
      _self.courseActionCreators.setUnpublishedCoursesFilter(
        _self.$scope.workgroupId,
        _self.$scope.year,
        !_self.$scope.view.state.filters.enableUnpublishedCourses
      );
    };
  }
}

CourseCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', '$timeout', 'CourseActionCreators', 'CourseService', 'Term', 'AuthService'];

export default CourseCtrl;
