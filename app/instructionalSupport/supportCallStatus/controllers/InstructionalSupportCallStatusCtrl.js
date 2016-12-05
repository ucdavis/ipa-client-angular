/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructionalSupportCallStatusCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportAssignmentActionCreators',
		this.InstructionalSupportCallStatusCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportAssignmentActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('instructionalSupportCallStatusStateChanged', function (event, data) {
				$scope.view.state = data.state;
				console.log($scope.view.state);
			});

			$scope.openSupportCallConfig = function(supportCallMode) {

				modalInstance = $uibModal.open({
					templateUrl: 'AddSupportCallModal.html',
					controller: ModalAddSupportCallCtrl,
					size: 'lg',
					resolve: {
						supportCallMode: function () {
							return supportCallMode;
						},
						scheduleId: function () {
							return $scope.view.state.userInterface.scheduleId;
						},
						mastersIds: function () {
							return $scope.view.state.mastersIds;
						},
						phdIds: function () {
							return $scope.view.state.phdIds;
						},
						instructionalSupportIds: function () {
							return $scope.view.state.instructionalSupportIds;
						},
						instructionalSupportStaffs: function () {
							return $scope.view.state.instructionalSupportStaffs;
						},
						year: function () {
							return $scope.year;
						},
						nextYear: function () {
							return $scope.nextYear;
						}
					}
				});
			};

			$scope.getTermDescription = function(term) {
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

				return termNames[term];
			};

	}]);

InstructionalSupportCallStatusCtrl.getPayload = function (authService, instructionalSupportCallStatusActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportCallStatusActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};