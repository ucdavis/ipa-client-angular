import { _array_sortByProperty } from 'shared/helpers/array';
import { sequenceNumberToPattern } from 'shared/helpers/sections';

class WorkloadSummaryActions {
	constructor(WorkloadSummaryReducers, WorkloadSummaryService, $rootScope, ActionTypes, Roles, TermService, DwService, TeachingAssignmentService, InstructorTypeService, $route) {
		this.WorkloadSummaryReducers = WorkloadSummaryReducers;
		this.WorkloadSummaryService = WorkloadSummaryService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;
		this.TermService = TermService;
		this.DwService = DwService;
		this.TeachingAssignmentService = TeachingAssignmentService;
		this.InstructorTypeService = InstructorTypeService;

		return {
			getInitialState: function () {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;

				WorkloadSummaryReducers._state = {};
				WorkloadSummaryReducers.reduce({
					type: ActionTypes.INIT_STATE,
					payload: {}
				});

				this._getCourses(workgroupId, year);
				this._getInstructorTypes(workgroupId, year);
				this._getInstructors(workgroupId, year);
				this._getTeachingAssignments(workgroupId, year);
				this._getSectionGroups(workgroupId, year);
				this._getUsers(workgroupId, year);
				this._getUserRoles(workgroupId, year);
				this._getSections(workgroupId, year);
			},
			_getCourses: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getCourses(workgroupId, year).then(function (rawCourses) {
					let courses = {
						ids: [],
						list: {}
					};

					rawCourses.forEach(function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_COURSES,
						payload: {
							courses: courses
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSections: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getSections(workgroupId, year).then(function (rawSections) {
					let sections = {
						ids: [],
						list: {},
						bySectionGroupId: {}
					};

					rawSections.forEach(function(section) {
						sections.ids.push(section.id);
						sections.list[section.id] = section;
						sections.bySectionGroupId[section.sectionGroupId] = sections.bySectionGroupId[section.sectionGroupId] || [];
						sections.bySectionGroupId[section.sectionGroupId].push(section);
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_SECTIONS,
						payload: {
							sections: sections
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getUsers: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getUsers(workgroupId, year).then(function (rawUsers) {
					let users = {
						ids: [],
						list: {}
					};

					rawUsers.forEach(function(user) {
						user.loginId = user.loginId.toLowerCase();
						users.ids.push(user.id);
						users.list[user.id] = user;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_USERS,
						payload: {
							users: users
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getUserRoles: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getUserRoles(workgroupId, year).then(function (rawUserRoles) {
					let userRoles = {
						ids: [],
						list: {}
					};

					rawUserRoles.forEach(function(userRole) {
						userRoles.ids.push(userRole.id);
						userRoles.list[userRole.id] = userRole;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_USER_ROLES,
						payload: {
							userRoles: userRoles
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructorTypes: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getInstructorTypes(workgroupId, year).then(function (rawInstructorTypes) {
					let instructorTypes = {
						ids: [],
						list: {}
					};

					rawInstructorTypes.forEach(function(instructorType) {
						instructorTypes.ids.push(instructorType.id);
						instructorTypes.list[instructorType.id] = instructorType;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_INSTRUCTOR_TYPES,
						payload: {
							instructorTypes: instructorTypes
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructors: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getInstructors(workgroupId, year).then(function (rawInstructors) {
					let instructors = {
						ids: [],
						list: {}
					};

					rawInstructors.forEach(function(instructor) {
						instructor.loginId = instructor.loginId ? instructor.loginId.toLowerCase() : null;
						instructors.ids.push(instructor.id);
						instructors.list[instructor.id] = instructor;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_INSTRUCTORS,
						payload: {
							instructors: instructors
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getTeachingAssignments: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getTeachingAssignments(workgroupId, year).then(function (rawTeachingAssignments) {
					let teachingAssignments = {
						ids: [],
						list: {}
					};

					rawTeachingAssignments.forEach(function(teachingAssignment) {
						teachingAssignments.ids.push(teachingAssignment.id);
						teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_TEACHING_ASSIGNMENTS,
						payload: {
							teachingAssignments: teachingAssignments
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSectionGroups: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getSectionGroups(workgroupId, year).then(function (rawSectionGroups) {
					let sectionGroups = {
						ids: [],
						list: {}
					};

					rawSectionGroups.forEach(function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_SECTION_GROUPS,
						payload: {
							sectionGroups: sectionGroups
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_performCalculations: function () {
				this._isInitialFetchComplete();

				if (WorkloadSummaryReducers._state.calculations.isInitialFetchComplete && WorkloadSummaryReducers._state.calculations.censusDataFetchBegun == false) {
					this._getEnrollmentData();
					this._getEnrollmentData(true);
				}

				if (WorkloadSummaryReducers._state.calculations.isInitialFetchComplete) {
					this._calculateView();
				}
			},
			_isInitialFetchComplete: function () {
				var sectionGroups = WorkloadSummaryReducers._state.sectionGroups;
				var courses = WorkloadSummaryReducers._state.courses;
				var teachingAssignments = WorkloadSummaryReducers._state.teachingAssignments;
				var instructors = WorkloadSummaryReducers._state.instructors;
				var instructorTypes = WorkloadSummaryReducers._state.instructorTypes;
				var users = WorkloadSummaryReducers._state.users;
				var userRoles = WorkloadSummaryReducers._state.userRoles;
				var sections = WorkloadSummaryReducers._state.sections;

				if (sectionGroups && courses && teachingAssignments && instructors && instructorTypes && users && userRoles && sections) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.INITIAL_FETCH_COMPLETE,
						payload: {
							isInitialFetchComplete: true
						}
					});
				}
			},
			_calculateView: function () {
				var _self = this;

				var sectionGroups = WorkloadSummaryReducers._state.sectionGroups;
				var courses = WorkloadSummaryReducers._state.courses;
				var teachingAssignments = WorkloadSummaryReducers._state.teachingAssignments;
				var instructors = WorkloadSummaryReducers._state.instructors;
				var instructorTypes = WorkloadSummaryReducers._state.instructorTypes;

				var calculatedView = {
					instructorTypeIds: [],
					byInstructorType: {},
					totals: {
						byInstructorTypeId: {},
						units: 0,
						studentCreditHours: 0,
						enrollment: 0,
						previousEnrollment: 0,
						instructorCount: 0,
						assignmentCount: 0
					}
				};

				instructors.ids.forEach(function(instructorId) {
					var instructor = instructors.list[instructorId];
					var instructorTypeId = _self._getInstructorTypeId(instructor);

					if (instructorTypeId == null) { return; }

					if (calculatedView.instructorTypeIds.indexOf(instructorTypeId) == -1) {
						calculatedView.instructorTypeIds.push(instructorTypeId);
						calculatedView.byInstructorType[instructorTypeId] = [];
					}

					instructor.assignments = [];
					instructor.totals = {
						units: 0,
						studentCreditHours: 0,
						enrollment: 0,
						seats: 0,
						previousEnrollment: 0,
						assignmentCount: 0
					};

					calculatedView.totals.byInstructorTypeId[instructorTypeId] = calculatedView.totals.byInstructorTypeId[instructorTypeId] || {
						units: 0,
						studentCreditHours: 0,
						enrollment: 0,
						previousEnrollment: 0,
						assignmentCount: 0
					};

					var instructorAssignments = _self._getInstructorAssignments(instructorId, teachingAssignments);

					instructorAssignments.forEach(function(teachingAssignment) {
						var assignment = {};
						var termCode = teachingAssignment.termCode;

						var sectionGroup = teachingAssignment.sectionGroupId > 0 ? sectionGroups.list[teachingAssignment.sectionGroupId] : null;
						var course = sectionGroup ? courses.list[sectionGroup.courseId] : null;

						assignment.term = TermService.getTermName(termCode);
						assignment.termCode = termCode;

						assignment.description = TeachingAssignmentService.getDescription(teachingAssignment, course);

						if (teachingAssignment.sectionGroupId > 0) {
							assignment.sequencePattern = course.sequencePattern;
							assignment.enrollment = _self._getEnrollment(sectionGroup);

							assignment.actualEnrollment = sectionGroup.actualEnrollment;
							assignment.maxEnrollment = sectionGroup.maxEnrollment;

							var seats = 0;

							var sections = WorkloadSummaryReducers._state.sections.bySectionGroupId[sectionGroup.id];

							if (sections) {
								sections.forEach(function(section) {
									seats += section.seats;
								});
							}

							assignment.seats = seats;
							assignment.previousEnrollment = sectionGroup.previousEnrollment;
							assignment.enrollmentPercentage = assignment.maxEnrollment && assignment.actualEnrollment ? parseInt((assignment.actualEnrollment / assignment.maxEnrollment) * 100) : "0";
							assignment.units = _self._getUnits(course);
							assignment.studentCreditHours = assignment.seats * assignment.units;

							calculatedView.totals.assignmentCount += 1;
							calculatedView.totals.enrollment += assignment.enrollment;
							calculatedView.totals.previousEnrollment += assignment.previousEnrollment;
							calculatedView.totals.units += assignment.units;
							calculatedView.totals.studentCreditHours += assignment.studentCreditHours;

							calculatedView.totals.byInstructorTypeId[instructorTypeId].assignmentCount += 1;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].enrollment += assignment.enrollment;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].previousEnrollment += assignment.previousEnrollment;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].units += assignment.units;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].studentCreditHours += assignment.studentCreditHours;
						}

						instructor.assignments.push(assignment);

						instructor.totals.units += assignment.units || 0;
						instructor.totals.studentCreditHours += assignment.studentCreditHours || 0;
						instructor.totals.enrollment += assignment.enrollment || 0;
						instructor.totals.seats += assignment.seats || 0;
						instructor.totals.previousEnrollment += assignment.previousEnrollment || 0;
						instructor.totals.assignmentCount += 1;
					});

					instructor.assignments = _array_sortByProperty(instructor.assignments, ["termCode", "description"]);

					calculatedView.byInstructorType[instructorTypeId].push(instructor);
					calculatedView.totals.instructorCount += 1;
				});

				calculatedView.instructorTypeIds = InstructorTypeService.orderInstructorTypeIdsAlphabetically(calculatedView.instructorTypeIds, instructorTypes);

				WorkloadSummaryReducers.reduce({
					type: ActionTypes.CALCULATE_VIEW,
					payload: {
						calculatedView: calculatedView
					}
				});
			},
			_getUnits: function (course) {
				if (course.unitsLow > 0) {
					return course.unitsLow;
				} else if (course.unitsHigh > 0) {
					return course.unitsHigh;
				}

				return 0;
			},
			// Return actual (census), seats, or plannedSeats for the enrollment number, depending on what is available
			_getEnrollment: function (sectionGroup) {
				if (sectionGroup.actualEnrollment > 0) {
					return sectionGroup.actualEnrollment ;
				} else if (sectionGroup.maxEnrollment > 0) {
					return sectionGroup.maxEnrollment;
				} else {
					return sectionGroup.plannedSeats;
				}
			},
			_getInstructorTypeId: function (instructor) {
				var teachingAssignments = WorkloadSummaryReducers._state.teachingAssignments;
				var users = WorkloadSummaryReducers._state.users;
				var userRoles = WorkloadSummaryReducers._state.userRoles;

				var user = this._getUserByLoginId(instructor.loginId, users);

				if (user) {
					// Attempt to find via userRole
					for (var i = 0; i < userRoles.ids.length; i++) {
						var userRole = userRoles.list[userRoles.ids[i]];

						if (userRole.roleId == Roles.instructor && userRole.userId == user.id) {
							return userRole.instructorTypeId;
						}
					}
				}

				// Attempt to find via teachingAssignment
				for (var i = 0; i < teachingAssignments.ids.length; i++) {
					var teachingAssignment = teachingAssignments.list[teachingAssignments.ids[i]];

					if (teachingAssignment.instructorId == instructor.id) {
						return teachingAssignment.instructorTypeId;
					}
				}

				return null;
			},
			_getUserByLoginId: function (loginId, users) {
				for (var i = 0; i < users.ids.length; i++) {
					var user = users.list[users.ids[i]];

					if (user.loginId == loginId) {
						return user;
					}
				}

				return null;
			},
			_getInstructorAssignments: function (instructorId, teachingAssignments) {
				var instructorAssignments = [];

				teachingAssignments.ids.forEach(function(teachingAssignmentId) {
					var teachingAssignment = teachingAssignments.list[teachingAssignmentId];

					if (teachingAssignment.instructorId == instructorId) {
						instructorAssignments.push(teachingAssignment);
					}
				});

				return instructorAssignments;
			},
			_getEnrollmentData: function(isPreviousYear) {
				var _self = this;

				WorkloadSummaryReducers.reduce({
					type: ActionTypes.BEGIN_CENSUS_DATA_FETCH,
					payload: {
						censusDataFetchBegun: true
					}
				});

				var SNAPSHOT_CODE = "CURRENT";
				var termCodes = this._getScheduleTermCodes(isPreviousYear);
				var subjectCodes = this._getScheduleSubjectCodes();
				var openCalls = WorkloadSummaryReducers._state.calculations.dwCallsOpened;
				var completedCalls = WorkloadSummaryReducers._state.calculations.dwCallsCompleted;

				termCodes.forEach(function(termCode) {
					subjectCodes.forEach(function(subjectCode) {
						openCalls += 1;

						DwService.getDwCensusData(subjectCode, null, termCode).then(function(censusSections) {
							censusSections.forEach(function(censusSection) {
								if (censusSection.snapshotCode == SNAPSHOT_CODE) {
									var censusSectionGroupKey = censusSection.subjectCode + censusSection.courseNumber + sequenceNumberToPattern(censusSection.sequenceNumber) + TermService.termCodeToTerm(censusSection.termCode);

									WorkloadSummaryReducers._state.sectionGroups.ids.forEach(function(sectionGroupId) {
										var sectionGroup = WorkloadSummaryReducers._state.sectionGroups.list[sectionGroupId];
										var course = WorkloadSummaryReducers._state.courses.list[sectionGroup.courseId];
										var sectionGroupUniqueKey = course.subjectCode + course.courseNumber + course.sequencePattern + TermService.termCodeToTerm(sectionGroup.termCode);

										sectionGroup.maxEnrollment = sectionGroup.maxEnrollment || 0;
										sectionGroup.actualEnrollment = sectionGroup.actualEnrollment || 0;
										sectionGroup.previousEnrollment = sectionGroup.previousEnrollment || 0;

										if (sectionGroupUniqueKey == censusSectionGroupKey) {
											if (isPreviousYear) {
												sectionGroup.previousEnrollment += censusSection.currentEnrolledCount;
											} else {
												sectionGroup.actualEnrollment += censusSection.currentEnrolledCount;
												sectionGroup.maxEnrollment = 0;
												_self._getSectionsForSectionGroup(sectionGroup).forEach(function(section) {
													sectionGroup.maxEnrollment += section.seats;
												});
											}
										}
									});
								}
							});

							completedCalls += 1;

							if (openCalls == completedCalls) {
								_self._performCalculations();
							}
						}, function () {
							$rootScope.$emit('toast', { message: "Could not retrieve enrollment data.", type: "ERROR" });
						});
					});
				});
			},
			_getScheduleSubjectCodes: function() {
				var subjectCodes = [];
				var sectionGroups = WorkloadSummaryReducers._state.sectionGroups;
				var courses = WorkloadSummaryReducers._state.courses;

				sectionGroups.ids.forEach(function(sectionGroupId) {
					var sectionGroup = sectionGroups.list[sectionGroupId];
					var subjectCode = courses.list[sectionGroup.courseId].subjectCode;

					if (subjectCodes.indexOf(subjectCode) == -1) {
						subjectCodes.push(subjectCode);
					}
				});

				return subjectCodes;
			},
			_getScheduleTermCodes: function(isPreviousYear) {
				var termCodes = [];

				var sectionGroups = WorkloadSummaryReducers._state.sectionGroups;

				sectionGroups.ids.forEach(function(sectionGroupId) {
					var termCode = sectionGroups.list[sectionGroupId].termCode;

					// Get the previous year's termCode instead
					if (isPreviousYear) {
						var year = parseInt(termCode.substring(0,4)) - 1;
						var term = termCode.substring(4,6);
						var previousYearTermCode = year + term;
						if (termCodes.indexOf(previousYearTermCode) == -1) {
							termCodes.push(previousYearTermCode);
						}
					} else {
						if (termCodes.indexOf(termCode) == -1) {
							termCodes.push(termCode);
						}
					}
				});

				return termCodes;
			},
			_getSectionsForSectionGroup: function (sectionGroup) {
				var sections = WorkloadSummaryReducers._state.sections;

				var matchingSections = [];
				sections.ids.forEach(function(sectionId) {
					var section = sections.list[sectionId];
					if (section.sectionGroupId == sectionGroup.id) {
						matchingSections.push(section);
					}
				});

				return matchingSections;
			}
		};
	}
}

WorkloadSummaryActions.$inject = ['WorkloadSummaryReducers', 'WorkloadSummaryService', '$rootScope', 'ActionTypes', 'Roles', 'TermService', 'DwService', 'TeachingAssignmentService', 'InstructorTypeService', '$route'];

export default WorkloadSummaryActions;
