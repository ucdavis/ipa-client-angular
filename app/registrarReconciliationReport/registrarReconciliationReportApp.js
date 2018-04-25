// ScheduleSummaryReport controllers
import RegistrarReconciliationReportCtrl from './controllers/registrarReconciliationReportCtrl.js';

// ScheduleSummaryReport services
import RegistrarReconciliationReportActionCreators from './services/registrarReconciliationReportActionCreators.js';
import RegistrarReconciliationReportService from './services/registrarReconciliationReportService.js';
import RegistrarReconciliationReportStateService from './services/registrarReconciliationReportStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode", {
		template: require('./templates/registrarReconciliationReportCtrl.html'),
		controller: "RegistrarReconciliationReportCtrl"
	})
	.when("/", {
		template: require('./templates/registrarReconciliationReportCtrl.html'),
		controller: "RegistrarReconciliationReportCtrl"
	})
	.otherwise({
		redirectTo: function () {
			window.location = "/not-found.html";
		}
	});
};

config.$inject = ['$routeProvider'];

// App declaration
const registrarReconciliationReportApp = angular.module("registrarReconciliationReportApp", dependencies)
.config(config)
.controller('RegistrarReconciliationReportCtrl', RegistrarReconciliationReportCtrl)
.service('RegistrarReconciliationReportActionCreators', RegistrarReconciliationReportActionCreators)
.service('RegistrarReconciliationReportService', RegistrarReconciliationReportService)
.service('RegistrarReconciliationReportStateService', RegistrarReconciliationReportStateService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	UPDATE_SECTION: "UPDATE_SECTION",
	CREATE_SECTION: "CREATE_SECTION",
	UPDATE_ACTIVITY: "UPDATE_ACTIVITY",
	DELETE_ACTIVITY: "DELETE_ACTIVITY",
	CREATE_ACTIVITY: "CREATE_ACTIVITY",
	CREATE_SYNC_ACTION: "CREATE_SYNC_ACTION",
	DELETE_SYNC_ACTION: "DELETE_SYNC_ACTION",
	ASSIGN_INSTRUCTOR: "ASSIGN_INSTRUCTOR",
	UNASSIGN_INSTRUCTOR: "UNASSIGN_INSTRUCTOR",
	DELETE_SECTION: "DELETE_SECTION",
	ADD: "Add",
	DELETE: "Delete",
	UPDATE: "Change"
});

export default registrarReconciliationReportApp;
