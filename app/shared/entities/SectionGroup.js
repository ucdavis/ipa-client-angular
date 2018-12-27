 // eslint-disable-next-line no-undef
const SectionGroup = angular.module('SectionGroup', [])

.factory('SectionGroup', function() {
	function SectionGroup(coData) {
		if (coData) {
			this.setData(coData);
		}
	}
	SectionGroup.prototype = {
			setData: function(coData) {
				angular.extend(this, coData); // eslint-disable-line no-undef
			}
	};
	return SectionGroup;
});

export default SectionGroup;