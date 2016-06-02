sharedApp.controller('NavCtrl', this.NavCtrl = function(
		$scope,
		$window,
		ngNotify
		// workgroupService,
		// sharedService,
		// userService,
		) {

	$scope.isImpersonating = userService.isImpersonating();
	$scope.waitingForImpersonating = false;
	$scope.loadingUsers = false;

	// Retrieve the data passed by the JSP from the JAVA controller
	// $scope.activeWorkgroup = userService.getActiveWorkgroup();
	// $scope.currentUser = userService.getCurrentUser();

	// Check if user is admin
	// $scope.isAdmin = userService.isAdmin();
	// $scope.isRegistrar = userService.isRegistrar();
	// $scope.isCoordinator = function(workgroup) {
	// 	return userService.isCoordinator(workgroup);
	// }

	$scope.meridiem = moment().format('a');
	$scope.thisYear = moment().year();

	// Collecting user workgroups
	$scope.workgroups = [];
	// workgroupService.getUserWorkgroups($scope.currentUser.id).then(function(data){
	// 	$scope.workgroups = data;
	// }, function(data) {
	// 	ngNotify.set("Error retrieving user's workgroups from server", "danger");
	// });

	// $scope.isSelectedYear = function(year) {
	// 	return year == sharedService.selectedYear();
	// };

	// $scope.searchUsers = function(query) {
	// 	return userService.searchIPAUsers(query).then(function(users) {
	// 		return users.map(function(user) {
	// 			user.description = user.firstName + ' ' + user.lastName + ' (' + user.loginId + ')';
	// 			return user;
	// 		});
	// 	}, function(data) {
	// 		ngNotify.set("Error querying users from server", "danger");
	// 	});
	// };

	// $scope.impersonate = function(item, model, label) {
	// 	// Show the user that something is happening while we $window.location.href them.
	// 	$scope.waitingForImpersonating = true;

	// 	userService.impersonate(item.loginId).then(function() {
	// 		$scope.navigateTo("/summary");
	// 	});
	// };

	// $scope.unImpersonate = function () {
	// 	userService.unImpersonate().then(function(data) {
	// 		$scope.navigateTo("/summary");
	// 	});
	// };

	$scope.navigateTo = function(url) {
		$window.location.href = $scope.rootUrl + url;
	};

});
