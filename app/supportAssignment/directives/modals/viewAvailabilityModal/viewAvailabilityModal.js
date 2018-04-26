let viewAvailabilityModal = function ($rootScope, supportActions) {
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
				supportActions.closeAvailabilityModal();
				scope.isVisible = false;
			};
		} // end link
	};
};

export default viewAvailabilityModal;
