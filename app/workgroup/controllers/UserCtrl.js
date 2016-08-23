'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('UserCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', 'workgroupActionCreators', 'workgroupService',
		this.UserCtrl = function ($scope, $rootScope, $routeParams, $timeout, workgroupActionCreators, workgroupService) {
			$scope.toggleUserRole = function (userId, roleId) {
				var user = $scope.view.state.users.list[userId];
				var role = $scope.view.state.roles.list[roleId];

				if ($scope.userHasRole(userId, role)) {
					var userRoleNames = user.userRoles.map(function (userRole) { return userRole.role; });
					var userRoleIndex = userRoleNames.indexOf(role.name);
					var userRoleToBeDeleted = user.userRoles[userRoleIndex];
					workgroupActionCreators.removeRoleFromUser($scope.workgroupId, user, role, userRoleToBeDeleted);
				} else {
					workgroupActionCreators.addRoleToUser($scope.workgroupId, user, role);
				}
			};

			$scope.userHasRole = function (userId, role) {
				var user = $scope.view.state.users.list[userId];
				var userRoleNames = user.userRoles.map(function (userRole) { return userRole.role; });
				var result = userRoleNames.indexOf(role.name) > -1;
				return result;
			};

			$scope.searchUsersResultSelected = function ($item, $model, $label, $event) {
				$scope.view.state.users.newUser = $item;
				$scope.view.state.users.searchQuery = $item.name;
			};

			$scope.searchUsers = function (query) {
				return workgroupService.searchUsers($scope.workgroupId, query).then(function (userSearchResults) {
					return userSearchResults;
				}, function (err) {
					$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
				});
			};

			$scope.addUserToWorkgroup = function() {
				workgroupActionCreators.createUser($scope.workgroupId, $scope.view.state.users.newUser);
			};

			$scope.removeUserFromWorkgroup = function(userId) {
				var user = $scope.view.state.users.list[userId];
				workgroupActionCreators.removeUserFromWorkgroup($scope.workgroupId, user);
			};

	}]);