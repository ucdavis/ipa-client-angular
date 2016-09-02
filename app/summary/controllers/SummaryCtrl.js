'use strict';

/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */
summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$http',
		this.SummaryCtrl = function ($scope, $routeParams, $http) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;

			$http.get("https://beta.dw.dss.ucdavis.edu/terms?token=dssit").then(function(response) {
				$scope.data = response.data;

				// Only grab from this year
				$scope.filtered = $scope.data.filter(function(term) {
					var currentYear = new Date();
					currentYear = currentYear.getFullYear() * 100;

					// Only return for the current year and ignore term code 04
					return (term.code >= currentYear && term.code != (currentYear + 4));
				})

				$scope.events = [];

				var j = 0;
				for (var i = 0; i < $scope.filtered.length; i++) {
					var startDate = new Date($scope.filtered[i].beginDate);
					var endDate = new Date($scope.filtered[i].endDate);

					if ($scope.filtered[i].beginDate < Date.now()) {
						$scope.events[j] = {
							'longtime': startDate,
							'date': startDate.toLocaleDateString(),
							'time': startDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
							'title': $scope.filtered[i].code.getTermCodeDisplayName() + " Start",
							'type': "school"
						};

						j++;
					}

					if ($scope.filtered[i].endDate < Date.now()) {
						$scope.events[j] = {
							'date': endDate.toLocaleDateString(),
							'time': endDate.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
							'title': $scope.filtered[i].code.getTermCodeDisplayName() + " End",
							'type': "school"
						}

						j++;

					}
				}

				// Sort from most recent to least recent
				$scope.events.sort(function(a,b) {
				  return new Date(b.date).getTime() - new Date(a.date).getTime();
				});
			});
}]);

SummaryCtrl.authenticate = function (authService, $route, summaryActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}
