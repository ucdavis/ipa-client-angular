instructionalSupportApp.service('instructionalSupportCallStatusStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term) {
	return {
		_state: {},
		_supportCallReducers: function (action, supportCalls) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportCalls = {
						studentSupportCalls: {
							list: {},
							ids: []
						},
						instructorSupportCalls: {
							list: {},
							ids: []
						},
						eligibleSupportStaff: {
							
						},
						eligibleInstructors: {
							
						}
					};

					// Collect instructors of interest (by term) from teachingAssignments
					var instructorsByTermCode = {};
					action.payload.teachingAssignments.forEach( function(teachingAssignment) {
						instructorId = teachingAssignment.instructorId;
						termCode = teachingAssignment.termCode;

						if (instructorsByTermCode[termCode] == null) {
							instructorsByTermCode[termCode] = [];
						} else if (instructorsByTermCode[termCode].indexOf(instructorId) == -1) {
							instructorsByTermCode[termCode].push(instructorId);
						}
					});

					// Scaffold out eligibleSupportStaff and eligibleInstructors
					var allSupportStaffIds = [];
					allSupportStaffIds = allSupportStaffIds.concat(action.payload.phdStudentIds);
					allSupportStaffIds = allSupportStaffIds.concat(action.payload.mastersStudentIds);
					allSupportStaffIds = allSupportStaffIds.concat(action.payload.instructionalSupportIds);

					var shortTermCodes = ['01', '02', '03', '05', '06', '07', '08', '09', '10'];
					shortTermCodes.forEach( function(shortTermCode) {
						if (['01', '02', '03'].indexOf(shortTermCode) >= 0) { 
							termYear = parseInt(action.year) + 1;
						} else {
							termYear = action.year;
						}

						var termCode = termYear + shortTermCode;

						supportCalls.eligibleSupportStaff[termCode] = [];
						supportCalls.eligibleSupportStaff[termCode] = supportCalls.eligibleSupportStaff[termCode].concat(allSupportStaffIds);
						supportCalls.eligibleInstructors[termCode] = [];

						// Ensure assigned instructors exist for that term
						var instructorIds = [];
						if (instructorsByTermCode[termCode]) {
							instructorIds = instructorsByTermCode[termCode];
						}
						supportCalls.eligibleInstructors[termCode] = supportCalls.eligibleInstructors[termCode].concat(instructorIds);
					});

					// Collect student support calls
					var studentSupportCallsLength = action.payload.studentSupportCalls ? action.payload.studentSupportCalls.length : 0;

					for (var i = 0; i < studentSupportCallsLength; i++) {
						var studentSupportCallData = action.payload.studentSupportCalls[i];

						studentSupportCallData.startDate = millisecondsToDate(studentSupportCallData.startDate);
						studentSupportCallData.dueDate = millisecondsToDate(studentSupportCallData.dueDate);

						// Contacted/Responded/Participants will be filled in below
						studentSupportCallData.contacted = 0;
						studentSupportCallData.responded = 0;
						studentSupportCallData.participants = [];

						supportCalls.studentSupportCalls.list[studentSupportCallData.id] = studentSupportCallData;
						supportCalls.studentSupportCalls.ids.push(studentSupportCallData.id);
					}

					// Collect instructor support calls
					var instructorSupportCallsLength = action.payload.instructorSupportCalls ? action.payload.instructorSupportCalls.length : 0;

					for (var i = 0; i < instructorSupportCallsLength; i++) {
						var instructorSupportCallData = action.payload.instructorSupportCalls[i];

						instructorSupportCallData.startDate = millisecondsToDate(instructorSupportCallData.startDate);
						instructorSupportCallData.dueDate = millisecondsToDate(instructorSupportCallData.dueDate);

						// Contacted/Responded/Participants will be filled in below
						instructorSupportCallData.contacted = 0;
						instructorSupportCallData.responded = 0;
						instructorSupportCallData.participants = [];

						supportCalls.instructorSupportCalls.list[instructorSupportCallData.id] = instructorSupportCallData;
						supportCalls.instructorSupportCalls.ids.push(instructorSupportCallData.id);
					}

					// Identify supportStaff that are no longer eligible in a given term
					action.payload.studentInstructionalSupportCallResponses.forEach( function(response) {
						var supportStaffId = response.instructionalSupportStaffId;
						var supportCallId = response.studentSupportCallId;
						var termCode = "";

						action.payload.studentSupportCalls.forEach( function (studentSupportCall) {
							if (supportCallId == studentSupportCall.id) {
								// Identify the termCode associated to the response
								termCode = studentSupportCall.termCode; 

								// Add the supportStaffId to the supportCall
								studentSupportCall.participants.push(supportStaffId);
							}
						});

						var index = supportCalls.eligibleSupportStaff[termCode].indexOf(supportStaffId);
						if (index >= 0) {
							supportCalls.eligibleSupportStaff[termCode].splice(index,1);
						}

						// Increment contacted and responded values
						var supportCall = supportCalls.studentSupportCalls.list[supportCallId];
						supportCall.contacted++;

						if (response.submitted) {
							supportCall.responded++;
						}
					});

					// Identify instructors that are no longer eligible in a given term
					action.payload.instructorInstructionalSupportCallResponses.forEach( function(response) {
						var instructorId = response.instructorId;
						var supportCallId = response.instructorSupportCallId;
						var termCode = "";

						action.payload.instructorSupportCalls.forEach( function (instructorSupportCall) {
							if (supportCallId == instructorSupportCall.id) {
								termCode = instructorSupportCall.termCode; 
							}

							// Add the supportStaffId to the supportCall
							instructorSupportCall.participants.push(instructorId);
						});

						var index = supportCalls.eligibleInstructors[termCode].indexOf(instructorId);
						if (index >= 0) {
							supportCalls.eligibleInstructors[termCode].splice(index,1);
						}

						// Increment contacted and responded values
						var supportCall = supportCalls.instructorSupportCalls.list[supportCallId];
						supportCall.contacted++;

						if (response.submitted) {
							supportCall.responded++;
						}
					});

					return supportCalls;
				case ADD_STUDENT_SUPPORT_CALL:
						var studentSupportCall = action.payload;
						var supportCallId = studentSupportCall.id;

						supportCalls.studentSupportCalls.ids.push(studentSupportCall.id);
						supportCalls.studentSupportCalls.list[supportCallId] = studentSupportCall;
					return supportCalls;
				case ADD_INSTRUCTOR_SUPPORT_CALL:
						var instructorSupportCall = action.payload;
						var supportCallId = instructorSupportCall.id;

						supportCalls.instructorSupportCalls.ids.push(instructorSupportCall.id);
						supportCalls.instructorSupportCalls.list[supportCallId] = instructorSupportCall;
					return supportCalls;
				case DELETE_STUDENT_SUPPORT_CALL:
					var supportCallId = action.payload;

					var index = supportCalls.studentSupportCalls.ids.indexOf(supportCallId);

					if (index > -1) {
						supportCalls.studentSupportCalls.ids.splice(index,1);
						supportCalls.studentSupportCalls.list[supportCallId] = null;
					}

					return supportCalls;
				case DELETE_INSTRUCTOR_SUPPORT_CALL:
					var supportCallId = action.payload;
					var index = supportCalls.instructorSupportCalls.ids.indexOf(supportCallId);

					if (index > -1) {
						supportCalls.instructorSupportCalls.ids.splice(index,1);
						supportCalls.instructorSupportCalls.list[supportCallId] = null;
					}

					return supportCalls;
				default:
					return supportCalls;
			}
		},
		_instructionalSupportStaffsReducers: function (action, instructionalSupportStaffs) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructionalSupportStaffs = {
						ids: [],
						list: {}
					};

					var instructionalSupportStaffsLength = action.payload.instructionalSupportStaffList ? action.payload.instructionalSupportStaffList.length : 0;

					for (var i = 0; i < instructionalSupportStaffsLength; i++) {
						var instructionalSupportStaffData = action.payload.instructionalSupportStaffList[i];

						instructionalSupportStaffs.list[instructionalSupportStaffData.id] = instructionalSupportStaffData;
						instructionalSupportStaffs.ids.push(instructionalSupportStaffData.id);
					}
					return instructionalSupportStaffs;
				default:
					return instructionalSupportStaffs;
			}
		},
		_instructorReducers: function (action, instructors) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructors = {
						ids: [],
						list: {}
					};

					var instructorsLength = action.payload.activeInstructors ? action.payload.activeInstructors.length : 0;

					for (var i = 0; i < instructorsLength; i++) {
						var instructorData = action.payload.activeInstructors[i];

						instructors.list[instructorData.id] = instructorData;
						instructors.ids.push(instructorData.id);
					}
					return instructors;
				default:
					return instructors;
			}
		},
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					userInterface = {};
					userInterface.scheduleId = action.payload.scheduleId;

					// Build InstructorsByTerm associative array
					var instructorsByTerm = {};
					action.payload.teachingAssignments.forEach( function(teachingAssignment) {
						instructorId = teachingAssignment.instructorId;
						shortTermCode = teachingAssignment.termCode.slice(-2);

						if (instructorsByTerm[shortTermCode] == null) {
							instructorsByTerm[shortTermCode] = [];
						} else if (instructorsByTerm[shortTermCode].indexOf(instructorId) == -1) {
							instructorsByTerm[shortTermCode].push(instructorId);
						}
					});
						userInterface.instructorsByShortTermCode = instructorsByTerm;
					return userInterface;
				default:
					return userInterface;
			}
		},
		_phdIdsReducers: function (action, phdIds) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					return action.payload.phdStudentIds;
				default:
					return phdIds;
			}
		},
		_mastersIdsReducers: function (action, mastersIds) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					return action.payload.mastersStudentIds;
				default:
					return mastersIds;
			}
		},
		_instructionalSupportIdsReducers: function (action, instructionalSupportIds) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					return action.payload.instructionalSupportIds;
				default:
					return instructionalSupportIds;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.supportCalls = scope._supportCallReducers(action, scope._state.supportCalls);
			newState.instructionalSupportStaffs = scope._instructionalSupportStaffsReducers(action, scope._state.instructionalSupportStaffs);
			newState.instructors = scope._instructorReducers(action, scope._state.instructors);

			newState.phdIds = scope._phdIdsReducers(action, scope._state.phdIds);
			newState.mastersIds = scope._mastersIdsReducers(action, scope._state.mastersIds);
			newState.instructionalSupportIds = scope._instructionalSupportIdsReducers(action, scope._state.instructionalSupportIds);

			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
			scope._state = newState;

			$rootScope.$emit('instructionalSupportCallStatusStateChanged', {
				state: scope._state
			});

			$log.debug("Instructional Support state updated:");
			$log.debug(scope._state);
		}
	};
});

millisecondsToDate = function(milliseconds) {
	var d = new Date(milliseconds);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var formattedDate = year + "-" + month + "-" + day;
	return formattedDate;
};