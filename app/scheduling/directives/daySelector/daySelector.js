import './daySelector.css';

let daySelector = function ($rootScope, SchedulingActionCreators) {
  return {
    restrict: 'E',
    template: require('./daySelector.html'),
    scope: {
      calendarMode: '<',
      selectedDay: '<',
    },
    replace: true,
    link: function (scope, element, attrs) {
      scope.view = {};
      scope.days = [
        { number: 0, description: "Sunday"},
        { number: 1, description: "Monday"},
        { number: 2, description: "Tuesday"},
        { number: 3, description: "Wednesday"},
        { number: 4, description: "Thursday"},
        { number: 5, description: "Friday"},
        { number: 6, description: "Saturday"},
      ];

      scope.setDepartmentalRoomsDay = function(day) {
        SchedulingActionCreators.setDepartmentalRoomsDay(day);
      };
    }
  };
};

export default daySelector;
