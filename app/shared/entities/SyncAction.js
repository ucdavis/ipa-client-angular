 // eslint-disable-next-line no-undef
const SyncAction = angular.module('SyncAction', [])

	.factory('SyncAction', ['$http', function ($http) {
		function SyncAction(syncActionData) {
			if (syncActionData) {
				this.setData(syncActionData);
			}
		}
		SyncAction.prototype = {
			setData: function (syncActionData) {
				angular.extend(this, syncActionData); // eslint-disable-line no-undef
			}
		};
		return SyncAction;
	}]);

	export default SyncAction;