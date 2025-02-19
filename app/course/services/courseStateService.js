import { _array_sortIdsByProperty } from 'shared/helpers/array';
import { _object_search_properties } from 'shared/helpers/object';

/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */
class CourseStateService {
  constructor ($rootScope, $log, Course, Term, SectionGroup, Section, Tag, ActionTypes) {
    var self = this;

    return {
      _state: {},
      _termReducers: function (action, terms) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
          case ActionTypes.IMPORT_COURSES:
            terms = {
              ids: []
            };
            var termList = {};
            var length = action.payload.terms ? action.payload.terms.length : 0;
            for (var i = 0; i < length; i++) {
              var termData = action.payload.terms[i];
              // Using termCode as key since the Term does not have an id
              termList[termData.termCode] = new Term(termData);
            }
            terms.ids = _array_sortIdsByProperty(termList, "termCode");
            terms.list = termList;
            return terms;
          default:
            return terms;
        }
      },
      _courseReducers: function (action, courses) {
        var newCourseIndex;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
          case ActionTypes.IMPORT_COURSES:
          case ActionTypes.TOGGLE_UNPUBLISHED_COURSES:
            courses = {
              newCourse: null,
              ids: [],
              importList: null,
            };
            var coursesList = {};
            var length = action.payload.courses ? action.payload.courses.length : 0;
            for (var i = 0; i < length; i++) {
              var courseData = action.payload.courses[i];
              coursesList[courseData.id] = new Course(courseData);
            }
            courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
            courses.list = coursesList;
            return courses;
          case ActionTypes.BEGIN_SEARCH_IMPORT_COURSES:
            courses.importList = null;
            return courses;
          case ActionTypes.SEARCH_IMPORT_COURSES:
            var importList = [];
            action.payload.sectionGroups.forEach(function (sg) {

              if (action.payload.subjectCode && action.payload.subjectCode.length > 0) {
                sg.subjectCode = action.payload.subjectCode;
              }

              // Find any duplicate in existing courses
              var matchingCourse = _.find(courses.list, function (course) { // eslint-disable-line no-undef
                return (course.courseNumber == sg.courseNumber)
                        && (course.subjectCode == sg.subjectCode)
                        && (course.sequencePattern == sg.sequencePattern);
              });
              // Find any duplicate in importList
              var matchingImportCourse = _.find(importList, function (course) { // eslint-disable-line no-undef
                return (course.courseNumber == sg.courseNumber) && (course.sequencePattern == sg.sequencePattern);
              });
              // Add only non-duplicates
              if (matchingCourse === undefined && matchingImportCourse === undefined) {
                const effectiveTermCode = action.payload.sectionGroups.find(
                  (sectionGroup) =>
                    sectionGroup.courseNumber === sg.courseNumber &&
                    sectionGroup.subjectCode === sg.subjectCode &&
                    sectionGroup.sequencePattern === sg.sequencePattern
                ).effectiveTermCode;

                importList.push(new Course({
                  subjectCode: sg.subjectCode,
                  courseNumber: sg.courseNumber,
                  title: sg.title,
                  sequencePattern: sg.sequencePattern,
                  effectiveTermCode: effectiveTermCode,
                  unitsLow: sg.creditHoursLow,
                  unitsHigh: sg.creditHoursHigh,
                  import: true
                }));
              }
            });
            courses.importList = _.sortBy(importList, function (course) { // eslint-disable-line no-undef
              return course.subjectCode + course.courseNumber + course.sequenceNumber;
            });
            return courses;
          case ActionTypes.TOGGLE_IMPORT_COURSE:
            var matchingImportCourse = _.find(courses.importList, function (course) { // eslint-disable-line no-undef
              return (course.subjectCode == action.payload.subjectCode) &&
                (course.courseNumber == action.payload.courseNumber) &&
                (course.sequencePattern == action.payload.sequencePattern);
            });
            if (matchingImportCourse) {
              matchingImportCourse.import = !matchingImportCourse.import;
            }
            return courses;
          case ActionTypes.NEW_COURSE:
            // Insert a new id of '0' at the specified index
            courses.ids.splice(action.payload.index, 0, 0);
            courses.newCourse = new Course();
            return courses;
          case ActionTypes.CLOSE_NEW_COURSE_DETAILS:
            newCourseIndex = courses.ids.indexOf(0);
            courses.ids.splice(newCourseIndex, 1);
            courses.newCourse = null;
            return courses;
          case ActionTypes.CREATE_COURSE:
            // Close details
            newCourseIndex = courses.ids.indexOf(0);
            courses.ids.splice(newCourseIndex, 1);
            courses.newCourse = null;
            // Insert new course
            courses.list[action.payload.course.id] = new Course(action.payload.course);
            courses.ids.splice(newCourseIndex, 0, action.payload.course.id);
            return courses;
          case ActionTypes.DELETE_MULTIPLE_COURSES:
            action.payload.courseIds.forEach(function(courseId) {
              var courseIndex = courses.ids.indexOf(courseId);
              courses.ids.splice(courseIndex, 1);
              delete courses.list[courseId];
            });
              return courses;
          case ActionTypes.REMOVE_COURSE:
            var courseIndex = courses.ids.indexOf(action.payload.course.id);
            courses.ids.splice(courseIndex, 1);
            delete courses.list[action.payload.course.id];
            return courses;
          case ActionTypes.UPDATE_COURSE:
            courses.list[action.payload.course.id] = new Course(action.payload.course);
            return courses;
          case ActionTypes.MASS_ASSIGN_TAGS:
            var courseIds = action.massAssignTags.courseIds;
            var tagIdsToAdd = action.massAssignTags.tagIdsToAdd;
            var tagIdsToRemove = action.massAssignTags.tagIdsToRemove;

            courseIds.forEach(function(courseId) {
              var course = courses.list[courseId];

              tagIdsToAdd.forEach(function(tagId) {
                if (course.tagIds.indexOf(tagId) == -1) {
                  course.tagIds.push(tagId);
                }
              });
              tagIdsToRemove.forEach(function(tagId) {
                var index = course.tagIds.indexOf(tagId);
                if (index > -1) {
                  course.tagIds.splice(index, 1);
                }
              });
            });

            return courses;
          case ActionTypes.UPDATE_TABLE_FILTER:
            var query = action.payload.query;

            // Specify the properties that we are interested in searching
            var courseKeyList = ['courseNumber', 'sequencePattern', 'subjectCode', 'title'];

            _object_search_properties(query, courses, courseKeyList);

            return courses;
          case ActionTypes.UPDATE_TAG_FILTERS:
            // Set the course.isFiltered flag to false if any tag matches the filters
            courses.ids.forEach(function (courseId) {
              // Display all courses if none of the tags is checked
              if (action.payload.tagIds.length === 0) {
                delete courses.list[courseId].matchesTagFilters;
              } else {
                courses.list[courseId].matchesTagFilters = courses.list[courseId].tagIds
                  .some(function (tagId) {
                    return action.payload.tagIds.indexOf(tagId) >= 0;
                  });
              }
            });
            return courses;
          case ActionTypes.GET_COURSE_CENSUS:
            var course = courses.list[action.payload.course.id];
            if (course) { course.census = action.payload.census; }
            return courses;
          case ActionTypes.END_IMPORT_MODE:
            courses.importList = null;
            return courses;
          default:
            return courses;
        }
      },
      _sectionGroupReducers: function (action, sectionGroups) {
        var sectionGroupData;

        switch (action.type) {
          case ActionTypes.INIT_STATE:
          case ActionTypes.IMPORT_COURSES:
          case ActionTypes.TOGGLE_UNPUBLISHED_COURSES:
            sectionGroups = {
              newSectionGroup: null,
              selectedSectionGroup: null,
              ids: [],
              importList: null
            };
            var sectionGroupsList = {};
            var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
            for (var i = 0; i < length; i++) {
              sectionGroupData = action.payload.sectionGroups[i];
              sectionGroupsList[sectionGroupData.id] = new SectionGroup(sectionGroupData);
              sectionGroupsList[sectionGroupData.id].sections = action.payload.sections?.filter(function(section) {
                return (section.sectionGroupId === sectionGroupData.id);
              });
              sectionGroups.ids.push(sectionGroupData.id);
            }
            sectionGroups.list = sectionGroupsList;
            return sectionGroups;
          case ActionTypes.SEARCH_IMPORT_COURSES:
            sectionGroups.importList = [];
            action.payload.sectionGroups.forEach(function (sg) {
              // Find any duplicate in importList
              var matchingImportSectionGroup = _.find(sectionGroups.importList, function (sectionGroup) { // eslint-disable-line no-undef
                return (sectionGroup.courseNumber == sg.courseNumber) &&
                  (sectionGroup.subjectCode == sg.subjectCode) &&
                  (sectionGroup.sequencePattern == sg.sequencePattern) &&
                  (sectionGroup.termCode == sg.termCode);
              });
              // Add only non-duplicates
              if (matchingImportSectionGroup === undefined) {
                const effectiveTermCode = action.payload.sectionGroups.find(sectionGroup => sectionGroup.courseNumber === sg.courseNumber && sectionGroup.subjectCode === sg.subjectCode && sectionGroup.sequencePattern === sg.sequencePattern).effectiveTermCode;

                sectionGroups.importList.push(new SectionGroup({
                  subjectCode: action.payload.subjectCode || sg.subjectCode,
                  courseNumber: sg.courseNumber,
                  sequencePattern: sg.sequencePattern,
                  plannedSeats: sg.seats || sg.plannedSeats || 0,
                  title: sg.title,
                  termCode: sg.termCode,
                  unitsLow: sg.creditHoursLow,
                  unitsHigh: sg.creditHoursHigh,
                  effectiveTermCode: effectiveTermCode
                }));
              }
            });
            return sectionGroups;
          case ActionTypes.ADD_SECTION_GROUP:
            sectionGroups.list[action.payload.sectionGroup.id] = new SectionGroup(action.payload.sectionGroup);
            sectionGroups.list[action.payload.sectionGroup.id].sectionIds = [action.payload.sections[0].id];
            sectionGroups.ids.push(action.payload.sectionGroup.id);
            sectionGroups.selectedSectionGroup = sectionGroups.list[action.payload.sectionGroup.id];
            sectionGroups.selectedSectionGroup.sections = action.payload.sections;
            sectionGroups.newSectionGroup = null;
            return sectionGroups;
          case ActionTypes.REMOVE_SECTION_GROUP:
            var sectionGroupIndex = sectionGroups.ids.indexOf(action.payload.sectionGroup.id);
            sectionGroups.ids.splice(sectionGroupIndex, 1);
            delete sectionGroups.list[action.payload.sectionGroup.id];
            sectionGroups.newSectionGroup = new SectionGroup({
              courseId: action.payload.sectionGroup.courseId,
              termCode: action.payload.sectionGroup.termCode
            });
            sectionGroups.selectedSectionGroup = sectionGroups.newSectionGroup;
            return sectionGroups;
          case ActionTypes.UPDATE_SECTION_GROUP:
            sectionGroups.list[action.payload.sectionGroup.id].plannedSeats = action.payload.sectionGroup.plannedSeats;
            sectionGroups.list[action.payload.sectionGroup.id].termCode = action.payload.sectionGroup.termCode;
            sectionGroups.selectedSectionGroup = sectionGroups.list[action.payload.sectionGroup.id];
            sectionGroups.selectedSectionGroup.requiresAttention = action.payload.requiresAttention;
            return sectionGroups;
          case ActionTypes.FETCH_SECTIONS:
            sectionGroups.list[action.payload.sectionGroup.id].sectionIds = action.payload.sections
              .sort(function (sectionA, sectionB) {
                if (sectionA.sequenceNumber < sectionB.sequenceNumber) { return -1; }
                if (sectionA.sequenceNumber > sectionB.sequenceNumber) { return 1; }
                return 0;
              })
              .map(function (section) { return section.id; });
            return sectionGroups;
          case ActionTypes.CREATE_SECTION:
            sectionGroups.selectedSectionGroup = sectionGroups.list[action.payload.section.sectionGroupId];
            if (!sectionGroups.selectedSectionGroup.sectionIds) { sectionGroups.selectedSectionGroup.sectionIds = []; }
            sectionGroups.selectedSectionGroup.sectionIds.push(action.payload.section.id);
            sectionGroups.selectedSectionGroup.sections.push(new Section(action.payload.section));
            sectionGroups.selectedSectionGroup.requiresAttention = false;
            return sectionGroups;
          case ActionTypes.UPDATE_SECTION:
            var sectionGroup = sectionGroups.selectedSectionGroup || sectionGroups.list[action.payload.section.sectionGroupId];
            sectionGroup.sections = sectionGroup.sections.map(slotSection => slotSection.id === action.payload.section.id ? action.payload.section : slotSection);
            sectionGroup.requiresAttention = action.payload.requiresAttention;
            return sectionGroups;
          case ActionTypes.REMOVE_SECTION:
            var sectionIdIndex = sectionGroups.list[action.payload.section.sectionGroupId].sectionIds.indexOf(action.payload.section.id);
            sectionGroups.list[action.payload.section.sectionGroupId].sectionIds.splice(sectionIdIndex, 1);

            sectionGroups.selectedSectionGroup.sections = sectionGroups.selectedSectionGroup.sections.filter(function( section ) {
              return section.id !== action.payload.section.id;
            });

            if (sectionGroups.selectedSectionGroup.plannedSeats && sectionGroups.selectedSectionGroup.sectionIds.length === 0) {
              sectionGroups.selectedSectionGroup.requiresAttention = true;
            }
            return sectionGroups;
          case ActionTypes.CELL_SELECTED:
            sectionGroups.selectedSectionGroup = _.find(sectionGroups.list, function (sg) { // eslint-disable-line no-undef
              return (sg.termCode == action.payload.termCode) && (sg.courseId == action.payload.courseId);
            });
            if (action.payload.termCode && sectionGroups.selectedSectionGroup === undefined) {
              sectionGroupData = {
                courseId: action.payload.courseId,
                termCode: action.payload.termCode.toString()
              };
              sectionGroups.newSectionGroup = new SectionGroup(sectionGroupData);
            }
            return sectionGroups;
          case ActionTypes.CLOSE_DETAILS:
            sectionGroups.selectedSectionGroup = null;
            sectionGroups.newSectionGroup = null;
            return sectionGroups;
          case ActionTypes.END_IMPORT_MODE:
            sectionGroups.importList = null;
            return sectionGroups;
          default:
            return sectionGroups;
        }
      },
      _sectionReducers: function (action, sections) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
          case ActionTypes.IMPORT_COURSES:
            sections = {
              list: {},
              ids: []
            };

            action.payload.sections.forEach(function (section) {
              sections.list[section.id] = new Section(section);
              sections.ids.push(section.id);
            });

            return sections;
          case ActionTypes.FETCH_SECTIONS:
            action.payload.sections.forEach(function (sectionData) {
              if (!sections.list[sectionData.id] && !sections.ids[sectionData.id]) {
                sections.list[sectionData.id] = new Section(sectionData);
                sections.ids.push(sectionData.id);
              }
            });
            return sections;
          case ActionTypes.ADD_SECTION_GROUP:
            sections.list[action.payload.sections[0].id] = new Section(action.payload.sections[0]);
            sections.ids.push(action.payload.sections[0].id);
            return sections;
          case ActionTypes.CREATE_SECTION:
            sections.list[action.payload.section.id] = new Section(action.payload.section);
            sections.ids.push(action.payload.section.id);
            return sections;
          case ActionTypes.REMOVE_SECTION:
            var sectionIndex = sections.ids.indexOf(action.payload.section.id);
            sections.ids.splice(sectionIndex, 1);
            delete sections.list[action.payload.section.id];
            return sections;
          case ActionTypes.UPDATE_SECTION:
            sections.list[action.payload.section.id].seats = action.payload.section.seats;
            return sections;
          default:
            return sections;
        }
      },
      _tagReducers: function (action, tags) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
          case ActionTypes.IMPORT_COURSES:
            tags = {
              ids: [],
              list: {},
              availableIds: []	// Tags that are available to be used (not archived).
            };
            var tagsList = {};
            var length = action.payload.tags ? action.payload.tags.length : 0;
            for (var i = 0; i < length; i++) {
              var tagData = action.payload.tags[i];
              tagsList[tagData.id] = new Tag(tagData);
            }
            tags.ids = _array_sortIdsByProperty(tagsList, "name");
            tags.availableIds = tags.ids.filter(function (tagId) { return tagsList[tagId].archived === false; });
            tags.list = tagsList;

            return tags;
          default:
            return tags;
        }
      },
      _filterReducers: function (action, filters) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
            // A filter is 'enabled' if it is checked, i.e. the category it represents
            // is selected to be shown/on/active.
            filters = {
              enabledTerms: [10, 1, 3], // these match the 'id' field in termDefinitions
              enabledTagIds: [],
              enableUnpublishedCourses: false
            };
            // Here is where we might load stored data about what filters
            // were left on last time.

            // Check localStorage for saved termFilter settings
            var termFiltersBlob = localStorage.getItem("termFilters");
            if (termFiltersBlob) {
              filters.enabledTerms = self.deserializeTermFiltersBlob(termFiltersBlob);
            }
            return filters;
          case ActionTypes.TOGGLE_TERM_FILTER:
            var tagId = action.payload.termId;
            var idx = filters.enabledTerms.indexOf(tagId);
            // A term in the term filter dropdown has been toggled on or off.
            if (idx === -1) {
              // Toggle on
              filters.enabledTerms.push(tagId);
            } else {
              // Toggle off
              filters.enabledTerms.splice(idx, 1);
            }
            var termFiltersBlob = self.serializeTermFilters(filters.enabledTerms);
            localStorage.setItem("termFilters", termFiltersBlob);
            return filters;
          case ActionTypes.UPDATE_TAG_FILTERS:
            filters.enabledTagIds = action.payload.tagIds;
            return filters;
          case ActionTypes.TOGGLE_UNPUBLISHED_COURSES:
            filters.enableUnpublishedCourses = !filters.enableUnpublishedCourses;
            filters.enabledTagIds = [];
            return filters;
          default:
            return filters;
        }
      },
      _uiStateReducers: function (action, uiState) {
        switch (action.type) {
          case ActionTypes.INIT_STATE:
          case ActionTypes.IMPORT_COURSES:
          case ActionTypes.TOGGLE_UNPUBLISHED_COURSES:
            uiState = {
              tableGrayedOut: false,
              selectedCourseId: null,
              selectedTermCode: null,
              massImportMode: false,
              massImportCode: null,
              massImportYear: null,
              massImportTimes: true,
              massImportInstructors: true,
              massImportPrivate: false,
              massImportInProgress: false,
              censusFetchInProgress: false,
              sectionsFetchInProgress: false,
              searchingCourseToImport: false,
              selectedCourseRowIds: [],
              isCourseDeleteModalOpen: false,
              moveCourseModal: {
                show: false,
                selectedSectionGroup: null,
                selectedTermCode: null
              },
              requiresAttention: false,
              flaggedSectionGroups: 0,
            };

            uiState.requiresAttention = action.payload.requiresAttention;
            uiState.flaggedSectionGroups = action.payload.flaggedSectionGroups;
            uiState.tableLocked = false;
            return uiState;
          case ActionTypes.BEGIN_FETCH_SECTIONS:
            uiState.sectionsFetchInProgress = true;
            return uiState;
          case ActionTypes.FETCH_SECTIONS:
            uiState.sectionsFetchInProgress = false;
            return uiState;
          case ActionTypes.CREATE_SECTION:
          case ActionTypes.UPDATE_SECTION:
          case ActionTypes.REMOVE_SECTION:
            uiState.requiresAttention = action.payload.flaggedSectionGroups > 0;
            uiState.flaggedSectionGroups = action.payload.flaggedSectionGroups;
            return uiState;
          case ActionTypes.BEGIN_FETCH_CENSUS:
            uiState.censusFetchInProgress = true;
            return uiState;
          case ActionTypes.GET_COURSE_CENSUS:
            uiState.censusFetchInProgress = false;
            return uiState;
          case ActionTypes.NEW_COURSE:
            uiState.tableLocked = true;
            uiState.tableGrayedOut = true;
            return uiState;
          case ActionTypes.CREATE_COURSE:
            uiState.selectedCourseId = action.payload.course.id;
            uiState.tableLocked = false;
            uiState.tableGrayedOut = false;
            return uiState;
          case ActionTypes.CELL_SELECTED:
            uiState.selectedCourseId = action.payload.courseId;
            uiState.selectedTermCode = action.payload.termCode;
            return uiState;
          case ActionTypes.CLOSE_DETAILS:
            uiState.selectedCourseId = null;
            uiState.selectedTermCode = null;
            return uiState;
          case ActionTypes.UPDATE_SECTION_GROUP:
            uiState.selectedCourseId = action.payload.sectionGroup.courseId;
            uiState.selectedTermCode = action.payload.sectionGroup.termCode;
            uiState.requiresAttention = action.payload.flaggedSectionGroups > 0;
            uiState.flaggedSectionGroups = action.payload.flaggedSectionGroups;
            return uiState;
          case ActionTypes.CLOSE_NEW_COURSE_DETAILS:
            uiState.tableLocked = false;
            uiState.tableGrayedOut = false;
            return uiState;
          case ActionTypes.BEGIN_SEARCH_IMPORT_COURSES:
            uiState.searchingCourseToImport = true;
            return uiState;
          case ActionTypes.SEARCH_IMPORT_COURSES:
            uiState.searchingCourseToImport = false;
            return uiState;
          case ActionTypes.BEGIN_IMPORT_MODE:
            uiState.tableLocked = true;
            uiState.tableGrayedOut = true;
            uiState.massImportMode = true;
            uiState.selectedCourseId = null;
            uiState.selectedTermCode = null;
            return uiState;
          case ActionTypes.END_IMPORT_MODE:
            uiState.tableLocked = false;
            uiState.tableGrayedOut = false;
            uiState.massImportMode = false;
            uiState.massImportCode = null;
            uiState.massImportYear = null;
            uiState.massImportPrivate = false;
            return uiState;
          case ActionTypes.REMOVE_COURSE:
            var courseId = action.payload.course.id;
            // Remove the details pane if it was showing the deleted course
            if (uiState.selectedCourseId == courseId) {
              uiState.selectedCourseId = null;
            }

            // Ensure deleted course is not selected
            var index = uiState.selectedCourseRowIds.indexOf(courseId);

            if (index > -1) {
              uiState.selectedCourseRowIds.splice(index, 1);
            }

            return uiState;
          case ActionTypes.TOGGLE_SELECT_COURSE_ROW:
            var courseId = action.payload.courseId;
            var index = uiState.selectedCourseRowIds.indexOf(courseId);

            if (index > -1) {
              uiState.selectedCourseRowIds.splice(index, 1);
            } else {
              uiState.selectedCourseRowIds.push(courseId);
            }

            return uiState;
          case ActionTypes.SELECT_ALL_COURSE_ROWS:
            var courseIds = action.payload.courseIds;
            courseIds.forEach(function(courseId) {
              var index = uiState.selectedCourseRowIds.indexOf(courseId);
              if (index == -1) {
                uiState.selectedCourseRowIds.push(courseId);
              }
            });
            return uiState;
          case ActionTypes.DESELECT_ALL_COURSE_ROWS:
            uiState.selectedCourseRowIds = [];
            return uiState;
          case ActionTypes.OPEN_COURSE_DELETION_MODAL:
            uiState.isCourseDeleteModalOpen = true;
            return uiState;
          case ActionTypes.CLOSE_COURSE_DELETION_MODAL:
            uiState.isCourseDeleteModalOpen = false;
            return uiState;
          case ActionTypes.TOGGLE_MOVE_COURSE_MODAL:
            uiState.moveCourseModal.show = !uiState.moveCourseModal.show;
            uiState.moveCourseModal.selectedSectionGroup = action.payload.selectedSectionGroup;
            uiState.moveCourseModal.selectedTermCode = action.payload.selectedTermCode;
            return uiState;
          default:
            return uiState;
        }
      },
      reduce: function (action) {
        var scope = this;

        if (!action || !action.type) {
          return;
        }

        let newState = {};
        newState.terms = scope._termReducers(action, scope._state.terms);
        newState.courses = scope._courseReducers(action, scope._state.courses);
        newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
        newState.sections = scope._sectionReducers(action, scope._state.sections);
        newState.tags = scope._tagReducers(action, scope._state.tags);
        newState.filters = scope._filterReducers(action, scope._state.filters);
        newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

        scope._state = newState;
        $rootScope.$emit('courseStateChanged', {
          state: scope._state,
          action: action
        });

        $log.debug("Course state updated:");
        $log.debug(scope._state, action.type);
      }
    };
  }

  // Creates a buildfield to store enabled term filters
  // Always 9 digits (skips 4th unused term), and in chronologic order
  // Example: "101010001"
  serializeTermFilters (termFilters) {
    var termsBlob = "";
    var orderedTerms = [5, 6, 7, 8, 9, 10, 1, 2, 3];

    orderedTerms.forEach(function (term) {
      if (termFilters.indexOf(term) > -1) {
        termsBlob += "1";
      } else {
        termsBlob += "0";
      }
    });

    return termsBlob;
  }

  deserializeTermFiltersBlob (termFiltersBlob) {
    var termFiltersArray = [];
    var orderedTerms = [5, 6, 7, 8, 9, 10, 1, 2, 3];

    for (var i = 0; i < orderedTerms.length; i++) {

      if (termFiltersBlob[i] == "1") {
        termFiltersArray.push(orderedTerms[i]);
      }
    }

    return termFiltersArray;
  }
}

CourseStateService.$inject = ['$rootScope', '$log', 'Course', 'Term', 'SectionGroup', 'Section', 'Tag', 'ActionTypes'];

export default CourseStateService;
