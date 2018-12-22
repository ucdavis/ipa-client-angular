let ipaDatePicker = function($window, $location, $routeParams) {
	return {
		restrict: 'E', // Use this via an element selector <dss-modal></dss-modal>
		template: require('./ipaDatePicker.html'), // directive html found here:
		replace: true, // Replace with the template below
		link: function (scope) {
			scope.year = $routeParams.year;
			scope.workgroupId = $routeParams.workgroupId;
			scope.termShortCode = $routeParams.termShortCode;
		} // End Link
	};
};

export default ipaDatePicker;
