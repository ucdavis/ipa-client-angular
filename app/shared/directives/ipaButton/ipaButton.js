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
			onClick: '&?', // On click action
			iconClass: '<?', // Provide classes for an icon, example: 'glyphicon glyphicon-trashcan'
			isDisabled: '<?', // Boolean: activates disabled styles and deactivates click action
			tooltipMessage: '<?',
			confirmMessage: '<?', // Uses a confirm tooltip with the supplied message. Will also wrap the action into the confirm
			text: '<?', // Displayed on body of button
			size: '<?',
			isWide: '<?', // Boolean: makes button attempt to take 100% width, default is to only take as much width as needed
			buttonClass: '<?', // Provide additional classes for context specific styling
			skin: '<?' // Default: 'light', planned skins are dark/light/red
		},
		link: function(scope, element, attrs) {
			// Intentionally empty
		}
	};
});