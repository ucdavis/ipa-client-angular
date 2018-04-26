let staffComments = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./staffComments.html'),
		replace: true,
		scope: {
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
};

export default staffComments;
