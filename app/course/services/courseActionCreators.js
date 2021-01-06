/**
 * @ngdoc service
 * @name courseApp.courseActionCreators
 * @description
 * # courseActionCreators
 * Service in the courseApp.
 * Central location for sharedState information.
 */
import { isNumber } from 'shared/helpers/types';

class CourseActionCreators {
  constructor (CourseStateService, $route, CourseService, $rootScope, Role, ActionTypes) {
    return {
      getInitialState: function () {
        var self = this;
        var workgroupId = $route.current.params.workgroupId;
        var year = $route.current.params.year;

        CourseService.getScheduleByWorkgroupIdAndYear(workgroupId, year).then(function (payload) {
          payload.flaggedSectionGroups = self._generateAttentionFlags(payload);
          payload.requiresAttention = payload.flaggedSectionGroups > 0;
          var action = {
            type: ActionTypes.INIT_STATE,
            payload: payload
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not load initial course state.", type: "ERROR" });
        });
      },
      submitMassAssignTags: function (userActions, tagIds, courseIds, workgroupId, year) {
        let massAssignTags = {
          tagIdsToAdd: [],
          tagIdsToRemove: [],
          courseIds: courseIds
        };

        tagIds.forEach(function(tagId) {
          if (userActions[tagId].userChoice == "add") {
            massAssignTags.tagIdsToAdd.push(tagId);
          }
          if (userActions[tagId].userChoice == "remove") {
            massAssignTags.tagIdsToRemove.push(tagId);
          }
        });

        CourseService.submitMassAssignTags(massAssignTags, workgroupId, year).then(function () {
          var action = {
            type: ActionTypes.MASS_ASSIGN_TAGS,
            massAssignTags: massAssignTags
          };
          CourseStateService.reduce(action);
          $rootScope.$emit('toast', { message: "Updated tags.", type: "SUCCESS" });
        }, function () {
          $rootScope.$emit('toast', { message: "Could not update tags.", type: "ERROR" });
        });
      },
      setActiveCell: function (courseId, termCode) {
        var action = {
          type: ActionTypes.CELL_SELECTED,
          payload: {
            courseId: courseId,
            termCode: termCode
          }
        };
        CourseStateService.reduce(action);
      },
      toggleImportCourse: function (subjectCode, courseNumber, sequencePattern) {
        var action = {
          type: ActionTypes.TOGGLE_IMPORT_COURSE,
          payload: {
            subjectCode: subjectCode,
            courseNumber: courseNumber,
            sequencePattern: sequencePattern
          }
        };
        CourseStateService.reduce(action);
      },
      closeDetails: function () {
        var action = {
          type: ActionTypes.CLOSE_DETAILS,
          payload: {}
        };
        CourseStateService.reduce(action);
      },
      closeNewCourseDetails: function () {
        var action = {
          type: ActionTypes.CLOSE_NEW_COURSE_DETAILS,
          payload: {}
        };
        CourseStateService.reduce(action);
      },
      toggleTermFilter: function (termId) {
        var action = {
          type: ActionTypes.TOGGLE_TERM_FILTER,
          payload: {
            termId: termId
          }
        };
        CourseStateService.reduce(action);
      },
      setUnpublishedCoursesFilter: function (workgroupId, year, enableUnpublishedCourses) {
        CourseService.getScheduleByWorkgroupIdAndYear(workgroupId, year, enableUnpublishedCourses).then(function (payload) {
          var action = {
            type: ActionTypes.TOGGLE_UNPUBLISHED_COURSES,
            payload: payload
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not toggle unpublished courses.", type: "ERROR" });
        });
      },
      updateTagFilters: function (tagIds) {
        var action = {
          type: ActionTypes.UPDATE_TAG_FILTERS,
          payload: {
            tagIds: tagIds
          }
        };
        CourseStateService.reduce(action);
      },
      addSectionGroup: function (sectionGroup) {
        CourseService.addSectionGroup(sectionGroup).then(function (sectionGroup) {
          CourseService.getSectionsBySectionGroupId(sectionGroup.id).then(function (sections) {
            $rootScope.$emit('toast', { message: "Created course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
            var action = {
            type: ActionTypes.ADD_SECTION_GROUP,
            payload: {
              sectionGroup: sectionGroup,
              sections: sections
            }
          };
          CourseStateService.reduce(action);
          });
        }, function () {
          $rootScope.$emit('toast', { message: "Could not create course offering.", type: "ERROR" });
        });
      },
      updateSectionGroup: function (sectionGroup, newTermCode) {
        let courseSeats = sectionGroup.sections.reduce(function (previousValue, relatedSection) {
          return previousValue + (parseInt(relatedSection.seats) || 0);
        }, 0);

        if (courseSeats <= sectionGroup.plannedSeats) {
          if (newTermCode) {
            sectionGroup.termCode = newTermCode;
          }

          CourseService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
            $rootScope.$emit('toast', { message: "Updated course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
            var action = {
              type: ActionTypes.UPDATE_SECTION_GROUP,
              payload: {
                sectionGroup: sectionGroup
              }
            };
            CourseStateService.reduce(action);
          }, function () {
            $rootScope.$emit('toast', { message: "Could not update course offering.", type: "ERROR" });
          });
        }

      },
      removeSectionGroup: function (sectionGroup) {
        if (!sectionGroup) { return; }
        CourseService.removeSectionGroup(sectionGroup.id).then(function () {
          $rootScope.$emit('toast', { message: "Deleted course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
          var action = {
            type: ActionTypes.REMOVE_SECTION_GROUP,
            payload: {
              sectionGroup: sectionGroup
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not delete course offering.", type: "ERROR" });
        });
      },
      deleteCourse: function (course) {
        var courseTitle = course.title;
        CourseService.deleteCourse(course).then(function () {
          window.ipa_analyze_event('courses', 'single course deleted', courseTitle);

          $rootScope.$emit('toast', { message: "Deleted course " + courseTitle, type: "SUCCESS" });
          var action = {
            type: ActionTypes.REMOVE_COURSE,
            payload: {
              course: course
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not delete course.", type: "ERROR" });
        });
      },
      deleteMultipleCourses: function (courseIds, workgroupId, year) {
        var self = this;
        CourseService.deleteMultipleCourses(courseIds, workgroupId, year).then(function () {
          window.ipa_analyze_event('courses', 'multiple courses deleted');

          $rootScope.$emit('toast', { message: "Deleted courses.", type: "SUCCESS" });
          var action = {
            type: ActionTypes.DELETE_MULTIPLE_COURSES,
            payload: {
              courseIds: courseIds
            }
          };
          CourseStateService.reduce(action);

          self.closeCourseDeletionModal();
          self.deselectAllCourseRows();
        }, function () {
          $rootScope.$emit('toast', { message: "Unable to delete multiple courses.", type: "ERROR" });
        });
      },
      searchImportCourses: function (subjectCode, year, includePrivate) {
        var action = {
          type: ActionTypes.BEGIN_SEARCH_IMPORT_COURSES,
          payload: {}
        };
        CourseStateService.reduce(action);
        CourseService.searchImportCourses(subjectCode, year, includePrivate).then(function (sectionGroups) {
          var action = {
            type: ActionTypes.SEARCH_IMPORT_COURSES,
            payload: {
              subjectCode: subjectCode,
              sectionGroups: sectionGroups
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not search import courses.", type: "ERROR" });
        });
      },
      searchCoursesFromIPA: function (workgroupId, year, includePrivate) {
        var action = {
          type: ActionTypes.BEGIN_SEARCH_IMPORT_COURSES,
          payload: {}
        };
        CourseStateService.reduce(action);
        CourseService.searchCoursesFromIPA(workgroupId, year, includePrivate).then(function (sectionGroups) {
          var action = {
            type: ActionTypes.SEARCH_IMPORT_COURSES,
            payload: {
              subjectCode: null,
              sectionGroups: sectionGroups
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not search IPA courses.", type: "ERROR" });
        });
      },
      newCourse: function (index) {
        var action = {
          type: ActionTypes.NEW_COURSE,
          payload: {
            index: index
          }
        };
        CourseStateService.reduce(action);
        // This needs to run after the reducer
        this.setActiveCell(0);
      },
      /**
       * POSTs to create a course
       *
       * @param  newCourse		new course object
       * @param  workgroupId
       * @param  year
       * @returns							created course
       */
      createCourse: function (newCourse, workgroupId, year) {
        CourseService.createCourse(newCourse, workgroupId, year).then(function (createdCourse) {
          window.ipa_analyze_event('courses', 'course added');

          $rootScope.$emit('toast', { message: "Created course " + createdCourse.title, type: "SUCCESS" });
          var action = {
            type: ActionTypes.CREATE_COURSE,
            payload: {
              course: createdCourse
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not create course.", type: "ERROR" });
        });

      },
      importCoursesAndSectionGroups: function (sectionGroupImports, workgroupId, year, importedCoursesCount, importTimes, importAssignments) {
        var importTimes = importTimes ? true : false;
        var importAssignments = importAssignments ? true : false;

        CourseService.importCoursesAndSectionGroups(sectionGroupImports, workgroupId, year, importTimes, importAssignments).then(function (payload) {
          window.ipa_analyze_event('courses', 'mass import', 'Banner');

          $rootScope.$emit('toast', { message: "Created " + importedCoursesCount + " courses", type: "SUCCESS" });
          var action = {
            type: ActionTypes.IMPORT_COURSES,
            payload: payload
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not import courses.", type: "ERROR" });
        });
      },
      importCoursesAndSectionGroupsFromIPA: function (sectionGroupImports, workgroupId, year, importedCoursesCount, importTimes, importAssignments) {
        var importTimes = importTimes ? true : false;
        var importAssignments = importAssignments ? true : false;

        CourseService.importCoursesAndSectionGroupsFromIPA(sectionGroupImports, workgroupId, year, importTimes, importAssignments).then(function (payload) {
          window.ipa_analyze_event('courses', 'mass import', 'IPA');

          $rootScope.$emit('toast', { message: "Created " + importedCoursesCount + " courses", type: "SUCCESS" });
          var action = {
            type: ActionTypes.IMPORT_COURSES,
            payload: payload
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not import courses from IPA.", type: "ERROR" });
        });
      },
      updateCourse: function (course) {
        CourseService.updateCourse(course).then(function (updatedCourse) {
          window.ipa_analyze_event('courses', 'course updated');

          $rootScope.$emit('toast', { message: "Updated course " + updatedCourse.title, type: "SUCCESS" });
          var action = {
            type: ActionTypes.UPDATE_COURSE,
            payload: {
              course: updatedCourse
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
        });
      },
      addTagToCourse: function (course, tag) {
        CourseService.addTagToCourse(course, tag).then(function (updatedCourse) {
          window.ipa_analyze_event('courses', 'course tag added');

          $rootScope.$emit('toast', { message: "Added tag " + tag.name, type: "SUCCESS" });
          var action = {
            type: ActionTypes.UPDATE_COURSE,
            payload: {
              course: updatedCourse
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not add tag to course.", type: "ERROR" });
        });
      },
      removeTagFromCourse: function (course, tag) {
        CourseService.removeTagFromCourse(course, tag).then(function (updatedCourse) {
          window.ipa_analyze_event('courses', 'course tag removed');

          $rootScope.$emit('toast', { message: "Removed tag " + tag.name, type: "SUCCESS" });
          var action = {
            type: ActionTypes.UPDATE_COURSE,
            payload: {
              course: updatedCourse
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not remove tag from course.", type: "ERROR" });
        });
      },
      getSectionsBySectionGroup: function (sectionGroup) {
        CourseStateService.reduce({
          type: ActionTypes.BEGIN_FETCH_SECTIONS,
          payload: {}
        });
        CourseService.getSectionsBySectionGroupId(sectionGroup.id).then(function (sections) {
          var action = {
            type: ActionTypes.FETCH_SECTIONS,
            payload: {
              sectionGroup: sectionGroup,
              sections: sections
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not get sections for section group.", type: "ERROR" });
        });
      },
      updateSection: function (section) {
        let maxCourseSeats = CourseStateService._state.sectionGroups.selectedSectionGroup.plannedSeats;
        let proposedCourseSeats;
        if (section){
          let proposedSectionSeats = parseInt(section.seats);
          proposedCourseSeats = CourseStateService._state.sectionGroups.selectedSectionGroup.sections.reduce(function (previousValue, relatedSection) {
            return relatedSection.id !== section.id
              ? previousValue + (parseInt(CourseStateService._state.sections.list[relatedSection.id].seats) || 0)
              : previousValue;
          }, proposedSectionSeats);
          section.seats = proposedSectionSeats;
        }
        else {
          proposedCourseSeats = CourseStateService._state.sectionGroups.selectedSectionGroup.sections.reduce(function (previousValue, relatedSection) {
            return parseInt(CourseStateService._state.sections.list[relatedSection.id].seats) || 0;
          }, 0);
        }

        let sectionCount = CourseStateService._state.sectionGroups.selectedSectionGroup.sections.length;
        if (maxCourseSeats >= proposedCourseSeats || isNumber(section.sequenceNumber) || sectionCount === 1){
          let attempted = [];
          let successes = [];
          let promises = [];
          CourseStateService._state.sectionGroups.selectedSectionGroup.sections.forEach(function (item) {
            let proposedSeatsForSection = CourseStateService._state.sections.list[item.id].seats;
            if (proposedSeatsForSection != item.seats){
              item.seats = proposedSeatsForSection;
              attempted.push(item.sequenceNumber);
              promises.push(CourseService.updateSection(item));
            }
          });
          if (promises.length == 0){
            return;
          }
          Promise.allSettled(promises).then((results) => {
            results.forEach(function (result) {
              if (result.status == 'fulfilled'){
                window.ipa_analyze_event('courses', 'section updated');
                var action = {
                  type: ActionTypes.UPDATE_SECTION,
                  payload: {
                    section: result.value

                  }
                };
                CourseStateService.reduce(action);
                successes.push(result.value.sequenceNumber);
              }
            });
            let failures = attempted.filter(x => !successes.includes(x));
            if (successes.length > 0){
              $rootScope.$emit('toast', { message: "Updated section(s) " + successes.join(), type: "SUCCESS" });
              this.updateSectionGroup(CourseStateService._state.sectionGroups.selectedSectionGroup);
            }
            else {
              $rootScope.$emit('toast', { message: "Failed to updated section(s) " + failures.join(), type: "ERROR" });
            }
          });
        }
      },
      createSection: function (section) {
        CourseService.createSection(section).then(function (section) {
          window.ipa_analyze_event('courses', 'section created');

          $rootScope.$emit('toast', { message: "Created section " + section.sequenceNumber, type: "SUCCESS" });

          var sectionGroup = CourseStateService._state.sectionGroups.list[section.sectionGroupId];
          var flaggedSectionGroups = CourseStateService._state.uiState.flaggedSectionGroups;
          if (sectionGroup.sectionIds.length === 0) {
            flaggedSectionGroups -= 1;
          }

          var action = {
            type: ActionTypes.CREATE_SECTION,
            payload: {
              section: section,
              flaggedSectionGroups: flaggedSectionGroups,
              requiresAttention: flaggedSectionGroups > 0
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not create section.", type: "ERROR" });
        });
      },
      deleteSection: function (section) {
        CourseService.deleteSection(section).then(function () {
          window.ipa_analyze_event('courses', 'section deleted');

          $rootScope.$emit('toast', { message: "Deleted section " + section.sequenceNumber, type: "SUCCESS" });

          var sectionGroup = CourseStateService._state.sectionGroups.list[section.sectionGroupId];
          var flaggedSectionGroups = CourseStateService._state.uiState.flaggedSectionGroups;

          if (sectionGroup.sectionIds.length === 1) {
            flaggedSectionGroups += 1;
          }

          var requiresAttention = flaggedSectionGroups > 0;

          var action = {
            type: ActionTypes.REMOVE_SECTION,
            payload: {
              section: section,
              flaggedSectionGroups,
              requiresAttention
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not delete section.", type: "ERROR" });
        });
      },
      updateTableFilter: function (query) {
        var action = {
          type: ActionTypes.UPDATE_TABLE_FILTER,
          payload: {
            query: query
          }
        };
        CourseStateService.reduce(action);
      },
      beginImportMode: function () {
        var action = {
          type: ActionTypes.BEGIN_IMPORT_MODE,
          payload: {}
        };
        CourseStateService.reduce(action);
      },
      endImportMode: function () {
        var action = {
          type: ActionTypes.END_IMPORT_MODE,
          payload: {}
        };
        CourseStateService.reduce(action);
      },
      getCourseCensus: function (course) {
        CourseStateService.reduce({
          type: ActionTypes.BEGIN_FETCH_CENSUS,
          payload: {}
        });

        CourseService.getCourseCensus(course).then(function (census) {
          var action = {
            type: ActionTypes.GET_COURSE_CENSUS,
            payload: {
              course: course,
              census: census
            }
          };
          CourseStateService.reduce(action);
        }, function () {
          $rootScope.$emit('toast', { message: "Could not get course census.", type: "ERROR" });
        });
      },
      toggleSelectCourse: function(courseId) {
        CourseStateService.reduce({
          type: ActionTypes.TOGGLE_SELECT_COURSE_ROW,
          payload: {
            courseId: courseId
          }
        });
      },
      selectAllCourseRows: function(courseIds) {
        CourseStateService.reduce({
          type: ActionTypes.SELECT_ALL_COURSE_ROWS,
          payload: {
            courseIds: courseIds
          }
        });
      },
      deselectAllCourseRows: function() {
        CourseStateService.reduce({
          type: ActionTypes.DESELECT_ALL_COURSE_ROWS,
          payload: {}
        });
      },
      openCourseDeletionModal: function() {
        CourseStateService.reduce({
          type: ActionTypes.OPEN_COURSE_DELETION_MODAL,
          payload: {}
        });
      },
      closeCourseDeletionModal: function() {
        CourseStateService.reduce({
          type: ActionTypes.CLOSE_COURSE_DELETION_MODAL,
          payload: {}
        });
      },
      toggleMoveCourseModal: function(sectionGroup, termCode) {
        CourseStateService.reduce({
          type: ActionTypes.TOGGLE_MOVE_COURSE_MODAL,
          payload: {
            selectedSectionGroup: sectionGroup,
            selectedTermCode: termCode
          }
        });
      },
      _generateAttentionFlags: function(payload) {
        var sectionGroups = [];
        var sections = [];
        var flagsGenerated = 0;

        if (payload == undefined) {
          sectionGroups = Object.values(CourseStateService._state.sectionGroups.list);
          sections = Object.values(CourseStateService._state.sections.list);
        } else {
          sectionGroups = payload.sectionGroups;
          sections = payload.sections;
        }

        for (var i = 0; i < sectionGroups.length; i++) {
          var sectionGroup = sectionGroups[i];

          sectionGroup.sections = sections.filter(function(section) {
            return (section.sectionGroupId === sectionGroup.id);
          });

          if (sectionGroup.sections.length === 0 && sectionGroup.plannedSeats) {
            sectionGroup.requiresAttention = true;
            flagsGenerated += 1;
          }
        }

        return flagsGenerated;
      }
    };
  }
}

CourseActionCreators.$inject = ['CourseStateService', '$route', 'CourseService', '$rootScope', 'Role', 'ActionTypes'];

export default CourseActionCreators;
