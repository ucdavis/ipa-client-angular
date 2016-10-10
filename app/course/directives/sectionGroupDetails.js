sharedApp.directive("sectionGroupDetails", this.sectionGroupDetails = function () {
	return {
		restrict: 'E',
		templateUrl: 'sectionGroupDetails.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.isLocked = function () {
				var termCode = scope.view.selectedEntity.termCode;
				var term = scope.view.state.terms.list[termCode];
				return term ? term.isLocked() : true;
			};
		}
	};
});