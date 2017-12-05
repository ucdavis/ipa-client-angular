/** Example Usage:
<ipa-button
	button-text="'waffle'"
	color="'light'"
	icon-class="'glyphicon glyphicon-envelope'"
	on-click="testComment()">
</ipa-button>

**/

sharedApp.directive("priorityButton", this.ipaButton = function () {
	return {
		restrict: 'E',
		templateUrl: 'priorityButton.html',
		replace: true,
		scope: {
			onClick: '&?',
			iconClass: '<?'
		},
		link: function(scope, element, attrs) {
			// Intentionally empty
		}
	};
});