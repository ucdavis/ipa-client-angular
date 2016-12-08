sharedApp.directive("sectionGroupDetails", this.sectionGroupDetails = function (courseActionCreators, $rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'sectionGroupDetails.html',
		replace: true,
		link: function (scope, element, attrs) {

			$rootScope.$on('courseStateChanged', function (event, data) {
				if (typeof scope.view.selectedEntity == "undefined") {
					throw "sectionGroupDetails is trying to render with an undefined 'selectedEntity', action: " + data.action.type;
				}

				var course = scope.view.state.courses.list[scope.view.selectedEntity.courseId];
				if (data.action.type == "ADD_SECTION_GROUP" && !course.isSeries()) {
					// If the sectionGroup is new and it is numeric, create its only section by default with the seats filled in to the max
					scope.addSection(scope.view.selectedEntity.plannedSeats);
				}
			});

			scope.isLocked = function () {
				var termCode = scope.view.selectedEntity.termCode;
				var term = scope.view.state.terms.list[termCode];
				return term ? term.isLocked() || scope.view.state.uiState.tableLocked : true;
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
});