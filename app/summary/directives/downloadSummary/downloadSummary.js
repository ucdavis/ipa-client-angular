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

            ApiService.get(`/api/workloadSummaryReport/years/${year}/download/status`).then(metadata => {
                if (metadata) {
                    const isEmptyFile = metadata.contentLength === 0;
                    const isLessThanOneHourAgo = scope.IsDateLessThanOneHourAgo(metadata.lastModified);

                    if (isEmptyFile && isLessThanOneHourAgo) {
                        scope.disableDownload = true;
                        scope.disableGenerate = true;
                        scope.fileStatus = "In progress, check back later.";
                    } else if (isEmptyFile && !isLessThanOneHourAgo) {
                        scope.disableDownload = true;
                        scope.disableGenerate = false;
                        scope.fileStatus = "File creation failed, please try again.";
                    } else {
                        scope.disableDownload = false;
                        scope.disableGenerate = false;
                        scope.fileStatus = "Created: " + new Date(metadata.lastModified).toLocaleString();
                    }
                } else {
                    scope.disableDownload = true;
                    scope.disableGenerate = false;
                }
                scope.isLoading = false;
            });

            scope.generate = () => {
                scope.disableGenerate = true;
                scope.fileStatus = "In progress, check back later.";

                ApiService.get(`/api/workloadSummaryReport/${workgroupId}/years/${year}/generateMultiple`);
            };

            scope.download = () => {
                ApiService.postWithResponseType(`/api/workloadSummaryReport/${scope.workgroup.id}/years/${year}/downloadMultiple`, "", "", 'arraybuffer').then(
                    response => {
                        var url = window.URL.createObjectURL(
                            new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                        );
                        var a = window.document.createElement('a'); // eslint-disable-line
                        a.href = url;
                        a.download = `${year} Workload Summary Report.xlsx`;
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
