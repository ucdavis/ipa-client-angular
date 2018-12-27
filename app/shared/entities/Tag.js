 // eslint-disable-next-line no-undef
const Tag = angular.module('Tag', [])

.factory('Tag', function() {
	function Tag(tagData) {
		if (tagData) {
			this.setData(tagData);
		}
	}
	Tag.prototype = {
		setData: function(tagData) {
			angular.extend(this, tagData); // eslint-disable-line no-undef
		},
		getTextColor: function () {
			var THRESHOLD = 180;
			var BLACK = "#000000";
			var WHITE = "#FFFFFF";
			if (this.color &&
					((parseInt(this.color.substring(1, 3), 16) +
						parseInt(this.color.substring(3, 5), 16) +
						parseInt(this.color.substring(5, 7), 16)) / 3) > THRESHOLD) {
				return BLACK;
			} else {
				return WHITE;
			}
		}
	};
	return Tag;
});

export default Tag;