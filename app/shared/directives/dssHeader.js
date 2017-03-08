sharedApp.directive('dssHeader', function() {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		templateUrl: 'dssHeader.html', // directive html found here:
		replace: true // Replace with the template below
	};
});