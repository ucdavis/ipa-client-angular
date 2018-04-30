let contactModal = function (SupportCallStatusActionCreators) {
	return {
		restrict: 'E',
		template: require('./contactModal.html'),
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
      // blank
    }
	};
};

export default contactModal;
