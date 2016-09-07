'use strict';

/**
 * @ngdoc service
 * @name adminApp.adminActionCreators
 * @description
 * # adminActionCreators
 * Service in the adminApp.
 * Central location for sharedState information.
 */
adminApp.service('adminActionCreators', function (adminStateService, adminService, $rootScope, Role) {
	return {
		getInitialState: function () {
			adminService.getAdminView().then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				adminStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		}
	}
});
