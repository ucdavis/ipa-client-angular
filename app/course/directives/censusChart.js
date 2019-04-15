/**
 * Uses Chart JS to display either a bar chart (historical courses), or a line chart (future courses)
 * Example: <census-chart census="census" term="termCode"course-id="courseId"></census-chart>
 */
let censusChart = function ($rootScope, $timeout) {
  return {
    restrict: 'E',
    template: '<canvas></canvas>',
    replace: true,
    scope: {
      census: '=',
      term: '=',
      courseId: '=',
      sequencePattern: '='
    },
    link: function (scope, element) {
      var ctx = element[0].getContext("2d");

      // Watch for changing params: happens when selecting a different courses
      // table cell or when the async data comes back from DW
      scope.$watchGroup(['census', 'term', 'courseId'], function () {
        // Display a loading message while no census data
        if (scope.census === undefined) {
          ctx.font = "14px Helvetica";
          ctx.textAlign = "center";
          ctx.fillText("Loading...", element.width() / 2, element.height() / 2);
          return;
        }

        // Gets the "CURRENT" snapshot of the given property (e.g. currentEnrolledCount, maxEnrollmentCount)
        var getCurrentCensusForProperty = function (property) {
          var sequenceFilteredCensus = scope.census.filter(function(courseCensus) {
            return courseCensus.sequenceNumber.includes(scope.sequencePattern) && courseCensus.snapshotCode === "CURRENT";
          });

          var censusByTermCode = {};

          sequenceFilteredCensus.forEach(function(courseCensus) {
            censusByTermCode[courseCensus.termCode] ? censusByTermCode[courseCensus.termCode].push(courseCensus) : censusByTermCode[courseCensus.termCode] = [];
          });

          for (var termCode in censusByTermCode) {
            var baseCensusObj = JSON.parse(JSON.stringify(censusByTermCode[termCode][0]));

            censusByTermCode[termCode] = censusByTermCode[termCode].reduce(function(accumulator, currentValue) {
              accumulator[property] += currentValue[property];
              return accumulator;
            }, baseCensusObj);
          }

          var lastFiveYears = Array.from([4, 3, 2, 1, 0], function (k) { return moment().year() - k; }); // eslint-disable-line no-undef

          return lastFiveYears.map(function(year) {
            var termCode = year + (scope.term.termCode + '').slice(-2);
            var courseCensus = censusByTermCode[termCode];

            return courseCensus ? courseCensus[property] : 0;
          });
        };

        var type, labels, datasets;

        type = 'line';
        // Last 5 years
        labels = Array.from([4, 3, 2, 1, 0], function (k) { return moment().year() - k; }); // eslint-disable-line no-undef
        datasets = [
          {
            label: "Seats",
            lineTension: 0,
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            data: getCurrentCensusForProperty("maxEnrollmentCount")
          },
          {
            label: "Enrollment",
            lineTension: 0,
            backgroundColor: "rgba(200,181,150,0.2)",
            borderColor: "rgba(200,181,150,1)",
            pointBackgroundColor: "rgba(200,181,150,1)",
            pointBorderColor: "#fff",
            data: getCurrentCensusForProperty("currentEnrolledCount")
          }
        ];

        Chart.defaults.global.defaultFontColor = "#888"; // eslint-disable-line no-undef
        Chart.defaults.global.tooltips.mode = 'x-axis'; // eslint-disable-line no-undef
        Chart.defaults.global.tooltips.titleFontSize = 10; // eslint-disable-line no-undef
        Chart.defaults.global.tooltips.bodyFontSize = 10; // eslint-disable-line no-undef
        Chart.defaults.global.tooltips.caretSize = 3; // eslint-disable-line no-undef
        Chart.defaults.global.tooltips.cornerRadius = 3; // eslint-disable-line no-undef
        Chart.defaults.global.legend.display = false; // eslint-disable-line no-undef

        $timeout(function () {
          var myChart = new Chart(ctx, { // eslint-disable-line no-undef
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
            if (myChart && data.action.type == "CELL_SELECTED" &&
              (data.state.uiState.selectedTermCode != scope.term.termCode || data.state.uiState.selectedCourseId != scope.courseId)) {
              myChart.destroy();
            }
          });
        });

      }, true);
    }
  };
};

export default censusChart;
