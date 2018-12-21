import './workgroupSummary.css';

let workgroupSummary = function () {
	return {
		restrict: 'E',
		template: require('./workgroupSummary.html'),
		replace: true,
		link: function () {
			// Do nothing
		}
	};
};

export default workgroupSummary;
