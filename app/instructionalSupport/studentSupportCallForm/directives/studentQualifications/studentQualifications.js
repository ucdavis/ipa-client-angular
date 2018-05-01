import './studentQualifications.css';

let studentQualifications = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./studentQualifications.html'),
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateStudentQualifications = function() {
				StudentFormActions.updateStudentQualifications(scope.supportCallResponse);
			};
		}
	};
};

export default studentQualifications;
