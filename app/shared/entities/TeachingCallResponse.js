/**
 * @author okadri
 * Stores instructor availabilities and comments for a given TeachingCall and TermCode
 */
angular.module('teachingCallResponse', [])

.factory('TeachingCallResponse', ['$http', function($http) {
	function TeachingCallResponse(teachingCallResponseData) {
		if (teachingCallResponseData) {
			this.setData(teachingCallResponseData);
		}
	};
	TeachingCallResponse.prototype = {
			setData: function(teachingCallResponseData) {
				angular.extend(this, teachingCallResponseData);
			}
	};
	return TeachingCallResponse;
}]);
