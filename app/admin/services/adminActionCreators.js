/**
 * @ngdoc service
 * @name adminApp.adminActionCreators
 * @description
 * # adminActionCreators
 * Service in the adminApp.
 * Central location for sharedState information.
 */
adminApp.service('adminActionCreators', function (adminStateService, adminService, $rootScope) {
	return {
		getInitialState: function () {
			adminService.getAdminView().then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				adminStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load admin view.", type: "ERROR" });
			});
		},
		updateWorkgroup: function (workgroup) {
			adminService.updateWorkgroup(workgroup).then(function (updatedWorkgroup) {
				$rootScope.$emit('toast', { message: "Updated workgroup " + updatedWorkgroup.name, type: "SUCCESS" });
				var action = {
					type: UPDATE_WORKGROUP,
					payload: {
						workgroup: updatedWorkgroup
					}
				};
				adminStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update workgroup.", type: "ERROR" });
			});
		},
		removeWorkgroup: function (workgroup) {
			adminService.removeWorkgroup(workgroup.id).then(function () {
				$rootScope.$emit('toast', { message: "Removed workgroup " + workgroup.name, type: "SUCCESS" });
				var action = {
					type: REMOVE_WORKGROUP,
					payload: {
						workgroup: workgroup
					}
				};
				adminStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove workgroup.", type: "ERROR" });
			});
		},
		addWorkgroup: function (workgroup) {
			adminService.addWorkgroup(workgroup).then(function (createdWorkgroup) {
				$rootScope.$emit('toast', { message: "Created workgroup " + workgroup.name, type: "SUCCESS" });
				var action = {
					type: ADD_WORKGROUP,
					payload: {
						workgroup: createdWorkgroup
					}
				};
				adminStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add workgroup.", type: "ERROR" });
			});
		}
	};
});
