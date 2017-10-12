courseApp.directive("assignTagTooltip", this.assignTagTooltip = function ($rootScope) {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		templateUrl: 'assignTagTooltip.html',
		replace: true, // Replace with the template below
		scope: {
			isVisible: '='
		},
		link: function(scope, element, attrs) {
			// Empty intentionally
		}
	};
});