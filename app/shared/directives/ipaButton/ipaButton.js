/** Example Usage:
<ipa-button
	text="'waffle'"
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
			onClick: '&?',
			iconClass: '<?',
			isDisabled: '<?',
			tooltipMessage: '<?',
			confirmMessage: '<?',
			text: '<?',
			size: '<?',
			isWide: '<?',
			buttonClass: '<?'
		},
		link: function(scope, element, attrs) {
			// Intentionally empty
		}
	};
});