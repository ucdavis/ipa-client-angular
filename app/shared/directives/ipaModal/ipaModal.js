let ipaModal = function() {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		template: require('./ipaModal.html'), // directive html found here:
		scope: {
			isVisible: '=',
			onClose: '&?',
			styles: '=?'
		},
		replace: true, // Replace with the template below
		transclude: true, // we want to insert custom content inside the directive
		link: function(scope, element, attrs) {
			// Validate Attributes
			scope.headerText = "";
			// Stores a copy of the last state, useful in handling unexpected termination of modal
			scope.previousIsVisible;

			if (attrs.headerText) {
				scope.headerText = attrs.headerText;
			}

			scope.$watch('isVisible',function() {
				if (scope.isVisible == scope.previousIsVisible) {
					return;
				}
				// Watches for changes to isVisible to turn page scrolling on/off
				if(scope.isVisible == true) {
					scope.open();
				} else if (!scope.isVisible) {
					scope.close();
				}

				scope.previousIsVisible = angular.copy(scope.isVisible); // eslint-disable-line no-undef
			});

			// Methods
			scope.close = function() {
				// Re-enable page scrolling
				$('body').css('overflow-y','visible');

				if (scope.isVisible && angular.isUndefined(scope.onClose) == false) { // eslint-disable-line no-undef
					scope.onClose()();
				}

				scope.isVisible = false;
			};

			scope.open = function() {
				scope.isVisible = true;
				// Disables page scrolling while modal is up
				$('body').css('overflow-y','hidden');
			};
		}
	};
};

export default ipaModal;
