let unavailabilityModal = function (AssignmentActionCreators) {
	return {
		restrict: 'E',
		template: require('./unavailabilityModal.html'),
		replace: true,
		scope: {
			instructor: '<',
      isVisible: '=',
      termDisplayNames: '<',
      teachingCallResponses: '<'
		},
		link: function (scope, element, attrs) {
      scope.close = function () {
        scope.isVisible = false;
      };
    
      scope.saveUnavailabilities = function (teachingCallResponse, blob) {
        teachingCallResponse.availabilityBlob = blob;
        AssignmentActionCreators.updateTeachingCallResponse(teachingCallResponse);
        scope.close();
      };
    } // end link
	};
};

export default unavailabilityModal;
