import './workloadSummary.css';

let workloadSummary = function ($rootScope) {
	return {
		restrict: 'E',
		template: require('./workloadSummary.html'),
		replace: true,
		scope: {},
		link: function(scope, element, attrs) {
			scope.view = {};

			$rootScope.$on('workloadSummaryStateChanged', function (event, data) {
				scope.view.state = data;
			});

			WorkloadActions.initState();
		}
	};
};

export default workloadSummary;
