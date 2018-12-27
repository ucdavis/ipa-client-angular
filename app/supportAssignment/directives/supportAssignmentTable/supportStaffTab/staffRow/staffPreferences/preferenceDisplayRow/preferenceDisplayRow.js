import './preferenceDisplayRow.css';

let preferenceDisplayRow = function () {
	return {
		restrict: 'E',
		template: require('./preferenceDisplayRow.html'),
		replace: true,
		scope: {
			text: '<'
		},
		link: function () {
			// Intentionally empty
		}
	};
};

export default preferenceDisplayRow;
