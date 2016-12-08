instructionalSupportApp.service('instructionalSupportCallStatusStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term) {
	return {
		_state: {},
		_supportCallReducers: function (action, supportCalls) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportCalls = {
						studentSupportCalls: {
							ids: []
						},
						instructorSupportCalls: {
							ids: []
						}
					};

					var studentSupportCalls = {};
					var studentSupportCallsList = {};
					var studentSupportCallsIds = [];
					var studentSupportCallsLength = action.payload.studentSupportCalls ? action.payload.studentSupportCalls.length : 0;

					// For every course, find the relevant sectionGroup and add metadata to it from the course
					for (var i = 0; i < studentSupportCallsLength; i++) {
						var studentSupportCallData = action.payload.studentSupportCalls[i];

						studentSupportCallData.startDate = millisecondsToDate(studentSupportCallData.startDate);
						studentSupportCallData.dueDate = millisecondsToDate(studentSupportCallData.dueDate);

						studentSupportCallsList[studentSupportCallData.id] = studentSupportCallData;
						studentSupportCallsIds.push(studentSupportCallData.id);
					}

					studentSupportCalls.list = studentSupportCallsList;
					studentSupportCalls.ids = studentSupportCallsIds;

					supportCalls.studentSupportCalls = studentSupportCalls;

					return supportCalls;
				case ADD_STUDENT_SUPPORT_CALL:

						var studentSupportCall = action.payload;
						var supportCallId = studentSupportCall.id;

						supportCalls.studentSupportCalls.ids.push(studentSupportCall.id);
						supportCalls.studentSupportCalls.list[supportCallId] = studentSupportCall;

					return supportCalls;

				case DELETE_STUDENT_SUPPORT_CALL:
					var supportCallId = action.payload;

					var index = supportCalls.studentSupportCalls.ids.indexOf(supportCallId);

					if (index > -1) {
						supportCalls.studentSupportCalls.ids.splice(index,1);
						supportCalls.studentSupportCalls.list[supportCallId] = null;
					}

					return supportCalls;
				default:
					return sectionGroups;
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
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					userInterface = {};
					userInterface.scheduleId = action.payload.scheduleId;
					return userInterface;
				default:
					return userInterface;
			}
		},
		_phdIdsReducers: function (action, phdStudentIds) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
 					return action.payload.phdStudentIds;
				default:
					return phdStudentIds;
			}
		},
		_mastersIdsReducers: function (action, mastersStudentIds) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					return action.payload.mastersStudentIds;
				default:
					return mastersStudentIds;
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

			newState.phdIds = scope._phdIdsReducers(action, scope._state.phdStudentIds);
			newState.mastersIds = scope._mastersIdsReducers(action, scope._state.mastersStudentIds);
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