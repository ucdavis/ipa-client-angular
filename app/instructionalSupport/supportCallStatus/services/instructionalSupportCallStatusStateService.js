instructionalSupportApp.service('instructionalSupportCallStatusStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term) {
	return {
		_state: {},
		_supportCallReducers: function (action, supportCalls) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportCalls = {
						ids: []
					};
					var supportCallsList = {};

					var supportCallsLength = action.payload.supportCalls ? action.payload.supportCalls.length : 0;

					// For every course, find the relevant sectionGroup and add metadata to it from the course
					for (var i = 0; i < supportCallsLength; i++) {
						var supportCallData = action.payload.supportCalls[i];

						supportCallsList[supportCallData.id] = supportCallData;
						supportCalls.ids.push(supportCallData.id);
					}

					supportCalls.list = supportCallsList;

					return supportCalls;

				case ADD_ASSIGNMENT_SLOTS:
					var instructionalSupportAssignmentsLength = action.payload ? action.payload.length : 0;

					for (var k = 0; k < instructionalSupportAssignmentsLength; k++) {
						var instructionalSupportAssignmentData = action.payload[k];
						var sectionGroupId = instructionalSupportAssignmentData.sectionGroupId;

						sectionGroups.list[sectionGroupId].instructionalSupportAssignmentIds.push(instructionalSupportAssignmentData.id);
					}

					return sectionGroups;

				case DELETE_ASSIGNMENT:

					sectionGroupId = action.payload.sectionGroupId;
					assignmentId = action.payload.id;

					var index = sectionGroups.list[sectionGroupId].instructionalSupportAssignmentIds.indexOf(assignmentId);

					if (index > -1) {
						sectionGroups.list[sectionGroupId].instructionalSupportAssignmentIds.splice(index,1);
					}

					return sectionGroups;
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

		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.supportCalls = scope._supportCallReducers(action, scope._state.supportCalls);
			newState.instructionalSupportStaffs = scope._instructionalSupportStaffsReducers(action, scope._state.instructionalSupportStaffs);
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