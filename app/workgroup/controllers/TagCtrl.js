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

		$scope.isNewTagValid = function () {
			if (!$scope.view.state) { return true; }

			var newTag = $scope.view.state.tags.newTag;

			if (!newTag.name) { return false; }

			var isNewTagUnique = true;

			$scope.view.state.tags.ids.forEach(function(tagId) {
				var tag = $scope.view.state.tags.list[tagId];

				if (tag.name == newTag.name) { isNewTagUnique = false; }
			});

			return isNewTagUnique;
		};
	}
}

TagCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'WorkgroupActionCreators'];

export default TagCtrl;
