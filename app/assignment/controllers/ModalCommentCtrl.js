assignmentApp.controller('ModalCommentCtrl', this.ModalCommentCtrl = function($scope, $rootScope, $uibModalInstance, instructor, privateComment, instructorComment) {
	$scope.instructor = instructor;
	$scope.privateComment = privateComment;
	$scope.instructorComment = instructorComment;

	$scope.confirm = function () {
		$uibModalInstance.close($scope.privateComment);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

});