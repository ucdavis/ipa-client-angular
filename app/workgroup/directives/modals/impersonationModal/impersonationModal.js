let impersonationModal = function (AuthService) {
	return {
		restrict: 'E',
		template: require('./impersonationModal.html'),
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope) {
      scope.selectUser = function (user) {
        scope.selectedUser = user;
      };
    
      scope.impersonate = function () {
        AuthService.impersonate(scope.selectedUser.loginId);
        scope.close();
      };
    
      scope.canBeImpersonated = function(user) {
        var canBeImpersonated = false;

        for (let userRole of user.userRoles) {
          if (userRole.role == "admin") {
            canBeImpersonated = false;
            return;
          }

          if (
            userRole.role == 'academicPlanner' ||
            userRole.role == 'studentMasters' ||
            userRole.role == 'studentPhd' ||
            userRole.role == 'instructor' ||
            userRole.role == 'instructionalSupport'
          ) {
            canBeImpersonated = true;
          }
        }

        return canBeImpersonated;
      };

      scope.close = function () {
        scope.isVisible = false;
      };
    } // end link
	};
};

export default impersonationModal;
