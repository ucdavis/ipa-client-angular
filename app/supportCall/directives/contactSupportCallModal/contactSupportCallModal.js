let contactSupportCallModal = function (SupportCallStatusActionCreators) {
  return {
    restrict: 'E',
    template: require('./contactSupportCallModal.html'),
    replace: true,
    scope: {
      state: '<',
      isVisible: '=',
      year: '<',
      scheduleId: '<',
      workgroupId: '<',
      supportCallMode: '<',
      termShortCode: '<',
      selectedParticipants: '<'
    },
    link: function (scope) {
      scope.nextYear = parseInt(scope.year) + 1;
      scope.supportCallConfigData = {};
      scope.supportCallConfigData.selectedParticipants = scope.selectedParticipants;
      scope.supportCallConfigData.dueDate = new Date();

      // Generate termCode
      if (scope.termShortCode < 4) {
        scope.supportCallConfigData.termCode =
          scope.nextYear + scope.termShortCode;
      } else {
        scope.supportCallConfigData.termCode = scope.year + scope.termShortCode;
      }

      // Indicates which button started this support call: 'student' or 'instructor'
      scope.supportCallConfigData.initialMessage = scope.selectedParticipants[0]?.message;
      scope.supportCallConfigData.mode = scope.supportCallMode;
      scope.supportCallConfigData.message = `This is a follow-up reminder to please submit your preferences for ${scope.supportCallConfigData.termCode.getTermCodeDisplayName()}.`;
      scope.formats = [
        'MMMM dd, yyyy',
        'yyyy/MM/dd',
        'dd.MM.yyyy',
        'shortDate',
        'yyyy-MM-dd',
      ];
      scope.format = scope.formats[0];

      // Datepicker config
      scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: false,
      };

      scope.dateOptions = {
        formatYear: 'yy',
        minDate: new Date(),
        startingDay: 1,
        showWeeks: false,
        initDate: new Date(),
      };

      scope.popup1 = {};
      scope.open1 = function () {
        scope.popup1.opened = true;
      };

      scope.submit = function () {
        var messageInput = $('.support-call-message-input').val();
        if (messageInput) {
          scope.supportCallConfigData.message = messageInput.replace(
            /\r?\n/g,
            '<br />'
          );
        }

        if (scope.supportCallConfigData.mode == 'instructor') {
          SupportCallStatusActionCreators.contactInstructorsSupportCall(
            scope.scheduleId,
            scope.supportCallConfigData
          );
        } else {
          SupportCallStatusActionCreators.contactSupportStaffSupportCall(
            scope.scheduleId,
            scope.supportCallConfigData
          );
        }

        scope.close();
      };

      scope.close = function () {
        scope.isVisible = false;
      };

      scope.isFormIncomplete = function () {
        if (
          !scope.supportCallConfigData.message ||
          scope.supportCallConfigData.message.length == 0
        ) {
          return true;
        }

        return false;
      };
    },
  };
};

export default contactSupportCallModal;
