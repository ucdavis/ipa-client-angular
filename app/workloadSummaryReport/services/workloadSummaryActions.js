class WorkloadSummaryActions {
	constructor(WorkloadSummaryReducers, WorkloadSummaryService, $rootScope, ActionTypes) {
		this.WorkloadSummaryReducers = WorkloadSummaryReducers;
		this.WorkloadSummaryService = WorkloadSummaryService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year) {
				var _self = this;

				this._getCourses(workgroupId, year);
			},
			_getCourses: function (workgroupId, year) {
				WorkloadSummaryService.getCourses(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.INIT_STATE,
						payload: {
							courses: payload
						}
					});
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			}
		};
	}
}

WorkloadSummaryActions.$inject = ['WorkloadSummaryReducers', 'WorkloadSummaryService', '$rootScope', 'ActionTypes'];

export default WorkloadSummaryActions;