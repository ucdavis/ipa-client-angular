import './studentAvailabilities.css';

let studentAvailabilities = function () {
	return {
		restrict: 'E',
		template: require('./studentAvailabilities.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
};

export default studentAvailabilities;
