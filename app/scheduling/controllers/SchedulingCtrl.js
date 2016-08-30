'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:SchedulingCtrl
 * @description
 * # SchedulingCtrl
 * Controller of the ipaClientAngularApp
 */
schedulingApp.controller('SchedulingCtrl', ['$scope', '$rootScope', '$routeParams', 'Activity', 'Term', 'schedulingActionCreators',
		this.SchedulingCtrl = function ($scope, $rootScope, $routeParams, Activity, Term, schedulingActionCreators) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termShortCode = $routeParams.termShortCode;
			$scope.term = Term.prototype.getTermByTermShortCodeAndYear($scope.termShortCode, $scope.year);
			$scope.view = {};

			$scope.days = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
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

				// Initialize sectionGroup sections if not done already
				if (sectionGroup && sectionGroup.sectionIds == undefined) {
					schedulingActionCreators.getSectionGroupDetails(sectionGroup);
				}
			};

			$scope.getWeekDays = function(dayIndicator, dayIndicators) {
				var dayArr = dayIndicator.split('');

				var dayStr = '';
				angular.forEach(dayArr, function(day, i) {
					if (day === '1') dayStr = dayStr + $scope.days[i];
				});

				return dayStr;
			};

			$scope.getMeridianTime = function (time) {
				var time = Activity.prototype.getMeridianTime(time);
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

			$scope.clearLocation = function () {
				var activity = $scope.view.state.activities.list[$scope.view.state.uiState.selectedActivityId];
				activity.locationId = 0;
				$scope.saveActivity();
			};

			$scope.toggleActivityDay = function(index) {
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

			$scope.createSharedActivity = function (sharedActivity, sectionGroup) {
				schedulingActionCreators.createSharedActivity(sharedActivity, sectionGroup);
			};

			$scope.createActivity = function (activity, sectionGroup) {
				schedulingActionCreators.createActivity(activity, sectionGroup);
			};
		}
]);

SchedulingCtrl.getPayload = function (authService, $route, Term, schedulingActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		var term = Term.prototype.getTermByTermShortCodeAndYear($route.current.params.termShortCode, $route.current.params.year);
		return schedulingActionCreators.getInitialState(
			$route.current.params.workgroupId,
			$route.current.params.year,
			term.code);
	});
}
