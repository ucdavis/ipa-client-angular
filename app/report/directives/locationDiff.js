/**
 * example:
 * <location-diff></location-diff>
 */
reportApp.directive("locationDiff", this.locationDiff = function(reportActionCreators) {
    return {
        restrict: "E",
        templateUrl: 'locationDiff.html',
        replace: true
    };
});
