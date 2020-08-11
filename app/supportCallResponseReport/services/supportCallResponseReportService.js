class SupportCallResponseReportService {
  constructor($http, $q, $window, ApiService) {
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.apiService = ApiService;

    return {
      getInitialState: function (workgroupId, year, termShortCode) {
        return ApiService.get(
          '/api/supportCallResponseReportView/workgroups/' +
            workgroupId +
            '/years/' +
            year +
            '/termCode/' +
            termShortCode
        );
      },
      download: function (workgroupId, year, termShortCode) {
        var deferred = $q.defer();

        let url = "";

        if (termShortCode) {
          url = window.serverRoot + "/api/supportCallResponseReportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode + "/generateExcel", { withCredentials: true };
        } else {
          url = window.serverRoot + "/api/supportCallResponseReportView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true };
        }

        $http.get(url)
        .then(function(payload) {
          $window.location.href = payload.data.redirect;
          deferred.resolve(payload.data);
        },
        function() {
          deferred.reject();
        });

        return deferred.promise;
      }
    };
  }
}

SupportCallResponseReportService.$inject = [
  '$http',
  '$q',
  '$window',
  'ApiService',
];

export default SupportCallResponseReportService;
