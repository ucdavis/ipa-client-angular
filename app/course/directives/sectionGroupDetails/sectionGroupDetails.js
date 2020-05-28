let sectionGroupDetails = function (CourseActionCreators, Term) {
  return {
    restrict: 'E',
    template: require('./sectionGroupDetails.html'),
    replace: true,
    link: function (scope) {
      scope.termDefinitions = Object.values(
        Term.prototype.generateTable(scope.year)
      );

      scope.$on('newSectionGroupSelected', function () {
        scope.existingTermCodes = Object.values(
          scope.view.state.sectionGroups.list
        )
          .filter(
            (sectionGroup) =>
              sectionGroup.courseId == scope.view.selectedEntity.courseId
          )
          .map((sectionGroup) => sectionGroup.termCode);

        scope.showTermDropdown =
          scope.existingTermCodes.length !==
          scope.view.state.filters.enabledTerms.length;

        scope.termDropdownItems = scope.view.state.filters.enabledTerms
          .map((enabledTerm) => {
            let termCode = scope.termDefinitions.find(
              (termDefinition) => termDefinition.id === enabledTerm
            ).code;

            return {
              id: termCode,
              description: termCode.getTermCodeDisplayName(true),
              sectionGroup: scope.view.selectedEntity,
            };
          })
          .filter((item) => !scope.existingTermCodes.includes(item.id));
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

      scope.updateSectionGroup = function (sectionGroup, termCode) {
        if (termCode && sectionGroup.termCode !== termCode) {
            sectionGroup.termCode = termCode;
        }

        sectionGroup.unitsVariable ? parseFloat(sectionGroup.unitsVariable) : null;

        CourseActionCreators.updateSectionGroup(sectionGroup);
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
