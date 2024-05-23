import { _array_sortByProperty } from 'shared/helpers/array';
import { sequenceNumberToPattern } from 'shared/helpers/sections';

class WorkloadSummaryActions {
	constructor(WorkloadSummaryReducers, WorkloadSummaryService, $rootScope, ActionTypes, Roles, TermService, DwService, TeachingAssignmentService, InstructorTypeService, CourseService, $route) {
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
				this._getScheduleInstructorNotes(workgroupId, year);
				this._getSectionGroups(workgroupId, year);
				this._getUsers(workgroupId, year);
				this._getUserRoles(workgroupId, year);
				this._getSections(workgroupId, year);
				this._getWorkloadSnapshots(workgroupId, year);
				this._getUserWorkgroupSnapshots(year);
			},
			download: function(snapshotId) {
				if (snapshotId) {
					WorkloadSummaryService.downloadWorkloadSnapshot(snapshotId);
				} else {
					const workgroupId = $route.current.params.workgroupId;
					const year = $route.current.params.year;
					WorkloadSummaryService.downloadWorkloadSummary(workgroupId, year);
				}
			},
			downloadMultiple: function(departmentSnapshots, workgroupId, year) {
				WorkloadSummaryReducers.reduce({
					type: ActionTypes.DOWNLOAD_MULTIPLE
				});

				WorkloadSummaryService.downloadMultipleSnapshots(departmentSnapshots, workgroupId, year);
			},
			selectSnapshot: function(snapshot) {
				let selectedSnapshot = null;

				let byInstructorType = {};
				let categoryTotals = {
					"Assigned": {
						instructorCount: 0,
						enrollment: 0,
						assignmentCount: 0,
						lastOfferedEnrollment: 0,
						previousEnrollment: 0,
						seats: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						units: 0
					},
					"Unassigned": {
						instructorCount: 0,
						enrollment: 0,
						assignmentCount: 0,
						lastOfferedEnrollment: 0,
						previousEnrollment: 0,
						seats: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						units: 0
					},
					"TBD Instructors": {
						instructorCount: 0,
						enrollment: 0,
						assignmentCount: 0,
						lastOfferedEnrollment: 0,
						previousEnrollment: 0,
						seats: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						units: 0
					}
				};
				let combinedTotals = {
					instructorCount: 0,
					enrollment: 0,
					assignmentCount: 0,
					lastOfferedEnrollment: 0,
					previousEnrollment: 0,
					seats: 0,
					studentMaxCreditHours: 0,
					units: 0
				};
				let totals = {};

				if (snapshot) {
					snapshot.workloadAssignments.forEach(assignment => {
						if (byInstructorType[assignment.instructorType] === undefined) {
							byInstructorType[assignment.instructorType] = {};
							totals[assignment.instructorType] = {
								enrollment: 0,
								assignmentCount: 0,
								lastOfferedEnrollment: 0,
								previousEnrollment: 0,
								seats: 0,
								studentCreditHours: 0,
								studentMaxCreditHours: 0,
								units: 0
							};
						}

						if (byInstructorType[assignment.instructorType][assignment.name] === undefined) {
							byInstructorType[assignment.instructorType][assignment.name] = {
								name: assignment.name,
								instructorType: assignment.instructorType,
								assignments: [],
								totals: {
									actualEnrollment: 0,
									assignmentCount: 0,
									lastOfferedEnrollment: 0,
									previousEnrollment: 0,
									seats: 0,
									studentCreditHours: 0,
									studentMaxCreditHours: 0,
									units: 0
								}
							};
						}

						if (assignment.termCode !== null) {
							const unitsValue = Number(assignment.units) ? Number(assignment.units) : 0;
							assignment.term = TermService.getTermName(assignment.termCode);

							if (assignment.lastOfferedCensus !== null) {
								assignment.lastOfferedEnrollment = parseInt(assignment.lastOfferedCensus.split(' ')[0]);
								assignment.lastOfferedTermDescription = assignment.lastOfferedCensus.slice(-7);
							}

							assignment.studentMaxCreditHours = unitsValue * Number(assignment.plannedSeats);
							byInstructorType[assignment.instructorType][assignment.name].assignments.push(assignment);

							byInstructorType[assignment.instructorType][assignment.name].totals.actualEnrollment += Number(assignment.census);
							byInstructorType[assignment.instructorType][assignment.name].totals.assignmentCount += 1;

							byInstructorType[assignment.instructorType][assignment.name].totals.lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
							byInstructorType[assignment.instructorType][assignment.name].totals.previousEnrollment += Number(assignment.previousYearCensus);
							byInstructorType[assignment.instructorType][assignment.name].totals.seats += Number(assignment.plannedSeats);
							byInstructorType[assignment.instructorType][assignment.name].totals.studentCreditHours += assignment.studentCreditHours;
							byInstructorType[assignment.instructorType][assignment.name].totals.studentMaxCreditHours += assignment.studentMaxCreditHours;
							byInstructorType[assignment.instructorType][assignment.name].totals.units += unitsValue;

							if (assignment.instructorType === "Unassigned") {
								categoryTotals["Unassigned"].enrollment += Number(assignment.census);
								categoryTotals["Unassigned"].assignmentCount += 1;
								categoryTotals["Unassigned"].lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
								categoryTotals["Unassigned"].previousEnrollment += Number(assignment.previousYearCensus);
								categoryTotals["Unassigned"].seats += Number(assignment.plannedSeats);
								categoryTotals["Unassigned"].studentMaxCreditHours += assignment.studentMaxCreditHours;
								categoryTotals["Unassigned"].units += unitsValue;
							} else if (assignment.name === "TBD") {
								categoryTotals["TBD Instructors"].instructorCount += 1;
								categoryTotals["TBD Instructors"].enrollment += Number(assignment.census);
								categoryTotals["TBD Instructors"].assignmentCount += 1;
								categoryTotals["TBD Instructors"].lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
								categoryTotals["TBD Instructors"].previousEnrollment += Number(assignment.previousYearCensus);
								categoryTotals["TBD Instructors"].seats += Number(assignment.plannedSeats);
								categoryTotals["TBD Instructors"].studentMaxCreditHours += assignment.studentMaxCreditHours;
								categoryTotals["TBD Instructors"].units += unitsValue;

								totals[assignment.instructorType].enrollment += Number(assignment.census);
								totals[assignment.instructorType].assignmentCount += 1;
								totals[assignment.instructorType].lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
								totals[assignment.instructorType].previousEnrollment += Number(assignment.previousYearCensus);
								totals[assignment.instructorType].seats += Number(assignment.plannedSeats);
								totals[assignment.instructorType].studentMaxCreditHours += assignment.studentMaxCreditHours;
								totals[assignment.instructorType].units += unitsValue;
							} else if (assignment.offering !== null) {
								categoryTotals["Assigned"].enrollment += Number(assignment.census);
								categoryTotals["Assigned"].assignmentCount += 1;
								categoryTotals["Assigned"].lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
								categoryTotals["Assigned"].previousEnrollment += Number(assignment.previousYearCensus);
								categoryTotals["Assigned"].seats += Number(assignment.plannedSeats);
								categoryTotals["Assigned"].studentCreditHours += assignment.studentCreditHours;
								categoryTotals["Assigned"].studentMaxCreditHours += assignment.studentMaxCreditHours;
								categoryTotals["Assigned"].units += unitsValue;

								totals[assignment.instructorType].enrollment += Number(assignment.census);
								totals[assignment.instructorType].assignmentCount += 1;
								totals[assignment.instructorType].lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
								totals[assignment.instructorType].previousEnrollment += Number(assignment.previousYearCensus);
								totals[assignment.instructorType].seats += Number(assignment.plannedSeats);
								totals[assignment.instructorType].studentCreditHours += assignment.studentCreditHours;
								totals[assignment.instructorType].studentMaxCreditHours += assignment.studentMaxCreditHours;
								totals[assignment.instructorType].units += unitsValue;
							}
						}
					});

					const types = Object.keys(byInstructorType).filter(type => type !== "Unassigned");
					types.forEach(t => {
						categoryTotals["Assigned"].instructorCount += Object.keys(byInstructorType[t]).length;
					});

					for (const category in categoryTotals) {
						const subtotal = categoryTotals[category];

						combinedTotals.instructorCount += subtotal.instructorCount;
						combinedTotals.enrollment += subtotal.enrollment;
						combinedTotals.assignmentCount += subtotal.assignmentCount;
						combinedTotals.lastOfferedEnrollment += subtotal.lastOfferedEnrollment;
						combinedTotals.previousEnrollment += subtotal.previousEnrollment;
						combinedTotals.seats += subtotal.seats;
						combinedTotals.studentMaxCreditHours += subtotal.studentMaxCreditHours;
						combinedTotals.units += subtotal.units;
					}

					// flatten one level for easier rendering
					const instructorTypes = Object.keys(byInstructorType);
					instructorTypes.forEach(instructorType => {
						byInstructorType[instructorType] = Object.values(byInstructorType[instructorType]);

						// sort assignments for display
						byInstructorType[instructorType].forEach(instructor => {
							instructor.assignments = _array_sortByProperty(instructor.assignments, ["termCode", "description"]);
						});
					});

					const DISPLAY_ORDER = [6, 9, 8, 5, 1, 2, 4, 10, 3, 7];
					const instructorTypeLookup = Object.values(WorkloadSummaryReducers._state.instructorTypes.list);
					const instructorTypeOrder = DISPLAY_ORDER.map(id => instructorTypeLookup.find(instructorType => instructorType.id === id).description);
					const displayOrder = instructorTypeOrder.filter(type => instructorTypes.includes(type));

					const byInstructorTypeList = displayOrder.map(type => {
						const instructors = byInstructorType[type];
						const namedInstructors = instructors.filter(i => i.name !== "TBD").sort((a, b) => a.name.localeCompare(b.name));
						const unnamedInstructors = instructors.filter(i => i.name === "TBD");

						return namedInstructors.concat(unnamedInstructors);
					});

					selectedSnapshot = {
						id: snapshot.id,
						name: snapshot.name,
						byInstructorType,
						byInstructorTypeList,
						categoryTotals,
						combinedTotals,
						totals,
						unassignedCourses: byInstructorType['Unassigned'] !== undefined ? _array_sortByProperty(byInstructorType['Unassigned'][0].assignments, ["termCode", "description"]) : null
					};
				}

				WorkloadSummaryReducers.reduce({
					type: ActionTypes.SELECT_WORKLOAD_SNAPSHOT,
					payload: selectedSnapshot
				});
			},
			downloadHistorical: function() {
				WorkloadSummaryService.downloadHistorical($route.current.params.workgroupId, $route.current.params.year);
			},
			toggleDownloadModal: function() {
				WorkloadSummaryReducers.reduce({
					type: ActionTypes.TOGGLE_DOWNLOAD_MODAL
				});
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

					// Adding census data to find last offering
					courses.ids.forEach(function (courseId) {
						var course = courses.list[courseId];
						course.census = [];

						DwService.getDwCensusData(course.subjectCode, course.courseNumber).then(function (courseCensus) {
							course.census = courseCensus;
						});
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
			_getScheduleInstructorNotes: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getScheduleInstructorNotes(workgroupId, year).then(function (rawInstructorNotes) {
					let scheduleInstructorNotes = {
						ids: [],
						list: {}
					};

					rawInstructorNotes.forEach(function(instructorNote) {
						scheduleInstructorNotes.ids.push(instructorNote.id);
						scheduleInstructorNotes.list[instructorNote.id] = instructorNote;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_SCHEDULE_INSTRUCTOR_NOTES,
						payload: {
							scheduleInstructorNotes,
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
			_getWorkloadSnapshots: function (workgroupId, year) {
				WorkloadSummaryService.getWorkloadSnapshots(workgroupId, year).then(function (workloadSnapshots) {
					// add description field for ipaDropdown
					const snapshots = workloadSnapshots.map(sn => ({description: sn.name, ...sn}));
					const payload = {
						list: snapshots,
						selected: null
					};

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_WORKLOAD_SNAPSHOTS,
						payload
					});
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getUserWorkgroupSnapshots: function (year) {
				WorkloadSummaryService.getUserWorkgroupSnapshots(year).then(function (userWorkgroupSnapshots) {

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_USER_WORKGROUP_SNAPSHOTS,
						payload: userWorkgroupSnapshots
					});
				}), function () {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				};
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
				var scheduleInstructorNotes = WorkloadSummaryReducers._state.scheduleInstructorNotes;
				var sections = WorkloadSummaryReducers._state.sections;

				if (sectionGroups && courses && teachingAssignments && instructors && instructorTypes && users && userRoles && scheduleInstructorNotes && sections) {
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
						displayName: "Assigned",
						byInstructorTypeId: {},
						units: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						seats: 0,
						enrollment: 0,
						previousEnrollment: 0,
						lastOfferedEnrollment: 0,
						instructorCount: 0,
						assignmentCount: 0
					},
					unassignedTotals: {
						displayName: "Unassigned",
						assignmentCount: 0,
						seats: 0,
						enrollment: 0,
						previousEnrollment: 0,
						units: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						instructorCount: 0
					},
					genericInstructorTotals: {
						displayName: "TBD Instructors",
						units: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						seats: 0,
						enrollment: 0,
						previousEnrollment: 0,
						instructorCount: 0,
						assignmentCount: 0
					},
					combinedTotals: {
						instructorCount: 0,
						assignmentCount: 0,
						enrollment: 0,
						seats: 0,
						previousEnrollment: 0,
						units: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
					}
				};

				instructorTypes.ids.forEach(function(instructorTypeId) {
					calculatedView.byInstructorType[instructorTypeId] = [];
					calculatedView.totals.byInstructorTypeId[instructorTypeId] = {
						units: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						seats: 0,
						enrollment: 0,
						previousEnrollment: 0,
						lastOfferedEnrollment: 0,
						assignmentCount: 0
					};
				});

				instructors.ids.forEach(function(instructorId) {
					var instructor = instructors.list[instructorId];
					var instructorTypeId = _self._getInstructorTypeId(instructor);

					if (instructorTypeId == null) { return; }

					if (calculatedView.instructorTypeIds.indexOf(instructorTypeId) == -1) {
						calculatedView.instructorTypeIds.push(instructorTypeId);
					}

					instructor.assignments = [];
					instructor.totals = {
						units: 0,
						studentCreditHours: 0,
						studentMaxCreditHours: 0,
						enrollment: 0,
						seats: 0,
						actualEnrollment: 0,
						previousEnrollment: 0,
						lastOfferedEnrollment: 0,
						assignmentCount: 0,
						workloadCount: 0
					};
					instructor.note = _self._getInstructorNote(instructor.id);

					var instructorAssignments = _self._getInstructorAssignments(instructorId, teachingAssignments);

					instructorAssignments.forEach(function(teachingAssignment) {
						var assignment = {};

						var sectionGroup = teachingAssignment.sectionGroupId > 0 ? sectionGroups.list[teachingAssignment.sectionGroupId] : null;
						var course = sectionGroup ? courses.list[sectionGroup.courseId] : null;
						let termCode = sectionGroup?.termCode || teachingAssignment.termCode;

						assignment.term = TermService.getTermName(termCode);
						assignment.termCode = termCode;

						assignment.description = TeachingAssignmentService.getDescription(teachingAssignment, course);

						if (course && course.census.length > 0) {
							var lastOfferedEnrollment = 0;
							var lastOfferedTermCode = "";

							for (var i = course.census.length - 1; i > 0; i--) {
								var slotCensus = course.census[i];

								if (slotCensus.currentEnrolledCount !== 0 && slotCensus.termCode < parseInt(termCode)) {
									lastOfferedEnrollment = slotCensus.currentEnrolledCount;
									lastOfferedTermCode = slotCensus.termCode.toString();
									break;
								}
							}

							assignment.lastOfferedEnrollment = lastOfferedEnrollment || 0;
							assignment.lastOfferedTermDescription = TermService.getTermName(lastOfferedTermCode, true);
						}

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
							assignment.previousEnrollment = sectionGroup.previousEnrollment || 0;
							assignment.enrollmentPercentage = assignment.maxEnrollment && assignment.actualEnrollment ? parseInt((assignment.actualEnrollment / assignment.maxEnrollment) * 100) : "0";
							assignment.units = CourseService.getUnits(course, sectionGroup);
							assignment.studentCreditHours = CourseService.getSCH(assignment.actualEnrollment, course, sectionGroup);
							assignment.studentMaxCreditHours = assignment.units * assignment.seats;
							assignment.studentCreditHoursPercentage = assignment.studentCreditHours && assignment.studentMaxCreditHours ? parseInt((assignment.studentCreditHours / assignment.studentMaxCreditHours) * 100) : "0";

							calculatedView.totals.assignmentCount += 1;
							calculatedView.totals.seats += assignment.seats;
							calculatedView.totals.enrollment += assignment.actualEnrollment;
							calculatedView.totals.previousEnrollment += assignment.previousEnrollment;
							calculatedView.totals.lastOfferedEnrollment += assignment.lastOfferedEnrollment;
							calculatedView.totals.units += assignment.units;
							calculatedView.totals.studentCreditHours += assignment.studentCreditHours;
							calculatedView.totals.studentMaxCreditHours += assignment.studentMaxCreditHours;

							calculatedView.totals.byInstructorTypeId[instructorTypeId].assignmentCount += 1;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].seats += assignment.seats;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].enrollment += assignment.actualEnrollment;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].previousEnrollment += assignment.previousEnrollment;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].lastOfferedEnrollment += assignment.lastOfferedEnrollment;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].units += assignment.units;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].studentCreditHours += assignment.studentCreditHours;
							calculatedView.totals.byInstructorTypeId[instructorTypeId].studentMaxCreditHours += assignment.studentMaxCreditHours;
						}

						// Workload minimum only applies to Ladder Faculty. "In Residence" assignments do not count towards workload.
						if (instructorTypeId === 6 && teachingAssignment.inResidence === false) {
							instructor.totals.workloadCount += 1;
						}

						instructor.assignments.push(assignment);

						instructor.totals.units += assignment.units || 0;
						instructor.totals.studentCreditHours += assignment.studentCreditHours || 0;
						instructor.totals.studentMaxCreditHours += assignment.studentMaxCreditHours || 0;
						instructor.totals.enrollment += assignment.enrollment || 0;
						instructor.totals.seats += assignment.seats || 0;
						instructor.totals.actualEnrollment += assignment.actualEnrollment || 0;
						instructor.totals.previousEnrollment += assignment.previousEnrollment || 0;
						instructor.totals.lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
						instructor.totals.assignmentCount += 1;
					});


					if (instructorTypeId === 6 && instructor.totals.workloadCount < _self._getWorkloadMinimum()) {
						instructor.displayWarning = true;
					}

					instructor.assignments = _array_sortByProperty(instructor.assignments, ["termCode", "description"]);

					calculatedView.byInstructorType[instructorTypeId].push(instructor);
					calculatedView.totals.instructorCount += 1;
				});

				calculatedView.instructorTypeIds = InstructorTypeService.orderInstructorTypeIdsAlphabetically(calculatedView.instructorTypeIds, instructorTypes);

				var assignedSectionGroupIds = teachingAssignments.ids.map(function (teachingAssignmentId) { return teachingAssignments.list[teachingAssignmentId].sectionGroupId; });
				var unassignedSectionGroupIds = sectionGroups.ids.filter(function (sectionGroupId) { return assignedSectionGroupIds.indexOf(sectionGroupId) === -1; });

				var unassignedCourses = unassignedSectionGroupIds.map(function (sectionGroupId) {
					var unassignedCourse = {};
					var sectionGroup = sectionGroups.list[sectionGroupId];
					var course = courses.list[sectionGroup.courseId];
					var sections = WorkloadSummaryReducers._state.sections.bySectionGroupId[sectionGroup.id];
					var seats = 0;

					if (sections) {
						seats = sections.reduce(function (acc, section) { return acc + section.seats; }, 0);
					}

					unassignedCourse.term = TermService.getTermName(sectionGroup.termCode);
					unassignedCourse.description = course.subjectCode + " " + course.courseNumber;
					unassignedCourse.sequencePattern = course.sequencePattern;
					unassignedCourse.seats = seats;
					unassignedCourse.enrollment = _self._getEnrollment(sectionGroup);
					unassignedCourse.previousEnrollment = sectionGroup.previousEnrollment;
					unassignedCourse.units = CourseService.getUnits(course, sectionGroup);
					unassignedCourse.studentCreditHours = CourseService.getSCH(unassignedCourse.enrollment, course, sectionGroup);
					unassignedCourse.studentMaxCreditHours = unassignedCourse.units * unassignedCourse.seats;

					calculatedView.unassignedTotals.assignmentCount += 1;
					calculatedView.unassignedTotals.seats += unassignedCourse.seats;
					calculatedView.unassignedTotals.enrollment += unassignedCourse.enrollment;
					calculatedView.unassignedTotals.previousEnrollment += unassignedCourse.previousEnrollment;
					calculatedView.unassignedTotals.units += unassignedCourse.units;
					calculatedView.unassignedTotals.studentCreditHours += unassignedCourse.studentCreditHours;
					calculatedView.unassignedTotals.studentMaxCreditHours += unassignedCourse.studentMaxCreditHours;

					return unassignedCourse;
				});

				var genericInstructors = {
					instructorTypeIds: [],
					byInstructorType: {},
				};

				teachingAssignments.ids.forEach(function (teachingAssignmentId) {
					var slotTeachingAssignment = teachingAssignments.list[teachingAssignmentId];

					if (slotTeachingAssignment.instructorId === null) {
						var instructorTypeId = slotTeachingAssignment.instructorTypeId;

						if (genericInstructors.instructorTypeIds.indexOf(instructorTypeId) == -1) {
							genericInstructors.instructorTypeIds.push(instructorTypeId);
							genericInstructors.byInstructorType[instructorTypeId] = {
								fullName: "TBD " + slotTeachingAssignment.instructorDisplayName,
								instructorAssignments: [],
								assignments: [],
								totals: {
									units: 0,
									studentCreditHours: 0,
									studentMaxCreditHours: 0,
									enrollment: 0,
									seats: 0,
									actualEnrollment: 0,
									previousEnrollment: 0,
									assignmentCount: 0
								}
							};
						}

						genericInstructors.byInstructorType[slotTeachingAssignment.instructorTypeId].instructorAssignments.push(slotTeachingAssignment);
					}
				});

				genericInstructors.instructorTypeIds.forEach(function (genericInstructorTypeId) {
					var genericInstructor = genericInstructors.byInstructorType[genericInstructorTypeId];

					genericInstructor.instructorAssignments.forEach(function (teachingAssignment) {
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
								sections.forEach(function (section) {
									seats += section.seats;
								});
							}

							assignment.seats = seats;
							assignment.previousEnrollment = sectionGroup.previousEnrollment;
							assignment.enrollmentPercentage = assignment.maxEnrollment && assignment.actualEnrollment ? parseInt((assignment.actualEnrollment / assignment.maxEnrollment) * 100) : "0";
							assignment.units = CourseService.getUnits(course, sectionGroup);
							assignment.studentCreditHours = CourseService.getSCH(assignment.actualEnrollment, course, sectionGroup);
							assignment.studentMaxCreditHours = assignment.units * assignment.seats;
							assignment.studentCreditHoursPercentage = assignment.studentCreditHours && assignment.studentMaxCreditHours ? parseInt((assignment.studentCreditHours / assignment.studentMaxCreditHours) * 100) : "0";

							calculatedView.genericInstructorTotals.assignmentCount += 1;
							calculatedView.genericInstructorTotals.seats += assignment.seats;
							calculatedView.genericInstructorTotals.enrollment += assignment.actualEnrollment;
							calculatedView.genericInstructorTotals.previousEnrollment += assignment.previousEnrollment;
							calculatedView.genericInstructorTotals.units += assignment.units;
							calculatedView.genericInstructorTotals.studentCreditHours += assignment.studentCreditHours;
							calculatedView.genericInstructorTotals.instructorCount += 1;
						}

						genericInstructor.assignments.push(assignment);

						genericInstructor.totals.units += assignment.units || 0;
						genericInstructor.totals.studentCreditHours += assignment.studentCreditHours || 0;
						genericInstructor.totals.studentMaxCreditHours += assignment.studentMaxCreditHours || 0;
						genericInstructor.totals.enrollment += assignment.enrollment || 0;
						genericInstructor.totals.seats += assignment.seats || 0;
						genericInstructor.totals.actualEnrollment += assignment.actualEnrollment || 0;
						genericInstructor.totals.previousEnrollment += assignment.previousEnrollment || 0;
						genericInstructor.totals.assignmentCount += 1;

						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].assignmentCount += 1;
						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].seats += assignment.seats || 0;
						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].enrollment += assignment.actualEnrollment || 0;
						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].previousEnrollment += assignment.previousEnrollment || 0;
						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].lastOfferedEnrollment += assignment.lastOfferedEnrollment || 0;
						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].units += assignment.units || 0;
						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].studentCreditHours += assignment.studentCreditHours || 0;
						calculatedView.totals.byInstructorTypeId[genericInstructorTypeId].studentMaxCreditHours += assignment.studentMaxCreditHours || 0;
					});

					genericInstructor.assignments = _array_sortByProperty(genericInstructor.assignments, ["termCode", "description"]);

					if (calculatedView.instructorTypeIds.indexOf(genericInstructorTypeId) == -1) {
						calculatedView.instructorTypeIds.push(genericInstructorTypeId);
					}

					calculatedView.byInstructorType[genericInstructorTypeId].push(genericInstructor);
					calculatedView.totals.instructorCount += 1;
				});

				calculatedView.unassignedCourses = unassignedCourses;

				calculatedView.workloadTotals = [calculatedView.totals, calculatedView.unassignedTotals, calculatedView.genericInstructorTotals];

				calculatedView.combinedTotals = calculatedView.workloadTotals.reduce(function(acc, total) {
					acc.instructorCount += total.instructorCount || 0;
					acc.assignmentCount += total.assignmentCount || 0;
					acc.enrollment += total.enrollment || 0;
					acc.seats += total.seats || 0;
					acc.previousEnrollment += total.previousEnrollment || 0;
					acc.units += total.units || 0;
					acc.studentCreditHours += total.studentCreditHours || 0;
					acc.studentMaxCreditHours += total.studentMaxCreditHours || 0;

					return acc;
				}, calculatedView.combinedTotals);

				WorkloadSummaryReducers.reduce({
					type: ActionTypes.CALCULATE_VIEW,
					payload: {
						calculatedView: calculatedView
					}
				});
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
			_getInstructorNote: function (instructorId) {
				const scheduleInstructorNotes = WorkloadSummaryReducers._state.scheduleInstructorNotes;
				let instructorComment = null;

				scheduleInstructorNotes.ids.forEach(function(instructorNoteId) {
					const instructorNote = scheduleInstructorNotes.list[instructorNoteId];

					if (instructorNote.instructorId === instructorId) {
						instructorComment = instructorNote.instructorComment;
					}
				});

				return instructorComment;
			},
			_getEnrollmentData: function(isPreviousYear) {
				var _self = this;

				WorkloadSummaryReducers.reduce({
					type: ActionTypes.BEGIN_CENSUS_DATA_FETCH,
					payload: {
						censusDataFetchBegun: true
					}
				});

				var termCodes = this._getScheduleTermCodes(isPreviousYear);
				var subjectCodes = this._getScheduleSubjectCodes();
				var openCalls = WorkloadSummaryReducers._state.calculations.dwCallsOpened;
				var completedCalls = WorkloadSummaryReducers._state.calculations.dwCallsCompleted;

				termCodes.forEach(function(termCode) {
					subjectCodes.forEach(function(subjectCode) {
						openCalls += 1;

						DwService.getDwCensusData(subjectCode, null, termCode).then(function(censusSections) {
							censusSections.forEach(function(censusSection) {
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
			},
			_getWorkloadMinimum: function() {
				const SOCIAL_SCIENCE_WORKGROUP_IDS = [12, 18, 19, 24, 25, 64, 81, 82, 83, 84];
				const HARCS_WORKGROUP_IDS = [16, 17, 36, 37, 38, 39, 40, 41, 42, 43, 45, 46, 48, 49, 50, 51, 53, 54, 56, 58, 59, 60, 61, 65, 66, 78, 89, 93, 94, 95, 96, 97, 99, 100];
				const MPS_WORKGROUP_IDS = [14, 28, 67, 69, 76];

				const DSS_MINIMUM = 4;
				const HARCS_MINIMUM = 4;
				const MPS_MINIMUM = 3;
	
				const workgroupId = Number(JSON.parse(localStorage.workgroup).id);
	
				if (SOCIAL_SCIENCE_WORKGROUP_IDS.includes(workgroupId)) {
					return DSS_MINIMUM;
				} else if (HARCS_WORKGROUP_IDS.includes(workgroupId)) {
					return HARCS_MINIMUM;
				} else if (MPS_WORKGROUP_IDS.includes(workgroupId)) {
					return MPS_MINIMUM;
				}
			}
		};
	}
}

WorkloadSummaryActions.$inject = ['WorkloadSummaryReducers', 'WorkloadSummaryService', '$rootScope', 'ActionTypes', 'Roles', 'TermService', 'DwService', 'TeachingAssignmentService', 'InstructorTypeService', 'CourseService', '$route'];

export default WorkloadSummaryActions;
