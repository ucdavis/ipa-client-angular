import './activityLog.css';

let activityLog = function (ApiService, AuditLogService) {
  return {
    restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
    template: require('./activityLog.html'), // directive html found here:
    scope: {
      isVisible: '=',
      logData: '<',
    },
    replace: true, // Replace with the template below
    link: function (scope) {
      scope.totalItems = 0;
      scope.currentPage = 1;
      scope.itemsPerPage = 8;
      scope.pagedData = [];
      scope.startDate;
      scope.endDate;

      scope.$watchGroup(['startDate', 'endDate', 'currentPage'], function () {
        if (scope.logData && scope.logData.length > 0) {
          scope.startMax = scope.getDateOnly(scope.endDate);
          scope.endMin = scope.getDateOnly(scope.startDate);
          scope.setPageData();
        }
      });

      scope.$watch('logData', function () {
        if (scope.logData && scope.logData.length > 0) {
          scope.startDate = new Date(
            new Date(
              scope.logData[scope.logData.length - 1].createdOn
            ).toDateString()
          );
          scope.endDate = new Date(new Date().toDateString());

          scope.minDate = scope.getDateOnly(scope.startDate);
          scope.maxDate = scope.getDateOnly(scope.endDate);
          scope.startMax = scope.maxDate;
          scope.endMin = scope.minDate;
          scope.setPageData();
        }
      });

      scope.setPageData = function () {
        const startTime = new Date(scope.startDate).getTime();
        // add 1 to get end of day
        const endTime = scope.endDate.getTime() + (24 * 60 * 60 * 1000 - 1);

        const dateFilteredLogs = scope.logData?.filter((entry) => {
          return entry.createdOn > startTime && entry.createdOn < endTime;
        });

        scope.totalItems = dateFilteredLogs.length || 0;

        scope.pagedData = dateFilteredLogs?.slice(
          (scope.currentPage - 1) * scope.itemsPerPage,
          scope.currentPage * scope.itemsPerPage
        );
      };

      scope.formatMessage = function (message) {
        return message
          .replaceAll(/\*{2}(.*?)\*{2}/g, '<strong>$1</strong>')
          .split('\n');
      };

      scope.dateToString = function (date) {
        return new Date(date).toLocaleString();
      };

      scope.getDateOnly = function (date) {
        // yyyy-mm-dd
        return date.toISOString().split('T')[0];
      };

      // Modal Methods
      scope.$watch('isVisible', function () {
        // Watches for changes to isVisible to turn page scrolling on/off
        if (scope.isVisible == true) {
          scope.open();
        } else if (!scope.isVisible) {
          scope.close();
        }
      });

      // Methods
      scope.close = function () {
        // Re-enable page scrolling
        $('body').css('overflow-y', 'visible'); // eslint-disable-line no-undef

        if (scope.isVisible && angular.isUndefined(scope.onClose) == false) { // eslint-disable-line no-undef
          scope.onClose()();
        }

        scope.isVisible = false;
      };

      scope.open = function () {
        scope.isVisible = true;
        // Disables page scrolling while modal is up
        $('body').css('overflow-y', 'hidden'); // eslint-disable-line no-undef
      };

      scope.download = function () {
        const workgroupId = JSON.parse(localStorage.workgroup).id;
        const year = localStorage.year;
        const module = location.pathname.split('/')[1];
        const moduleName = AuditLogService.getFullModuleName(module);

        ApiService.postWithResponseType("/api/workgroups/" + workgroupId + "/years/" + year + "/modules/" + encodeURIComponent(moduleName) + "/auditLogs/download", '', '', 'arraybuffer')
          .then(response => {
            var url = window.URL.createObjectURL(
              new Blob([response.data], { type: 'application/vnd.ms-excel' })
            );
            var a = window.document.createElement('a'); // eslint-disable-line
            a.href = url;
            var workgroupInfo = JSON.parse(localStorage.getItem('workgroup'));
            a.download = `Audit-Log-${workgroupInfo.name}-${localStorage.getItem('year')}.xlsx`;
            window.document.body.appendChild(a); // eslint-disable-line
            a.click();
            a.remove();  //afterwards we remove the element again
          });
      };
    },
  };
};

export default activityLog;
