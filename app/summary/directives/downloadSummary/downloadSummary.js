import './downloadSummary.css';

let downloadSummary = function (ApiService) {
    return {
        restrict: 'E',
        template: require('./downloadSummary.html'),
        replace: true,
        scope: {
        },
        link: function (scope) {
            const year = localStorage.getItem("year");
            const workgroupId = JSON.parse(localStorage.getItem("workgroup")).id;
            scope.disableGenerate = true;
            scope.disableDownload = true;

            ApiService.get(`/api/workloadSummaryReport/download/status`).then(metadata => {
                if (metadata) {
                    const emptyFile = metadata.contentLength === 0;

                    scope.disableDownload = emptyFile;
                    scope.disableGenerate = emptyFile && scope.IsDateMoreThanOneHourAgo(metadata.lastModified);
                    scope.lastModified = emptyFile ? "" : new Date(metadata.lastModified).toLocaleString();
                } else {
                    scope.disableDownload = true;
                    scope.disableGenerate = false;
                }
            });

            scope.generate = () => {
                scope.disableGenerate = true;

                // const workgroupIds = JSON.parse(localStorage.getItem("currentUser"))?.userRoles.filter(r => r.roleName === "academicPlanner").map(r => r.workgroupId);
                ApiService.get(`/api/workloadSummaryReport/${workgroupId}/years/${year}/generateMultiple`);
            };

            scope.download = () => {
                ApiService.postWithResponseType(`/api/workloadSummaryReport/${workgroupId}/years/${year}/downloadMultiple`, "", "", 'arraybuffer').then(
                    response => {
                        var url = window.URL.createObjectURL(
                            new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
                        );
                        var a = window.document.createElement('a'); // eslint-disable-line
                        a.href = url;
                        a.download = `Workload Report ${year}.xlsx`;
                        window.document.body.appendChild(a); // eslint-disable-line
                        a.click();
                        a.remove();  //afterwards we remove the element again
                    });
            };

            scope.IsDateMoreThanOneHourAgo = (date) => {
                const oneHour = 60 * 60 * 1000;
                const oneHourAgo = Date.now() - oneHour;

                return date > oneHourAgo;
            };
        }
    };
};

export default downloadSummary;
