/**
 * example:
 * <seats-diff></seats-diff>
 */
registrarReconciliationReportApp.directive("seatsDiff", this.seatsDiff = function (reportActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'seatsDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.updateSeats = function (seats) {
				var section = {
					id: scope.section.id,
					seats: seats
				};
				reportActionCreators.updateSection(section, 'seats');
			};
		}
	};
});
