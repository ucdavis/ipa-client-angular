import './css/admin.css';

// Controllers
import AdminCtrl from './controllers/adminCtrl.js';

// Services
import AdminActionCreators from './services/adminActionCreators.js';
import AdminService from './services/adminService.js';
import AdminStateService from './services/adminStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./adminCtrl.html'),
		controller: "AdminCtrl"
	})
	.when("/", {
		template: require('./adminCtrl.html'),
		controller: "AdminCtrl"
	})
	.otherwise({
		redirectTo: "/"
	});
}

config.$inject = ['$routeProvider'];

// App declaration
const adminApp = angular.module("adminApp", dependencies)
.config(config)
.controller('AdminCtrl', AdminCtrl)
.service('AdminActionCreators', AdminActionCreators)
.service('AdminService', AdminService)
.service('AdminStateService', AdminStateService)
.service('ApiService', ApiService)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE",
	UPDATE_WORKGROUP: "UPDATE_WORKGROUP",
	REMOVE_WORKGROUP: "REMOVE_WORKGROUP",
	ADD_WORKGROUP: "ADD_WORKGROUP"
});

export default adminApp;
