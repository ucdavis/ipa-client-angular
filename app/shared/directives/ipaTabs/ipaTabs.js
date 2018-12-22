/*
Example Usage:
var tabNames = ['food', 'people', 'animals'];
var activeTab = "food";
<ipa-tabs
	tab-names="tabNames"
	active-tab="activeTab">
</ipa-tabs>
*/

let ipaTabs = function () {
	return {
		restrict: 'E',
		template: require('./ipaTabs.html'),
		replace: true,
		scope: {
			tabNames: '<',
			activeTab: '<',
			tabOverrides: '<?', // Can provide a hash with tab names and their override values, example: {"Presence" : "Unassigned", "Teachers" : "Instructor People"}
			selectTab: '&',
			slim: '<?',
			containerClass: '<?', // Can provide classes to transclusion container
			borderLess: '<?' // Removes borders from the container
		},
		transclude: true,
		link: function (scope) {
			// Validate passed methods
			if (angular.isUndefined(scope.selectTab)) { // eslint-disable-line no-undef
				throw {
					message: "ipaTabs: Required method selectTab was not provided."
				};
			}

			scope.triggerSelection = function(tab) {
				scope.selectTab()(tab);
			};
		}
	};
};

export default ipaTabs;
