let supportStaffTab = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./supportStaffTab.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.radioNames = ["Teaching Assistants", "Readers"];

			scope.setViewType = function(type) {
				SupportActions.setViewType(type);
			};
		}
	};
};

export default supportStaffTab;
