import { _array_sortIdsByProperty } from 'shared/helpers/array';

/**
 * @ngdoc service
 * @name adminApp.adminStateService
 * @description
 * # adminStateService
 * Service in the adminApp.
 * Central location for sharedState information.
 */
class AdminStateService {
	constructor ($rootScope, Workgroup, $log, ActionTypes) {
		this.$rootScope = $rootScope;
		this.Workgroup = Workgroup;
		this.$log = $log;

		return {
			_state: {},
			_workgroupReducers: function (action, workgroups) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						workgroups = {
							newWorkgroup: {},
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
	
						if (action.payload.lastActiveDates) {
							action.payload.lastActiveDates.forEach(function(lastActiveDate) {
								var results = lastActiveDate.split(",");
								var workgroupId = results[0];
								var date = results[1].split(" ")[0];
	
								if (!date || date == "null") {
									date = "";
								} else {
									date = "Last Active (" + date + ")";
								}
	
								workgroups.list[workgroupId].lastActiveDate = date;
							});
						}
	
						return workgroups;
					case ActionTypes.UPDATE_WORKGROUP:
						workgroups.list[action.payload.workgroup.id] = action.payload.workgroup;
						return workgroups;
					case ActionTypes.REMOVE_WORKGROUP:
						var workgroupIndex = workgroups.ids.indexOf(action.payload.workgroup.id);
						workgroups.ids.splice(workgroupIndex, 1);
						delete workgroups.list[action.payload.workgroup.id];
						return workgroups;
					case ActionTypes.ADD_WORKGROUP:
						workgroups.list[action.payload.workgroup.id] = action.payload.workgroup;
						workgroups.ids.push(action.payload.workgroup.id);
						workgroups.newWorkgroup = {};
						return workgroups;
					default:
						return workgroups;
				}
			},
			_uiStateReducers: function (action, uiState) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
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
	
				let newState = {};
				newState.workgroups = scope._workgroupReducers(action, scope._state.workgroups);
				newState.uiState = scope._uiStateReducers(action, scope._state.uiState);
	
				scope._state = newState;
				$rootScope.$emit('adminStateChanged', {
					state: scope._state,
					action: action
				});
	
				$log.debug("Admin state updated:");
				$log.debug(scope._state, action.type);
			}
		};	
	}
}

AdminStateService.$inject = ['$rootScope', 'Workgroup', '$log', 'ActionTypes'];

export default AdminStateService;
