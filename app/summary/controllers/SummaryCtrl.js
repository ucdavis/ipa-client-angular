'use strict';

/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */
summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$rootScope',
		this.SummaryCtrl = function ($scope, $routeParams, $rootScope) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('summaryStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);
			});

			$rootScope.$on('sharedStateSet', function (event, data) {
				$scope.sharedState = data;

				if ($scope.sharedState.activeWorkgroup.roles.indexOf("senateInstructor") || $scope.sharedState.activeWorkgroup.roles.indexOf("federationInstructor")) {
					$scope.sharedState.isInstructor = true;
				}

				if ($scope.sharedState.activeWorkgroup.roles.indexOf("academicPlanner") ) {
					$scope.sharedState.isAcademicPlanner = true;
				}
			});

			$scope.getTermName = function(term) {
				var endingYear = "";
				if (term.length == 6) {
					endingYear = term.substring(0,4);
					term = term.slice(-2);
				}

				termNames = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};

				return termNames[term] + " " + endingYear;
			};
}]);

SummaryCtrl.authenticate = function (authService, $route, summaryActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		return summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}
