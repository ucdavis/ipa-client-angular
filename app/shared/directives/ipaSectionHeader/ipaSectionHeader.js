let ipaSectionHeader = function() {
	return {
		restrict: 'E',
		template: require('./ipaSectionHeader.html'),
		scope: {
			headerText: '<'
		},
		replace: true, // Replace with the template below
		transclude: true,
		link: function() {
			/* Example Usage:
			<ipa-section-header
				header-text="supportCall.title">
			</ipa-section-header>
			*/
		}
	};
};

export default ipaSectionHeader;
