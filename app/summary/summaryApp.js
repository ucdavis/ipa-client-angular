import './css/summary.css';

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
import supportSummary from './directives/supportSummary/supportSummary.js';

import instructorSummary from './directives/instructorSummary/instructorSummary.js';
import instructorHeader from './directives/instructorSummary/instructorHeader/instructorHeader.js';
import scheduledCourses from './directives/instructorSummary/scheduledCourses/scheduledCourses.js';
import supportCalls from './directives/instructorSummary/supportCalls/supportCalls.js';
import teachingCalls from './directives/instructorSummary/teachingCalls/teachingCalls.js';

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
		resolve: {
			validate: function (AuthService, $route, SummaryActionCreators) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						SummaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
					}
				});
			}
		}
	})
	.when("/", {
		template: require('./SummaryCtrl.html'),
		controller: "SummaryCtrl",
		resolve: {
			validate: function (AuthService) {
				return AuthService.validate();
			}
		}
	})
	.otherwise({
		redirectTo: "/"
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const summaryApp = angular.module("summaryApp", dependencies) // eslint-disable-line no-undef
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
.directive('instructorHeader', instructorHeader)
.directive('scheduledCourses', scheduledCourses)
.directive('supportCalls', supportCalls)
.directive('teachingCalls', teachingCalls)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	SELECT_TERM: "SELECT_TERM"
});

export default summaryApp;
