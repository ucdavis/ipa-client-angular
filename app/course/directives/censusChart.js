import { _ } from 'underscore';

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
      courseId: '='
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
          var lastFiveYears = Array.from([4, 3, 2, 1, 0], function (k) { return moment().year() - k; }); // eslint-disable-line no-undef
          return lastFiveYears.map(function (year) {
            return _.find(scope.census, function (c) {
              var matchesTermCode = c.termCode.toString() == year + (scope.term.termCode + '').slice(-2);
              var matchesCurrentCode = c.snapshotCode == "CURRENT";
              return matchesTermCode && matchesCurrentCode;
            });
          }).map(function (c) {
            return c ? c[property] : 0;
          });
        };

        /**
         * Returns an arry of Enrollments for the given list of snapshot codes
         */
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

        if (scope.term.isLocked()) {	// Historical mode (locked)
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
              data: getCensusEnrollmentByCensusCodes(snapshotCodes)
            }
          ];
        } else { // SG is in the future (unlocked)
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
        }

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
