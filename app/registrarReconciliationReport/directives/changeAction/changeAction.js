/**
 * example:
 * <change-action
 *	title="Planned Seats don't match"
 *	sis-value-message="Apply banner maximum enrollment to IPA"
 *	ipa-value-message="Apply IPA maximum enrollment to Banner"
 *	apply-sis="methodToApplyBannerValueToIpa()"
 *	apply-ipa="methodToApplyIpaValueToBanner()"
 *	hide-ipa-message="true"
 * ></change-action>
 */
let changeAction = function () {
	return {
		restrict: "E",
		template: require('./changeAction.html'),
		replace: true,
		scope: {
			title: '@',
			sisValueMessage: '@',
			ipaValueMessage: '@',
			applySis: '&',
			applyIpa: '&',
			isActive: '='
		},
		link: function (scope, element, attrs) {
			scope.hideSisMessage = attrs.hideSisMessage == 'true';
			scope.hideIpaMessage = attrs.hideIpaMessage == 'true';
		}
	};
};

export default changeAction;
