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
			selectedTab: '<'
		},
		link: function (scope, element, attrs) {
			// Left blank on purpose
		}
	};
});