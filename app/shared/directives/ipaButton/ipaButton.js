/** Example Usage:
<ipa-button
	text="'waffle'"
	color="'light'"
	icon-class="'glyphicon glyphicon-envelope'"
	on-click="testComment()">
</ipa-button>

**/

let ipaButton = function () {
	return {
		restrict: 'E',
		template: require('./ipaButton.html'),
		replace: true,
		scope: {
			onClick: '&?', // On click action
			iconClass: '<?', // Provide classes for an icon, example: 'glyphicon glyphicon-trashcan'
			isDisabled: '<?', // Boolean: activates disabled styles and deactivates click action
			disabledTooltipMessage: '<?', // Will only show if button is disabled, overrides tooltipMessage
			tooltipMessage: '<?',
			confirmMessage: '<?', // Uses a confirm tooltip with the supplied message. Will also wrap the action into the confirm
			text: '<?', // Displayed on body of button
			size: '<?', // Current options are 'slim', 'short'
			isWide: '<?', // Boolean: makes button attempt to take 100% width, default is to only take as much width as needed
			buttonClass: '<?', // Provide additional classes for context specific styling
      skin: '<?', // Options are 'light' and 'dark' (default light)
			superscript: '<?', // Superscript text displayed to the right of the icon
			iconColor: '<?'  // Accepts optional color value to override default styling
		},
		link: function(scope, element, attrs) {
			scope.calculateTooltip = function() {
				if (scope.isDisabled && scope.disabledTooltipMessage && scope.disabledTooltipMessage.length > 0) {
					return scope.disabledTooltipMessage;
				}

				return scope.tooltipMessage;
			};
		}
	};
};

export default ipaButton;