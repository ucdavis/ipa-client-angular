import './schedulingFilter.css';

let schedulingFilter = function (SchedulingActionCreators) {
  return {
    restrict: "E",
    template: require('./schedulingFilter.html'),
    scope: {
      filters: '<',
      tags: '<',
      instructors: '<',
      locations: '<'
    },
    link: function (scope, element, attrs) {
      scope.dayDescriptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      scope.toggleCalendarDay = function (index) {
        SchedulingActionCreators.toggleDay(index);
      };
    }
  };
};

export default schedulingFilter;
