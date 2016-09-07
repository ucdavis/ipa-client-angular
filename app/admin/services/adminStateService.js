'use strict';

/**
 * @ngdoc service
 * @name adminApp.adminStateService
 * @description
 * # adminStateService
 * Service in the adminApp.
 * Central location for sharedState information.
 */
adminApp.service('adminStateService', function ($rootScope, Workgroup) {
	return {
		_state: {},
		_workgroupReducers: function (action, workgroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					workgroups = {
						ids: []
					};
					var workgroupList = {};
					var length = action.payload.workgroups ? action.payload.workgroups.length : 0;
					for (var i = 0; i < length; i++) {
						var workgroupData = action.payload.workgroups[i];
						workgroupList[workgroupData.id] = new Workgroup(workgroupData);
					}
					workgroups.ids = _array_sortIdsByProperty(workgroupList, "name");
					workgroups.list = workgroupList;
					return workgroups;
				default:
					return workgroups;
			}
		},
		_uiStateReducers: function (action, uiState) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					uiState = {
					};
					return uiState;
				default:
					return uiState;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.workgroups = scope._workgroupReducers(action, scope._state.workgroups);
			newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

			scope._state = newState;
			$rootScope.$emit('adminStateChanged', {
				state: scope._state,
				actionType: action.type
			});

			console.debug("Admin state updated:");
			console.debug(scope._state, action.type);
		}
	}
});
