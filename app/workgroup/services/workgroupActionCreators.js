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
		setInstructorType: function (instructorType, userRole) {
			var self = this;

			userRole.instructorTypeId = instructorType.id;

			workgroupService.updateUserRole(userRole).then(function (newUserRole) {
				$rootScope.$emit('toast', { message: "Updated instructor type", type: "SUCCESS" });
				var action = {
					type: UPDATE_USER_ROLE,
					payload: {
						userRole: newUserRole
					}
				};
				workgroupStateService.reduce(action);
				self._calculateUserRoles();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor type", type: "ERROR" });
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
					activeRoleTabDisplay: tabName == "Presence" ? "Unassigned" : tabName,
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

			var userRolesWithPresence = this._calculateUserRolesWithPresence();
			var calculatedUserRoles = [];

			workgroupStateService._state.userRoles.ids.forEach(function(userRoleId) {
				var userRole = workgroupStateService._state.userRoles.list[userRoleId];

				if (userRole.role == 'admin' || userRole.role == 'registrar') {
					return;
				}

				var displayPresence = (userRolesWithPresence.indexOf(userRole.id) > -1);
				var newUserRole = self._generateUserRole(userRole, displayPresence);

				calculatedUserRoles.push(newUserRole);
			});

			calculatedUserRoles = _array_sortByProperty(calculatedUserRoles, "userDisplayName");

			workgroupStateService.reduce({
				type: CALCULATE_USER_ROLES,
				payload: {
					calculatedUserRoles: calculatedUserRoles
				}
			});

			this._calculateRoleTotals();
		},
		_generateUserRole: function (userRole, shouldDisplayPresence) {
			var user = workgroupStateService._state.users.list[userRole.userId];
			var role = null;

			workgroupStateService._state.roles.ids.forEach(function(roleId) {
				var slotRole = workgroupStateService._state.roles.list[roleId];

				if (slotRole.name == userRole.role) {
					role = slotRole;
				}
			});

			var instructorTypeDescription = userRole.instructorTypeId > 0 ? workgroupStateService._state.instructorTypes.list[userRole.instructorTypeId].description : null;

			return {
				id: userRole.id,
				role: userRole.role,
				roleDisplay: role.name,
				roleId: role.id,
				workgroupId: userRole.workgroupId,
				userDisplayName: user.name,
				userId: user.id,
				userLoginId: user.loginId,
				userEmail: user.email,
				displayPresence: shouldDisplayPresence,
				instructorTypeId: userRole.instructorTypeId,
				instructorTypeDescription: instructorTypeDescription
			};
		},
		// Will generate a list of presence userRoles that should be displayed in the presence column.
		// Presence userRole will only show if the user does not have any other userRoles in the workgroup
		_calculateUserRolesWithPresence: function() {
			// Identify which users shouldn't have presence displayed
			var usersWithAccess = [];

			workgroupStateService._state.userRoles.ids.forEach(function(userRoleId) {
				var userRole = workgroupStateService._state.userRoles.list[userRoleId];
				// Ignore userRoles from other workgroups
				if (userRole.workgroupId != workgroupStateService._state.ui.workgroupId) { return; }

				// Ignore presence, admin and registrar roles as these roles are not displayed in the UI
				if (userRole.role == "presence" || userRole.role == "admin" || userRole.role == "registrar") { return; }

				usersWithAccess.push(userRole.userId);
			});

			// List of UserRole ids.
			var presenceUserRoles = [];
			workgroupStateService._state.userRoles.ids.forEach(function(userRoleId) {
				var userRole = workgroupStateService._state.userRoles.list[userRoleId];
				// Ignore userRoles from other workgroups
				if (userRole.workgroupId != workgroupStateService._state.ui.workgroupId) { return; }

				// If user does not have access, and we found the presence role, add it to the list
				if (userRole.roleId == 9 && usersWithAccess.indexOf(userRole.userId) == -1) {
					presenceUserRoles.push(userRole.id);
				}
			});

			return presenceUserRoles;
		},
		// Calculates totals for each 'role' category
		_calculateRoleTotals: function() {
			var roleIds = [];

			workgroupStateService._state.roles.ids.forEach(function(roleId) {
				var role = workgroupStateService._state.roles.list[roleId];
				roleIds.push(role.id);
			});

			var roleTotals = {};
			roleIds.forEach(function(roleId) {
				roleTotals[roleId] = 0;
			});

			workgroupStateService._state.calculatedUserRoles.forEach(function(userRole) {
				// Role 9 is 'presence' which is a special case
				// It should only be counted if displayPresence was calculated to be true, when the user has no access.
				if (userRole.roleId == 9 && userRole.displayPresence == false) { return; }

				roleTotals[userRole.roleId] += 1;
			});

			workgroupStateService.reduce({
				type: CALCULATE_ROLE_TOTALS,
				payload: {
					roleTotals: roleTotals
				}
			});
		}
	};
});