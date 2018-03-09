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
			var self = this;

			workgroupService.getWorkgroupByCode(workgroupId).then(function (payload) {
				var action = {
					type: INIT_WORKGROUP,
					payload: payload,
					workgroupId: workgroupId
				};
				workgroupStateService.reduce(action);
				self._calculateUserRoles();
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
			var self = this;

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
				self._calculateUserRoles();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add role for user.", type: "ERROR" });
			});
		},
		removeRoleFromUser: function (userId, roleId, userRoleToBeDeleted) {
			var self = this;
			var user = workgroupStateService._state.users.list[userId];
			var role = workgroupStateService._state.roles.list[roleId];
			var workgroupId = workgroupStateService._state.ui.workgroupId;

			workgroupService.removeRoleFromUser(workgroupId, user, role).then(function (userRole) {
				$rootScope.$emit('toast', { message: user.firstName + " " + user.lastName + " is no longer " + role.getDisplayName(), type: "SUCCESS" });

				workgroupStateService.reduce({
					type: REMOVE_USER_ROLE,
					payload: {
						user: user,
						userRole: userRoleToBeDeleted
					}
				});

				self._calculateUserRoles();
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
		createUser: function (workgroupId, dwUser, roleId) {
			var self = this;
			var role = new Role({ name: workgroupStateService._state.roles.list[roleId].name });

			var existingUser = this._userPresent(dwUser);
			if (!existingUser) {
				workgroupStateService.reduce({
					type: ADD_USER_PENDING,
					payload: {}
				});

				workgroupService.createUser(workgroupId, dwUser).then(function (newUser) {
					var action = {
						type: ADD_USER_COMPLETED,
						payload: {
							user: newUser
						}
					};
					workgroupStateService.reduce(action);
					self.addRoleToUser(workgroupId, newUser, new Role({ name: "presence"}));
					self.addRoleToUser(workgroupId, newUser, role);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not add user.", type: "ERROR" });
				});
			} else {
				self.addRoleToUser(workgroupId, existingUser, role);
			}
		},
		_userPresent: function (user) {
			var userPresent = null;
			workgroupStateService._state.users.ids.forEach(function(userId) {
				var slotUser = workgroupStateService._state.users.list[userId];
				if (slotUser.loginId == user.loginId && slotUser.email == user.email) {
					userPresent = slotUser;
				}
			});

			return userPresent;
		},
		setRoleTab: function(tabName) {
			workgroupStateService.reduce({
				type: SET_ROLE_TAB,
				payload: {
					activeRoleTab: tabName,
					activeRoleId: this._getRoleIdFromTabName(tabName)
				}
			});
		},
		_getRoleIdFromTabName: function(tabName) {
			tabNameRoleIds = {
				"Academic Planner": 2,
				"Instructor": 15,
				"Reviewer": 10,
				"Instructional Support": 11,
				"Student Masters": 12,
				"Student PhD": 13,
				"Presence": 9
			};

			return tabNameRoleIds[tabName];
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
		},
		_calculateUserRoles: function () {
			var self = this;
			calculatedUserRoles = [];

			workgroupStateService._state.userRoles.ids.forEach(function(userRoleId) {
				var userRole = workgroupStateService._state.userRoles.list[userRoleId];

				if (userRole.role == 'admin' || userRole.role == 'registrar') {
					return;
				}

				var newUserRole = self._generateUserRole(userRole);
				calculatedUserRoles.push(newUserRole);
			});

			workgroupStateService.reduce({
				type: CALCULATE_USER_ROLES,
				payload: {
					calculatedUserRoles: calculatedUserRoles
				}
			});
		},
		_generateUserRole: function (userRole) {
			var user = workgroupStateService._state.users.list[userRole.userId];
			var role = null;

			workgroupStateService._state.roles.ids.forEach(function(roleId) {
				var slotRole = workgroupStateService._state.roles.list[roleId];

				if (slotRole.name == userRole.role) {
					role = slotRole;
				}
			});

			return {
				id: userRole.id,
				role: userRole.role,
				roleDisplay: role.name,
				roleId: role.id,
				workgroupId: userRole.workgroupId,
				userDisplayName: user.name,
				userId: user.id,
				userLoginId: user.loginId,
				userEmail: user.email
			};
		}
	};
});