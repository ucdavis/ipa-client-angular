/*
Example Usage:
var tabNames = ['food', 'people', 'animals'];
var activeTab = "food";

<ipa-tabs-vertical
	tab-names="tabNames"
	active-tab="activeTab">
</ipa-tabs-vertical>
*/

sharedApp.directive("ipaTabsVertical", this.ipaTabsVertical = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaTabsVertical.html',
		replace: true,
		scope: {
			tabNames: '<',
			activeTab: '<',
			selectTab: '&'
		},
		transclude: true,
		link: function (scope, element, attrs) {
			// Validate passed methods
			if (angular.isUndefined(scope.selectTab)) {
				throw {
					message: "ipaTabs: Required method selectTab was not provided."
				};
			}

			scope.triggerSelection = function(tab) {
				scope.selectTab()(tab);
			};
		}
	};
});