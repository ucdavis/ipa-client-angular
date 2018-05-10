// Directives
import workloadTable from './directives/workloadTable/workloadTable.js';
import workloadHeader from './directives/workloadHeader/workloadHeader.js';

// Services
import WorkloadSummaryActions from './services/WorkloadSummaryActions.js';
import WorkloadSummaryReducers from './services/WorkloadSummaryReducers.js';
import WorkloadSummaryService from './services/WorkloadSummaryService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';

// Controllers
import WorkloadSummaryReportCtrl from './workloadSummaryReportCtrl.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./workloadSummaryReportCtrl.html'),
		controller: 'WorkloadSummaryReportCtrl'
	})
	.otherwise({
		redirectTo: function () {
			window.location = "/not-found.html";
		}
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const workloadSummaryReportApp = angular.module("workloadSummaryReportApp", dependencies)
.directive('workloadHeader', workloadHeader)
.directive('workloadTable', workloadTable)
.controller('WorkloadSummaryReportCtrl', WorkloadSummaryReportCtrl)
.service('WorkloadSummaryActions', WorkloadSummaryActions)
.service('WorkloadSummaryReducers', WorkloadSummaryReducers)
.service('WorkloadSummaryService', WorkloadSummaryService)
.service('ApiService', ApiService)
.config(config)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE"
});

export default workloadSummaryReportApp;
