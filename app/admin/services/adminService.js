/**
 * @ngdoc service
 * @name adminApp.adminService
 * @description
 * # adminService
 * Service in the adminApp.
 * adminApp specific api calls.
 */
adminApp.factory("adminService", this.adminService = function($http, $q, apiService) {
	return {
		getAdminView: function() {
			return apiService.get("/api/adminView");
		},
		updateWorkgroup: function(workgroup) {
			return apiService.put("/api/adminView/workgroups/" + workgroup.id, workgroup);
		},
		removeWorkgroup: function(workgroupId) {
			return apiService.delete("/api/adminView/workgroups/" + workgroupId);
		},
		addWorkgroup: function(workgroup) {
			return apiService.post("/api/adminView/workgroups", workgroup);
		}
	};
});
