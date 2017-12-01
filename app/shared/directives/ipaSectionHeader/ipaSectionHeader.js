sharedApp.directive("ipaSectionHeader", this.ipaSectionHeader = function() {
	return {
		restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
		templateUrl: 'ipaSectionHeader.html', // directive html found here:
		scope: {
			headerText: '<'
		},
		replace: true, // Replace with the template below
		link: function(scope, element, attrs) {
			/* Example Usage:
			<ipa-section-header
				header-text="supportCall.title">
			</ipa-section-header>
			*/
		}
	};
});