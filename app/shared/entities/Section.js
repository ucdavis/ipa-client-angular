 // eslint-disable-next-line no-undef
const Section = angular.module('Section', [])

.factory('Section', function() {
	function Section(sectionData) {
		if (sectionData) {
			this.setData(sectionData);
		}
	}
	Section.prototype = {
			setData: function(sectionData) {
				angular.extend(this, sectionData); // eslint-disable-line no-undef
			}
	};
	return Section;
});

export default Section;