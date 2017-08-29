budgetApp.directive("doughnutChart", this.doughnutChart = function ($rootScope, $document) {
	return {
		restrict: 'E',
		templateUrl: 'doughnutChart.html',
		replace: true,
		scope: {
			params: '<',
			titleText: '<'
		},
		link: function (scope, element, attrs) {

			// Params is expected to be an array of objects with value and description
			/* Example

			params = [
				{ value: 22, description: "Instructor Costs" },
				{ value: 55, description: "TA Costs" },
				{ value: 18, description: "Reader Costs" },
				{ value: 22, description: "Line Item Costs"},
			];

			*/
			var config = {
				type: 'doughnut',
				data: {
					datasets: [{
						data: [],
						backgroundColor: [
							'#f56954',
							'#00a65a',
							'#00c0ef',
							'#0073b7'
						]
					}],
					labels: []
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					animation: {
						animateScale: true,
						animateRotate: true
					},
					title: {
						display: true,
						text: scope.titleText
					}
				}
			};

			scope.params.forEach(function(slotParam) {
				config.data.datasets[0].data.push(slotParam.value);
				config.data.labels.push(slotParam.description);
			});
			// End config


			// Mount chart
			var element = angular.element($document[0].querySelector('#chart-area'));
			var ctx = element[0].getContext("2d");
			var myDoughnutChart = new Chart(ctx, config);
		} // end link
	};
});


