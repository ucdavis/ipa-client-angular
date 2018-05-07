import './staffHeader.css';

let staffHeader = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./staffHeader.html'),
		replace: true,
		scope: {
			supportStaff: '<',
			viewType: '<',
			readOnly: '<?'
		},
		link: function (scope, element, attrs) {
			scope.openAvailabilityModal = function(supportStaff) {
				SupportActions.openAvailabilityModal(supportStaff);
			};
		}
	};
};

export default staffHeader;
