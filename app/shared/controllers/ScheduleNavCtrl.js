sharedApp.controller('ScheduleNavCtrl', this.ScheduleNavCtrl = function(
		$scope,
		$routeParams,
		sharedService,
		siteConfig,
		termService,
		scheduleService) {

	$scope.rootUrl = siteConfig.rootUrl;
	$scope.scheduleId = $routeParams.scheduleId;
	selectedYear = sharedService.selectedYear();

	// workgroupId may be inherited from the parent scope, if not look in the route
	if (!$scope.workgroupId || $scope.workgroupId < 1) {
		$scope.workgroupId = $routeParams.workgroupId;
	}

	$scope.getActiveTerms = function() {
		$scope.activeTerms = termService.getActiveTerms();
	};
	termService.registerObserverCallback($scope.getActiveTerms, true);

	if (!selectedYear) {
		scheduleService.getScheduleSummaryById($scope.scheduleId).then( function() {
			selectedYear = sharedService.selectedYear();
			$scope.activeTerms = termService.getActiveTerms();
		});
	}

	$scope.getTermName = function(term) {
		return termService.getTermName(term);
	};

	$scope.getFullTermCode = function(term) {
		return sharedService.termYear(term, selectedYear) + term;
	};
});
