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
						}
					}
				});
			};

	}]);

InstructionalSupportCallStatusCtrl.getPayload = function (authService, instructionalSupportCallStatusActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportCallStatusActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};