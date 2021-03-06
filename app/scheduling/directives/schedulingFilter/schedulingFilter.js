import './schedulingFilter.css';

let schedulingFilter = function (SchedulingActionCreators) {
  return {
    restrict: "E",
    template: require('./schedulingFilter.html'),
		replace: true,
    scope: {
      filters: '<',
      tags: '<',
      instructors: '<',
      locations: '<',
      schedulingMode: '<'
    },
    link: function (scope) {
      scope.dayDescriptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      scope.filterDescriptionMax = 19;

      scope.toggleCalendarDay = function (index) {
        SchedulingActionCreators.toggleDay(index);
      };

      scope.toggleTagFilter = function (tagId) {
        var tagIndex = scope.filters.enabledTagIds.indexOf(tagId);

        if (tagIndex < 0) {
          scope.filters.enabledTagIds.push(tagId);
        } else {
          scope.filters.enabledTagIds.splice(tagIndex, 1);
        }

        SchedulingActionCreators.updateTagFilters(scope.filters.enabledTagIds);
      };

      scope.toggleLocationFilter = function (locationId) {
        var locationIndex = scope.filters.enabledLocationIds.indexOf(locationId);

        if (locationIndex < 0) {
          scope.filters.enabledLocationIds.push(locationId);
        } else {
          scope.filters.enabledLocationIds.splice(locationIndex, 1);
        }

        SchedulingActionCreators.updateLocationFilters(scope.filters.enabledLocationIds);
      };

      scope.toggleInstructorFilter = function (instructorId) {
        var instructorIndex = scope.filters.enabledInstructorIds.indexOf(instructorId);

        if (instructorIndex < 0) {
          scope.filters.enabledInstructorIds.push(instructorId);
        } else {
          scope.filters.enabledInstructorIds.splice(instructorIndex, 1);
        }

        SchedulingActionCreators.updateInstructorFilters(scope.filters.enabledInstructorIds);
      };

      scope.toggleShowOnlyPrimaryActivityFilter = function() {
        SchedulingActionCreators.toggleShowOnlyPrimaryActivityFilter();
      };

      scope.isDayTab = function (tab) {
        switch (tab) {
          case "Sunday":
          case "Monday":
          case "Tuesday":
          case "Wednesday":
          case "Thursday":
          case "Friday":
          case "Saturday":
            return true;
          default:
            return false;
        }
      };
    }
  };
};

export default schedulingFilter;
