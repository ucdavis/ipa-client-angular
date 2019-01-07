import './css/report.css';

// Controllers
import RegistrarReconciliationReportCtrl from './controllers/registrarReconciliationReportCtrl.js';

// Services
import RegistrarReconciliationReportActionCreators from './services/registrarReconciliationReportActionCreators.js';
import RegistrarReconciliationReportService from './services/registrarReconciliationReportService.js';
import RegistrarReconciliationReportStateService from './services/registrarReconciliationReportStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';

// Directives
import activityDiff from './directives/activityDiff/activityDiff.js';
import changeAction from './directives/changeAction/changeAction.js';
import crnDiff from './directives/crnDiff/crnDiff.js';
import dayIndicatorDiff from './directives/dayIndicatorDiff/dayIndicatorDiff.js';
import endTimeDiff from './directives/endTimeDiff/endTimeDiff.js';
import locationDiff from './directives/locationDiff/locationDiff.js';
import seatsDiff from './directives/seatsDiff/seatsDiff.js';
import sectionDiff from './directives/sectionDiff/sectionDiff.js';
import startTimeDiff from './directives/startTimeDiff/startTimeDiff.js';
import syncActionList from './directives/syncActionList/syncActionList.js';
import instructorDiff from './directives/instructorDiff/instructorDiff.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/:termShortCode", {
		template: require('./registrarReconciliationReportCtrl.html'),
		controller: "RegistrarReconciliationReportCtrl",
		resolve: {
			validate: function (AuthService, $route, RegistrarReconciliationReportActionCreators) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						var hasAccess = AuthService.getCurrentUser().hasRole('academicPlanner', $route.current.params.workgroupId);

						if (hasAccess) {
							return RegistrarReconciliationReportActionCreators.getInitialState();
						} else {
							return { noAccess: true };
						}
					}
				});
			}
		}
	})
	.when("/", {
		template: require('./registrarReconciliationReportCtrl.html'),
		controller: "RegistrarReconciliationReportCtrl",
		resolve: {
			validate: function (AuthService) {
				return AuthService.validate();
			}
		}
	})
	.otherwise({
		redirectTo: function () {
			window.location = "/not-found.html";
		}
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const registrarReconciliationReportApp = angular.module("registrarReconciliationReportApp", dependencies) // eslint-disable-line no-undef
.config(config)
.controller('RegistrarReconciliationReportCtrl', RegistrarReconciliationReportCtrl)
.service('RegistrarReconciliationReportActionCreators', RegistrarReconciliationReportActionCreators)
.service('RegistrarReconciliationReportService', RegistrarReconciliationReportService)
.service('RegistrarReconciliationReportStateService', RegistrarReconciliationReportStateService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.directive('activityDiff', activityDiff)
.directive('changeAction', changeAction)
.directive('crnDiff', crnDiff)
.directive('dayIndicatorDiff', dayIndicatorDiff)
.directive('endTimeDiff', endTimeDiff)
.directive('locationDiff', locationDiff)
.directive('seatsDiff', seatsDiff)
.directive('sectionDiff', sectionDiff)
.directive('startTimeDiff', startTimeDiff)
.directive('syncActionList', syncActionList)
.directive('instructorDiff', instructorDiff)
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
