/**
 * Role is the frontend model of a user's role, used on the
 * Workgroup Configuration page and possibly elsewhere.
 */

angular.module('role', [])

.factory('Role', ['$http', function($http) {
	function Role(roleData) {
		if (roleData) {
			this.setData(roleData);
		}
	}
	Role.prototype = {
			setData: function(roleData) {
				angular.extend(this, roleData);
			},
			getDisplayName : function() {
				if (typeof this.name !== 'string') { return ""; }

				var lowercase = this.name.replace( /([A-Z])/g, " $1" );
				return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
			}
	};
	return Role;
}]);
