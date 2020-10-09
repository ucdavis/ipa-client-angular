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
      scope.logData = [
        {
          id: 1,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60.',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 2,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 2',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 3,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 3',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 4,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 4',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 5,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 5',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 6,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 6',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 7,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 7',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 8,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 8',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 9,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 9',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 10,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 10',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
        {
          id: 11,
          message: 'Fei Li in Courses: Changed ECS 60 Section A Fall Quarter seats to 60. 11',
          userName: 'John Doe',
          timestamp: '10/8/2020',
        },
      ];

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
