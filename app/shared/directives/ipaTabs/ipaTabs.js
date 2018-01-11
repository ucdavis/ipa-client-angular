/*
Example Usage:
var tabNames = ['food', 'people', 'animals'];
var activeTab = "food";
<ipa-tabs
	tab-names="tabNames"
	active-tab="activeTab">
</ipa-tabs>
*/

sharedApp.directive("ipaTabs", this.ipaTabs = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaTabs.html',
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