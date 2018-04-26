let viewAvailabilityModal = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./viewAvailabilityModal.html'),
		replace: true,
		scope: {
			supportStaff: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.close = function() {
				SupportActions.closeAvailabilityModal();
				scope.isVisible = false;
			};
		} // end link
	};
};

export default viewAvailabilityModal;
