sharedApp.directive("sectionGroupDetails", this.sectionGroupDetails = function () {
	return {
		restrict: 'E',
		templateUrl: 'sectionGroupDetails.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.isLocked = function () {
				var termCode = scope.view.selectedEntity.termCode;
				var termState = scope.view.state.scheduleTermStates.list[termCode];
				return termState ? termState.isLocked : true;
			};
		}
	};
});