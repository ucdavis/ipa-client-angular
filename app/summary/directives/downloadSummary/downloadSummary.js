import './downloadSummary.css';

let downloadSummary = function (ApiService) {
    return {
        restrict: 'E',
        template: require('./downloadSummary.html'),
        replace: true,
        scope: {
            workgroup: '=',
            year: '=',
            hasAccess: '='
        },
        link: function (scope) {
            const workgroupId = scope.workgroup.id;
            const year = scope.year;

            scope.isLoading = true;
            scope.disableGenerate = true;
            scope.disableDownload = true;

            scope.downloadStatus = {
                workloadSummaries: {
                    isEmpty: true,
                    isLessThanOneHourOld: true,
                    disableDownload: true,
                    disableGenerate: false,
                    fileStatus: ""
                },
                workloadSnapshots: {
                    isEmpty: true,
                    isLessThanOneHourOld: true
                }
            };

            ApiService.get(`/api/workloadSummaryReport/years/${year}/download/status`).then(metadata => {
                Object.keys(metadata).forEach(file => {
                    const isEmpty = metadata[file].contentLength === 0;
                    const isLessThanOneHourOld = scope.IsDateLessThanOneHourAgo(metadata[file].lastModified);

                    scope.downloadStatus[file].isEmpty = isEmpty;
                    scope.downloadStatus[file].isLessThanOneHourOld = isLessThanOneHourOld;

                    if (isEmpty && isLessThanOneHourOld) {
                        scope.downloadStatus[file].disableDownload = true;
                        scope.downloadStatus[file].disableGenerate = true;
                        scope.downloadStatus[file].fileStatus = "In progress, check back later.";
                    } else if (isEmpty && !isLessThanOneHourOld) {
                        scope.downloadStatus[file].disableDownload = true;
                        scope.downloadStatus[file].disableGenerate = false;
                        scope.downloadStatus[file].fileStatus = "File creation failed, please try again.";
                    } else {
                        scope.downloadStatus[file].disableDownload = false;
                        scope.downloadStatus[file].disableGenerate = false;
                        scope.downloadStatus[file].fileStatus = "Created: " + new Date(metadata[file].lastModified).toLocaleString();
                    }
                });

                scope.isLoading = false;
            });

            scope.generate = () => {
                scope.downloadStatus.workloadSummaries.disableGenerate = true;
                scope.downloadStatus.workloadSummaries.fileStatus = "In progress, check back later.";

                ApiService.post(`/api/workloadSummaryReport/${workgroupId}/years/${year}/generateMultiple`, null);
            };

            scope.download = (file) => {
                let reportName;
                if (file === "workloadSummaries") {
                    reportName = `Summary Report`;
                } else if (file === "workloadSnapshots") {
                    reportName = `Snapshots`;
                }

                ApiService.postWithResponseType(`/api/workloadSummaryReport/${scope.workgroup.id}/years/${year}/downloadMultiple/${file}`, "", "", 'arraybuffer').then(
                    response => {
                        var url = window.URL.createObjectURL(
                            new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                        );
                        var a = window.document.createElement('a'); // eslint-disable-line
                        a.href = url;
                        a.download = `${year} Workload ${reportName}.xlsx`;
                        window.document.body.appendChild(a); // eslint-disable-line
                        a.click();
                        a.remove();  //afterwards we remove the element again
                    });
            };

            scope.IsDateLessThanOneHourAgo = (date) => {
                const oneHour = 60 * 60 * 1000;
                const oneHourAgo = Date.now() - oneHour;

                return date > oneHourAgo;
            };
        }
    };
};

export default downloadSummary;
