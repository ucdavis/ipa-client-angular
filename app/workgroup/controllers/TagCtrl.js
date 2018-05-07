/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:TagCtrl
 * @description
 * # TagCtrl
 * Controller of the ipaClientAngularApp
 */
class TagCtrl {
	constructor ($scope, $rootScope, $routeParams, WorkgroupActionCreators) {
		$scope.addTag = function () {
			WorkgroupActionCreators.addTag($scope.workgroupId, $scope.view.state.tags.newTag);
		};

		$scope.removeTag = function (tagId) {
			WorkgroupActionCreators.removeTag($scope.workgroupId, $scope.view.state.tags.list[tagId]);
		};

		$scope.updateTag = function (tag) {
			WorkgroupActionCreators.updateTag($scope.workgroupId, tag);
		};
	}
}

TagCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'WorkgroupActionCreators'];

export default TagCtrl;
