 // eslint-disable-next-line no-undef
const TeachingCall = angular.module('TeachingCall', [])

.factory('TeachingCall', ['$http', function($http) {
	function TeachingCall(teachingCallData) {
		if (teachingCallData) {
			this.setData(teachingCallData);
		}
	}
	TeachingCall.prototype = {
			setData: function(teachingCallData) {
				angular.extend(this, teachingCallData); // eslint-disable-line no-undef
			}
	};
	return TeachingCall;
}]);

export default TeachingCall;