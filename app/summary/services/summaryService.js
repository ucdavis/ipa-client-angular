/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
class SummaryService {
	constructor (ApiService) {
		var self = this;
		this.apiService = ApiService;
		return {
			getInitialState: function(workgroupId, year) {
				return self.apiService.get("/api/summaryView/" + workgroupId + "/" + year);
			}
		};
	}
}

SummaryService.$inject = ['ApiService'];

export default SummaryService;
