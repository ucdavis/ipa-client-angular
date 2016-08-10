assignmentApp.controller('ModalCommentCtrl', this.ModalCommentCtrl = function($scope, $rootScope, $uibModalInstance, instructor, scheduleInstructorNote, teachingCallReceipt) {
	$scope.instructor = instructor;
	$scope.scheduleInstructorNote = scheduleInstructorNote;
	$scope.teachingCallReceipt = teachingCallReceipt;
});