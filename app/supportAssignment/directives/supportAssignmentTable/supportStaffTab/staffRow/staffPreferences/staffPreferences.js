import './staffPreferences.css';

let staffPreferences = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./staffPreferences.html'),
		replace: true,
		scope: {
			state: '<',
			supportStaff: '<'
		},
		link: function (scope, element, attrs) {
			scope.deleteAssignment = function(supportAssignment) {
				SupportActions.deleteAssignment(supportAssignment);
			};
		}
	};
};

export default staffPreferences;
