/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:LocationCtrl
 * @description
 * # LocationCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('LocationCtrl', ['$scope', 'workgroupActionCreators',
		this.LocationCtrl = function ($scope, workgroupActionCreators) {
			$scope.locationValidationError = "";

			$scope.addLocation = function () {
				workgroupActionCreators.addLocation($scope.workgroupId, $scope.view.state.locations.newLocation);
			};

			$scope.removeLocation = function (locationId) {
				workgroupActionCreators.removeLocation($scope.workgroupId, $scope.view.state.locations.list[locationId]);
			};

			$scope.updateLocation = function (location) {
				workgroupActionCreators.updateLocation($scope.workgroupId, location);
			};

			$scope.isLocationFormValid = function () {
				isFormValid = true;

				// Dont attempt validation before page is initialized
				if (!$scope.view.state) {
					return false;
				}

				// Ensure name has been provided
				if (!$scope.view.state.locations.newLocation.description || $scope.view.state.locations.newLocation.description.length == 0) {
					$scope.locationValidationError = "You must provide a name for the new location";
					isFormValid = false;
				}

				// Ensure name is unique within department
				$scope.view.state.locations.ids.forEach(function(locationId) {
					var location = $scope.view.state.locations.list[locationId];

					if (location.description == $scope.view.state.locations.newLocation.description) {
						$scope.locationValidationError = "You have already used this location name";
						isFormValid = false;
					}
				});

				return isFormValid;
			};
	}]);
