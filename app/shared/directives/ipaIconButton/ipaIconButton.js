/** Example Usage:
<ipa-button
	button-text="'waffle'"
	color="'light'"
	icon-class="'glyphicon glyphicon-envelope'"
	on-click="testComment()">
</ipa-button>

**/

sharedApp.directive("ipaIconButton", this.ipaIconButton = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaIconButton.html',
		replace: true,
		scope: {
			onClick: '&?',
			iconClass: '<?',
			isDisabled: '<?',
			tooltipMessage: '<?',
			confirmMessage: '<?',
			buttonText: '<?',
			size: '<?'
		},
		link: function(scope, element, attrs) {
			// Intentionally empty
		}
	};
});