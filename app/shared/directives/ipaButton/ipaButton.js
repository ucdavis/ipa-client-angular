/** Example Usage:
<ipa-button
	button-text="'waffle'"
	color="'light'"
	icon-class="'glyphicon glyphicon-envelope'"
	on-click="testComment()">
</ipa-button>

**/

sharedApp.directive("ipaButton", this.ipaButton = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaButton.html',
		replace: true,
		scope: {
			buttonText: '<?',
			onClick: '&?',
			argument: '<?',
			isDisabled: '<?',
			hoverText: '<?',
			color: '<?',
			iconClass: '<?',
		},
		link: function(scope, element, attrs) {
			// Intentionally empty
		}
	};
});