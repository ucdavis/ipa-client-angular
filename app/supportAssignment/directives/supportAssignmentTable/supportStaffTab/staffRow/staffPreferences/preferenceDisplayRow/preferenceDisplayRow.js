import './preferenceDisplayRow.css';

let preferenceDisplayRow = function () {
	return {
		restrict: 'E',
		template: require('./preferenceDisplayRow.html'),
		replace: true,
		scope: {
			text: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally empty
		}
	};
};

export default preferenceDisplayRow;
