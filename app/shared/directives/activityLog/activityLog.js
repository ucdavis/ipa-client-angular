import './activityLog.css';

let activityLog = function () {
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
        scope.setPageData();
      });

      scope.$watch('logData', function () {
        if (scope.logData) {
          const firstLog = new Date(scope.logData[scope.logData.length - 1].createdOn);
          scope.startDate = new Date(firstLog.getFullYear(), firstLog.getMonth(), firstLog.getDate());
          scope.endDate = new Date();
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
    },
  };
};

export default activityLog;
