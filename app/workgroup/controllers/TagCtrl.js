'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:TagCtrl
 * @description
 * # TagCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('TagCtrl', ['$scope', '$rootScope', '$routeParams', 'workgroupActionCreators',
		this.TagCtrl = function ($scope, $rootScope, $routeParams, workgroupActionCreators) {

			$scope.addTag = function () {
				workgroupActionCreators.addTag($scope.workgroupId, $scope.view.state.tags.newTag);
			};

			$scope.removeTag = function (tagId) {
				workgroupActionCreators.removeTag($scope.workgroupId, $scope.view.state.tags.list[tagId]);
			};

			$scope.updateTag = function (tag) {
				workgroupActionCreators.updateTag($scope.workgroupId, tag);
			};

	}]);