// Controllers
import SummaryCtrl from './SummaryCtrl.js';

// Services
import SummaryActionCreators from './services/summaryActionCreators.js';
import SummaryService from './services/summaryService.js';
import SummaryStateService from './services/summaryStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';

// Directives
import workgroupSummary from './directives/workgroupSummary/workgroupSummary.js';
import instructorSummary from './directives/instructorSummary/instructorSummary.js';
import supportSummary from './directives/supportSummary/supportSummary.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./SummaryCtrl.html'),
		controller: "SummaryCtrl",
		reloadOnSearch: false
	})
	.when("/", {
		template: require('./SummaryCtrl.html'),
		controller: "SummaryCtrl"
	})
	.otherwise({
		redirectTo: "/"
	});
};

config.$inject = ['$routeProvider'];

// App declaration
const summaryApp = angular.module("summaryApp", dependencies)
.config(config)
.controller('SummaryCtrl', SummaryCtrl)
.service('SummaryActionCreators', SummaryActionCreators)
.service('SummaryService', SummaryService)
.service('SummaryStateService', SummaryStateService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.directive('workgroupSummary', workgroupSummary)
.directive('instructorSummary', instructorSummary)
.directive('supportSummary', supportSummary)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	SELECT_TERM: "SELECT_TERM"
});

export default summaryApp;
