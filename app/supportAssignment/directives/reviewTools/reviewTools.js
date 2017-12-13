supportAssignmentApp.directive("reviewTools", this.reviewTools = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'reviewTools.html',
		replace: true,
		scope: {
			supportReview: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleInstructorSupportReview = function() {
				supportActions.toggleInstructorSupportReview();
			};

			scope.toggleStudentSupportReview = function() {
				supportActions.toggleStudentSupportReview();
			};
		}
	};
});
