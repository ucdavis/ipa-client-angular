import './rolesTable.css';

let rolesTable = function ($rootScope, WorkgroupActionCreators, WorkgroupExcelService, WorkgroupService) {
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
		link: function(scope) {
			scope.view = {
				loadingPeople: false,
				noResults: false
			};

			scope.removeUserRole = function (userRole) {
				WorkgroupActionCreators.removeRoleFromUser(userRole.userId, userRole.roleId, userRole);
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
				return WorkgroupService.searchUsers(scope.ui.workgroupId, query).then(function (userSearchResults) {
					return userSearchResults;
				}, function () {
					$rootScope.$emit('toast', {message: "Could not search users.", type: "ERROR"});
				});
			};

			scope.searchUsersResultSelected = function ($item) {
				scope.users.newUser = $item;
			};

			scope.addUserToWorkgroup = function() {
				scope.users.newUser;
				WorkgroupActionCreators.createUser(scope.ui.workgroupId, scope.users.newUser, scope.activeRoleId);
				scope.clearUserSearch();
			};

			scope.download = function() {
				WorkgroupExcelService.generateDownload();
			};
		}
	};
};

export default rolesTable;
