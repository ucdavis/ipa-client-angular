'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
workgroupApp.service('workgroupActionCreators', function (workgroupStateService, workgroupService, $rootScope) {
	return {
		getInitialState: function (workgroupCode) {
			workgroupService.getWorkgroupByCode(workgroupCode).then(function (payload) {
				var action = {
					type: INIT_WORKGROUP,
					payload: payload
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		addTag: function (workgroupCode, tag) {
			workgroupService.addTag(workgroupCode, tag).then(function (newTag) {
				$rootScope.$emit('toast', {message: "Created tag " + newTag.name, type: "SUCCESS"});
				var action = {
					type: ADD_TAG,
					payload: {
						tag: newTag
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		updateTag: function (workgroupCode, tag) {
			workgroupService.updateTag(workgroupCode, tag).then(function (newTag) {
				$rootScope.$emit('toast', {message: "Renamed tag to " + newTag.name, type: "SUCCESS"});
				var action = {
					type: UPDATE_TAG,
					payload: {
						tag: newTag
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		removeTag: function (workgroupCode, tag) {
			workgroupService.removeTag(workgroupCode, tag).then(function () {
				$rootScope.$emit('toast', {message: "Removed tag " + tag.name, type: "SUCCESS"});
				var action = {
					type: REMOVE_TAG,
					payload: {
						tag: tag
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		addLocation: function (workgroupCode, location) {
			workgroupService.addLocation(workgroupCode, location).then(function (newLocation) {
				$rootScope.$emit('toast', {message: "Created location " + newLocation.description, type: "SUCCESS"});
				var action = {
					type: ADD_LOCATION,
					payload: {
						location: newLocation
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		updateLocation: function (workgroupCode, location) {
			workgroupService.updateLocation(workgroupCode, location).then(function (newLocation) {
				$rootScope.$emit('toast', {message: "Renamed location to " + newLocation.description, type: "SUCCESS"});
				var action = {
					type: UPDATE_LOCATION,
					payload: {
						location: newLocation
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		removeLocation: function (workgroupCode, location) {
			workgroupService.removeLocation(workgroupCode, location).then(function (newLocation) {
				$rootScope.$emit('toast', {message: "Removed location " + location.description, type: "SUCCESS"});
				var action = {
					type: REMOVE_LOCATION,
					payload: {
						location: location
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		addRoleToUser: function (workgroupCode, user, role) {
			workgroupService.addRoleToUser(workgroupCode, user, role).then(function (userRole) {
				$rootScope.$emit('toast', {message: user.firstName + " " + user.lastName + " is now " + role.getDisplayName(), type: "SUCCESS"});
				var action = {
					type: ADD_USER_ROLE,
					payload: {
						userRole: userRole
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		removeRoleFromUser: function (workgroupCode, user, role, userRoleToBeDeleted) {
			workgroupService.removeRoleFromUser(workgroupCode, user, role).then(function (userRole) {
				$rootScope.$emit('toast', {message: user.firstName + " " + user.lastName + " is no longer " + role.getDisplayName(), type: "SUCCESS"});
				var action = {
					type: REMOVE_USER_ROLE,
					payload: {
						userRole: userRoleToBeDeleted
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		searchUsers: function (workgroupCode, query) {
			workgroupService.searchUsers(workgroupCode, query).then(function (userSearchResults) {
				var action = {
					type: SEARCH_USERS,
					payload: {
						userSearchResults: userSearchResults
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		createUser: function (workgroupCode, dwUser) {
			var scope = this;
			var role = {name: "senateInstructor"};

			workgroupService.createUser(dwUser).then(function (newUser) {
				$rootScope.$emit('toast', {message: "Added user " + newUser.firstName + " " + newUser.lastName, type: "SUCCESS"});
				var action = {
					type: ADD_USER,
					payload: {
						user: newUser
					}
				};
				workgroupStateService.reduce(action);
				scope.addRoleToUser(workgroupCode, newUser, role);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		removeUserFromWorkgroup: function (workgroupCode, user) {
			workgroupService.removeUserFromWorkgroup(workgroupCode, user).then(function () {
				$rootScope.$emit('toast', {message: "Removed user " + user.firstName + " " + user.lastName, type: "SUCCESS"});
				var action = {
					type: REMOVE_USER,
					payload: {
						user: user
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		}
	}
});