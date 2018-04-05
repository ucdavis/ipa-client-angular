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

			if (scope.params) {
				scope.params.forEach(function(slotParam) {
					config.data.datasets[0].data.push(slotParam.value);
					config.data.labels.push(slotParam.description);
				});
			}
			// End config

			// Mount chart
			var element = angular.element($document[0].querySelector('#chart-area'));
			var ctx = element[0].getContext("2d");
			scope.myDoughnutChart = new Chart(ctx, config);

			// Handle updates
			function addData(chart, data) {
				scope.params.forEach(function(slotParam) {
					chart.data.datasets[0].data.push(slotParam.value);
				});

				chart.options.title.text = scope.titleText;

				chart.update();
			}

			function removeData(chart) {
				chart.data.datasets[0].data = [];
				chart.update();
			}

			function paramsMatched(params, oldParams) {
				var allMatched = true;

				if (scope.oldTitleText != scope.titleText) {
					allMatched = false;
				}

				params.forEach(function(slotParam, index) {
					if (params[index].value != oldParams[index].value) {
						allMatched = false;
					}
				});

				return allMatched;
			}

			scope.$watch('params',function() {
				if (!scope.params) {
					return;
				}

				if (!scope.oldParams) {
					scope.oldParams = scope.params;
					scope.oldTitleText = scope.titleText;
					return;
				}

				if (paramsMatched(scope.params, scope.oldParams)) {
					return;
				}

				scope.oldParams = scope.params;

				removeData(scope.myDoughnutChart);
				addData(scope.myDoughnutChart, scope.params);
			});
		} // end link
	};
});
