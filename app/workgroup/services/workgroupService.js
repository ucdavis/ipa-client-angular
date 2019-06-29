/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
class WorkgroupService {
	constructor (ApiService) {
		return {
			getWorkgroupByCode: function(workgroupId) {
				return ApiService.get("/api/workgroupView/" + workgroupId);
			},
			addTag: function (workgroupId, tag) {
				return ApiService.post("/api/workgroupView/" + workgroupId + "/tags", tag);
			},
			updateTag: function (workgroupId, tag) {
				return ApiService.put("/api/workgroupView/" + workgroupId + "/tags/" + tag.id, tag);
			},
			setInstructorType: function (userRole) {
				return ApiService.put("/api/workgroupView/workgroups/" + userRole.workgroupId + "/userRoles/" + userRole.id + "/instructorTypes/" + userRole.instructorTypeId);
			},
			removeTag: function(workgroupId, tag) {
				return ApiService.delete("/api/workgroupView/" + workgroupId + "/tags/" + tag.id);
			},
			addLocation: function (workgroupId, location) {
				return ApiService.post("/api/workgroupView/" + workgroupId + "/locations", location);
			},
			updateLocation: function (workgroupId, location) {
				return ApiService.put("/api/workgroupView/" + workgroupId + "/locations/" + location.id, location);
			},
			removeLocation: function(workgroupId, location) {
				return ApiService.delete("/api/workgroupView/" + workgroupId + "/locations/" + location.id);
			},
			addRoleToUser: function (workgroupId, user, role) {
				return ApiService.post("/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupId + "/roles/" + role.name, null);
			},
			removeRoleFromUser: function (workgroupId, user, role) {
				return ApiService.delete("/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupId + "/roles/" + role.name);
			},
			searchUsers: function(workgroupId, query) {
				return ApiService.get("/api/people/search?query=" + query);
			},
			createUser: function (workgroupId, user) {
				return ApiService.post("/api/workgroupView/workgroups/" + workgroupId + "/users", user);
			},
			removeUserFromWorkgroup: function (workgroupId, user) {
				return ApiService.delete("/api/workgroupView/workgroups/" + workgroupId + "/users/" + user.loginId);
			},
			updateUserRole: function (userRole) {
				return ApiService.put("/api/workgroupView/userRoles/" + userRole.id + "/roles/" + userRole.roleId);
			},
			addPlaceholderUser: function (placeholderUser, workgroupId) {
				return ApiService.post("/api/workgroups/" + workgroupId + "/users/placeholder/", placeholderUser);
			},
			updatePlaceholderUser: function (user, previousLoginId, workgroupId) {
				return ApiService.put("/api/workgroups/" + workgroupId + "/users/placeholder/" + previousLoginId, user);
			}
		};
	}
}

WorkgroupService.$inject = ['ApiService'];

export default WorkgroupService;
