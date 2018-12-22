import './studentPreferences.css';

let studentPreferences = function () {
	return {
		restrict: 'E',
		template: require('./studentPreferences.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function () {
			// Intentionally blank
		}
	};
};

export default studentPreferences;
