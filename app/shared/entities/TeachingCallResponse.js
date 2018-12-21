 // eslint-disable-next-line no-undef
const TeachingCallResponse = angular.module('TeachingCallResponse', [])

.factory('TeachingCallResponse', ['$http', function($http) {
	function TeachingCallResponse(teachingCallResponseData) {
		if (teachingCallResponseData) {
			this.setData(teachingCallResponseData);
		}
	}
	TeachingCallResponse.prototype = {
			setData: function(teachingCallResponseData) {
				angular.extend(this, teachingCallResponseData); // eslint-disable-line no-undef
			}
	};
	return TeachingCallResponse;
}]);

export default TeachingCallResponse;