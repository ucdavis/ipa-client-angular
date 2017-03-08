sharedApp.directive('ipaHeader', function() {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		templateUrl: 'ipaHeader.html', // directive html found here:
		replace: true // Replace with the template below
	};
});