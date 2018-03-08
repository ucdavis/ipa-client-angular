/**
 * @ngdoc service
 * @name workgroupApp.workgroupStateService
 * @description
 * # workgroupStateService
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
workgroupApp.service('workgroupStateService', function ($rootScope, Role, Tag, Location, User, UserRole) {
	return {
		_state: {},
		_tagReducers: function (action, tags) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					tags = {
						newTag: {},
						ids: []
					};
					var tagsList = {};
					var length = action.payload.tags ? action.payload.tags.length : 0;
					for (var i = 0; i < length; i++) {
						var tagData = action.payload.tags[i];
						if (tagData.archived === false) {
							tagsList[tagData.id] = new Tag(tagData);
						}
					}
					tags.ids = _array_sortIdsByProperty(tagsList, "name");
					tags.list = tagsList;
					return tags;
				case ADD_TAG:
					tags.list[action.payload.tag.id] = action.payload.tag;
					tags.ids.push(action.payload.tag.id);
					tags.newTag = {};
					return tags;
				case REMOVE_TAG:
					var tagIndex = tags.ids.indexOf(action.payload.tag.id);
					tags.ids.splice(tagIndex, 1);
					delete tags.list[action.payload.tag.id];
					return tags;
				case UPDATE_TAG:
					tags.list[action.payload.tag.id] = action.payload.tag;
					return tags;
				default:
					return tags;
			}
		},
		_locationReducers: function (action, locations) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					locations = {
						newLocation: {},
						ids: []
					};
					var locationsList = {};
					var length = action.payload.locations ? action.payload.locations.length : 0;

					for (var i = 0; i < length; i++) {
						var locationData = action.payload.locations[i];

						if (locationData.archived === false) {
							locationsList[locationData.id] = new Location(locationData);
						}
					}
					locations.ids = _array_sortIdsByProperty(locationsList, "description");
					locations.list = locationsList;
					return locations;
				case ADD_LOCATION:
					locations.list[action.payload.location.id] = action.payload.location;
					locations.ids.push(action.payload.location.id);
					locations.newLocation = {};
					return locations;
				case REMOVE_LOCATION:
					var locationIndex = locations.ids.indexOf(action.payload.location.id);
					locations.ids.splice(locationIndex, 1);
					delete locations.list[action.payload.location.id];
					return locations;
				case UPDATE_LOCATION:
					locations.list[action.payload.location.id] = action.payload.location;
					return locations;
				default:
					return locations;
			}
		},
		_userRoleReducers: function (action, userRoles) {
			switch (action.type) {
				case INIT_WORKGROUP:
					userRoles = {
						ids: [],
						list: {}
					};

					action.payload.users.forEach(function(user) {
						user.userRoles.forEach(function(userRole) {
							userRoles.ids.push(userRole.id);
							userRoles.list[userRole.id] = userRole;
						});
					});
					return userRoles;
				default:
					return userRoles;
			}
		},
		_userReducers: function (action, users) {
			var scope = this;
			var userIndex;

			switch (action.type) {
				case INIT_WORKGROUP:
					users = {
						newUser: {},
						ids: [],
						userSearchResults: [],
						searchQuery: "",
						list: {}
					};
					var usersList = {};
					var length = action.payload.users ? action.payload.users.length : 0;
					for (var i = 0; i < length; i++) {
						var userData = action.payload.users[i];
						usersList[userData.id] = new User(userData);
					}
					users.ids = _array_sortIdsByProperty(usersList, "name");
					users.list = usersList;
					return users;
				case ADD_USER_COMPLETED:
					userIndex = users.ids.indexOf(action.payload.user.id);
					if (userIndex >= 0) { return users; }

					users.list[action.payload.user.id] = action.payload.user;
					users.ids.push(action.payload.user.id);
					users.newUser = {};
					users.userSearchResults = [];
					users.searchQuery = "";
					return users;
				case REMOVE_USER:
					userIndex = users.ids.indexOf(action.payload.user.id);
					users.ids.splice(userIndex, 1);
					delete users.list[action.payload.user.id];
					return users;
				case ADD_USER_ROLE:
					users.list[action.payload.user.id].userRoles.push(action.payload.userRole);

					// Uncheck other mutually exclusive roles if any
					var exclusiveRoles = ["federationInstructor", "senateInstructor"];
					var exclusiveIndex = exclusiveRoles.indexOf(action.payload.userRole.role);
					if (exclusiveIndex >= 0) {
						exclusiveRoles.splice(exclusiveIndex, 1);
						users.list[action.payload.user.id].userRoles = users.list[action.payload.user.id].userRoles
							.filter(function (ur) {
								return exclusiveRoles.indexOf(ur.role) < 0;
							});
					}

					return users;
				case REMOVE_USER_ROLE:
					var userRoleIndex = users.list[action.payload.user.id].userRoles.indexOf(action.payload.userRole);
					users.list[action.payload.user.id].userRoles.splice(userRoleIndex, 1);
					return users;
				case SEARCH_USERS:
					users.userSearchResults = action.payload.userSearchResults;
					return users;
				default:
					return users;
			}
		},
		_roleReducers: function (action, roles) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					roles = {
						ids: []
					};
					var _hiddenRoles = ['admin', 'registrar', 'presence'];
					var rolesList = {};
					var length = action.payload.roles ? action.payload.roles.length : 0;

					for (var i = 0; i < length; i++) {
						var roleData = action.payload.roles[i];
						if (_hiddenRoles.indexOf(roleData.name) < 0) {
							rolesList[roleData.id] = new Role(roleData);
						}
					}
					roles.ids = _array_sortIdsByProperty(rolesList, "name");
					roles.list = rolesList;
					return roles;
				default:
					return roles;
			}
		},
		_calculatedUserRoleReducers: function (action, calculatedUserRoles) {
			var scope = this;
			
			switch (action.type) {
				case INIT_WORKGROUP:
					return [];
				case CALCULATE_USER_ROLES:
					return action.payload.calculatedUserRoles;
				default:
					return calculatedUserRoles;
			}
		},

		_uiReducers: function (action, ui) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					ui = {
						addUserPending: false,
						roles: {
							activeRoleTab: "Academic Planner",
							activeRoleId: 2,
							allTabs: [
								"Academic Planner",
								"Presence",
								"Instructor",
								"Reviewer",
								"Instructional Support",
								"Student Masters",
								"Student PhD"],
						}
					};
					return ui;
				case SET_ROLE_TAB:
					ui.roles.activeRoleTab = action.payload.activeRoleTab;
					ui.roles.activeRoleId = action.payload.activeRoleId;
					return ui;
				case ADD_USER_PENDING:
					ui.addUserPending = true;
					return ui;
				case ADD_USER_COMPLETED:
					ui.addUserPending = false;
					return ui;
				default:
					return ui;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.locations = scope._locationReducers(action, scope._state.locations);
			newState.users = scope._userReducers(action, scope._state.users);
			newState.roles = scope._roleReducers(action, scope._state.roles);
			newState.ui = scope._uiReducers(action, scope._state.ui);
			newState.userRoles = scope._userRoleReducers(action, scope._state.userRoles);
			newState.calculatedUserRoles = scope._calculatedUserRoleReducers(action, scope._state.calculatedUserRoles);

			scope._state = newState;
			$rootScope.$emit('workgroupStateChanged', scope._state);
		}
	};
});