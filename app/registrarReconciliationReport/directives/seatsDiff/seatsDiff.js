/**
 * example:
 * <seats-diff></seats-diff>
 */
let seatsDiff = function (RegistrarReconciliationReportActionCreators) {
	return {
		restrict: "E",
		template: require('./seatsDiff.html'),
		replace: true,
		link: function (scope) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.updateSeats = function (seats) {
				var section = {
					id: scope.section.id,
					seats: seats
				};
				RegistrarReconciliationReportActionCreators.updateSection(section, 'seats', scope.section.uniqueKey);
			};
		}
	};
};

export default seatsDiff;
