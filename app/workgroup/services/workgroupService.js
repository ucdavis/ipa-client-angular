/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
workgroupApp.factory("workgroupService", this.workgroupService = function(apiService) {
	return {
		getWorkgroupByCode: function(workgroupId) {
			return apiService.get("/api/workgroupView/" + workgroupId);
		},
		addTag: function (workgroupId, tag) {
			return apiService.post("/api/workgroupView/" + workgroupId + "/tags", tag);
		},
		updateTag: function (workgroupId, tag) {
			return apiService.put("/api/workgroupView/" + workgroupId + "/tags/" + tag.id, tag);
		},
		setInstructorType: function (userRole) {
			return apiService.put("/api/workgroupView/workgroups/" + userRole.workgroupId + "/userRoles/" + userRole.id + "/instructorTypes/" + userRole.instructorTypeId);
		},
		removeTag: function(workgroupId, tag) {
			return apiService.delete("/api/workgroupView/" + workgroupId + "/tags/" + tag.id);
		},
		addLocation: function (workgroupId, location) {
			return apiService.post("/api/workgroupView/" + workgroupId + "/locations", location);
		},
		updateLocation: function (workgroupId, location) {
			return apiService.put("/api/workgroupView/" + workgroupId + "/locations/" + location.id, location);
		},
		removeLocation: function(workgroupId, location) {
			return apiService.delete("/api/workgroupView/" + workgroupId + "/locations/" + location.id);
		},
		addRoleToUser: function (workgroupId, user, role) {
			return apiService.post("/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupId + "/roles/" + role.name, null);
		},
		removeRoleFromUser: function (workgroupId, user, role) {
			return apiService.delete("/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupId + "/roles/" + role.name);
		},
		searchUsers: function(workgroupId, query) {
			return apiService.get("/api/people/search?query=" + query);
		},
		createUser: function (workgroupId, user) {
			return apiService.post("/api/workgroupView/workgroups/" + workgroupId + "/users", user);
		},
		removeUserFromWorkgroup: function (workgroupId, user) {
			return apiService.delete("/api/workgroupView/workgroups/" + workgroupId + "/users/" + user.loginId);
		},
		updateUserRole: function (userRole) {
			return apiService.put("/api/workgroupView/userRoles/" + userRole.id + "/roles/" + userRole.roleId);
		},
	};
});
