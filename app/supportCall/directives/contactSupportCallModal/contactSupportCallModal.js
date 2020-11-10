let contactSupportCallModal = function (
  SupportCallStatusActionCreators,
  TermService
) {
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
      selectedParticipants: '<',
    },
    link: function (scope) {
      scope.supportCallConfigData = {
        // Indicates which button started this support call: 'student' or 'instructor'
        mode: scope.supportCallMode,
        selectedParticipants: scope.selectedParticipants,
        dueDate: new Date(),
        termCode: TermService.termToTermCode(scope.termShortCode, scope.year),
        initialMessage: scope.selectedParticipants[0].message,
      };

      scope.supportCallConfigData.message = `This is a follow-up reminder to please submit your preferences for ${scope.supportCallConfigData.termCode.getTermCodeDisplayName()}.`,
      scope.isFormEmpty = false;

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

      scope.isFormEmpty = function () {
        return scope.supportCallConfigData.message || scope.supportCallConfigData.message.length > 0
            ? false
            : true;
      };
    },
  };
};

export default contactSupportCallModal;
