import './locationEditor.css';

let locationEditor = function (SchedulingActionCreators) {
  return {
    restrict: "E",
    template: require('./locationEditor.html'),
    scope: {
      activity: '<',
      locations: '<'
    },
    link: function (scope, element, attrs) {
      scope.setLocation = function (location) {
        scope.activity.locationId = location.id;
        SchedulingActionCreators.updateActivity(scope.activity);

        scope.currentLocationDescription = location.description;
      };

      scope.convertParams = function () {
        // Set initial location description display
        scope.currentLocationDescription = scope.activity.locationId > 0 ? scope.locations.list[scope.activity.locationId].description : (scope.activity.bannerLocation || "Location from Banner TBD");

        // Convert location params to props
        scope.bannerLocation = [
          {id: 0, description: scope.activity.bannerLocation || "Location from Banner TBD" }
        ];

        scope.dropdownLocations = scope.locations.ids.map((locationId) => {
          return scope.locations.list[locationId];
        });

        scope.dropdownLocations = scope.bannerLocation.concat(scope.dropdownLocations);
      };

      scope.convertParams();
    }
  };
};

export default locationEditor;
