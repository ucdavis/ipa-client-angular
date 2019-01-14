import './workgroupSummary.css';

let workgroupSummary = function () {
	return {
		restrict: 'E',
		template: require('./workgroupSummary.html'),
		replace: true,
    scope: {
      state: '=',
      workgroup: '=',
      hasAccess: '='
    },
		link: function () {
			// Do nothing
		}
	};
};

export default workgroupSummary;
