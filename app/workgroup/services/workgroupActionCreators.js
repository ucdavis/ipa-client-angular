/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
class WorkgroupActionCreators {
	constructor (WorkgroupStateService, WorkgroupService, $rootScope, Role, Roles, ActionTypes) {
		var self = this;
		this.WorkgroupStateService = WorkgroupStateService;
		this.WorkgroupService = WorkgroupService;
		this.$rootScope = $rootScope;
		this.Role = Role;
		this.Roles = Roles;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId) {
				var self = this;
	
				WorkgroupService.getWorkgroupByCode(workgroupId).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_WORKGROUP,
						payload: payload,
						workgroupId: workgroupId
					};
					WorkgroupStateService.reduce(action);
					self._calculateUserRoles();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load workgroup initial state.", type: "ERROR" });
				});
			},
			setInstructorType: function (instructorType, userRole) {
				var self = this;
	
				userRole.instructorTypeId = instructorType.id;
	
				WorkgroupService.setInstructorType(userRole).then(function (newUserRole) {
					$rootScope.$emit('toast', { message: "Updated instructor type", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_USER_ROLE,
						payload: {
							userRole: newUserRole
						}
					};
					WorkgroupStateService.reduce(action);
					self._calculateUserRoles();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update instructor type", type: "ERROR" });
				});
			},
			addTag: function (workgroupId, tag) {
				WorkgroupService.addTag(workgroupId, tag).then(function (newTag) {
					$rootScope.$emit('toast', { message: "Created tag " + newTag.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_TAG,
						payload: {
							tag: newTag
						}
					};
					WorkgroupStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Not could create tag.", type: "ERROR" });
				});
			},
			updateTag: function (workgroupId, tag) {
				WorkgroupService.updateTag(workgroupId, tag).then(function (newTag) {
					$rootScope.$emit('toast', { message: "Updated tag " + newTag.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TAG,
						payload: {
							tag: newTag
						}
					};
					WorkgroupStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update tag.", type: "ERROR" });
				});
			},
			removeTag: function (workgroupId, tag) {
				WorkgroupService.removeTag(workgroupId, tag).then(function () {
					$rootScope.$emit('toast', { message: "Removed tag " + tag.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_TAG,
						payload: {
							tag: tag
						}
					};
					WorkgroupStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not remove tag.", type: "ERROR" });
				});
			},
			addLocation: function (workgroupId, location) {
				WorkgroupService.addLocation(workgroupId, location).then(function (newLocation) {
					$rootScope.$emit('toast', { message: "Created location " + newLocation.description, type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_LOCATION,
						payload: {
							location: newLocation
						}
					};
					WorkgroupStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create location.", type: "ERROR" });
				});
			},
			updateLocation: function (workgroupId, location) {
				WorkgroupService.updateLocation(workgroupId, location).then(function (newLocation) {
					$rootScope.$emit('toast', { message: "Renamed location to " + newLocation.description, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_LOCATION,
						payload: {
							location: newLocation
						}
					};
					WorkgroupStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not rename location.", type: "ERROR" });
				});
			},
			removeLocation: function (workgroupId, location) {
				WorkgroupService.removeLocation(workgroupId, location).then(function (newLocation) {
					$rootScope.$emit('toast', { message: "Removed location " + location.description, type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_LOCATION,
						payload: {
							location: location
						}
					};
					WorkgroupStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not remove location.", type: "ERROR" });
				});
			},
			updateStudentRole: function (userRole) {
				var self = this;
	
				WorkgroupService.updateUserRole(userRole).then(function (newUserRole) {
					$rootScope.$emit('toast', { message: "Updated student role", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_USER_ROLE,
						payload: {
							userRole: newUserRole
						}
					};
					WorkgroupStateService.reduce(action);
					self._calculateUserRoles();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update student role", type: "ERROR" });
				});
			},
			addRoleToUser: function (workgroupId, user, role) {
				var self = this;
	
				WorkgroupService.addRoleToUser(workgroupId, user, role).then(function (userRole) {
					$rootScope.$emit('toast', { message: user.firstName + " " + user.lastName + " is now " + role.getDisplayName(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_USER_ROLE,
						payload: {
							user: user,
							userRole: userRole,
						}
					};
					WorkgroupStateService.reduce(action);
					self._calculateUserRoles();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not add role for user.", type: "ERROR" });
				});
			},
			removeRoleFromUser: function (userId, roleId, userRoleToBeDeleted) {
				var self = this;
				var user = WorkgroupStateService._state.users.list[userId];
				var role = WorkgroupStateService._state.roles.list[roleId];
				var workgroupId = WorkgroupStateService._state.ui.workgroupId;
	
				WorkgroupService.removeRoleFromUser(workgroupId, user, role).then(function (userRole) {
					$rootScope.$emit('toast', { message: user.firstName + " " + user.lastName + " is no longer " + role.getDisplayName(), type: "SUCCESS" });
	
					WorkgroupStateService.reduce({
						type: ActionTypes.REMOVE_USER_ROLE,
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
					type: ActionTypes.SEARCH_USERS,
					payload: {
						userSearchResults: []
					}
				};
				WorkgroupStateService.reduce(action);
			},
			createUser: function (workgroupId, dwUser, roleId) {
				var self = this;
				var role = new Role({ name: WorkgroupStateService._state.roles.list[roleId].name });
	
				var existingUser = this._userPresent(dwUser);
				if (!existingUser) {
					WorkgroupStateService.reduce({
						type: ActionTypes.ADD_USER_PENDING,
						payload: {}
					});
	
					WorkgroupService.createUser(workgroupId, dwUser).then(function (newUser) {
						var action = {
							type: ActionTypes.ADD_USER_COMPLETED,
							payload: {
								user: newUser
							}
						};
						WorkgroupStateService.reduce(action);
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
				WorkgroupStateService._state.users.ids.forEach(function(userId) {
					var slotUser = WorkgroupStateService._state.users.list[userId];
					if (slotUser.loginId == user.loginId && slotUser.email == user.email) {
						userPresent = slotUser;
					}
				});
	
				return userPresent;
			},
			setRoleTab: function(tabName) {
				WorkgroupStateService.reduce({
					type: ActionTypes.SET_ROLE_TAB,
					payload: {
						activeRoleTab: tabName,
						activeRoleTabDisplay: tabName == "Presence" ? "Unassigned" : tabName,
						activeRoleId: this._getRoleIdFromTabName(tabName)
					}
				});
			},
			// Will return the roleId, or -1 for student (as it does not match a specific roleId, but will be expected to match 11,12 or 13 for masters, phd, instructional support)
			_getRoleIdFromTabName: function(tabName) {
				tabNameRoleIds = {
					"Academic Planner": Roles.academicPlanner,
					"Instructor": Roles.instructor,
					"Reviewer": Roles.reviewer,
					"Student": -1,
					"Presence": Roles.presence,
				};
	
				return tabNameRoleIds[tabName];
			},
			_calculateUserRoles: function () {
				var self = this;
	
				var userRolesWithPresence = this._calculateUserRolesWithPresence();
				var calculatedUserRoles = [];
	
				WorkgroupStateService._state.userRoles.ids.forEach(function(userRoleId) {
					var userRole = WorkgroupStateService._state.userRoles.list[userRoleId];
	
					if (userRole.role == 'admin' || userRole.role == 'registrar') {
						return;
					}
	
					var displayPresence = (userRolesWithPresence.indexOf(userRole.id) > -1);
					var newUserRole = self._generateUserRole(userRole, displayPresence);
	
					calculatedUserRoles.push(newUserRole);
				});
	
				calculatedUserRoles = _array_sortByProperty(calculatedUserRoles, "userDisplayName");
	
				WorkgroupStateService.reduce({
					type: ActionTypes.CALCULATE_USER_ROLES,
					payload: {
						calculatedUserRoles: calculatedUserRoles
					}
				});
	
				this._calculateRoleTotals();
			},
			_generateUserRole: function (userRole, shouldDisplayPresence) {
				var user = WorkgroupStateService._state.users.list[userRole.userId];
				var role = null;
	
				WorkgroupStateService._state.roles.ids.forEach(function(roleId) {
					var slotRole = WorkgroupStateService._state.roles.list[roleId];
	
					if (slotRole.name == userRole.role) {
						role = slotRole;
					}
				});
	
				var instructorTypeDescription = userRole.instructorTypeId > 0 ? WorkgroupStateService._state.instructorTypes.list[userRole.instructorTypeId].description : null;
	
				return {
					id: userRole.id,
					role: userRole.role,
					roleDisplay: role.name,
					description: getRoleDisplayName(userRole.role),
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
	
				WorkgroupStateService._state.userRoles.ids.forEach(function(userRoleId) {
					var userRole = WorkgroupStateService._state.userRoles.list[userRoleId];
					// Ignore userRoles from other workgroups
					if (userRole.workgroupId != WorkgroupStateService._state.ui.workgroupId) { return; }
	
					// Ignore presence, admin and registrar roles as these roles are not displayed in the UI
					if (userRole.role == "presence" || userRole.role == "admin" || userRole.role == "registrar") { return; }
	
					usersWithAccess.push(userRole.userId);
				});
	
				// List of UserRole ids.
				var presenceUserRoles = [];
				WorkgroupStateService._state.userRoles.ids.forEach(function(userRoleId) {
					var userRole = WorkgroupStateService._state.userRoles.list[userRoleId];
					// Ignore userRoles from other workgroups
					if (userRole.workgroupId != WorkgroupStateService._state.ui.workgroupId) { return; }
	
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
	
				WorkgroupStateService._state.roles.ids.forEach(function(roleId) {
					var role = WorkgroupStateService._state.roles.list[roleId];
					roleIds.push(role.id);
				});
	
				var roleTotals = {};
				roleIds.forEach(function(roleId) {
					roleTotals[roleId] = 0;
				});
	
				WorkgroupStateService._state.calculatedUserRoles.forEach(function(userRole) {
					// Role 9 is 'presence' which is a special case
					// It should only be counted if displayPresence was calculated to be true, when the user has no access.
					if (userRole.roleId == 9 && userRole.displayPresence == false) { return; }
	
					roleTotals[userRole.roleId] += 1;
				});
	
				WorkgroupStateService.reduce({
					type: ActionTypes.CALCULATE_ROLE_TOTALS,
					payload: {
						roleTotals: roleTotals
					}
				});
			}
		};
	}
}

WorkgroupActionCreators.$inject = ['WorkgroupStateService', 'WorkgroupService', '$rootScope', 'Role', 'Roles', 'ActionTypes'];

export default WorkgroupActionCreators;
