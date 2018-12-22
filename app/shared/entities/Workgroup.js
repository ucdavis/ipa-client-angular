 // eslint-disable-next-line no-undef
const Workgroup = angular.module('Workgroup', [])

.factory('Workgroup', function() {
	function Workgroup(workgroupData) {
		if (workgroupData) {
			this.setData(workgroupData);
		}
	}
	Workgroup.prototype = {
			setData: function(workgroupData) {
				angular.extend(this, workgroupData); // eslint-disable-line no-undef
			}
	};
	return Workgroup;
});

export default Workgroup;