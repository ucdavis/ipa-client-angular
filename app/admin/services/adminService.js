/**
 * @ngdoc service
 * @name adminApp.adminService
 * @description
 * # adminService
 * Service in the adminApp.
 * adminApp specific api calls.
 */
class AdminService {
	constructor (ApiService) {
		this.ApiService = ApiService;

		return {
			getAdminView: function() {
				return ApiService.get("/api/adminView");
			},
			updateWorkgroup: function(workgroup) {
				return ApiService.put("/api/adminView/workgroups/" + workgroup.id, workgroup);
			},
			removeWorkgroup: function(workgroupId) {
				return ApiService.delete("/api/adminView/workgroups/" + workgroupId);
			},
			addWorkgroup: function(workgroup) {
				return ApiService.post("/api/adminView/workgroups", workgroup);
			}
		};	
	}
}

AdminService.$inject = ['ApiService'];

export default AdminService;
