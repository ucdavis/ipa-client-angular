let sectionGroupDetails = function (courseActionCreators, $rootScope) {
	return {
		restrict: 'E',
		template: require('./sectionGroupDetails.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.isLocked = function () {
				return scope.view.state.uiState.tableLocked;
			};

			scope.addSection = function (seats) {
				var sequenceNumber = scope.nextSequence();
				var sectionGroupId = scope.view.selectedEntity.id;
				var section = {
					sectionGroupId: sectionGroupId,
					sequenceNumber: sequenceNumber,
					seats: seats
				};

				courseActionCreators.createSection(section);
			};

			scope.removeSectionGroup = function (sectionGroup) {
				courseActionCreators.removeSectionGroup(sectionGroup);
			};

			/**
			 * For a given sectionGroup this returns the next sequence number if applicable.
			 * Possible cases:
			 * Numeric:
			 * - no section -> the parent course sequencePattern
			 * - section exists -> null
			 * Alpha:
			 * - no sections -> the parent course sequencePattern + 01
			 * - sections exists -> increments the last section
			 */
			scope.nextSequence = function () {
				var sg = scope.view.selectedEntity;
				// SectionGroup does not exist...
				if (!(sg.id && sg.sectionIds)) { return null; }

				var course = scope.view.state.courses.list[sg.courseId];
				if (course.isSeries() === false) {
					// Numeric sections: return sequencePattern iff no sections exist
					if (sg.sectionIds.length > 0) { return null; }
					else { return course.sequencePattern; }
				} if (sg.sectionIds.length > 0) {
					// Calculate next section sequence if sections already exist
					var lstSectionId = sg.sectionIds[sg.sectionIds.length - 1];
					var lastSection = scope.view.state.sections.list[lstSectionId];
					var number = ("0" + (parseInt(lastSection.sequenceNumber.slice(-2)) + 1)).slice(-2);
					return course.sequencePattern + number;
				} else {
					// Default to 'X01' for the first section
					return course.sequencePattern + "01";
				}
			};

		}
	};
};

export default sectionGroupDetails;
