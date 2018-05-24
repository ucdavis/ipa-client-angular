/* Example Usage:
<ipa-checkbox
	is-checked="supportCall.commentsRequired"
	is-disabled="true"
	click-action="toggleThing()">
</ipa-checkbox>
*/
let ipaCheckbox = function() {
	return {
		restrict: 'E',
		template: require('./ipaCheckbox.html'), // directive html found here:
		scope: {
			isChecked: '=',
			clickAction: '&?',
			isDisabled: '<?',
			style: '<?' // Options are muted and default (black)
		},
		replace: true, // Replace with the template below
		link: function(scope, element, attrs) {
			scope.onClick = function() {
				if (angular.isUndefined(scope.clickAction)) { return; }

				scope.clickAction();
			};
		}
	};
};

export default ipaCheckbox;
