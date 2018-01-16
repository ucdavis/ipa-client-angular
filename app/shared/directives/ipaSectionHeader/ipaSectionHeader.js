sharedApp.directive("ipaSectionHeader", this.ipaSectionHeader = function() {
	return {
		restrict: 'E',
		templateUrl: 'ipaSectionHeader.html',
		scope: {
			headerText: '<'
		},
		replace: true, // Replace with the template below
		transclude: true,
		link: function(scope, element, attrs) {
			/* Example Usage:
			<ipa-section-header
				header-text="supportCall.title">
			</ipa-section-header>
			*/
		}
	};
});