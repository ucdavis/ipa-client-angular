class BudgetComparisonReportActions {
	constructor(BudgetComparisonReportReducers, BudgetComparisonReportService, BudgetComparisonReportCalculations, $rootScope, ActionTypes, Roles, $route) {
		return {
			getInitialState: function () {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var previousYear = String(parseInt($route.current.params.year) - 1);

				BudgetComparisonReportReducers._state = {};

				BudgetComparisonReportReducers.reduce({
					type: ActionTypes.INIT_STATE,
					payload: {}
				});

				this._getBudget(workgroupId, year, ActionTypes.GET_CURRENT_BUDGET);
				this._getCourses(workgroupId, year, ActionTypes.GET_CURRENT_COURSES);
				this._getSectionGroups(workgroupId, year, ActionTypes.GET_CURRENT_SECTION_GROUPS);
				this._getSections(workgroupId, year, ActionTypes.GET_CURRENT_SECTIONS);
				this._getInstructorTypes(workgroupId, year, ActionTypes.GET_CURRENT_INSTRUCTOR_TYPES);
				this._getTeachingAssignments(workgroupId, year, ActionTypes.GET_CURRENT_TEACHING_ASSIGNMENTS);
				this._getLineItems(workgroupId, year, ActionTypes.GET_CURRENT_LINE_ITEMS);
				this._getBudgetScenarios(workgroupId, year, ActionTypes.GET_CURRENT_BUDGET_SCENARIOS);
				this._getLineItemCategories(workgroupId, year, ActionTypes.GET_CURRENT_LINE_ITEM_CATEGORIES);
				this._getInstructorTypeCosts(workgroupId, year, ActionTypes.GET_CURRENT_INSTRUCTOR_TYPE_COSTS);
				this._getInstructorCosts(workgroupId, year, ActionTypes.GET_CURRENT_INSTRUCTOR_COSTS);
				this._getSectionGroupCosts(workgroupId, year, ActionTypes.GET_CURRENT_SECTION_GROUP_COSTS);
				this._getSectionGroupCostInstructors(workgroupId, year, ActionTypes.GET_CURRENT_SECTION_GROUP_COST_INSTRUCTORS);

				this._getBudget(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_BUDGET);
				this._getCourses(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_COURSES);
				this._getSectionGroups(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_SECTION_GROUPS);
				this._getSections(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_SECTIONS);
				this._getInstructorTypes(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_INSTRUCTOR_TYPES);
				this._getTeachingAssignments(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_TEACHING_ASSIGNMENTS);
				this._getLineItems(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_LINE_ITEMS);
				this._getBudgetScenarios(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_BUDGET_SCENARIOS);
				this._getLineItemCategories(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_LINE_ITEM_CATEGORIES);
				this._getInstructorTypeCosts(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_INSTRUCTOR_TYPE_COSTS);
				this._getInstructorCosts(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_INSTRUCTOR_COSTS);
				this._getSectionGroupCosts(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_SECTION_GROUP_COSTS);
				this._getSectionGroupCostInstructors(workgroupId, previousYear, ActionTypes.GET_PREVIOUS_SECTION_GROUP_COST_INSTRUCTORS);

				this._getUsers(workgroupId, year);
				this._getUserRoles(workgroupId);
				this._getInstructors(workgroupId, year);
				this._getUserWorkgroupsScenarios(year);
			},
			_getBudget: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getBudget(workgroupId, year).then(function (budget) {
					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							budget: budget
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getUsers: function (workgroupId, year) {
				var _self = this;

				BudgetComparisonReportService.getUsers(workgroupId, year).then(function (rawUsers) {
					let users = {
						ids: [],
						list: {},
						byLoginId: {}
					};

					rawUsers.forEach(function(user) {
						users.ids.push(user.id);
						users.list[user.id] = user;
						users.byLoginId[user.loginId.toLowerCase()] = user;
					});

					BudgetComparisonReportReducers.reduce({
						type: ActionTypes.GET_USERS,
						payload: {
							users: users
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getUserRoles: function (workgroupId) {
				var _self = this;

				BudgetComparisonReportService.getUserRoles(workgroupId).then(function (rawUserRoles) {
					let userRoles = {
						ids: [],
						list: {},
						byUserId: {}
					};

					rawUserRoles.forEach(function(userRole) {
						userRoles.ids.push(userRole.id);
						userRoles.list[userRole.id] = userRole;
						userRoles.byUserId[userRole.userId] = userRoles.byUserId[userRole.userId] || [];
						userRoles.byUserId[userRole.userId].push(userRole);
					});

					BudgetComparisonReportReducers.reduce({
						type: ActionTypes.GET_USER_ROLES,
						payload: {
							userRoles: userRoles
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getUserWorkgroupsScenarios: function (year) {
				BudgetComparisonReportService.getUserWorkgroupsScenarios(year).then(function (userWorkgroupsScenarios) {
					BudgetComparisonReportReducers.reduce({
						type: ActionTypes.GET_USER_WORKGROUPS_SCENARIOS,
						payload: {
							userWorkgroupsScenarios: userWorkgroupsScenarios
						}
					});
				});
			},
			_getInstructors: function (workgroupId, year) {
				var _self = this;

				BudgetComparisonReportService.getInstructors(workgroupId, year).then(function (rawInstructors) {
					let instructors = {
						ids: [],
						list: {}
					};

					rawInstructors.forEach(function(instructor) {
						instructors.ids.push(instructor.id);
						instructors.list[instructor.id] = instructor;
					});

					BudgetComparisonReportReducers.reduce({
						type: ActionTypes.GET_INSTRUCTORS,
						payload: {
							instructors: instructors
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getCourses: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getCourses(workgroupId, year).then(function (rawCourses) {
					let courses = {
						ids: [],
						list: {}
					};

					rawCourses.forEach(function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							courses: courses
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getInstructorTypeCosts: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getInstructorTypeCosts(workgroupId, year).then(function (rawInstructorTypeCosts) {
					let instructorTypeCosts = {
						ids: [],
						list: {},
						byInstructorTypeId: {},
						byBudgetScenarioId: {}
					};

					rawInstructorTypeCosts.forEach(function(instructorTypeCost) {
						instructorTypeCosts.ids.push(instructorTypeCost.id);
						instructorTypeCosts.list[instructorTypeCost.id] = instructorTypeCost;

						if (!instructorTypeCost.budgetScenarioId) {
								instructorTypeCosts.byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
							} else {
								if (!instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId]) {
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId] = {
										byInstructorTypeId: {}
									};
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId].byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
								} else {
									instructorTypeCosts.byBudgetScenarioId[instructorTypeCost.budgetScenarioId].byInstructorTypeId[instructorTypeCost.instructorTypeId] = instructorTypeCost;
								}
							}
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							instructorTypeCosts: instructorTypeCosts
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getInstructorCosts: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getInstructorCosts(workgroupId, year).then(function (rawInstructorCosts) {
					let instructorCosts = {
            ids: [],
            list: {},
            byInstructorId: {},
            byBudgetScenarioId: {}
          };

					rawInstructorCosts.forEach(function(instructorCost) {
						instructorCosts.ids.push(instructorCost.id);
						instructorCosts.list[instructorCost.id] = instructorCost;

						if (!instructorCost.budgetScenarioId) {
								instructorCosts.byInstructorId[instructorCost.instructorId] = instructorCost;
							} else {
								if (!instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId]) {
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId] = {
										byInstructorId: {}
									};
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId].byInstructorId[instructorCost.instructorId] = instructorCost;
								} else {
									instructorCosts.byBudgetScenarioId[instructorCost.budgetScenarioId].byInstructorId[instructorCost.instructorId] = instructorCost;
								}
							}
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							instructorCosts: instructorCosts
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getSectionGroupCosts: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getSectionGroupCosts(workgroupId, year).then(function (rawSectionGroupCosts) {
					let sectionGroupCosts = {
						ids: [],
						list: {},
						bySectionGroupId: {}
					};

					rawSectionGroupCosts.forEach(function(sectionGroupCost) {
						sectionGroupCosts.ids.push(sectionGroupCost.id);
						sectionGroupCosts.list[sectionGroupCost.id] = sectionGroupCost;
						sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId] = sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId] || [];
						sectionGroupCosts.bySectionGroupId[sectionGroupCost.sectionGroupId].push(sectionGroupCost.id);
					});


					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							sectionGroupCosts: sectionGroupCosts
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getSectionGroupCostInstructors: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getSectionGroupCostInstructors(workgroupId, year).then(function (rawSectionGroupCostInstructors) {
					var sectionGroupCostInstructors = {
						bySectionGroupCostId : {}
					};
					var teachingAssignmentIds = [];

					rawSectionGroupCostInstructors.forEach(function(sectionGroupCostInstructor) {
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] = sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId] || [];
						sectionGroupCostInstructors.bySectionGroupCostId[sectionGroupCostInstructor.sectionGroupCostId].push(sectionGroupCostInstructor);
						if (sectionGroupCostInstructor.teachingAssignmentId){
							teachingAssignmentIds.push(sectionGroupCostInstructor.teachingAssignmentId);
						}
					});


					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							sectionGroupCostInstructors: sectionGroupCostInstructors,
							teachingAssignmentIds: teachingAssignmentIds
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getLineItemCategories: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getLineItemCategories(workgroupId, year).then(function (rawLineItemCategories) {
					let lineItemCategories = {
						ids: [],
						list: {}
					};

					rawLineItemCategories.forEach(function(lineItemCategory) {
						lineItemCategories.ids.push(lineItemCategory.id);
						lineItemCategories.list[lineItemCategory.id] = lineItemCategory;
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							lineItemCategories: lineItemCategories
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getLineItems: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getLineItems(workgroupId, year).then(function (rawLineItems) {
					let lineItems = {
						ids: [],
						list: {}
					};

					rawLineItems.forEach(function(lineItem) {
						lineItems.ids.push(lineItem.id);
						lineItems.list[lineItem.id] = lineItem;
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							lineItems: lineItems
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getBudgetScenarios: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getBudgetScenarios(workgroupId, year).then(function (rawBudgetScenarios) {
					let budgetScenarios = {
						ids: [],
						list: {}
					};

					rawBudgetScenarios.forEach(function(budgetScenario) {
						budgetScenarios.ids.push(budgetScenario.id);
						budgetScenarios.list[budgetScenario.id] = budgetScenario;
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							budgetScenarios: budgetScenarios
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getSections: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getSections(workgroupId, year).then(function (rawSections) {
					let sections = {
						ids: [],
						list: {}
					};

					rawSections.forEach(function(section) {
						sections.ids.push(section.id);
						sections.list[section.id] = section;
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							sections: sections
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getInstructorTypes: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getInstructorTypes(workgroupId, year).then(function (rawInstructorTypes) {
					let instructorTypes = {
						ids: [],
						list: {}
					};

					rawInstructorTypes.forEach(function(instructorType) {
						instructorTypes.ids.push(instructorType.id);
						instructorTypes.list[instructorType.id] = instructorType;
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							instructorTypes: instructorTypes
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getTeachingAssignments: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getTeachingAssignments(workgroupId, year).then(function (rawTeachingAssignments) {
					let teachingAssignments = {
						ids: [],
						list: {},
						bySectionGroupId: []
					};

					rawTeachingAssignments.forEach(function(teachingAssignment) {
						teachingAssignments.ids.push(teachingAssignment.id);
						teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
						if (teachingAssignment.sectionGroupId) {
							teachingAssignments.bySectionGroupId[teachingAssignment.sectionGroupId] = teachingAssignments.bySectionGroupId[teachingAssignment.sectionGroupId] || [];
							teachingAssignments.bySectionGroupId[teachingAssignment.sectionGroupId].push(teachingAssignment.id);
						}
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							teachingAssignments: teachingAssignments
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_getSectionGroups: function (workgroupId, year, action) {
				var _self = this;

				BudgetComparisonReportService.getSectionGroups(workgroupId, year).then(function (rawSectionGroups) {
					let sectionGroups = {
						ids: [],
						list: {}
					};

					rawSectionGroups.forEach(function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});

					BudgetComparisonReportReducers.reduce({
						type: action,
						payload: {
							sectionGroups: sectionGroups
						}
					});

					_self._performCalculations();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load Budget Comparison Report information.", type: "ERROR" });
				});
			},
			_performCalculations: function () {
				this._isCurrentYearFetchComplete();
				this._isPreviousYearFetchComplete();

				if (BudgetComparisonReportReducers._state.calculations.isCurrentYearFetchComplete && BudgetComparisonReportReducers._state.calculations.isPreviousYearFetchComplete
				&& BudgetComparisonReportReducers._state.userRoles.ids && BudgetComparisonReportReducers._state.users.ids && BudgetComparisonReportReducers._state.instructors.ids) {
					this._generateFilters();

					BudgetComparisonReportCalculations.calculateView();
				}
			},
			_isCurrentYearFetchComplete: function () {
				var budget = BudgetComparisonReportReducers._state.budget.current;
				var sectionGroups = BudgetComparisonReportReducers._state.sectionGroups.current;
				var courses = BudgetComparisonReportReducers._state.courses.current;
				var teachingAssignments = BudgetComparisonReportReducers._state.teachingAssignments.current;
				var instructorTypes = BudgetComparisonReportReducers._state.instructorTypes.current;
				var sections = BudgetComparisonReportReducers._state.sections.current;
				var budgetScenarios = BudgetComparisonReportReducers._state.budgetScenarios.current;
				var lineItems = BudgetComparisonReportReducers._state.lineItems.current;
				var lineItemCategories = BudgetComparisonReportReducers._state.lineItemCategories.current;
				var instructorTypeCosts = BudgetComparisonReportReducers._state.instructorTypeCosts.current;
				var instructorCosts = BudgetComparisonReportReducers._state.instructorCosts.current;
				var sectionGroupCosts = BudgetComparisonReportReducers._state.sectionGroupCosts.current;

				if (budget && sectionGroups && courses && teachingAssignments && instructorTypes
					&& sections && budgetScenarios && lineItems && lineItemCategories
					&& instructorTypeCosts && instructorCosts && sectionGroupCosts) {
					BudgetComparisonReportReducers.reduce({
						type: ActionTypes.CURRENT_YEAR_FETCH_COMPLETE,
						payload: {
							isCurrentYearFetchComplete: true
						}
					});
				}
			},
			_isPreviousYearFetchComplete: function () {
				var budget = BudgetComparisonReportReducers._state.budget.previous;
				var sectionGroups = BudgetComparisonReportReducers._state.sectionGroups.previous;
				var courses = BudgetComparisonReportReducers._state.courses.previous;
				var teachingAssignments = BudgetComparisonReportReducers._state.teachingAssignments.previous;
				var instructorTypes = BudgetComparisonReportReducers._state.instructorTypes.previous;
				var sections = BudgetComparisonReportReducers._state.sections.previous;
				var budgetScenarios = BudgetComparisonReportReducers._state.budgetScenarios.previous;
				var lineItems = BudgetComparisonReportReducers._state.lineItems.previous;
				var lineItemCategories = BudgetComparisonReportReducers._state.lineItemCategories.previous;
				var instructorTypeCosts = BudgetComparisonReportReducers._state.instructorTypeCosts.previous;
				var instructorCosts = BudgetComparisonReportReducers._state.instructorCosts.previous;
				var sectionGroupCosts = BudgetComparisonReportReducers._state.sectionGroupCosts.previous;

				if (budget && sectionGroups && courses && teachingAssignments && instructorTypes
				&& sections && budgetScenarios && lineItems && lineItemCategories
				&& instructorTypeCosts && instructorCosts && sectionGroupCosts) {
					BudgetComparisonReportReducers.reduce({
						type: ActionTypes.PREVIOUS_YEAR_FETCH_COMPLETE,
						payload: {
							isPreviousYearFetchComplete: true
						}
					});
				}
			},
			_generateFilters: function() {
				let courses = BudgetComparisonReportReducers._state.courses;
				let lineItems = BudgetComparisonReportReducers._state.lineItems;
				let subjectCodes = [];
				let accountNumbers = [];
				let filters = [];

				filters.push({
					subheader: true,
					description: 'Subject Codes'
				});
				courses.current.ids.forEach(function(courseId) {
					var subjectCode = courses.current.list[courseId].subjectCode;

					if (!subjectCodes.includes(subjectCode)) {
						subjectCodes.push(subjectCode);

						filters.push({
							type: 'subjectCode',
							description: subjectCode,
							selected: false
						});
					}
				});

				courses.previous.ids.forEach(function(courseId) {
					var subjectCode = courses.previous.list[courseId].subjectCode;

					if (!subjectCodes.includes(subjectCode)) {
						subjectCodes.push(subjectCode);

				filters.push({
							type: 'subjectCode',
							description: subjectCode,
							selected: false
						});
					}
				});

				filters.push({
					subheader: true,
					description: 'Account Number'
				});

				lineItems.current.ids.forEach(function(lineItemId) {
					var accountNumber = lineItems.current.list[lineItemId].accountNumber;

					if (accountNumber && !accountNumbers.includes(accountNumber)) {
						accountNumbers.push(accountNumber);

						filters.push({
							type: 'accountNumber',
							description: accountNumber,
							selected: false
						});
					}
				});

				lineItems.previous.ids.forEach(function(lineItemId) {
					var accountNumber = lineItems.previous.list[lineItemId].accountNumber;

					if (accountNumber && !accountNumbers.includes(accountNumber)) {
						accountNumbers.push(accountNumber);

						filters.push({
							type: 'accountNumber',
							description: accountNumber,
							selected: false
						});
					}
				});

				BudgetComparisonReportReducers.reduce({
					type: ActionTypes.GENERATE_FILTERS,
					payload: {
						filters: filters
					}
				});
			},
			selectCurrentBudgetScenario: function(selectedScenarioId) {
				BudgetComparisonReportReducers.reduce({
					type: ActionTypes.SELECT_CURRENT_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: selectedScenarioId
					}
				});
	
				this._performCalculations();
			},
			selectPreviousBudgetScenario: function(selectedScenarioId) {
				BudgetComparisonReportReducers.reduce({
					type: ActionTypes.SELECT_PREVIOUS_BUDGET_SCENARIO,
					payload: {
						budgetScenarioId: selectedScenarioId
					}
				});
	
				this._performCalculations();
			},
			// old frontend excel download method
			// downloadAsExcel: function(year, workgroupName) {
			// 	var viewState = BudgetComparisonReportReducers._state;
			// 	BudgetComparisonReportService.downloadAsExcel(viewState, year, workgroupName);
			// },
			toggleFilter: function(filter) {
				let filters = BudgetComparisonReportReducers._state.ui.filters;
				let lineItems = BudgetComparisonReportReducers._state.lineItems;
				let sectionGroupCosts = BudgetComparisonReportReducers._state.sectionGroupCosts;

				let activeSubjectCodeFilterDescriptions = filters.filter(function(slotFilter) {
					return slotFilter.selected && slotFilter.type == "subjectCode";
				}).map(function(slotFilter) { return slotFilter.description; });

				let activeAccountNumberFilterDescriptions = filters.filter(function(slotFilter) {
						return slotFilter.selected && slotFilter.type == "accountNumber";
					}).map(function(slotFilter) {
						return slotFilter.description;
					});

				if (filter.type === "accountNumber") {
					let keys = Object.keys(lineItems);

					keys.forEach(function(key) {
						lineItems[key].ids.forEach(function(lineItemId) {
							let slotLineItem = lineItems[key].list[lineItemId];

							if (activeAccountNumberFilterDescriptions.length < 1) {
								slotLineItem.hidden = false;
								return;
							}

							slotLineItem.hidden = true;

							if (activeAccountNumberFilterDescriptions.includes(slotLineItem.accountNumber)) {
								slotLineItem.hidden = false;
							}

						});
					});
				}

				if (filter.type === "subjectCode") {
					let keys = Object.keys(sectionGroupCosts);

					keys.forEach(function(key) {
						sectionGroupCosts[key].ids.forEach(function(sectionGroupCostId) {
							let slotSectionGroupCost = sectionGroupCosts[key].list[sectionGroupCostId];

							if (activeSubjectCodeFilterDescriptions.length < 1) {
								slotSectionGroupCost.hidden = false;
								return;
							}

							slotSectionGroupCost.hidden = true;

							if (activeSubjectCodeFilterDescriptions.includes(slotSectionGroupCost.subjectCode)) {
								slotSectionGroupCost.hidden = false;
							}
						});
					});
				}

				BudgetComparisonReportReducers.reduce({
					type: ActionTypes.TOGGLE_FILTER,
					payload: {
						lineItems: lineItems,
						sectionGroupCosts: sectionGroupCosts,
						filters: filters
					}
				});

				BudgetComparisonReportCalculations.calculateView();
			},
			toggleDownloadModal: function() {
				BudgetComparisonReportReducers.reduce({
					type: ActionTypes.TOGGLE_DOWNLOAD_MODAL
				});
			}
		};
	}
}

BudgetComparisonReportActions.$inject = ['BudgetComparisonReportReducers', 'BudgetComparisonReportService', 'BudgetComparisonReportCalculations', '$rootScope', 'ActionTypes', 'Roles', '$route'];

export default BudgetComparisonReportActions;
