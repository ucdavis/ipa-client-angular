/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
summaryApp.factory("summaryService", this.summaryService = function(apiService) {
	return {
		getInitialState: function(workgroupId, year) {
			return apiService.get("/api/summaryView/" + workgroupId + "/" + year);
		}
	};
});
