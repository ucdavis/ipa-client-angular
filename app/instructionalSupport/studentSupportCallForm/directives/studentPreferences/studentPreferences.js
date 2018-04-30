let studentPreferences = function () {
	return {
		restrict: 'E',
		template: require('./studentPreferences.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
};

export default studentPreferences;
