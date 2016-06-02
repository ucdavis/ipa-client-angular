sharedApp.controller('ModalAddUnscheduledCourseCtrl', this.ModalAddUnscheduledCourseCtrl = function(
		$scope,
		$rootScope,
		$uibModalInstance,
		termService,
		courseService,
		term,
		hiddenCourses) {

	$scope.newCourseData = null;
	$scope.term = term;

	$scope.getTermName = function(term) {
		return termService.getTermName(term);
	};

	$scope.clearSearch = function() {
		noResults = false;
		if ($scope.newCourseData != null) {
			$scope.newCourse = null;
			$scope.newCourseData = null;
		}

	};

	$scope.searchCourses = function(query) {
		return courseService.searchCourses(query, hiddenCourses);
	};

	$scope.setCourse = function(item, model, label) {
		$scope.newCourseData = item;
	};

	$scope.ok = function () {
		$uibModalInstance.close($scope.newCourseData);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.isFormIncomplete = function() {
		if ($scope.newCourseData == null) {
			return true;
		}
		return false;
	};

});