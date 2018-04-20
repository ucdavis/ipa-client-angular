const SyncAction = angular.module('SyncAction', [])

	.factory('SyncAction', ['$http', function ($http) {
		function SyncAction(syncActionData) {
			if (syncActionData) {
				this.setData(syncActionData);
			}
		}
		SyncAction.prototype = {
			setData: function (syncActionData) {
				angular.extend(this, syncActionData);
			}
		};
		return SyncAction;
	}]);

	export default SyncAction;