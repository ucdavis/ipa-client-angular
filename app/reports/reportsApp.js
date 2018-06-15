// Services
//import DeansOfficeReportActions from './deansOffice/services/deansOfficeReportActions.js';
//import DeansOfficeReportReducers from './deansOffice/services/deansOfficeReportReducers.js';
//import DeansOfficeReportService from './deansOffice/services/deansOfficeReportService.js';

// Controllers
import DeansOfficeReportCtrl from './deansOffice/deansOfficeReportCtrl.js';

// Shared services

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year/deansOfficeReport", {
		template: require('./deansOffice/deansOfficeReportCtrl.html'),
		controller: 'DeansOfficeReportCtrl',
		resolve: {
			validate: function (AuthService, $route) {
				return AuthService.validate().then(function () {
					if ($route.current.params.workgroupId) {
						//DeansOfficeReportActions.getInitialState();
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
const reportsApp = angular.module("reportsApp", dependencies)
.controller('DeansOfficeReportCtrl', DeansOfficeReportCtrl)
//.service('DeansOfficeReportActions', DeansOfficeReportActions)
//.service('DeansOfficeReportReducers', DeansOfficeReportReducers)
//.service('DeansOfficeReportService', DeansOfficeReportService)
.config(config)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE"
});

export default reportsApp;
