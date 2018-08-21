import './addCourseComments.css';

let addCourseComments = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./addCourseComments.html'),
		replace: true,
		scope: {
			sectionGroupCost: '<',
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
				BudgetActions.createSectionGroupCostCommentFromSectionGroup(scope.newComment, scope.sectionGroupCost, scope.currentUserLoginId);
				scope.newComment = "";
			};
		} // end link
	};
};

export default addCourseComments;
