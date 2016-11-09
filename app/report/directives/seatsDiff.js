/**
 * example:
 * <seats-diff></seats-diff>
 */
reportApp.directive("seatsDiff", this.seatsDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'seatsDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.updateSeats = function (sectionId, seats) {
				var section = {
					id: sectionId,
					seats: seats
				};
				reportActionCreators.updateSection(section, 'seats');
			};

			scope.addBannerToDoItem = function (sectionId, seats) {
				var section = scope.view.state.sections.list[sectionId];
				reportActionCreators.addBannerToDoItem(section, UPDATE, 'seats', seats);
			};
		}
	};
});
