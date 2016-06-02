/**
 * @author okadri
 * Stores instructor receipt information for a given TeachingCall
 * It has a flag to indicate whether the instructor has completed inputing preferences
 */
angular.module('teachingCallReceipt', [])

.factory('TeachingCallReceipt', ['$http', function($http) {
	function TeachingCallReceipt(teachingCallReceiptData) {
		if (teachingCallReceiptData) {
			this.setData(teachingCallReceiptData);
		}
	};
	TeachingCallReceipt.prototype = {
			setData: function(teachingCallReceiptData) {
				angular.extend(this, teachingCallReceiptData);
			}
	};
	return TeachingCallReceipt;
}]);
