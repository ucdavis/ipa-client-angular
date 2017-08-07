sharedApp.directive('ipaModal', function() {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		templateUrl: 'ipaModal.html', // directive html found here:
		scope: {
			isVisible: '='
		},
		replace: true, // Replace with the template below
		transclude: true, // we want to insert custom content inside the directive
		link: function(scope, element, attrs, iAttr) {
/*
			// [VALIDATE: Passed Methods]
			scope.isCloseModalSupplied = (angular.isUndefined(scope.closeModal) === false);

			if (scope.isCloseModalSupplied == false) {
				throw {
					message:	"dssModal: Required method closeModal was not passed in."
				};
			}
*/
			// [VALIDATE: Attributes]
			scope.dialogStyle = {};
			scope.headerText = "";
/*
			if (attrs.width) {
				scope.dialogStyle.width = attrs.width;
			}
			if (attrs.height) {
				scope.dialogStyle.height = attrs.height;
			}
*/
			if (attrs.headerText) {
				scope.headerText = attrs.headerText;
			}

			scope.$watch('isVisible',function() {
				// Watches for changes to isVisible to turn page scrolling on/off
				if(scope.isVisible == true) {
					scope.open();
				} else if (scope.isVisible == false) {
					scope.close();
				}
			});

			// [METHODS]
			scope.close = function() {
				// Re-enable page scrolling
				$('body').css('overflow-y','visible');
				scope.isVisible = false;
			};

			scope.open = function() {
				scope.isVisible = true;
				// Disables page scrolling while modal is up
				$('body').css('overflow-y','hidden');
			};
		}
	};
});