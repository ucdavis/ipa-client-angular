class ModalCommentCtrl {
	constructor ($scope, $rootScope, $uibModalInstance, instructor, privateComment, instructorComment) {
		$scope.instructor = instructor;
		$scope.privateComment = privateComment;
		$scope.instructorComment = instructorComment;
	
		$scope.confirm = function () {
			$uibModalInstance.close($scope.privateComment);
		};
	
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}
}

ModalCommentCtrl.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'instructor', 'privateComment', 'instructorComment'];

export default ModalCommentCtrl;
