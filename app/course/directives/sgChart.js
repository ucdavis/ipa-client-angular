courseApp.directive("sgChart", this.sgChart = function ($rootScope, $timeout) {
	return {
		restrict: 'E',
		template: '<canvas></canvas>',
		replace: true,
		scope: {
			sg: '='
		},
		link: function (scope, element, attrs) {
			var ctx = element[0].getContext("2d");
			scope.$watch('sg', function () {
				if (scope.sg && scope.sg.seats && scope.sg.demand && scope.sg.enrollment) {

					var type, labels, datasets;
					if (scope.sg.isActive) {	// SG is in historical mode
						type = 'line';
						labels = [2011, 2012, 2013, 2014, 2015];
						datasets = [
							{
								label: "Seats",
								lineTension: 0,
								backgroundColor: "rgba(179,181,198,0.2)",
								borderColor: "rgba(179,181,198,1)",
								pointBackgroundColor: "rgba(179,181,198,1)",
								pointBorderColor: "#fff",
								pointHoverBackgroundColor: "#fff",
								pointHoverBorderColor: "rgba(179,181,198,1)",
								data: scope.sg.seats
							},
							{
								label: "Demand",
								lineTension: 0,
								backgroundColor: "rgba(200,181,150,0.2)",
								borderColor: "rgba(200,181,150,1)",
								pointBackgroundColor: "rgba(200,181,150,1)",
								pointBorderColor: "#fff",
								pointHoverBackgroundColor: "#fff",
								pointHoverBorderColor: "rgba(179,181,198,1)",
								data: scope.sg.demand
							},
							{
								label: "Enrollment",
								lineTension: 0,
								backgroundColor: "rgba(255,99,132,0.2)",
								borderColor: "rgba(255,99,132,1)",
								pointBackgroundColor: "rgba(255,99,132,1)",
								pointBorderColor: "#fff",
								pointHoverBackgroundColor: "#fff",
								pointHoverBorderColor: "rgba(255,99,132,1)",
								data: scope.sg.enrollment
							}
						];
					} else {
						type = 'bar';
						labels = ['Day 1', 'Day 5', 'Day 15', 'Day 20', 'Current'];
						datasets = [
							{
								label: "Census",
								lineTension: 0,
								backgroundColor: "rgba(179,181,198,0.5)",
								borderColor: "rgba(179,181,198,1)",
								pointBackgroundColor: "rgba(179,181,198,1)",
								pointBorderColor: "#fff",
								pointHoverBackgroundColor: "#fff",
								pointHoverBorderColor: "rgba(179,181,198,1)",
								data: scope.sg.census
							}
						];
					}

					Chart.defaults.global.defaultFontColor = "#888";
					// Chart.defaults.global.responsive = false;
					$timeout(function () {
						var myChart = new Chart(ctx, {
							type: type,
							data: {
								labels: labels,
								datasets: datasets
							},
							options: {
								scales: {
									yAxes: [{
										ticks: {
											beginAtZero: true
										}
									}]
								}
							}
						});
						$rootScope.$on("courseStateChanged", function () {
							if (myChart) { myChart.destroy(); }
						});
					});
				}
			}, true);
		}
	}
});
