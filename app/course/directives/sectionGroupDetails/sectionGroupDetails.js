import { isNumber } from '../../../shared/helpers/types';

let sectionGroupDetails = function (CourseActionCreators, Term) {
  return {
    restrict: 'E',
    template: require('./sectionGroupDetails.html'),
    replace: true,
    link: function (scope) {
      scope.termDefinitions = Object.values(
        Term.prototype.generateTable(scope.year)
      );

      scope.$on('sectionGroupCellSelected', function () {
        scope.enabledTermCodes = scope.view.state.filters.enabledTerms.map(
          (enabledTerm) =>
            scope.termDefinitions.find(
              (termDefinition) => termDefinition.id === enabledTerm
            ).code
        );

        scope.occupiedTermCodes = Object.values(
          scope.view.state.sectionGroups.list
        )
          .filter(
            (sectionGroup) =>
              sectionGroup.courseId === scope.view.selectedEntity.courseId &&
              scope.enabledTermCodes.includes(sectionGroup.termCode)
          )
          .map((sectionGroup) => sectionGroup.termCode);

        scope.showTermDropdown = scope.enabledTermCodes.length > scope.occupiedTermCodes.length;

        if (scope.showTermDropdown) {
          scope.termDropdownItems = scope.enabledTermCodes
            .filter((termCode) => !scope.occupiedTermCodes.includes(termCode))
            .map((termCode) => ({
              id: termCode,
              description: termCode.getTermCodeDisplayName(true),
              sectionGroup: scope.view.selectedEntity,
            }))
            .sort((a, b) => a.id - b.id);
        }
      });

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

        CourseActionCreators.createSection(section);
      };

      scope.toggleMoveCourseModal = function (sectionGroup, termCode) {
        CourseActionCreators.toggleMoveCourseModal(sectionGroup, termCode);
      };

      scope.updateSection = function (section) {
        let sectionGroup = scope.view.state.sectionGroups.list[section.sectionGroupId];
        let proposedSections = sectionGroup.sections.map(section => scope.view.state.sections.list[section.id]);
        let proposedSectionSeatTotal = sectionGroup.sections.reduce((acc, section) => parseInt(scope.view.state.sections.list[section.id].seats) + acc, 0);

        // check to see if other sections need updating due to previous overflow
        let outOfSyncSections = sectionGroup.sectionIds.reduce((acc, sectionId) => {
          let proposedSectionSeats = parseInt(scope.view.state.sections.list[sectionId].seats);
          let originalSectionSeats = parseInt(sectionGroup.sections.find(section => section.id === sectionId).seats);

          return Number(proposedSectionSeats !== originalSectionSeats) + acc;
        }, 0);

        // sync with sectionGroup if single numeric section
        if (proposedSections.length === 1 && isNumber(section.sequenceNumber)) {
          sectionGroup.plannedSeats = section.seats;
          CourseActionCreators.updateSectionGroup(sectionGroup);
        }

        if (sectionGroup.plannedSeats >= proposedSectionSeatTotal) {
          if (outOfSyncSections === 1) {
            CourseActionCreators.updateSection(section);
          } else {
            CourseActionCreators.updateSections(proposedSections, sectionGroup);
          }
        }
      };

      scope.updateSectionGroup = function (sectionGroup, termCode) {
        sectionGroup.unitsVariable ? parseFloat(sectionGroup.unitsVariable) : null;

        CourseActionCreators.updateSectionGroup(sectionGroup, termCode);
      };

      scope.removeSectionGroup = function (sectionGroup) {
        CourseActionCreators.removeSectionGroup(sectionGroup);
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

      scope.isSeries = function () {
        let selectedEntity = scope.view.selectedEntity;
        let course = scope.view.state.courses.list[selectedEntity.courseId];
        return course.isSeries();
      };
    }
  };
};

export default sectionGroupDetails;
