'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:LocationCtrl
 * @description
 * # LocationCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('LocationCtrl', ['$scope', 'workgroupActionCreators',
		this.LocationCtrl = function ($scope, workgroupActionCreators) {
			$scope.addLocation = function () {
				workgroupActionCreators.addLocation($scope.workgroupCode, $scope.view.state.locations.newLocation);
			};

			$scope.removeLocation = function (locationId) {
				workgroupActionCreators.removeLocation($scope.workgroupCode, {id: locationId});
			};

			$scope.updateLocation = function (location) {
				workgroupActionCreators.updateLocation($scope.workgroupCode, location);
			};
	}]);