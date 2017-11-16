/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
workgroupApp.service('workgroupActionCreators', function (workgroupStateService, workgroupService, $rootScope, Role) {
	return {
		getInitialState: function (workgroupId) {
			workgroupService.getWorkgroupByCode(workgroupId).then(function (payload) {
				var action = {
					type: INIT_WORKGROUP,
					payload: payload
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load workgroup initial state.", type: "ERROR" });
			});
		},
		addTag: function (workgroupId, tag) {
			workgroupService.addTag(workgroupId, tag).then(function (newTag) {
				$rootScope.$emit('toast', { message: "Created tag " + newTag.name, type: "SUCCESS" });
				var action = {
					type: ADD_TAG,
					payload: {
						tag: newTag
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Not could create tag.", type: "ERROR" });
			});
		},
		updateTag: function (workgroupId, tag) {
			workgroupService.updateTag(workgroupId, tag).then(function (newTag) {
				$rootScope.$emit('toast', { message: "Updated tag " + newTag.name, type: "SUCCESS" });
				var action = {
					type: UPDATE_TAG,
					payload: {
						tag: newTag
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update tag.", type: "ERROR" });
			});
		},
		removeTag: function (workgroupId, tag) {
			workgroupService.removeTag(workgroupId, tag).then(function () {
				$rootScope.$emit('toast', { message: "Removed tag " + tag.name, type: "SUCCESS" });
				var action = {
					type: REMOVE_TAG,
					payload: {
						tag: tag
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove tag.", type: "ERROR" });
			});
		},
		addLocation: function (workgroupId, location) {
			workgroupService.addLocation(workgroupId, location).then(function (newLocation) {
				$rootScope.$emit('toast', { message: "Created location " + newLocation.description, type: "SUCCESS" });
				var action = {
					type: ADD_LOCATION,
					payload: {
						location: newLocation
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not create location.", type: "ERROR" });
			});
		},
		updateLocation: function (workgroupId, location) {
			workgroupService.updateLocation(workgroupId, location).then(function (newLocation) {
				$rootScope.$emit('toast', { message: "Renamed location to " + newLocation.description, type: "SUCCESS" });
				var action = {
					type: UPDATE_LOCATION,
					payload: {
						location: newLocation
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not rename location.", type: "ERROR" });
			});
		},
		removeLocation: function (workgroupId, location) {
			workgroupService.removeLocation(workgroupId, location).then(function (newLocation) {
				$rootScope.$emit('toast', { message: "Removed location " + location.description, type: "SUCCESS" });
				var action = {
					type: REMOVE_LOCATION,
					payload: {
						location: location
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove location.", type: "ERROR" });
			});
		},
		addRoleToUser: function (workgroupId, user, role) {
			workgroupService.addRoleToUser(workgroupId, user, role).then(function (userRole) {
				$rootScope.$emit('toast', { message: user.firstName + " " + user.lastName + " is now " + role.getDisplayName(), type: "SUCCESS" });
				var action = {
					type: ADD_USER_ROLE,
					payload: {
						user: user,
						userRole: userRole,
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add role for user.", type: "ERROR" });
			});
		},
		removeRoleFromUser: function (workgroupId, user, role, userRoleToBeDeleted) {
			workgroupService.removeRoleFromUser(workgroupId, user, role).then(function (userRole) {
				$rootScope.$emit('toast', { message: user.firstName + " " + user.lastName + " is no longer " + role.getDisplayName(), type: "SUCCESS" });
				var action = {
					type: REMOVE_USER_ROLE,
					payload: {
						user: user,
						userRole: userRoleToBeDeleted
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove role from user.", type: "ERROR" });
			});
		},
		clearUserSearch: function () {
			var action = {
				type: SEARCH_USERS,
				payload: {
					userSearchResults: []
				}
			};
			workgroupStateService.reduce(action);
		},
		createUser: function (workgroupId, dwUser) {
			var scope = this;
			var role = new Role({ name: "presence" });

			workgroupStateService.reduce({
				type: BEGIN_ADD_USER,
				payload: {}
			});

			workgroupService.createUser(workgroupId, dwUser).then(function (newUser) {
				$rootScope.$emit('toast', { message: "Added user " + newUser.firstName + " " + newUser.lastName, type: "SUCCESS" });
				var action = {
					type: ADD_USER,
					payload: {
						user: newUser
					}
				};
				workgroupStateService.reduce(action);
				scope.addRoleToUser(workgroupId, newUser, role);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add user.", type: "ERROR" });
			});
		},
		removeUserFromWorkgroup: function (workgroupId, user) {
			workgroupService.removeUserFromWorkgroup(workgroupId, user).then(function () {
				$rootScope.$emit('toast', { message: "Removed user " + user.firstName + " " + user.lastName, type: "SUCCESS" });
				var action = {
					type: REMOVE_USER,
					payload: {
						user: user
					}
				};
				workgroupStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove user.", type: "ERROR" });
			});
		}
	};
});