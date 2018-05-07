import './reviewTools.css';

let reviewTools = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./reviewTools.html'),
		replace: true,
		scope: {
			supportReview: '<',
			readOnly: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleInstructorSupportCallReview = function() {
				SupportActions.toggleInstructorSupportCallReview();
			};

			scope.toggleStudentSupportCallReview = function() {
				SupportActions.toggleStudentSupportCallReview();
			};
		}
	};
};

export default reviewTools;
