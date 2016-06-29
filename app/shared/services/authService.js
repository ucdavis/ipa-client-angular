'use strict';

/**
 * URL for the IPA API server ("the backend")
 */
var serverRoot = 'http://localhost:8080'

/**
 * @ngdoc service
 * @name ipaClientAngularApp.authService
 * @description
 * # authService
 * Service in the ipaClientAngularApp.
 */
angular.module('sharedApp')
	.service('authService', function ($http, $window, $q, $location) {
		return {
			validate: function (token, workgroupId, year) {
				var deferred = $q.defer();
				var userRoles = this.getUserRoles();
				var self = this;

				$http.post(serverRoot + '/login', { token: token, userRoles: userRoles }, { withCredentials: true }).then(function (response) {
					// Token may be null if we are redirecting
					if (response.data != null && response.data.token !== null) {
						var token = response.data.token;
						$http.defaults.headers.common.Authorization = 'Bearer ' + token;
						localStorage.setItem('JWT', token);
						localStorage.setItem('userRoles', JSON.stringify(response.data.userRoles));

						// If workgroupId or year NOT set
						if ( !workgroupId || !year) {
							self.fallbackToDefaultUrl();
							deferred.reject();
						}

						deferred.resolve(response);
					} else if(response.data != null && response.data.redirect != null && response.data.redirect.length > 0) {
						// Received a request to redirect to CAS. Obey.
						localStorage.removeItem('JWT');
						localStorage.removeItem('userRoles');
						$window.location.href = response.data.redirect + "?ref=" + document.URL;

						deferred.reject();
					}
				});

				return deferred.promise;
			},
			getUserRoles: function () {
				var userRoles = null;

				try {
					userRoles = JSON.parse(localStorage.getItem('userRoles'));
				} catch(err) {
					console.log(err);
				}

				return userRoles;
			},
			fallbackToDefaultUrl: function() {
				var userRoles = this.getUserRoles();
				for (var i = 0; i < userRoles.length; i++) {
					userRole = userRoles[i];
					
					if (userRole.workgroupId > 0) {
						var workgroupId = userRole.workgroupId;
						var year = new Date().getFullYear();
						var url = '/' + workgroupId + '/' + year;
						$location.path(url);
					}
				}
			}
		};
	});
