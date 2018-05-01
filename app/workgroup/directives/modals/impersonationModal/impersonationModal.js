let impersonationModal = function (AuthService) {
	return {
		restrict: 'E',
		template: require('./impersonationModal.html'),
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {	
      scope.selectUser = function (user) {
        scope.selectedUser = user;
      };
    
      scope.impersonate = function () {
        AuthService.impersonate(scope.selectedUser.loginId);
        scope.close();
      };
    
      scope.canBeImpersonated = function(user) {
        var canBeImpersonated = false;
    
        user.userRoles.forEach( function(userRole) {
          if (userRole.role == "studentMasters"
          || userRole.role == "studentPhd"
          || userRole.role == "senateInstructor"
          || userRole.role == "federationInstructor"
          || userRole.role == "instructionalSupport") {
              canBeImpersonated = true;
            }
        });
    
        return canBeImpersonated;
      };

      scope.close = function () {
        scope.isVisible = false;
      };
    } // end link
	};
};

export default impersonationModal;
