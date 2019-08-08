class TaReaderUtilizationReportActions {
  constructor(
    TaReaderUtilizationReportReducers,
    TaReaderUtilizationReportService,
    $rootScope,
    ActionTypes,
    Roles,
    DwService,
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

        TaReaderUtilizationReportService.getBudget(workgroupId, year).then(
          function(payload) {
            var action = {
              type: ActionTypes.GET_CURRENT_BUDGET,
              payload: payload
            };
            TaReaderUtilizationReportReducers.reduce(action);
          }
        ),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };

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
                courseCensus.forEach(function(census) {
                  if (census.snapshotCode === SNAPSHOT_CODE) {
                    course.census.push(census);
                  }
                });

                completedCalls += 1;

                if (openCalls == completedCalls) {
                  var action = {
                    type: ActionTypes.CENSUS_FETCH_COMPLETE,
                    payload: { isInitialFetchComplete: true }
                  };
                  TaReaderUtilizationReportReducers.reduce(action);
                }
              });
            });

            var action = {
              type: ActionTypes.GET_CURRENT_COURSES,
              payload: courses
            };
            TaReaderUtilizationReportReducers.reduce(action);
          }
        ),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };

        TaReaderUtilizationReportService.getSectionGroupCosts(
          workgroupId,
          year
        ).then(function(payload) {
          var action = {
            type: ActionTypes.GET_CURRENT_SECTION_GROUP_COSTS,
            payload: payload
          };
          TaReaderUtilizationReportReducers.reduce(action);
        }),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };

        TaReaderUtilizationReportService.getSectionGroups(
          workgroupId,
          year
        ).then(function(payload) {
          var action = {
            type: ActionTypes.GET_CURRENT_SECTION_GROUPS,
            payload: payload
          };
          TaReaderUtilizationReportReducers.reduce(action);
        }),
          function() {
            $rootScope.$emit('toast', {
              message: 'Could not load initial state.',
              type: 'ERROR'
            });
          };
        TaReaderUtilizationReportService.getSections(workgroupId, year).then(
          function(payload) {
            var action = {
              type: ActionTypes.GET_CURRENT_SECTIONS,
              payload: payload
            };
            TaReaderUtilizationReportReducers.reduce(action);
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
          TaReaderUtilizationReportReducers.reduce({
            type: ActionTypes.INITIAL_FETCH_COMPLETE,
            payload: {
              isInitialFetchComplete: true
            }
          });
        }
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
  '$route'
];

export default TaReaderUtilizationReportActions;
