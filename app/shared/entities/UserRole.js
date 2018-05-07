const UserRole = angular.module('UserRole', [])
.factory('UserRole', ['$http', function($http) {
	function UserRole(userRoleData) {
		if (userRoleData) {
			this.setData(userRoleData);
		}
	}
	UserRole.prototype = {
			setData: function(userRoleData) {
				angular.extend(this, userRoleData);
			}
	};
	return UserRole;
}]);

export default UserRole;