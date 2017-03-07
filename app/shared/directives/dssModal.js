sharedApp.directive('dssModal', function() {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		templateUrl: 'dssModal.html', // directive html found here:
		scope: {
			closeModal: '&?' // Accepts a method closeModal, ? defines it as optional (even though it is not) to ensure its easily referenceable for validation
		},
		replace: true, // Replace with the template below
		transclude: true, // we want to insert custom content inside the directive
		link: function(scope, element, attrs, iAttr) {
			// [VALIDATE: Passed Methods]
			scope.isCloseModalSupplied = (angular.isUndefined(scope.closeModal) === false);

			if (scope.isCloseModalSupplied == false) {
				throw {
					message:	"dssModal: Required method closeModal was not passed in."
				};
			}

			// [VALIDATE: Attributes]
			scope.dialogStyle = {};
			scope.headerText = "";

			if (attrs.width) {
				scope.dialogStyle.width = attrs.width;
			}
			if (attrs.height) {
				scope.dialogStyle.height = attrs.height;
			}
			if (attrs.headerText) {
				scope.headerText = attrs.headerText;
			}

			// [DISABLE PAGE SCROLLING]
			$('body').css('overflow-y','hidden');

			// [METHODS]
			scope.close = function() {
				// Re-enable page scrolling
				$('body').css('overflow-y','visible');
				scope.closeModal();
			};
		}
	};
});