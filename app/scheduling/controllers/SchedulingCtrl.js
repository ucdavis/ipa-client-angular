/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:SchedulingCtrl
 * @description
 * # SchedulingCtrl
 * Controller of the ipaClientAngularApp
 */
schedulingApp.controller('SchedulingCtrl', ['$scope', '$rootScope', '$routeParams', 'Activity', 'Term', 'schedulingActionCreators', 'authService',
	this.SchedulingCtrl = function ($scope, $rootScope, $routeParams, Activity, Term, schedulingActionCreators, authService) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.termShortCode = $routeParams.termShortCode;
		$scope.view = {
			addSharedActivityPopoverIsOpen: {},
			addActivityPopoverIsOpen: {}
		};

		$scope.days = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
		// Meeting codes in the order of popularity
		$scope.allActivityTypes = ['V', 'D', 'A', 'I', 'C', 'T', 'J', 'B', 'E', 'H', 'O', 'G', '8', 'S', 'F', '2', 'X', 'L', '9', 'Y', '0', '1', '3', 'K', '%', 'W', '6', 'U', 'Q', 'R', 'P', '7', 'Z'];
		$scope.standardPatterns = Activity.prototype.getStandardTimes();

		$rootScope.$on('schedulingStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});

		$scope.setSelectedSectionGroup = function (sectionGroupId) {
			var sectionGroup = $scope.view.state.sectionGroups.list[sectionGroupId];
			schedulingActionCreators.setSelectedSectionGroup(sectionGroup);
			$scope.getSectionGroupDetails(sectionGroupId);
		};

		$scope.toggleCheckedSectionGroup = function (sectionGroupId) {
			schedulingActionCreators.toggleCheckedSectionGroup(sectionGroupId);
			$scope.getSectionGroupDetails(sectionGroupId);
		};

		$scope.setSelectedActivity = function (activityId) {
			var activity = $scope.view.state.activities.list[activityId];
			schedulingActionCreators.setSelectedActivity(activity);
		};

		$scope.getSectionGroupDetails = function (sectionGroupId) {
			var sectionGroup = $scope.view.state.sectionGroups.list[sectionGroupId];
			var course = $scope.view.state.courses.list[sectionGroup.courseId];

			// Initialize sectionGroup sections if not done already
			if (sectionGroup && sectionGroup.sectionIds === undefined) {
				schedulingActionCreators.getSectionGroupDetails(sectionGroup);
			}

			// Initialize course activity types if not done already
			if (course && course.activityTypes === undefined) {
				schedulingActionCreators.getCourseActivityTypes(course);
			}
		};

		$scope.getMeridianTime = function (time) {
			time = Activity.prototype.getMeridianTime(time);
			return ('0' + time.hours).slice(-2) + ':' + ('0' + time.minutes).slice(-2) + ' ' + time.meridian;
		};

		$scope.toggleCalendarDay = function (index) {
			schedulingActionCreators.toggleDay(index);
		};

		$scope.toggleTagFilter = function (tagId) {
			var tagFilters = $scope.view.state.filters.enabledTagIds;
			var tagIndex = tagFilters.indexOf(tagId);

			if (tagIndex < 0) {
				tagFilters.push(tagId);
			} else {
				tagFilters.splice(tagIndex, 1);
			}

			schedulingActionCreators.updateTagFilters(tagFilters);
		};

		$scope.toggleLocationFilter = function (locationId) {
			var locationFilters = $scope.view.state.filters.enabledLocationIds;
			var locationIndex = locationFilters.indexOf(locationId);

			if (locationIndex < 0) {
				locationFilters.push(locationId);
			} else {
				locationFilters.splice(locationIndex, 1);
			}

			schedulingActionCreators.updateLocationFilters(locationFilters);
		};

		$scope.setLocation = function (locationId) {
			if (!$scope.view.state.uiState.selectedActivityId) { return; }
			var activity = $scope.view.state.activities.list[$scope.view.state.uiState.selectedActivityId];
			activity.locationId = locationId;
			$scope.saveActivity();
		};

		$scope.toggleActivityDay = function (index) {
			var activity = $scope.view.state.activities.list[$scope.view.state.uiState.selectedActivityId];
			var dayArr = activity.dayIndicator.split('');
			dayArr[index] = Math.abs(1 - parseInt(dayArr[index])).toString();
			activity.dayIndicator = dayArr.join('');
			$scope.saveActivity();
		};

		$scope.setActivityStandardTime = function (time) {
			var activity = $scope.view.state.activities.list[$scope.view.state.uiState.selectedActivityId];
			activity.frequency = 1;
			activity.startTime = time.start;
			activity.endTime = time.end;
			$scope.saveActivity();
		};

		$scope.saveActivity = function () {
			var activity = $scope.view.state.activities.list[$scope.view.state.uiState.selectedActivityId];
			schedulingActionCreators.updateActivity(activity);
		};

		$scope.removeActivity = function (activity) {
			schedulingActionCreators.removeActivity(activity);
		};

		$scope.createSharedActivity = function (activityCode, sectionGroup) {
			schedulingActionCreators.createSharedActivity(activityCode, sectionGroup);
			$scope.view.addSharedActivityPopoverIsOpen[sectionGroup.id] = false;
		};

		$scope.createActivity = function (activityCode, sectionId, sectionGroup) {
			schedulingActionCreators.createActivity(activityCode, sectionId, sectionGroup);
			$scope.view.addActivityPopoverIsOpen[sectionId] = false;
		};

		$scope.closeActivityDetails = function () {
			schedulingActionCreators.setSelectedActivity();
		};

		$scope.toggleCheckAll = function () {
			var sectionGroupIdsToCheck = $scope.view.state.sectionGroups.ids.filter(function (sgId) {
				return $scope.matchesFilters($scope.view.state.sectionGroups.list[sgId]);
			});
			schedulingActionCreators.toggleCheckAll(sectionGroupIdsToCheck);

			// Initialize all sectionGroup sections if not done already
			if ($scope.view.state.uiState.allSectionGroupsDetailsCached === false) {
				schedulingActionCreators.getAllSectionGroupDetails(
					$scope.workgroupId, $scope.year, $scope.view.state.uiState.term.termCode);
			}
		};

		$scope.isLocked = function () {
			if (!$scope.view.state) { return true; }
			var term = $scope.view.state.uiState.term;
			var hasAuthorizedRole = $scope.sharedState.currentUser.isAdmin() ||
				$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);
			// Return true if the term is locked or the user has not write access
			return term ? term.isLocked() || !(hasAuthorizedRole) : true;
		};

		$scope.matchesFilters = function (sectionGroup) {
			var satisfiesTagFilters = (
				$scope.view.state.filters.enabledTagIds.length === 0 ||
				$scope.view.state.courses.list[sectionGroup.courseId].matchesTagFilters
			);

			var satisfiesLocationFilters = (
				$scope.view.state.filters.enabledLocationIds.length === 0 ||
				matchesLocationFilters(sectionGroup)
			);

			return satisfiesTagFilters && satisfiesLocationFilters;
		};

		var matchesLocationFilters = function (sectionGroup) {
			var sectionGroupLocationIds = $scope.view.state.activities.ids
				.filter(function (activityId) {
					return $scope.view.state.activities.list[activityId].sectionGroupId == sectionGroup.id;
				}).map(function (activityId) {
					return $scope.view.state.activities.list[activityId].locationId;
				});

			return $scope.view.state.filters.enabledLocationIds.some(function (locationId) {
				return sectionGroupLocationIds.indexOf(locationId) >= 0;
			});
		};
	}
]);

SchedulingCtrl.getPayload = function (authService, $route, Term, schedulingActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		var term = Term.prototype.getTermByTermShortCodeAndYear($route.current.params.termShortCode, $route.current.params.year);
		return schedulingActionCreators.getInitialState(
			$route.current.params.workgroupId,
			$route.current.params.year,
			term.code);
	});
};
