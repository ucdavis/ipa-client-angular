/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('TeachingCallStatusCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$uibModal', 'assignmentActionCreators', 'assignmentService',
		this.TeachingCallStatusCtrl = function ($scope, $rootScope, $window, $routeParams, $uibModal, assignmentActionCreators, assignmentService) {
			$window.document.title = "Teaching Call Status";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
				$scope.prepareTeachingCallStatusPage();
			});

			// Launches TeachingCall Config modal and controller
			$scope.openTeachingCallConfig = function() {
				modalInstance = $uibModal.open({
					templateUrl: 'ModalTeachingCallConfig.html',
					controller: ModalTeachingCallConfigCtrl,
					size: 'lg',
					resolve: {
						scheduleYear: function () {
							return $scope.year;
						},
						workgroupId: function () {
							return $scope.workgroupId;
						},
						viewState: function () {
							return $scope.view.state;
						},
						allTerms: function () {
							return assignmentService.allTerms();
						}
					}
				});

				modalInstance.result.then(function (teachingCallConfig) {
					$scope.startTeachingCall($scope.workgroupId, $scope.year, teachingCallConfig);
				});
			};

			// Triggered on TeachingCall Config submission
			$scope.startTeachingCall = function(workgroupId, year, teachingCallConfig) {
				teachingCallConfig.termsBlob = "";
				var allTerms = ['01','02','03','04','05','06','07','08','09','10'];

				for (var i = 0; i < allTerms.length; i++) {
					if (teachingCallConfig.activeTerms[allTerms[i]] === true) {
						teachingCallConfig.termsBlob += "1";
					} else {
						teachingCallConfig.termsBlob += "0";
					}
				}

				delete teachingCallConfig.activeTerms;

				assignmentActionCreators.createTeachingCall(workgroupId, year, teachingCallConfig);
			};

			$scope.prepareTeachingCallStatusPage = function () {
				var allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
				var chronologicallyOrderedTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
				var termNames = {
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

				// Build each teachingCall

				for (var i = 0; i < $scope.view.state.teachingCalls.ids.length; i++) {
					var teachingCall = $scope.view.state.teachingCalls.list[$scope.view.state.teachingCalls.ids[i]];

					teachingCall.terms = [];

					// Decode termsBlob into two digit terms (example: '02', '04')
					var decodedTermsBlob = $scope.termsBlobToTerms(teachingCall.termsBlob);

					// Ensure terms are properly ordered
					var orderedTermNames = [];

					chronologicallyOrderedTerms.forEach(function (chronologicallyOrderedTerm) {
						if (decodedTermsBlob.indexOf(chronologicallyOrderedTerm) > -1) {
							orderedTermNames.push(termNames[chronologicallyOrderedTerm]);
						}
					});

					teachingCall.terms = orderedTermNames;
				}
			};

			$scope.toFullDate = function (shortDate) {
				return shortDate.toFullDate();
			};

			// Decode termsBlob into two digit terms (example: '02', '04')
			$scope.termsBlobToTerms = function (termsBlob) {
				var decodedTermsBlob = [];
				for (var j = 0; j < termsBlob.length; j++) {
					var isTermInTeachingCall = parseInt(termsBlob.charAt(j));

					if (isTermInTeachingCall) {
						term = j + 1;
						term = term.toString();
						if (term.toString().length == 1) {
							term = "0" + term;
						}

						decodedTermsBlob.push(term);
					}
				}
				return decodedTermsBlob;
			};
	}]);

TeachingCallStatusCtrl.validate = function (authService, assignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};