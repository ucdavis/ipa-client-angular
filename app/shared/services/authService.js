'use strict';

/**
 * @ngdoc service
 * @name ipaClientAngularApp.authService
 * @description
 * # authService
 * Service in the ipaClientAngularApp.
 */
angular.module('sharedApp')
	.service('authService', function ($http, $window, $q, $location, $rootScope) {
		return {
			activeWorkgroup: {},
			activeYear: 0,
			userWorkgroups: [],
			displayName: "",

			/**
			 * Validates the given JWT token with the backend.
			 */
			validate: function (token, workgroupId, year) {
				var deferred = $q.defer();
				var userRoles = this.getUserRoles();
				var displayName = localStorage.getItem('displayName');
				var scope = this;

				$http.post(serverRoot + '/login', { token: token, userRoles: userRoles, displayName: displayName }, { withCredentials: true }).then(function (response) {
					// Token may be null if we are redirecting
					if (response.data != null && response.data.token !== null) {
						var token = response.data.token;

						$http.defaults.headers.common.Authorization = 'Bearer ' + token;

						localStorage.setItem('JWT', token);
						localStorage.setItem('userRoles', JSON.stringify(response.data.userRoles));
						localStorage.setItem('displayName', response.data.displayName);

						// If workgroupId or year NOT set
						if ( !workgroupId || !year) {
							scope.fallbackToDefaultUrl();
							$rootScope.$emit('sharedStateSet', scope.getSharedState());
							deferred.reject();
						} else {
							scope.setSharedState(workgroupId, year, response.data.displayName);
						}

						deferred.resolve(response);
					} else if(response.data != null && response.data.redirect != null && response.data.redirect.length > 0) {
						// Received a request to redirect to CAS. Obey.
						localStorage.removeItem('JWT');
						localStorage.removeItem('userRoles');
						localStorage.removeItem('displayName');
						$window.location.href = response.data.redirect + "?ref=" + document.URL;

						deferred.reject();
					}
				}, function (error) {
					if (error.status == 400) {
						// Token is invalid. Grab a new token
						localStorage.removeItem('JWT');
						location.reload();

					} else if (error.status == 403) {
						// User has no access, redirect to Access Denied page
						console.error("Authentication request received a 403. Redirecting to access denied page ...");
						$window.location.href = "/access-denied.html";
					} else if(error.status == -1) {
						console.error("Request was aborted or server was not found. Check that the backend is running.");
						$window.location.href = "/unknown-error.html";
					} else {
						console.error("Unknown error occurred while authenticating. Details:");
						console.error(error);
						$window.location.href = "/unknown-error.html";
					}
				});

				return deferred.promise;
			},

			logout: function () {
				localStorage.removeItem('JWT');
				localStorage.removeItem('userRoles');
				localStorage.removeItem('displayName');
				$window.location.href = serverRoot + "/logout";
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
			},

			setSharedState: function (workgroupId, year, displayName) {
				var scope = this;
				var userRoles = scope.getUserRoles();
				scope.activeYear = year;
				scope.displayName = displayName;

				for (var i = 0; i < userRoles.length; i++) {
					userRole = userRoles[i];
					var workgroup = {
						id: userRole.workgroupId,
						name: userRole.workgroupName
					}

					// Append to userWorkgroups iff workgroup is valid and avoid duplicates
					if (workgroup.id > 0 && _array_findById(scope.userWorkgroups, workgroup.id) == undefined) {
						scope.userWorkgroups.push(workgroup);
					}

					if (userRole.workgroupId == workgroupId) {
						scope.activeWorkgroup = workgroup;
					}
				}

				$rootScope.$emit('sharedStateSet', scope.getSharedState());
			},

			getSharedState: function () {
				return {
					workgroup: this.activeWorkgroup,
					year: this.activeYear,
					userWorkgroups: this.userWorkgroups,
					displayName: this.displayName
				}
			}
		};
	});
