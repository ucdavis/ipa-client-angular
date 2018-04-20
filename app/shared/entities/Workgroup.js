const Workgroup = angular.module('Workgroup', [])

.factory('Workgroup', ['$http', function($http) {
	function Workgroup(workgroupData) {
		if (workgroupData) {
			this.setData(workgroupData);
		}
	}
	Workgroup.prototype = {
			setData: function(workgroupData) {
				angular.extend(this, workgroupData);
			}
	};
	return Workgroup;
}]);

export default Workgroup;