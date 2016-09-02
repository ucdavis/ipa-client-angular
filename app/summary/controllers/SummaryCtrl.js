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

			// $http.get("").then(function(response) {
			// 	$scope.data = response.data;
			// 	console.log($scope.data);
			// });
			$scope.events = [{
					'date': "5/12/2016",
					'time': "12:00 PM",
					'type': "school",
					'title': "Spring Quarter Started"
				}, {
					'date': "8/12/2016",
					'time': "1:42 PM",
					'type': "notice",
					'title': "Summer Session I Upload Available"
				}, {
					'date': "9/01/2016",
					'time': "9:00 AM",
					'type': "teaching_call",
					'title': "Teaching Call 2017 Started",
					'caption': "Send to Federation and Senate Instructors",
					'link': "11" // probably would be the id
				}
			];
}]);

SummaryCtrl.authenticate = function (authService, $route) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year);
}
