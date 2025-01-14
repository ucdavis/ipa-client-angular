import './workloadDownloadModal.css';
import { _array_sortByProperty } from '../../../shared/helpers/array';
import { dateToCalendar } from '../../../shared/helpers/dates';

let workloadDownloadModal = function (WorkloadSummaryActions) {
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
        const downloadSettings = JSON.parse(localStorage.getItem('workloadSnapshotDownloadSettings'));
        const workgroupsSnapshotsLength = Object.keys(userWorkgroupsSnapshots || {}).length;

        if (workgroupsSnapshotsLength > 0) {
          scope.selectableYears = scope.getSelectableYears(userWorkgroupsSnapshots);
        }

        if (
          downloadSettings &&
          workgroupsSnapshotsLength > 0 &&
          !scope.prevYear && !scope.nextYear &&
          downloadSettings.selections.length === workgroupsSnapshotsLength
        ) {
          scope.departmentSnapshots = scope.getScenarioOptions(userWorkgroupsSnapshots);
          scope.departmentSnapshots = scope.departmentSnapshots.map(d => {
            const savedSelection = downloadSettings.selections.find(s => s.workgroupId === d.workgroupId);

            d.selectedNext = savedSelection.selectedNext;
            d.selectedPrevious = savedSelection.selectedPrevious;

            return d;
          });

          scope.prevYear = downloadSettings.prevYear;
          scope.nextYear = downloadSettings.nextYear;
          scope.isSortedByRecentActivity = downloadSettings.isSorted;
        } else if (!downloadSettings && workgroupsSnapshotsLength > 0) {
          scope.selectableYears = scope.getSelectableYears(userWorkgroupsSnapshots);
          scope.prevYear = scope.selectableYears[0];
          scope.nextYear = scope.selectableYears[0];

          scope.departmentSnapshots = scope.getScenarioOptions(userWorkgroupsSnapshots);
          scope.showSnapshotWarning = scope.isAnyWorkgroupMissingSnapshots(userWorkgroupsSnapshots);
        }
      }, true);

      scope.onPrevYearChange = function (prevYear) {
        scope.departmentSnapshots.prevYear = prevYear;
        scope.departmentSnapshots.forEach(d => {
          d.prevYearFilteredSnapshots = [{ id: 0, name: "Live Data" }, ...d.snapshots.filter(s => s.year === prevYear)];
          d.selectedPrevious = '0';
        });
      };

      scope.onNextYearChange = function (nextYear) {
        scope.departmentSnapshots.nextYear = nextYear;
        scope.departmentSnapshots.forEach(d => {
          d.nextYearFilteredSnapshots = [{ id: 0, name: "Live Data" }, ...d.snapshots.filter(s => s.year === nextYear)];
          d.selectedNext = '0';
        });
      };

      scope.sortDepartmentsByRecentActivity = function () {
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

      scope.getSelectableYears = function (userWorkgroupsSnapshots) {
        const selectableYears = [...new Set(Object.values(userWorkgroupsSnapshots).flatMap(s => s.years))];
        return selectableYears.length ? selectableYears.sort() : [scope.year];
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
            const snapshots = userWorkgroupSnapshots[department].snapshots;
            
            return ({
              name: department,
              workgroupId: userWorkgroupSnapshots[department].workgroupId,
              snapshots: snapshots,
              prevYearFilteredSnapshots: [liveDataOption, ...snapshots.filter(s => s.year === scope.year)],
              nextYearFilteredSnapshots: [liveDataOption, ...snapshots.filter(s => s.year === scope.year)],
              selectedPrevious: '0',
              selectedNext: '0',
              download: true,
              lastActivity: userWorkgroupSnapshots[department].snapshots.map(snapshot => snapshot.createdOn).sort().slice(-1)[0],
              showWarning: userWorkgroupSnapshots[department].snapshots.length === 0
            });
          });
      };

      scope.selectLatestSnapshots = function () {
        scope.departmentSnapshots = scope.departmentSnapshots.map((department) => {
          const selectedPrevious = department.prevYearFilteredSnapshots.filter(snapshot => snapshot.id !== 0).map(snapshot => snapshot.id).sort()[0]?.toString();
          const selectedNext = department.nextYearFilteredSnapshots.filter(snapshot => snapshot.id !== 0).map(snapshot => snapshot.id).sort()[0]?.toString();

          return { ...department, selectedPrevious: selectedPrevious || '0', selectedNext: selectedNext || '0' };
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

        const departmentSelections = scope.departmentSnapshots.map(d => ({
            workgroupId: d.workgroupId,
            selectedNext: d.selectedNext,
            selectedPrevious: d.selectedPrevious
          }));

        localStorage.setItem('workloadSnapshotDownloadSettings', JSON.stringify({
            selections: departmentSelections,
            // year: scope.year,
            prevYear: scope.prevYear,
            nextYear: scope.nextYear,
            isSorted: scope.isSortedByRecentActivity
          })
        );
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
            let downloads = {};

            downloads.prev = {
              snapshotId: parseInt(department.selectedPrevious),
              liveDataYear: scope.prevYear
            };

            downloads.next = {
              snapshotId: parseInt(department.selectedNext),
              liveDataYear: scope.nextYear
            };

            departmentSnapshots[department.workgroupId] = downloads;
          });

        WorkloadSummaryActions.downloadMultiple(departmentSnapshots, scope.workgroupId, scope.year);
      };

      scope.dateToCalendar = function (date) {
        return dateToCalendar(date);
      };
    }, // end link
  };
};

export default workloadDownloadModal;
