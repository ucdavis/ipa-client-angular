summaryApp.directive("instructorHeader", this.instructorHeader = function ($routeParams, $rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'instructorHeader.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.workgroupId = $routeParams.workgroupId;
			scope.year = $routeParams.year;

			scope.localState = {};

			$rootScope.$on('summaryStateChanged', function (event, data) {
				scope.mapDataToState(data);
			});

			scope.mapDataToState = function(data) {
				scope.localState.supportReviewTerms = scope.openReviewBlobToTerms(data.schedule.instructorSupportCallReviewOpen);
			};

			scope.getTermDisplayName = function(term) {
				return term.getTermDisplayName();
			};

			scope.openReviewBlobToTerms = function(openReviewBlob) {
				var terms = [];

				for (var i = 0; i < openReviewBlob.length; i++) {
					if (openReviewBlob[i] == "1") {
						var term = String(i + 1);

						if (term.length == 1) {
							term = "0" + term;
						}

						terms.push(term);
					}
				}

				return terms;
			};

			if (scope.state) {
				scope.mapDataToState(scope.state);
			}
		}
	};
});