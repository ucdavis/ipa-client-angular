budgetApp.directive("addLineItemComments", this.addLineItemComments = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addLineItemComments.html',
		replace: true,
		scope: {
			lineItem: '<',
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
				budgetActions.createLineItemComment(scope.newComment, scope.lineItem, scope.currentUserLoginId);
				scope.newComment = "";
			};
		} // end link
	};
});
