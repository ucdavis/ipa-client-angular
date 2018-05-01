// Controllers
import LocationCtrl from './controllers/LocationCtrl.js';
import TagCtrl from './controllers/TagCtrl.js';
import UserCtrl from './controllers/UserCtrl.js';
import WorkgroupCtrl from './controllers/WorkgroupCtrl.js';

// Services
import WorkgroupActionCreators from './services/workgroupActionCreators.js';
import WorkgroupService from './services/workgroupService.js';
import WorkgroupStateService from './services/workgroupStateService.js';

// Shared services
import ApiService from './../shared/services/ApiService.js';
import TermService from './../shared/services/TermService.js';

// Directives
import peopleAndRoles from './directives/peopleAndRoles/peopleAndRoles.js';
import rolesTable from './directives/peopleAndRoles/rolesTable/rolesTable.js';
import instructorTypeSelector from './directives/peopleAndRoles/rolesTable/instructorTypeSelector/instructorTypeSelector.js';
import studentRoleSelector from './directives/peopleAndRoles/rolesTable/studentRoleSelector/studentRoleSelector.js';
import impersonationModal from './directives/modals/impersonationModal/impersonationModal.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/:workgroupId/:year", {
		template: require('./templates/WorkgroupCtrl.html'),
		controller: "WorkgroupCtrl",
		reloadOnSearch: false
	})
	.when("/", {
		template: require('./templates/WorkgroupCtrl.html'),
		controller: "WorkgroupCtrl"
	})
	.otherwise({
		redirectTo: "/"
	});

};

config.$inject = ['$routeProvider'];

// App declaration
const workgroupApp = angular.module("workgroupApp", dependencies)
.config(config)
.controller('LocationCtrl', LocationCtrl)
.controller('TagCtrl', TagCtrl)
.controller('UserCtrl', UserCtrl)
.controller('WorkgroupCtrl', WorkgroupCtrl)
.service('WorkgroupActionCreators', WorkgroupActionCreators)
.service('WorkgroupService', WorkgroupService)
.service('WorkgroupStateService', WorkgroupStateService)
.service('ApiService', ApiService)
.service('TermService', TermService)
.directive('peopleAndRoles', peopleAndRoles)
.directive('rolesTable', rolesTable)
.directive('instructorTypeSelector', instructorTypeSelector)
.directive('studentRoleSelector', studentRoleSelector)
.directive('impersonationModal', impersonationModal)
.constant('ActionTypes', {
	ADD_TAG: "ADD_TAG",
	REMOVE_TAG: "REMOVE_TAG",
	UPDATE_TAG: "UPDATE_TAG",
	ADD_LOCATION: "ADD_LOCATION",
	REMOVE_LOCATION: "REMOVE_LOCATION",
	UPDATE_LOCATION: "UPDATE_LOCATION",
	ADD_USER_COMPLETED: "ADD_USER_COMPLETED",
	REMOVE_USER: "REMOVE_USER",
	ADD_USER_ROLE: "ADD_USER_ROLE",
	REMOVE_USER_ROLE: "REMOVE_USER_ROLE",
	INIT_WORKGROUP: "INIT_WORKGROUP",
	SEARCH_USERS: "SEARCH_USERS",
	ADD_USER_PENDING: "ADD_USER_PENDING",
	UPDATE_USER_ROLE: "UPDATE_USER_ROLE",
	SET_ROLE_TAB: "SET_ROLE_TAB",
	CALCULATE_USER_ROLES: "CALCULATE_USER_ROLES",
	CALCULATE_ROLE_TOTALS: "CALCULATE_ROLE_TOTALS"
});

export default workgroupApp;
