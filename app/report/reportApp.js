import workloadSummary from './workloadSummary/directives/workloadSummary/workloadSummary.js';
import workloadHeader from './workloadSummary/directives/workloadHeader/workloadHeader.js';

// Dependencies
var dependencies = [
	"sharedApp",
	"ngRoute"
];

// Config
function config ($routeProvider) {
	return $routeProvider
	.when("/workloadSummary/:workgroupId/:year", {
		template: require('./workloadSummary/workloadSummary.html')
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
.directive('workloadSummary', workloadSummary)
.directive('workloadHeader', workloadHeader)
.config(config)
.constant('ActionTypes', {
	INIT_STATE: "INIT_STATE"
});

export default reportApp;
