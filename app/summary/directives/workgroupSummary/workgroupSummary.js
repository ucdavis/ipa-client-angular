let workgroupSummary = function () {
	return {
		restrict: 'E',
		template: require('./workgroupSummary.html'),
		replace: true,
		link: function (scope, element, attrs) {
			// Do nothing
		}
	};
};

export default workgroupSummary;
