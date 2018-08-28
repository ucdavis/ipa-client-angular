import './modalPreferenceComments.css';

let modalPreferenceComments = function ($rootScope, StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./modalPreferenceComments.html'),
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.preference = scope.state.ui.modalPreference;

			scope.submitForm = function () {
				StudentFormActions.updatePreferenceComment(scope.state.misc.scheduleId, scope.state.ui.modalPreference);
			};

			scope.close = function() {
				scope.isVisible = false;
				StudentFormActions.closePreferenceCommentsModal();
			};
		} // end link
	};
};

export default modalPreferenceComments;
