/**
 * example:
 * <seats-diff></seats-diff>
 */
reportApp.directive("seatsDiff", this.seatsDiff = function () {
	return {
		restrict: "E",
		templateUrl: 'seatsDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.updateSeats = function (sectionId, seats) {
				var section = {
					id: sectionId,
					seats: seats
				};
				reportActionCreators.updateSection(section, 'seats');
			};

			scope.addBannerToDoItem = function (sectionId, seats) {
				var section = scope.view.state.sections.list[sectionId];
				reportActionCreators.addBannerToDoItem(section, 'section', 'update', 'seats', seats);
			};
		}
	};
});
