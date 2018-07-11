class DeansOfficeReportActions {
	constructor(DeansOfficeReportReducers, DeansOfficeReportService, DeansOfficeReportCalculations, $rootScope, ActionTypes, Roles, $route) {
		return {
			getInitialState: function () {
				var _self = this;
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var previousYear = String(parseInt($route.current.params.year) - 1);

				DeansOfficeReportReducers._state = {};

				DeansOfficeReportReducers.reduce({
					type: ActionTypes.INIT_STATE,
					payload: {}
				});

				this._getBudget(workgroupId, year, ActionTypes.GET_CURRENT_BUDGET);
				this._getCourses(workgroupId, year, ActionTypes.GET_CURRENT_COURSES);
				this._getSectionGroups(workgroupId, year, ActionTypes.GET_CURRENT_SECTION_GROUPS);
				this._getSections(workgroupId, year, ActionTypes.GET_CURRENT_SECTIONS);
				this._getInstructorTypes(workgroupId, year, ActionTypes.GET_CURRENT_INSTRUCTOR_TYPES);
				this._getTeachingAssignments(workgroupId, year, ActionTypes.GET_CURRENT_TEACHING_ASSIGNMENTS);

				this._getBudget(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_BUDGET);
				this._getCourses(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_COURSES);
				this._getSectionGroups(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_SECTION_GROUPS);
				this._getSections(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_SECTIONS);
				this._getInstructorTypes(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_INSTRUCTOR_TYPES);
				this._getTeachingAssignments(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_TEACHING_ASSIGNMENTS);
			},
			_getBudget: function (workgroupId, year, action) {
				var _self = this;

				DeansOfficeReportService.getBudget(workgroupId, year).then(function (budget) {
					DeansOfficeReportReducers.reduce({
						type: action,
						payload: {
							budget: budget
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getCourses: function (workgroupId, year, action) {
				var _self = this;

				DeansOfficeReportService.getCourses(workgroupId, year).then(function (rawCourses) {
					let courses = {
						ids: [],
						list: {}
					};

					rawCourses.forEach(function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});

					DeansOfficeReportReducers.reduce({
						type: action,
						payload: {
							courses: courses
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSections: function (workgroupId, year, action) {
				var _self = this;

				DeansOfficeReportService.getSections(workgroupId, year).then(function (rawSections) {
					let sections = {
						ids: [],
						list: {}
					};

					rawSections.forEach(function(section) {
						sections.ids.push(section.id);
						sections.list[section.id] = section;
					});

					DeansOfficeReportReducers.reduce({
						type: action,
						payload: {
							sections: sections
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructorTypes: function (workgroupId, year, action) {
				var _self = this;

				DeansOfficeReportService.getInstructorTypes(workgroupId, year).then(function (rawInstructorTypes) {
					let instructorTypes = {
						ids: [],
						list: {}
					};

					rawInstructorTypes.forEach(function(instructorType) {
						instructorTypes.ids.push(instructorType.id);
						instructorTypes.list[instructorType.id] = instructorType;
					});

					DeansOfficeReportReducers.reduce({
						type: action,
						payload: {
							instructorTypes: instructorTypes
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getTeachingAssignments: function (workgroupId, year, action) {
				var _self = this;

				DeansOfficeReportService.getTeachingAssignments(workgroupId, year).then(function (rawTeachingAssignments) {
					let teachingAssignments = {
						ids: [],
						list: {}
					};

					rawTeachingAssignments.forEach(function(teachingAssignment) {
						teachingAssignments.ids.push(teachingAssignment.id);
						teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
					});

					DeansOfficeReportReducers.reduce({
						type: action,
						payload: {
							teachingAssignments: teachingAssignments
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSectionGroups: function (workgroupId, year, action) {
				var _self = this;

				DeansOfficeReportService.getSectionGroups(workgroupId, year).then(function (rawSectionGroups) {
					let sectionGroups = {
						ids: [],
						list: {}
					};

					rawSectionGroups.forEach(function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});

					DeansOfficeReportReducers.reduce({
						type: action,
						payload: {
							sectionGroups: sectionGroups
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_performCalculations: function () {
				this._isCurrentYearFetchComplete();
				this._isPreviousYearFetchComplete();

				if (DeansOfficeReportReducers._state.calculations.isCurrentYearFetchComplete && DeansOfficeReportReducers._state.calculations.isPreviousYearFetchComplete) {
					DeansOfficeReportCalculations.calculateView();
				}
			},
			_isCurrentYearFetchComplete: function () {
				var budget = DeansOfficeReportReducers._state.budget.current;
				var sectionGroups = DeansOfficeReportReducers._state.sectionGroups.current;
				var courses = DeansOfficeReportReducers._state.courses.current;
				var teachingAssignments = DeansOfficeReportReducers._state.teachingAssignments.current;
				var instructorTypes = DeansOfficeReportReducers._state.instructorTypes.current;
				var sections = DeansOfficeReportReducers._state.sections.current;

				if (budget && sectionGroups && courses && teachingAssignments && instructorTypes && sections) {
					DeansOfficeReportReducers.reduce({
						type: ActionTypes.CURRENT_YEAR_FETCH_COMPLETE,
						payload: {
							isCurrentYearFetchComplete: true
						}
					});
				}
			},
			_isPreviousYearFetchComplete: function () {
				var budget = DeansOfficeReportReducers._state.budget.previous;
				var sectionGroups = DeansOfficeReportReducers._state.sectionGroups.previous;
				var courses = DeansOfficeReportReducers._state.courses.previous;
				var teachingAssignments = DeansOfficeReportReducers._state.teachingAssignments.previous;
				var instructorTypes = DeansOfficeReportReducers._state.instructorTypes.previous;
				var sections = DeansOfficeReportReducers._state.sections.previous;

				if (budget && sectionGroups && courses && teachingAssignments && instructorTypes && sections) {
					DeansOfficeReportReducers.reduce({
						type: ActionTypes.PREVIOUS_YEAR_FETCH_COMPLETE,
						payload: {
							isPreviousYearFetchComplete: true
						}
					});
				}
			}
		};
	}
}

DeansOfficeReportActions.$inject = ['DeansOfficeReportReducers', 'DeansOfficeReportService', 'DeansOfficeReportCalculations', '$rootScope', 'ActionTypes', 'Roles', '$route'];

export default DeansOfficeReportActions;
