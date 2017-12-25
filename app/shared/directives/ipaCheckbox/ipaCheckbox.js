/* Example Usage:
<ipa-checkbox
	is-checked="supportCall.commentsRequired"
	is-disabled="true"
	click-action="toggleThing()">
</ipa-checkbox>
*/
sharedApp.directive("ipaCheckbox", this.ipaCheckbox = function() {
	return {
		restrict: 'E',
		templateUrl: 'ipaCheckbox.html', // directive html found here:
		scope: {
			isChecked: '=',
			clickAction: '&?',
			isDisabled: '<?'
		},
		replace: true, // Replace with the template below
		link: function(scope, element, attrs) {
			scope.onClick = function() {
				scope.clickAction();
			};
		}
	};
});