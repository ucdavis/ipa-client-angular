let instructorHeader = function ($routeParams, $rootScope, $location, $window) {
	return {
		restrict: 'E',
		template: require('./instructorHeader.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.workgroupId = $routeParams.workgroupId;
			scope.year = $routeParams.year;

			scope.localState = {};

			scope.shouldDisplayTCSubmit = function() {
				var submittedTC = $location.search().submittedTC == "true";
				// Ensure the page referrer is from the teachingCall form.
				// We want to avoid displaying the splash message in the case that the user bookmarks the url with the submitted param.
				var fromTeachingCall = $window.document.referrer && $window.document.referrer.indexOf("/teachingCalls/") > -1;

				return submittedTC && fromTeachingCall;
			};

			$rootScope.$on('summaryStateChanged', function (event, data) {
				scope.mapDataToState(data);
			});

			scope.mapDataToState = function(data) {
				scope.localState.supportReviewTerms = scope.openReviewBlobToTerms(data.schedule.instructorSupportCallReviewOpen);
				scope.localState.atLeastOneAlert = (data.ui.alert.teachingCall || data.ui.alert.supportCalls);
			};

			scope.getTermDisplayName = function(term) {
				return term.getTermDisplayName();
			};

			scope.openReviewBlobToTerms = function(openReviewBlob) {
				var terms = [];

				if (openReviewBlob == false || openReviewBlob == null) {
					return terms;
				}

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
};

export default instructorHeader;
