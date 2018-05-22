import './css/teachingCallResponseReport.css';

// Controller imports
import TeachingCallResponseReportCtrl from './controllers/TeachingCallResponseReportCtrl.js';

// Service imports
import TeachingCallResponseReportActionCreators from './services/teachingCallResponseReportActionCreators.js';
import TeachingCallResponseReportService from './services/teachingCallResponseReportService.js';
import TeachingCallResponseReportStateService from './services/teachingCallResponseReportStateService.js';

// Shared service imports
import ApiService from './../shared/services/ApiService.js';
import DwService from './../shared/services/DwService.js';
import TermService from './../shared/services/TermService.js';
import AuthService from './../shared/services/AuthService.js';
import StringService from './../shared/services/StringService.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./templates/TeachingCallResponseReportCtrl.html'),
		controller: "TeachingCallResponseReportCtrl"
	})
	.otherwise({
		redirectTo: function () {
			window.location = "/not-found.html";
		}
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const teachingCallResponseReportApp = angular.module("teachingCallResponseReportApp", dependencies)
.config(config)
.controller('TeachingCallResponseReportCtrl', TeachingCallResponseReportCtrl)
.service('TeachingCallResponseReportActionCreators', TeachingCallResponseReportActionCreators)
.service('TeachingCallResponseReportService', TeachingCallResponseReportService)
.service('TeachingCallResponseReportStateService', TeachingCallResponseReportStateService)
.service('DwService', DwService)
.service('StringService', StringService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE"
});

export default teachingCallResponseReportApp;