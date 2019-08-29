import { _array_sortByProperty } from 'shared/helpers/array';
class TaReaderUtilizationReportActions {
  constructor(
    TaReaderUtilizationReportReducers,
    TaReaderUtilizationReportService,
    $rootScope,
    ActionTypes,
    Roles,
    DwService,
    TermService,
    $route
  ) {
    return {
      getInitialState: function() {
        var workgroupId = $route.current.params.workgroupId;
        var year = $route.current.params.year;

        TaReaderUtilizationReportReducers._state = {};

        TaReaderUtilizationReportReducers.reduce({
          type: ActionTypes.INIT_STATE,
          payload: {}
        });

        this._getBudget(workgroupId, year);
        this._getCourses(workgroupId, year);
        this._getSectionGroupCosts(workgroupId, year);
        this._getSectionGroups(workgroupId, year);
        this._getSections(workgroupId, year);
      },
      _getBudget: function(workgroupId, year) {
        var _self = this;
        TaReaderUtilizationReportService.getBudget(workgroupId, year).then(
          function(budgets) {
            var action = {
              type: ActionTypes.GET_CURRENT_BUDGET,
              payload: { budgets: budgets }
            };
            TaReaderUtilizationReportReducers.reduce(action);

            _self._calculateView();
          }
        ),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };
      },
      _getCourses: function(workgroupId, year) {
        var _self = this;

        TaReaderUtilizationReportService.getCourses(workgroupId, year).then(
          function(rawCourses) {
            var courses = { ids: [], list: {} };

            for (var i = 0; i < rawCourses.length; i++) {
              var course = rawCourses[i];
              courses.ids.push(course.id);
              courses.list[course.id] = course;
            }

            var openCalls = 0;
            var completedCalls = 0;
            // Adding census data to find last offering
            courses.ids.forEach(function(courseId) {
              openCalls += 1;

              var course = courses.list[courseId];
              course.census = [];
              var SNAPSHOT_CODE = 'CURRENT';

              DwService.getDwCensusData(
                course.subjectCode,
                course.courseNumber
              ).then(function(courseCensus) {
                completedCalls += 1;

                courseCensus.forEach(function(census) {
                  if (census.snapshotCode === SNAPSHOT_CODE) {
                    course.census.push(census);
                  }
                });
                if (openCalls == completedCalls) {
                  var action = {
                    type: ActionTypes.CENSUS_FETCH_COMPLETE,
                    payload: { isInitialFetchComplete: true }
                  };
                  TaReaderUtilizationReportReducers.reduce(action);

                  _self._calculateView();
                }


              });
            });

            var action = {
              type: ActionTypes.GET_CURRENT_COURSES,
              payload: { courses: courses }
            };
            TaReaderUtilizationReportReducers.reduce(action);

            _self._calculateView();
          }
        ),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };
      },
      _getSectionGroupCosts: function(workgroupId, year) {
        var _self = this;
        TaReaderUtilizationReportService.getSectionGroupCosts(
          workgroupId,
          year
        ).then(function(rawSectionGroupCosts) {
          var sectionGroupCosts = {
            ids: [],
            list: {}
          };

          for (var i = 0; i < rawSectionGroupCosts.length; i++) {
            var sectionGroupCost = rawSectionGroupCosts[i];
            sectionGroupCosts.ids.push(sectionGroupCost.id);
            sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
          }

          var action = {
            type: ActionTypes.GET_CURRENT_SECTION_GROUP_COSTS,
            payload: { sectionGroupCosts: sectionGroupCosts }
          };

          TaReaderUtilizationReportReducers.reduce(action);

          _self._calculateView();
        }),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };
      },
      _getSectionGroups: function(workgroupId, year) {
        var _self = this;

        TaReaderUtilizationReportService.getSectionGroups(
          workgroupId,
          year
        ).then(function(rawSectionGroups) {
          var sectionGroups = {
            ids: [],
            list: {}
          };

          for (var i = 0; i < rawSectionGroups.length; i++) {
            var sectionGroup = rawSectionGroups[i];
            sectionGroups.ids.push(sectionGroup.id);
            sectionGroups.list[sectionGroup.id] = sectionGroup;
          }

          var action = {
            type: ActionTypes.GET_CURRENT_SECTION_GROUPS,
            payload: { sectionGroups: sectionGroups }
          };

          TaReaderUtilizationReportReducers.reduce(action);

          _self._calculateView();
        }),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };
      },
      _getSections: function(workgroupId, year) {
        var _self = this;

        TaReaderUtilizationReportService.getSections(workgroupId, year).then(
          function(rawSections) {
            var sections = {
              ids: [],
              list: {}
            };

            for (var i = 0; i < rawSections.length; i++) {
              var section = rawSections[i];
              sections.ids.push(section.id);
              sections.list[section.id] = section;
            }

            var action = {
              type: ActionTypes.GET_CURRENT_SECTIONS,
              payload: { sections: sections }
            };

            TaReaderUtilizationReportReducers.reduce(action);

            _self._calculateView();
          }
        ),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };
      },
      _isInitialFetchComplete: function() {
        var budgets = TaReaderUtilizationReportReducers._state.budgets;
        var courses = TaReaderUtilizationReportReducers._state.courses;
        var sectionGroupCosts =
          TaReaderUtilizationReportReducers._state.sectionGroupCosts;
        var sectionGroups =
          TaReaderUtilizationReportReducers._state.sectionGroups;
        var sections = TaReaderUtilizationReportReducers._state.sections;

        if (
          Object.keys(budgets).length > 0 &&
          Object.keys(courses).length > 0 &&
          Object.keys(sectionGroupCosts).length > 0 &&
          Object.keys(sectionGroups).length > 0 &&
          Object.keys(sections).length > 0
        ) {
          // TaReaderUtilizationReportReducers.reduce({
          //   type: ActionTypes.INITIAL_FETCH_COMPLETE,
          //   payload: {
          //     isInitialFetchComplete: true
          //   }
          // });
          return true;
        } else {
          return false;
        }
      },
      _calculateView: function() {
        if (this._isInitialFetchComplete()) {
          var budgets = TaReaderUtilizationReportReducers._state.budgets;
          var courses = TaReaderUtilizationReportReducers._state.courses;
          var sectionGroups =
            TaReaderUtilizationReportReducers._state.sectionGroups;
          var sections = TaReaderUtilizationReportReducers._state.sections;

          var calculatedView = {
            sortedByTerm: {},
            termDescriptions: {},
            appointmentsByTerm: {}
          };

          // Fill sectionGroups with sections
          sections.ids.forEach(function(sectionId) {
            var section = sections.list[sectionId];
            var sectionGroupId = section.sectionGroupId;
            var sectionGroup = sectionGroups.list[sectionGroupId];

            sectionGroup.sections
              ? sectionGroup.sections.push(section)
              : (sectionGroup.sections = [section]);
          });

          // Fill with course info
          sectionGroups.ids.forEach(function(sectionGroupId) {
            var sectionGroup = sectionGroups.list[sectionGroupId];
            var courseId = sectionGroup.courseId;
            var course = courses.list[courseId];

            sectionGroup.subjectCode = course.subjectCode;
            sectionGroup.courseNumber = course.courseNumber;
            sectionGroup.title = course.title;
            sectionGroup.sequencePattern = course.sequencePattern;

            sectionGroup.taCost =
              sectionGroup.teachingAssistantAppointments * budgets.taCost || 0;
            sectionGroup.readerCost =
              sectionGroup.readerAppointments * budgets.readerCost || 0;

            if (course && course.census.length > 0) {
              var lastOfferedEnrollment = 0;
              var lastOfferedTermCode = '';

              for (var i = course.census.length - 1; i > 0; i--) {
                var slotCensus = course.census[i];

                if (
                  slotCensus.currentEnrolledCount !== 0 &&
                  slotCensus.termCode < parseInt(sectionGroup.termCode) &&
                  TermService.termCodeToTerm(slotCensus.termCode) ==
                    TermService.termCodeToTerm(sectionGroup.termCode)
                ) {
                  lastOfferedEnrollment = slotCensus.currentEnrolledCount;
                  lastOfferedTermCode = slotCensus.termCode.toString();
                  break;
                }
              }
              sectionGroup.lastOfferedEnrollment = lastOfferedEnrollment || 0;
              sectionGroup.lastOfferedTermDescription = TermService.getTermName(
                lastOfferedTermCode,
                true
              );
            }

            calculatedView.sortedByTerm[sectionGroup.termCode] = calculatedView
              .sortedByTerm[sectionGroup.termCode]
              ? [
                  ...calculatedView.sortedByTerm[sectionGroup.termCode],
                  sectionGroup
                ]
              : [sectionGroup];

            calculatedView.appointmentsByTerm[
              sectionGroup.termCode
            ] = calculatedView.appointmentsByTerm[sectionGroup.termCode]
              ? [
                  ...calculatedView.appointmentsByTerm[sectionGroup.termCode],
                  sectionGroup.teachingAssistantAppointments
                ]
              : [sectionGroup.teachingAssistantAppointments];
          });

          for (var term in calculatedView.sortedByTerm) {
            calculatedView.termDescriptions[term] = TermService.getTermName(
              term
            );

            calculatedView.sortedByTerm[term] = _array_sortByProperty(
              calculatedView.sortedByTerm[term],
              'courseNumber'
            );
          }

          for (var term in calculatedView.appointmentsByTerm) {
            calculatedView.appointmentsByTerm[
              term
            ] = calculatedView.appointmentsByTerm[term].reduce(function(
              total,
              current
            ) {
              return total + current;
            },
            0);
          }

          TaReaderUtilizationReportReducers.reduce({
            type: ActionTypes.CALCULATE_VIEW,
            payload: {
              calculatedView: calculatedView
            }
          })
        }
      },
      selectReportView: function(tabName) {
        TaReaderUtilizationReportReducers.reduce({
          type: ActionTypes.SELECT_REPORT_VIEW,
          payload: {
            tabName: tabName
          }
        });
      }
    };
  }
}

TaReaderUtilizationReportActions.$inject = [
  'TaReaderUtilizationReportReducers',
  'TaReaderUtilizationReportService',
  '$rootScope',
  'ActionTypes',
  'Roles',
  'DwService',
  'TermService',
  '$route'
];

export default TaReaderUtilizationReportActions;
