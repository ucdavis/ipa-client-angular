import './addLineItemComments.css';

let addLineItemComments = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./addLineItemComments.html'),
		replace: true,
		scope: {
			lineItem: '<',
			currentUserLoginId: '<'
		},
		link: function (scope) {
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
				BudgetActions.createLineItemComment(scope.newComment, scope.lineItem, scope.currentUserLoginId);
				scope.newComment = "";
			};
		} // end link
	};
};

export default addLineItemComments;
