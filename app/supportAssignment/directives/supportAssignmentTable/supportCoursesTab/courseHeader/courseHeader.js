import './courseHeader.css';

let courseHeader = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./courseHeader.html'),
		replace: true,
		scope: {
			sectionGroup: '<',
			viewType: '<',
			readOnly: '<?'
		},
		link: function (scope) {
			scope.updateTeachingAssistantAppointments = function(sectionGroup) {
				SupportActions.updateTeachingAssistantAppointments(sectionGroup);
			};

			scope.updateReaderAppointments = function(sectionGroup) {
				SupportActions.updateReaderAppointments(sectionGroup);
			};
		}
	};
};

export default courseHeader;