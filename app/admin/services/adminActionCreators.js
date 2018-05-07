/**
 * @ngdoc service
 * @name adminApp.adminActionCreators
 * @description
 * # adminActionCreators
 * Service in the adminApp.
 * Central location for sharedState information.
 */
class AdminActionCreators {
	constructor (AdminStateService, AdminService, $rootScope, ActionTypes) {
		var self = this;
		this.adminStateService = AdminStateService;
		this.adminService = AdminService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function () {
				self.adminService.getAdminView().then(function (payload) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: payload
					};
					self.adminStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not load admin view.", type: "ERROR" });
				});
			},
			updateWorkgroup: function (workgroup) {
				self.adminService.updateWorkgroup(workgroup).then(function (updatedWorkgroup) {
					self.$rootScope.$emit('toast', { message: "Updated workgroup " + updatedWorkgroup.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_WORKGROUP,
						payload: {
							workgroup: updatedWorkgroup
						}
					};
					self.adminStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not update workgroup.", type: "ERROR" });
				});
			},
			removeWorkgroup: function (workgroup) {
				self.adminService.removeWorkgroup(workgroup.id).then(function () {
					self.$rootScope.$emit('toast', { message: "Removed workgroup " + workgroup.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_WORKGROUP,
						payload: {
							workgroup: workgroup
						}
					};
					self.adminStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not remove workgroup.", type: "ERROR" });
				});
			},
			addWorkgroup: function (workgroup) {
				self.adminService.addWorkgroup(workgroup).then(function (createdWorkgroup) {
					self.$rootScope.$emit('toast', { message: "Created workgroup " + workgroup.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_WORKGROUP,
						payload: {
							workgroup: createdWorkgroup
						}
					};
					self.adminStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not add workgroup.", type: "ERROR" });
				});
			}
		};
	}
}

AdminActionCreators.$inject = ['AdminStateService', 'AdminService', '$rootScope', 'ActionTypes'];

export default AdminActionCreators;
