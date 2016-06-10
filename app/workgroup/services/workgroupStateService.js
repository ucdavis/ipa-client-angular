'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupStateService
 * @description
 * # workgroupStateService
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
workgroupApp.service('workgroupStateService', function ($rootScope) {
	return {
		_state: {},
		_tagReducers: function (action, tags) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					var tagsList = {};
					var length = tags.list ? tags.list.length : 0;
					for (var i = 0; i < length; i++) {
						var tag = tags.list[i];
						tagsList[tag.id] = tag;
						tags.ids.push(tag.id);
					}
					tags.list = tagsList;
					return tags;
				case ADD_TAG:
					tags.list[action.payload.tag.id] = action.payload.tag;
					tags.ids.push(action.payload.tag.id);
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
					var locationsList = {};
					var length = locations.list ? locations.list.length : 0;
					for (var i = 0; i < length; i++) {
						var location = locations.list[i];
						locationsList[location.id] = location;
						locations.ids.push(location.id);
					}
					locations.list = locationsList;
					return locations;
				case ADD_LOCATION:
					locations.list[action.payload.location.id] = action.payload.location;
					locations.ids.push(action.payload.location.id);
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
		_userReducers: function (action, users) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					var usersList = {};
					var length = users.list ? users.list.length : 0;
					for (var i = 0; i < length; i++) {
						var user = users.list[i];
						usersList[user.id] = user;
						users.ids.push(user.id);
					}
					users.list = usersList;
					return users;
				case ADD_USER:
					users.list[action.payload.user.id] = action.payload.user;
					users.ids.push(action.payload.user.id);
					return users;
				case REMOVE_USER:
					var userIndex = users.ids.indexOf(action.payload.user.id);
					users.ids.splice(userIndex, 1);
					delete users.list[action.payload.user.id];
					return users;
				case UPDATE_USER:
					users.list[action.payload.user.id] = action.payload.user;
					return users;
				default:
					return users;
			}
		},
		_userRoleReducers: function (action, userRoles) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					var userRolesList = {};
					var length = userRoles.list ? userRoles.list.length : 0;
					for (var i = 0; i < length; i++) {
						var userRole = userRoles.list[i];
						userRolesList[userRole.id] = userRole;
						userRoles.ids.push(userRole.id);
					}
					userRoles.list = userRolesList;
					return userRoles;
				case ADD_USER_ROLE:
					userRoles.list[action.payload.userRole.id] = action.payload.userRole;
					userRoles.ids.push(action.payload.userRole.id);
					return userRoles;
				case REMOVE_USER_ROLE:
					var userRoleIndex = userRoles.ids.indexOf(action.payload.userRole.id);
					userRoles.ids.splice(userRoleIndex, 1);
					delete userRoles.list[action.payload.userRole.id];
					return userRoles;
				case UPDATE_USER_ROLE:
					userRoles.list[action.payload.userRole.id] = action.payload.userRole;
					return userRoles;
				default:
					return userRoles;
			}
		},
		_roleReducers: function (action, roles) {
			var scope = this;

			switch (action.type) {
				case INIT_WORKGROUP:
					var rolesList = {};
					var length = roles.list ? roles.list.length : 0;
					for (var i = 0; i < length; i++) {
						var role = roles.list[i];
						rolesList[role.id] = role;
						roles.ids.push(role.id);
					}
					roles.list = rolesList;
					return roles;
				default:
					return roles;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			if (action.type == INIT_WORKGROUP) {
				scope._state.tags = {
					ids: [],
					list: action.payload.tags
				};
				scope._state.locations = {
					ids: [],
					list: action.payload.locations
				};
				scope._state.users = {
					ids: [],
					list: action.payload.users
				};
				scope._state.userRoles = {
					ids: [],
					list: action.payload.userRoles
				};
				scope._state.roles = {
					ids: [],
					list: action.payload.roles
				};
			}

			scope._state.tags = scope._tagReducers(action, scope._state.tags);
			scope._state.locations = scope._locationReducers(action, scope._state.locations);
			scope._state.users = scope._userReducers(action, scope._state.users);
			scope._state.userRoles = scope._userRoleReducers(action, scope._state.userRoles);
			scope._state.roles = scope._roleReducers(action, scope._state.roles);
			console.log(scope._state);

			$rootScope.$emit('workgroupStateChanged',scope._state);
		}
	}
});