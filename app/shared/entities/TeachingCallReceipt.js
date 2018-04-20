const TeachingCallReceipt = angular.module('TeachingCallReceipt', [])

.factory('TeachingCallReceipt', ['$http', function($http) {
	function TeachingCallReceipt(teachingCallReceiptData) {
		if (teachingCallReceiptData) {
			this.setData(teachingCallReceiptData);
		}
	}
	TeachingCallReceipt.prototype = {
			setData: function(teachingCallReceiptData) {
				angular.extend(this, teachingCallReceiptData);
			}
	};
	return TeachingCallReceipt;
}]);

export default TeachingCallReceipt;