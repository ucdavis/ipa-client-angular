import './locationEditor.css';

let locationEditor = function (SchedulingActionCreators, $rootScope) {
  return {
    restrict: "E",
    template: require('./locationEditor.html'),
    scope: {
      activity: '<',
      locations: '<'
    },
    link: function (scope) {
      scope.setLocation = function (location) {
        scope.activity.locationId = location.id;
        SchedulingActionCreators.updateActivity(scope.activity);
        scope.currentLocationDescription = location.description;
      };

      scope.convertParams = function () {
        // Set initial location description display
        if (!scope.activity) { return; }

        scope.currentLocationDescription = scope.activity.locationId > 0 ? scope.locations.list[scope.activity.locationId].description : "Registrar Location";
        scope.fullLocationDescription = scope.activity.bannerLocation ? scope.activity.bannerLocation : scope.currentLocationDescription;

        if (scope.fullLocationDescription == "null null") {
          scope.fullLocationDescription = null;
        }

        // Convert location params to props
        scope.bannerLocation = [
          {id: 0, description: "Registrar Location" }
        ];

        scope.dropdownLocations = scope.locations.ids.map((locationId) => {
          return scope.locations.list[locationId];
        });

        scope.dropdownLocations = scope.bannerLocation.concat(scope.dropdownLocations);
      };

      scope.$watch("activity", function () {
        scope.convertParams();
      });

      $rootScope.$on('schedulingStateChanged', function (event, data) {
        scope.activity = data.state.activities.list[data.state.uiState.selectedActivityId];
        scope.convertParams();
      });

      scope.generateLocationStandardDescription = function () {
        if (scope.activity.bannerLocation) { return '(Registrar)'; }

        if (scope.activity.locationId) { return '(Self Assigned)'; }

        return null;
      };

      scope.convertParams();
    }
  };
};

export default locationEditor;
