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
			}
		};
		return CurrentUser;
	}]);
