// Services
import DeansOfficeReportActions from './deansOffice/services/deansOfficeReportActions.js';
import DeansOfficeReportReducers from './deansOffice/services/deansOfficeReportReducers.js';
import DeansOfficeReportService from './deansOffice/services/deansOfficeReportService.js';

// Controllers
import DeansOfficeReportCtrl from './deansOffice/deansOfficeReportCtrl.js';

// Shared services
import TermService from './../shared/services/TermService.js';
import DwService from './../shared/services/DwService.js';
import InstructorTypeService from './../shared/services/InstructorTypeService.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/deansOfficeReport", {
		template: require('./deansOfficeReport/deansOfficeReportCtrl.html'),
		controller: 'deansOfficeReportCtrl',
		resolve: {
			validate: function (AuthService, $route, DeansOfficeReportActions) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						DeansOfficeReportActions.getInitialState();
					}
				});
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
const reportApp = angular.module("reportApp", dependencies)
.controller('DeansOfficeReportCtrl', DeansOfficeReportCtrl)
.service('DeansOfficeReportActions', DeansOfficeReportActions)
.service('DeansOfficeReportReducers', DeansOfficeReportReducers)
.service('DeansOfficeReportService', DeansOfficeReportService)
.service('TermService', TermService)
.service('DwService', DwService)
.service('InstructorTypeService', InstructorTypeService)
.config(config)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE"
});

export default reportApp;
