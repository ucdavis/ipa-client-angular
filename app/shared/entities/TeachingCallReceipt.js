 // eslint-disable-next-line no-undef
const TeachingCallReceipt = angular.module('TeachingCallReceipt', [])

.factory('TeachingCallReceipt', function() {
	function TeachingCallReceipt(teachingCallReceiptData) {
		if (teachingCallReceiptData) {
			this.setData(teachingCallReceiptData);
		}
	}
	TeachingCallReceipt.prototype = {
			setData: function(teachingCallReceiptData) {
				angular.extend(this, teachingCallReceiptData); // eslint-disable-line no-undef
			}
	};
	return TeachingCallReceipt;
});

export default TeachingCallReceipt;