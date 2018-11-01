import './studentFormDetail.css';

/**
 * Provides the main course table in the Courses View
 */
let studentFormDetail = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./studentFormDetail.html'),
		replace: true,
		scope: {
			studentSupportCallResponses: '='
		},
		link: function (scope, element, attrs) {
			// do nothing
		}
	};
};

export default studentFormDetail;
