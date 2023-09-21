import './workloadDownloadModal.css';
import { _array_sortByProperty } from '../../../shared/helpers/array';
import { dateToCalendar } from '../../../shared/helpers/dates';

let workloadDownloadModal = function (WorkloadSummaryActions, WorkloadSummaryService) {
  return {
    restrict: 'E',
    template: require('./workloadDownloadModal.html'),
    replace: true,
    scope: {
      userWorkgroupSnapshots: '<',
    },
    link: function (scope) {
      scope.isDisabled = false;
      scope.workgroupId = JSON.parse(localStorage.getItem('workgroup')).id;
      scope.year = parseInt(localStorage.getItem('year'));
      scope.isSortedByRecentActivity = false;
      scope.showSnapshotWarning = false;

      scope.$watch('userWorkgroupSnapshots', function (userWorkgroupsSnapshots) {
        if (userWorkgroupsSnapshots) {
          scope.departmentSnapshots = scope.getScenarioOptions(userWorkgroupsSnapshots);
          scope.showSnapshotWarning = scope.isAnyWorkgroupMissingSnapshots(userWorkgroupsSnapshots);
        }
      }, true);

      scope.sortDepartmentsByRecentActivity = function () {
        debugger;
        if (scope.isSortedByRecentActivity === false) {
          scope.isSortedByRecentActivity = true;
          scope.departmentSnapshots = _array_sortByProperty(scope.departmentSnapshots, "lastActivity", true);
        } else {
          scope.isSortedByRecentActivity = false;
          scope.departmentSnapshots = _array_sortByProperty(scope.departmentSnapshots, "name");
        }
      };


      scope.isAnyWorkgroupMissingSnapshots = function (workgroupSnapshots) {
        if (workgroupSnapshots) {
          return Object.keys(workgroupSnapshots).map(departmentName => {
            const isSnapshotEmpty = workgroupSnapshots[departmentName].length === 0;
            return isSnapshotEmpty;
          }).some((v) => v === true);
        }
      };

      scope.getScenarioOptions = function (userWorkgroupSnapshots) {
        // each row gets Live Data as an option
        // two columns with the same options
        const liveDataOption = {
          id: 0,
          name: "Live Data"
        };

        return Object.keys(userWorkgroupSnapshots)
          .sort()
          .map((department) => {
            return ({
              name: department,
              workgroupId: userWorkgroupSnapshots[department][0]?.workgroupId,
              snapshots: [liveDataOption, ...userWorkgroupSnapshots[department]],
              selectedPrevious: '0',
              selectedNext: '0',
              download: true,
              lastActivity: userWorkgroupSnapshots[department].map(snapshot => snapshot.createdOn).sort().slice(-1)[0],
              showWarning: userWorkgroupSnapshots[department].length === 0
            });
          });
      };

      scope.selectLatestSnapshots = function () {
        debugger;

        scope.departmentSnapshots = scope.departmentSnapshots.map((department) => {
          debugger;
          const selectedNext = department.snapshots.filter(snapshot => snapshot.id !== 0).map(snapshot => snapshot.id).sort()[0]?.toString();

          const nextState = { ...department, selectedNext };
          // return {...department, selectedNext};
          return nextState;
        });
      };

      scope.resetDownloadSelections = function () {
        scope.departmentSnapshots = scope.departmentSnapshots.map((department) => {
          return { ...department, selectedPrevious: '0', selectedNext: '0' };
        });
        scope.downloadAllDepartments = true;
      };

      scope.toggleAllDepartmentDownloads = function () {
        if (scope.downloadAllDepartments) {
          scope.departmentSnapshots.forEach(department => department.download = false);
          scope.downloadAllDepartments = false;
        } else {
          scope.departmentSnapshots.forEach(department => department.download = true);
          scope.downloadAllDepartments = true;
        }
      };

      scope.toggleDepartmentDownload = function (department) {
        department.download = !department.download;

        scope.downloadAllDepartments = scope.departmentScenarios.every(department => department.download === true);
      };

      scope.close = function () {
        scope.status = null;
        WorkloadSummaryActions.toggleDownloadModal();
        localStorage.setItem("budgetComparisonDownloadSelections", JSON.stringify(scope.departmentScenarios));
        localStorage.setItem("budgetComparisonDownloadSorted", JSON.stringify(scope.isSortedByRecentActivity));
      };

      scope.submit = function () {
        scope.isDisabled = true;

        // track workgroupId for Live Data report and snapshotId
        // {
        //   workgroupId: [snapshotId1, snapshotId2],
        //   workrgroupId2: [snapshotId1]
        // }

        let departmentSnapshots = {};

        scope.departmentSnapshots
          .filter(department => department.download)
          .forEach((department) => {
            if (department.workgroupId === undefined) {
              debugger;
            }
            departmentSnapshots[department.workgroupId] = [parseInt(department.selectedPrevious), parseInt(department.selectedNext)].filter(id => id > 0);
          }
          );


        WorkloadSummaryService.downloadMultipleSnapshots(departmentSnapshots, scope.workgroupId, scope.year);
      };

      scope.dateToCalendar = function (date) {
        return dateToCalendar(date);
      };
    }, // end link
  };
};

export default workloadDownloadModal;
