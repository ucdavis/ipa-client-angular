let sectionGroupDetails = function (CourseActionCreators) {
  return {
    restrict: 'E',
    template: require('./sectionGroupDetails.html'),
    replace: true,
    link: function (scope) {
      scope.termDropdownItems = scope.view.state.filters.enabledTerms.map(
        (enabledTerm) => {
          let year = localStorage.getItem('year');

          let termIdToTermCode = {
            1: '01',
            2: '02',
            3: '03',
            5: '05',
            6: '06',
            7: '07',
            8: '08',
            9: '09',
            10: '10',
          };

          if (enabledTerm < 4) {
            year = parseInt(year) + 1;
          }

          let termCode = year + termIdToTermCode[enabledTerm];

          return {
            id: termCode,
            description: termCode.getTermCodeDisplayName(true),
            sectionGroup: scope.view.selectedEntity,
          };
        }
      );

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
