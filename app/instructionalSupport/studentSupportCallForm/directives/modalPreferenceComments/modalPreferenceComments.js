instructionalSupportApp.directive("modalPreferenceComments", this.modalPreferenceComments = function () {
	return {
		restrict: 'E',
		templateUrl: 'modalPreferenceComments.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank

			scope.submit = function () {
				supportStaffFormActionCreators.updatePreference(scope.state.misc.scheduleId, scope.preference);

				$uibModalInstance.dismiss('cancel');
			};

			scope.dismiss = function() {
				$uibModalInstance.dismiss('cancel');
			};
		}
	};
});