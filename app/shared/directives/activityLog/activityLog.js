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
      scope.totalItems = scope.logData.length;
      scope.currentPage = 1;
      scope.itemsPerPage = 8;
      scope.pagedData = [];

      scope.$watch('currentPage', function () {
        scope.setPagingData(scope.currentPage);
      });

      scope.setPagingData = function (page) {
        scope.pagedData = scope.logData.slice(
          (page - 1) * scope.itemsPerPage,
          page * scope.itemsPerPage
        );
      };

      // Stores a copy of the last state, useful in handling unexpected termination of modal
      scope.previousIsVisible;

      scope.$watch('isVisible', function () {
        if (scope.isVisible == scope.previousIsVisible) {
          return;
        }
        // Watches for changes to isVisible to turn page scrolling on/off
        if (scope.isVisible == true) {
          scope.open();
        } else if (!scope.isVisible) {
          scope.close();
        }

        scope.previousIsVisible = angular.copy(scope.isVisible); // eslint-disable-line no-undef
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
