sharedApp.directive('dssModal', function() {
	return {
		restrict: 'E',
		templateUrl: 'dssModal.html',
		scope: {
			show: '='
		},
		replace: true, // Replace with the template below
		transclude: true, // we want to insert custom content inside the directive
		link: function(scope, element, attrs) {
			scope.dialogStyle = {};
			scope.headerText = "";

			console.log(attrs);
			console.log('taco');

			if (attrs.width) {
				scope.dialogStyle.width = attrs.width;
			}
			if (attrs.height) {
				scope.dialogStyle.height = attrs.height;
			}
			if (attrs.headerText) {
				scope.headerText = attrs.headerText;
			}
			scope.hideModal = function() {
				scope.show = false;
			};
		}
	};
});