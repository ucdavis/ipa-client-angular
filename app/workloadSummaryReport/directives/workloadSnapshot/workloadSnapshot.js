import './workloadSnapshot.css';

let workloadSnapshot = function () {
	return {
		restrict: 'E',
		template: require('./workloadSnapshot.html'),
		replace: true,
		scope: {
			snapshot: '<'
		},
		link: function(scope) {
			scope.round = (num) => Math.floor(num);
		}
	};
};

export default workloadSnapshot;
