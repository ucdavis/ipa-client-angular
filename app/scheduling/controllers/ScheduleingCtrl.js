'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:SchedulingCtrl
 * @description
 * # SchedulingCtrl
 * Controller of the ipaClientAngularApp
 */
schedulingApp.controller('SchedulingCtrl', ['$scope', '$rootScope', '$routeParams', 'schedulingActionCreators',
		this.SchedulingCtrl = function ($scope, $rootScope, $routeParams, schedulingActionCreators) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termCode = $routeParams.termCode;
			$scope.view = {};

			$rootScope.$on('schedulingStateChanged', function (event, data) {
				$scope.view.state = data.state;
			});

			$scope.setSelectedSectionGroup = function (sectionGroupId) {
				var sectionGroup = $scope.view.state.sectionGroups.list[sectionGroupId];
				schedulingActionCreators.setSelectedSectionGroup(sectionGroup);
				$scope.getSectionGroupDetails(sectionGroupId);
			};

			$scope.getSectionGroupDetails = function (sectionGroupId) {
				var sectionGroup = $scope.view.state.sectionGroups.list[sectionGroupId];

				// Initialize sectionGroup sections if not done already
				if (sectionGroup && sectionGroup.sectionIds == undefined) {
					schedulingActionCreators.getSectionGroupDetails(sectionGroup);
				}
			};
		}
]);

SchedulingCtrl.getPayload = function (authService, $route, schedulingActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return schedulingActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termCode);
	});
}
