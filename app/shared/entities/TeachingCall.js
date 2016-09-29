angular.module('teachingCall', [])

.factory('TeachingCall', ['$http', function($http) {
	function TeachingCall(teachingCallData) {
		if (teachingCallData) {
			this.setData(teachingCallData);
		}
	}
	TeachingCall.prototype = {
			setData: function(teachingCallData) {
				angular.extend(this, teachingCallData);
			}
	};
	return TeachingCall;
}]);
