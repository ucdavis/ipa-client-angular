import './supportCalls.css';

let supportCalls = function () {
	return {
		restrict: 'E',
		template: require('./supportCalls.html'),
		replace: true,
		link: function () {
			// Do nothing
		}
	};
};

export default supportCalls;
