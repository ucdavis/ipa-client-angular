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
	.service('authService', function ($http, $window, $q, $location, $rootScope) {
		return {
			activeWorkgroup: {},
			activeYear: 0,
			userWorkgroups: [],
			validate: function (token, workgroupId, year) {
				var deferred = $q.defer();
				var userRoles = this.getUserRoles();
				var scope = this;

				$http.post(serverRoot + '/login', { token: token, userRoles: userRoles }, { withCredentials: true }).then(function (response) {
					// Token may be null if we are redirecting
					if (response.data != null && response.data.token !== null) {
						var token = response.data.token;
						$http.defaults.headers.common.Authorization = 'Bearer ' + token;
						localStorage.setItem('JWT', token);
						localStorage.setItem('userRoles', JSON.stringify(response.data.userRoles));

						// If workgroupId or year NOT set
						if ( !workgroupId || !year) {
							scope.fallbackToDefaultUrl();
							$rootScope.$emit('sharedStateSet', scope.getSharedState());
							deferred.reject();
						} else {
							scope.setSharedState(workgroupId, year);
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
			logout: function () {
				localStorage.removeItem('JWT');
				localStorage.removeItem('userRoles');
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
			setSharedState: function (workgroupId, year) {
				var scope = this;
				var userRoles = scope.getUserRoles();
				scope.activeYear = year;

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
					userWorkgroups: this.userWorkgroups
				}
			}
		};
	});
