courseApp.directive("censusChart", this.censusChart = function ($rootScope, $timeout) {
	return {
		restrict: 'E',
		template: '<canvas></canvas>',
		replace: true,
		scope: {
			census: '=',
			termCode: '='
		},
		link: function (scope, element, attrs) {
			var ctx = element[0].getContext("2d");
			scope.$watchGroup(['census', 'termCode'], function () {
				if (scope.census == undefined) { return; }

				var getCurrentCensusForProperty = function (property) {
					return scope.census.filter(function (c) {
						var matchesTerm = (c.termCode + '').slice(-2) == (scope.termCode + '').slice(-2);
						var matchesCurrentCode = c.snapshotCode == "CURRENT";
						return matchesTerm && matchesCurrentCode;
					}).sort(function (ca, cb) {
						return ca.termCode - cb.termCode;
					}).map(function (c) {
						return c[property];
					}).slice(-5);
				};

				var type, labels, datasets;
				// TODO: Determine chart mode
				if (true) {	// SG is in historical mode
					type = 'line';
					labels = getCurrentCensusForProperty("termCode").map(function (tc) { return Math.floor(tc/100); });
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
							data: getCurrentCensusForProperty("maxEnrollmentCount")
						},
						{
							label: "Enrollment",
							lineTension: 0,
							backgroundColor: "rgba(200,181,150,0.2)",
							borderColor: "rgba(200,181,150,1)",
							pointBackgroundColor: "rgba(200,181,150,1)",
							pointBorderColor: "#fff",
							pointHoverBackgroundColor: "#fff",
							pointHoverBorderColor: "rgba(179,181,198,1)",
							data: getCurrentCensusForProperty("currentEnrolledCount")
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
							data: scope.census.census
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
					$rootScope.$on("courseStateChanged", function (event, data) {
						if (myChart && data.actionType == "CELL_SELECTED") { myChart.destroy(); }
					});
				});

			}, true);
		}
	}
});
