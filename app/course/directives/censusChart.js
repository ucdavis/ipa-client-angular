courseApp.directive("censusChart", this.censusChart = function ($rootScope, $timeout) {
	return {
		restrict: 'E',
		template: '<canvas></canvas>',
		replace: true,
		scope: {
			census: '=',
			term: '=',
			courseId: '='
		},
		link: function (scope, element, attrs) {
			var ctx = element[0].getContext("2d");
			scope.$watchGroup(['census', 'term', 'courseId'], function () {
				if (scope.census === undefined) {
					ctx.font = "14px Helvetica";
					ctx.textAlign = "center";
					ctx.fillText("Loading...", element.width() / 2, element.height() / 2);
					return;
				}

				var getLastFiveYears = function () {
					var lastFiveYears = [];
					for (var y = 4; y >= 0; y--) { lastFiveYears.push(moment().year() - y); }
					return lastFiveYears;
				};

				var getCurrentCensusForProperty = function (property) {
					var something = getLastFiveYears().map(function (year) {
						return _.find(scope.census, function (c) {
							var matchesTermCode = c.termCode.toString() == year + (scope.term.termCode + '').slice(-2);
							var matchesCurrentCode = c.snapshotCode == "CURRENT";
							return matchesTermCode && matchesCurrentCode;
						});
					}).map(function (c) {
						return c ? c[property] : 0;
					});
					return something;
				};

				var getCensusEnrollmentByCensusCodes = function (snapshotCodes) {
					var censusEnrollment = [];

					// Create an array of currentEnrolledCounts in the order of passed snapshotCodes
					for (var sc = 0; sc < snapshotCodes.length; sc++) {
						var snapshotCodesFound = false;
						for (var c = 0; c < scope.census.length; c++) {
							// If snapshotCode and termCode match push to array and go on to the next snapshotCode
							if (scope.census[c].snapshotCode == snapshotCodes[sc] && scope.census[c].termCode == scope.term.termCode) {
								censusEnrollment.push(scope.census[c].currentEnrolledCount);
								snapshotCodesFound = true;
								break;
							}
						}
						// Fill in 0 for missing snapshotCodes
						if (!snapshotCodesFound) {
							censusEnrollment.push(0);
						}
					}

					return censusEnrollment;
				};

				var type, labels, datasets;

				if (scope.term.isLocked()) {	// Locked mode
					var snapshotCodes = ["INSTR_BEG", "DAY5", "DAY10", "DAY15", "CURRENT"];
					type = 'bar';
					labels = snapshotCodes;
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
							data: getCensusEnrollmentByCensusCodes(snapshotCodes)
						}
					];
				} else { // SG is in historical mode
					type = 'line';
					labels = getLastFiveYears();
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
				}

				Chart.defaults.global.defaultFontColor = "#888";
				Chart.defaults.global.tooltips.mode = 'x-axis';
				Chart.defaults.global.tooltips.titleFontSize = 10;
				Chart.defaults.global.tooltips.bodyFontSize = 10;
				Chart.defaults.global.tooltips.caretSize = 3;
				Chart.defaults.global.tooltips.cornerRadius = 3;

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
						// Destroy chart only if it exists and another cell was selected
						if (myChart && data.actionType == "CELL_SELECTED" &&
							(data.state.uiState.selectedTermCode != scope.term.termCode || data.state.uiState.selectedCourseId != scope.courseId)) {
							myChart.destroy();
						}
					});
				});

			}, true);
		}
	};
});
