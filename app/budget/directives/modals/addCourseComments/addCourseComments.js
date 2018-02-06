budgetApp.directive("addCourseComments", this.addCourseComments = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addCourseComments.html',
		replace: true,
		scope: {
			sectionGroup: '<',
			currentUserLoginId: '<'
		},
		link: function (scope, element, attrs) {
			scope.newComment = "";

			scope.isFormValid = function() {
				if (scope.newComment.length > 0) {
					return true;
				}

				return false;
			};

			scope.dateToCalendar = function(date) {
				return dateToCalendar(date);
			};

			scope.dateToRelative = function(date) {
				return dateToRelative(date);
			};

			scope.submit = function() {
				budgetActions.createSectionGroupCostCommentFromSectionGroup(scope.newComment, scope.sectionGroup, scope.currentUserLoginId);
				scope.newComment = "";
			};
		} // end link
	};
});
