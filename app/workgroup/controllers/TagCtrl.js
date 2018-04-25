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
			workgroupActionCreators.addTag($scope.workgroupId, $scope.view.state.tags.newTag);
		};

		$scope.removeTag = function (tagId) {
			workgroupActionCreators.removeTag($scope.workgroupId, $scope.view.state.tags.list[tagId]);
		};

		$scope.updateTag = function (tag) {
			workgroupActionCreators.updateTag($scope.workgroupId, tag);
		};
	}
}

TagCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'WorkgroupActionCreators'];

export default TagCtrl;
