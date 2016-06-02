'use strict';
var serverRoot = 'http://localhost:8080'

/**
 * @ngdoc service
 * @name ipaClientAngularApp.authService
 * @description
 * # authService
 * Service in the ipaClientAngularApp.
 */
angular.module('sharedApp')
	.service('authService', function ($http, $window, $q) {
		return {
			validate: function (token) {
				var deferred = $q.defer();
				console.log('validating', token);

				$http.post(serverRoot + '/auth/validate', { token: token }, { withCredentials: true }).then(function (response) {
					// Token may be null if we are redirecting
					if (response.data != null && response.data.token !== null) {
						var token = response.data.token;
						$http.defaults.headers.common.Authorization = 'Bearer ' + token;
						localStorage.setItem('JWT', token);

						deferred.resolve(response);
					} else {
						// Received a request to redirect to CAS. Obey.
						localStorage.removeItem('JWT');
						$window.location.href = response.data.redirect + "?ref=" + document.URL;

						deferred.reject();
					}
				});

				return deferred.promise;
			},


			hasRole: function (role) {
				return $http.get(serverRoot + '/api/role/' + role).then(function (response) {
					console.log(response);
					return response.data;
				});
			},

			whoami: function () {
				return $http.get(serverRoot + '/api/whoami/').then(function (response) {
					return response.data.loginId;
				});
			}
		};
	});
