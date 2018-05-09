import './workloadHeader.css';

let workloadHeader = function () {
	return {
		restrict: 'E',
		template: require('./workloadHeader.html'),
		replace: true,
		scope: {},
		link: function(scope, element, attrs) {
			// Intentionally blank
		}
	};
};

export default workloadHeader;
