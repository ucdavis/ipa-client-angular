supportAssignmentApp.directive("courseHeader", this.courseHeader = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseHeader.html',
		replace: true,
		scope: {
			sectionGroup: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateTeachingAssistantAppointments = function(sectionGroup) {
				supportActions.updateTeachingAssistantAppointments(sectionGroup);
			};

			scope.updateReaderAppointments = function(sectionGroup) {
				supportActions.updateReaderAppointments(sectionGroup);
			};
		}
	};
});
