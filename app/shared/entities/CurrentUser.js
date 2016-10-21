angular.module('currentUser', ['userRole'])
	.factory('CurrentUser', ['$http', 'UserRole', function ($http, UserRole) {
		function CurrentUser(currentUserData) {
			if (currentUserData) {
				this.setData(currentUserData);
			}
		}
		CurrentUser.prototype = {
			setData: function (currentUserData) {
				angular.extend(this, currentUserData);
			},

			setDisplayName: function (displayName) {
				this.displayName = displayName;
			},

			setUserRoles: function (userRoles) {
				this.userRoles = [];
				if (userRoles instanceof Array) {
					userRoles.forEach(function (userRole) {
						this.userRoles.push(new UserRole(userRole));
					}, this);
				}
			},

			getWorkgroups: function () {
				if (!this.userRoles) { return []; }
				return _.uniq(
					this.userRoles
						.filter(function (ur) { return ur.workgroupId > 0; })
						.map(function (ur) { return { id: ur.workgroupId, name: ur.workgroupName }; }),
					'id'
				);
			},

			getUserRolesForWorkgroupId: function (workgroupId) {
				if (!this.userRoles) { return []; }
				return this.userRoles
					.filter(function (ur) { return ur.workgroupId == workgroupId; })
					.map(function (ur) { return ur.roleName; });
			},

			isAdmin: function () {
				if (!this.userRoles) { return false; }
				return this.userRoles
					.some(function (ur) {
						return ur.roleName == "admin" && ur.workgroupId === 0;
					});
			},

			hasRole: function (roleName, workgroupId) {
				if (!this.userRoles) { return false; }
				return this.userRoles
					.some(function (userRole) {
						return userRole.roleName == roleName && userRole.workgroupId == workgroupId;
					});
			},

			hasRoles: function (roleNames, workgroupId) {
				if (roleNames instanceof Array === false) {
					$log.error("Parameter passed to hasRoles() is not valid", roleNames);
					return false;
				}
				if (!this.userRoles) { return false; }

				return this.userRoles
					.some(function (userRole) {
						return roleNames.indexOf(userRole.roleName) >= 0 && userRole.workgroupId == workgroupId;
					});
			}

		};
		return CurrentUser;
	}]);
