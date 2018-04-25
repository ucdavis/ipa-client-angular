let rolesTable = function ($rootScope, WorkgroupActionCreators, WorkgroupService) {
	return {
		restrict: 'E',
		template: require('./rolesTable.html'),
		replace: true,
		scope: {
			userRoles: '<',
			activeRoleId: '<',
			users: '<',
			ui: '<'
		},
		link: function(scope, element, attrs) {
			scope.view = {
				loadingPeople: false,
				noResults: false
			};

			scope.removeUserRole = function (userRole) {
				workgroupActionCreators.removeRoleFromUser(userRole.userId, userRole.roleId, userRole);
			};

			scope.clearUserSearch = function () {
				scope.users.newUser = {};
				scope.users.searchQuery = "";
				scope.view.noResults = false;
			};

			scope.searchOnChange = function () {
				scope.view.noResults = false;
				scope.users.newUser = {};
			};

			scope.searchUsers = function (query) {
				return workgroupService.searchUsers(scope.ui.workgroupId, query).then(function (userSearchResults) {
					return userSearchResults;
				}, function (err) {
					$rootScope.$emit('toast', {message: "Could not search users.", type: "ERROR"});
				});
			};

			scope.searchUsersResultSelected = function ($item, $model, $label, $event) {
				scope.users.newUser = $item;
			};

			scope.addUserToWorkgroup = function() {
				scope.users.newUser;
				workgroupActionCreators.createUser(scope.ui.workgroupId, scope.users.newUser, scope.activeRoleId);
				scope.clearUserSearch();
			};
		}
	};
};

export default rolesTable;
