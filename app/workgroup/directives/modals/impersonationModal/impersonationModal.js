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
      scope.filteredUsersList = Object.values(scope.state.users.list);

      scope.selectUser = function (user) {
        scope.selectedUser = user;
      };
    
      scope.impersonate = function () {
        AuthService.impersonate(scope.selectedUser.loginId);
        scope.close();
      };

      scope.filterList = function (searchQuery) {
        if (searchQuery.length == 0) {
          scope.filteredUsersList = Object.values(scope.state.users.list);
        }

        if (searchQuery.length >= 1) {
          var options = {
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            includeScore: false,
            keys: [
              "displayName", "email"
            ]
          };
        }
        var fuse = new Fuse(Object.values(scope.state.users.list), options); // eslint-disable-line no-undef
        var results = fuse.search(searchQuery);

        scope.filteredUsersList = results;
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
