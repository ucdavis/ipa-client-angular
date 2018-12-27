import './teachingCalls.css';

let teachingCalls = function () {
	return {
		restrict: 'E',
		template: require('./teachingCalls.html'),
		replace: true,
		link: function () {
			// Do nothing
		}
	};
};

export default teachingCalls;
