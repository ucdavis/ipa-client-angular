angular.module('user', [])

.factory('User', ['$http', function($http) {
	function User(userData) {
		if (userData) {
			this.setData(userData);
		}
	};
	User.prototype = {
			setData: function(userData) {
				angular.extend(this, userData);
			}
	};
	return User;
}]);
