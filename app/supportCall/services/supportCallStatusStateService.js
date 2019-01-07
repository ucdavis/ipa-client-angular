import { _array_sortIdsByProperty } from 'shared/helpers/array';

class SupportCallStatusStateService {
	constructor ($rootScope, $log, SupportCallStatusSelectors, ActionTypes) {
		this.$rootScope = $rootScope;
		this.$log = $log;
		this.SupportCallStatusSelectors = SupportCallStatusSelectors;
		this.ActionTypes = ActionTypes;

		var self = this;
		return {
			_state: {},
			_supportStaffSupportCallResponseReducers: function (action, supportStaffSupportCallResponses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportStaffSupportCallResponses = {
							ids: [],
							list: []
						};
	
						action.payload.studentSupportCallResponses.forEach(function(supportResponse) {
							// Record to state
							supportStaffSupportCallResponses.ids.push(supportResponse.id);
							supportStaffSupportCallResponses.list[supportResponse.id] = supportResponse;
						});
	
						return supportStaffSupportCallResponses;
					case ActionTypes.DELETE_STUDENT_SUPPORT_CALL:
						var supportCallResponseId = action.payload;
	
						var index = supportStaffSupportCallResponses.ids.indexOf(supportCallResponseId);
						supportStaffSupportCallResponses.ids.splice(index, 1);
	
						return supportStaffSupportCallResponses;
					case ActionTypes.ADD_STUDENT_SUPPORT_CALL:
						action.payload.forEach(function(supportCallResponse) {
							supportStaffSupportCallResponses.ids.push(supportCallResponse.id);
							supportStaffSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
						});
	
						return supportStaffSupportCallResponses;
					case ActionTypes.CONTACT_STUDENT_SUPPORT_CALL:
						action.payload.forEach(function(supportCallResponse) {
							supportStaffSupportCallResponses.ids.push(supportCallResponse.id);
							supportStaffSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
						});
	
						return supportStaffSupportCallResponses;
					default:
						return supportStaffSupportCallResponses;
				}
			},
			_instructorSupportCallResponseReducers: function (action, instructorSupportCallResponses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						instructorSupportCallResponses = {
							ids: [],
							list: []
						};
	
						action.payload.instructorSupportCallResponses.forEach(function(supportResponse) {
							// Record to state
							instructorSupportCallResponses.ids.push(supportResponse.id);
							instructorSupportCallResponses.list[supportResponse.id] = supportResponse;
						});
	
						return instructorSupportCallResponses;
					case ActionTypes.DELETE_INSTRUCTOR_SUPPORT_CALL:
						var supportCallResponseId = action.payload.supportCallResponseId;
	
						var index = instructorSupportCallResponses.ids.indexOf(supportCallResponseId);
						instructorSupportCallResponses.ids.splice(index, 1);
	
						return instructorSupportCallResponses;
					case ActionTypes.ADD_INSTRUCTOR_SUPPORT_CALL:
						action.payload.forEach(function(supportCallResponse) {
							instructorSupportCallResponses.ids.push(supportCallResponse.id);
							instructorSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
						});
	
						return instructorSupportCallResponses;
					case ActionTypes.CONTACT_INSTRUCTOR_SUPPORT_CALL:
						action.payload.forEach(function(supportCallResponse) {
							instructorSupportCallResponses.ids.push(supportCallResponse.id);
							instructorSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
						});
	
						return instructorSupportCallResponses;
					default:
						return instructorSupportCallResponses;
				}
			},
			_instructorReducers: function (action, instructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						instructors = {
							ids: [],
							list: []
						};
	
						action.payload.activeInstructors.forEach(function(instructor) {
							// Find teachingCallReceiptId if it exists
							instructor.teachingCallReceiptId = 0;
	
							for (var i = 0; i < action.payload.instructorSupportCallResponses.length; i++) {
								var instructorResponse = action.payload.instructorSupportCallResponses[i];
								if (instructorResponse.instructorId == instructor.id) {
									instructor.supportCallResponseId = instructorResponse.id;
									break;
								}
							}
	
							instructor.isInstructor = true;
	
							instructors.list[instructor.id] = instructor;
						});
	
						// Ensure instructors are pre-sorted by last name
						instructors.ids = _array_sortIdsByProperty(instructors.list, ["lastName"]);
	
						return instructors;
					case ActionTypes.DELETE_INSTRUCTOR_SUPPORT_CALL:
						var instructorId = action.payload.instructorId;
						instructors.list[instructorId].supportCallResponseId = null;
						return instructors;
					case ActionTypes.ADD_INSTRUCTOR_SUPPORT_CALL:
						action.payload.forEach(function(supportCallResponse) {
							var instructor = instructors.list[supportCallResponse.instructorId];
							instructor.supportCallResponseId = supportCallResponse.id;
						});
	
						return instructors;
					default:
						return instructors;
				}
			},
			_supportStaffReducers: function (action, supportStaff) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportStaff = {
							ids: [],
							list: [],
							mastersIds: [],
							phdIds: [],
							instructionalSupportIds: []
						};
	
						supportStaff.mastersIds = action.payload.mastersStudentIds;
						supportStaff.phdIds = action.payload.phdStudentIds;
						supportStaff.instructionalSupportIds = action.payload.instructionalSupportIds;
	
						action.payload.supportStaffList.forEach(function(slotSupportStaff) {
	
							// Identify type of supportStaff
							slotSupportStaff.isMasters = (supportStaff.mastersIds.indexOf(slotSupportStaff.id) > -1);
							slotSupportStaff.isPhd = (supportStaff.phdIds.indexOf(slotSupportStaff.id) > -1);
							slotSupportStaff.isInstructionalSupport = (supportStaff.instructionalSupportIds.indexOf(slotSupportStaff.id) > -1);
	
							// Find teachingCallReceiptId if it exists
							slotSupportStaff.supportCallResponseId = 0;
	
							for (var i = 0; i < action.payload.studentSupportCallResponses.length; i++) {
								var supportStaffResponse = action.payload.studentSupportCallResponses[i];
								if (supportStaffResponse.supportStaffId == slotSupportStaff.id) {
									slotSupportStaff.supportCallResponseId = supportStaffResponse.id;
									break;
								}
							}
	
							supportStaff.list[slotSupportStaff.id] = slotSupportStaff;
						});
	
						// Ensure instructors are pre-sorted by last name
						supportStaff.ids = _array_sortIdsByProperty(supportStaff.list, ["lastName"]);
	
						return supportStaff;
					case ActionTypes.DELETE_STUDENT_SUPPORT_CALL:
						var supportStaffId = action.payload.supportStaffId;
						supportStaff.list[supportStaffId].supportCallResponseId = null;
	
						return supportStaff;
					case ActionTypes.ADD_STUDENT_SUPPORT_CALL:
						action.payload.forEach(function(supportCallResponse) {
							var supportStaffDTO = supportStaff.list[supportCallResponse.supportStaffId];
							supportStaffDTO.supportCallResponseId = supportCallResponse.id;
						});
	
						return supportStaff;
					default:
						return supportStaff;
				}
			},
			_miscReducers: function (action, misc) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						misc = {
							scheduleId: action.payload.scheduleId,
							year: action.year,
							nextYear: parseInt(action.year) + 1,
							nextYearShort: (parseInt(action.year) + 1).toString().slice(-2),
							termShortCode: action.termShortCode,
							workgroupId: action.workgroupId
						};
	
						// Set termCode
						if (misc.termShortCode < 4) {
							misc.termCode = misc.nextYear + misc.termShortCode;
						} else {
							misc.termCode = misc.year + misc.termShortCode;
						}
	
						return misc;
					default:
						return misc;
				}
			},
			reduce: function (action) {
				var scope = this;
	
				// Build new 'state'
				// The 'state' is the normalized source of truth
				let newState = {};
				newState.instructors = scope._instructorReducers(action, scope._state.instructors);
				newState.instructorSupportCallResponses = scope._instructorSupportCallResponseReducers(action, scope._state.instructorSupportCallResponses);
				newState.supportStaff = scope._supportStaffReducers(action, scope._state.supportStaff);
				newState.supportStaffSupportCallResponses = scope._supportStaffSupportCallResponseReducers(action, scope._state.supportStaffSupportCallResponses);
				newState.misc = scope._miscReducers(action, scope._state.misc);
	
				scope._state = newState;
	
				// Build new 'page state'
				// This is the 'view friendly' version of the store
				let newPageState = {};
				newPageState.supportCall = {};
				newPageState.eligible = {};
				newPageState.misc = {};
	
				newPageState.supportCall.instructors = self.SupportCallStatusSelectors.generateInstructorGroup(angular.copy(scope._state.instructors), angular.copy(scope._state.instructorSupportCallResponses), false); // eslint-disable-line no-undef
	
				newPageState.supportCall.masters = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "masters"); // eslint-disable-line no-undef
				newPageState.supportCall.phds = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "phd"); // eslint-disable-line no-undef
				newPageState.supportCall.instructionalSupports = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "instructionalSupport"); // eslint-disable-line no-undef
				newPageState.supportCall.supportStaff = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "all"); // eslint-disable-line no-undef
	
				newPageState.eligible.instructors = self.SupportCallStatusSelectors.generateInstructorGroup(angular.copy(scope._state.instructors), angular.copy(scope._state.instructorSupportCallResponses), true); // eslint-disable-line no-undef
	
				newPageState.eligible.masters = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "masters"); // eslint-disable-line no-undef
				newPageState.eligible.phds = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "phd"); // eslint-disable-line no-undef
				newPageState.eligible.instructionalSupports = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "instructionalSupport"); // eslint-disable-line no-undef
				newPageState.eligible.supportStaff = self.SupportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "all"); // eslint-disable-line no-undef
	
				newPageState.misc = angular.copy(scope._state.misc); // eslint-disable-line no-undef
	
				$rootScope.$emit('supportCallStatusStateChanged', newPageState);
			}
		};
	}
}

SupportCallStatusStateService.$inject = ['$rootScope', '$log', 'SupportCallStatusSelectors', 'ActionTypes'];

export default SupportCallStatusStateService;
