/**
 * Role is the frontend model of a user's role, used on the
 * Workgroup Configuration page and possibly elsewhere.
 */

  // eslint-disable-next-line no-undef
const Role = angular.module('Role', [])

.factory('Role', ['$http', function($http) {
	function Role(roleData) {
		if (roleData) {
			this.setData(roleData);
		}
	}
	Role.prototype = {
			setData: function(roleData) {
				angular.extend(this, roleData); // eslint-disable-line no-undef
			},
			getDisplayName : function() {
				if (typeof this.name !== 'string') { return ""; }

				if (this.name == "studentPhd") {
					return "Student PhD";
				}

				var lowercase = this.name.replace( /([A-Z])/g, " $1" );
				return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
			}
	};
	return Role;
}]);

export default Role;