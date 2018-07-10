class DeansOfficeReportActions {
	constructor(DeansOfficeReportReducers, DeansOfficeReportService, $rootScope, ActionTypes, Roles, $route) {
		return {
			getInitialState: function () {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;

				var _self = this;
				DeansOfficeReportReducers._state = {};
				DeansOfficeReportReducers.reduce({
					type: ActionTypes.INIT_STATE,
					payload: {}
				});

				this._getBudget(workgroupId, year);
				this._getCourses(workgroupId, year);
				this._getSectionGroups(workgroupId, year);
				this._getSections(workgroupId, year);

				this._getInstructorTypes(workgroupId, year);
				this._getTeachingAssignments(workgroupId, year);
			},
			_getBudget: function (workgroupId, year) {
				var _self = this;

				DeansOfficeReportService.getBudget(workgroupId, year).then(function (budget) {
					DeansOfficeReportReducers.reduce({
						type: ActionTypes.GET_BUDGET,
						payload: {
							budget: budget
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getCourses: function (workgroupId, year) {
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
						type: ActionTypes.GET_COURSES,
						payload: {
							courses: courses
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSections: function (workgroupId, year) {
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
						type: ActionTypes.GET_SECTIONS,
						payload: {
							sections: sections
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructorTypes: function (workgroupId, year) {
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
						type: ActionTypes.GET_INSTRUCTOR_TYPES,
						payload: {
							instructorTypes: instructorTypes
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getTeachingAssignments: function (workgroupId, year) {
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
						type: ActionTypes.GET_TEACHING_ASSIGNMENTS,
						payload: {
							teachingAssignments: teachingAssignments
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSectionGroups: function (workgroupId, year) {
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
						type: ActionTypes.GET_SECTION_GROUPS,
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
				this._isInitialFetchComplete();

				if (DeansOfficeReportReducers._state.calculations.isInitialFetchComplete) {
					debugger;
					this._calculateView();
				}
			},
			_isInitialFetchComplete: function () {
				var budget = DeansOfficeReportReducers._state.budget;
				var sectionGroups = DeansOfficeReportReducers._state.sectionGroups;
				var courses = DeansOfficeReportReducers._state.courses;
				var teachingAssignments = DeansOfficeReportReducers._state.teachingAssignments;
				var instructorTypes = DeansOfficeReportReducers._state.instructorTypes;
				var sections = DeansOfficeReportReducers._state.sections;

				if (budget && sectionGroups && courses && teachingAssignments && instructorTypes && sections) {
					DeansOfficeReportReducers.reduce({
						type: ActionTypes.INITIAL_FETCH_COMPLETE,
						payload: {
							isInitialFetchComplete: true
						}
					});
				}
			},
			_calculateView: function () {
				return {};

				// var _self = this;

				// var sectionGroups = DeansOfficeReportReducers._state.sectionGroups;
				// var courses = DeansOfficeReportReducers._state.courses;
				// var teachingAssignments = DeansOfficeReportReducers._state.teachingAssignments;
				// var instructors = DeansOfficeReportReducers._state.instructors;
				// var instructorTypes = DeansOfficeReportReducers._state.instructorTypes;
				// var users = DeansOfficeReportReducers._state.users;
				// var userRoles = DeansOfficeReportReducers._state.userRoles;

				// var calculatedView = {
				// 	instructorTypeIds: [],
				// 	byInstructorType: {},
				// 	totals: {
				// 		byInstructorTypeId: {},
				// 		units: 0,
				// 		studentCreditHours: 0,
				// 		enrollment: 0,
				// 		previousEnrollment: 0,
				// 		instructorCount: 0,
				// 		assignmentCount: 0
				// 	}
				// };

				// DeansOfficeReportReducers.reduce({
				// 	type: ActionTypes.CALCULATE_VIEW,
				// 	payload: {
				// 		calculatedView: calculatedView
				// 	}
				// });
			}
		};
	}
}

DeansOfficeReportActions.$inject = ['DeansOfficeReportReducers', 'DeansOfficeReportService', '$rootScope', 'ActionTypes', 'Roles', '$route'];

export default DeansOfficeReportActions;
