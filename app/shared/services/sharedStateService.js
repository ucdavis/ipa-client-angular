'use strict';

/**
 * @ngdoc service
 * @name sharedApp.sharedStateService
 * @description
 * # sharedStateService
 * Service in the sharedApp.
 * Central location for sharedState information.
 */
angular.module('sharedApp').service('sharedStateService', function ($window, $routeParams) {
	return {
		year: '',
		workgroupCode: '',
	
		setWorkgroupCode: function (workgroupCode) {
			this.workgroupCode = workgroupCode;
		},
		getWorkgroupCode: function () {
			return this.workgroupCode;
		},
		setYear: function (year) {
			this.year = year;
		},
		getYear: function () {
			return this.year;
		}
	}
});