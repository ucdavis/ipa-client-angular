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
			termStates: [],
			isAdmin: 0,

			validateToken: function (token) {
				var deferred = $q.defer();

				$http.post(serverRoot + '/login', { token: token }, { withCredentials: true }).then(function (response) {
					// Token may be null if we are redirecting
					if (response.data != null && response.data.token !== null) {
						var token = response.data.token;

						$http.defaults.headers.common.Authorization = 'Bearer ' + token;

						localStorage.setItem('JWT', token);

						deferred.resolve(response);
					} else if(response.data != null && response.data.redirect != null && response.data.redirect.length > 0) {
						// Received a request to redirect to CAS. Obey!
						localStorage.removeItem('JWT');
						localStorage.removeItem('userRoles');
						localStorage.removeItem('displayName');
						localStorage.removeItem('termStates');
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
						localStorage.clear();
						$window.location.href = "/access-denied.html";
					} else if(error.status == -1) {
						console.error("Request was aborted or server was not found. Check that the backend is running.");
						$window.location.href = "/unknown-error.html";
					} else {
						console.error("Unknown error occurred while authenticating. Details:");
						console.error(error);
						$window.location.href = "/unknown-error.html";
					}

					deferred.reject();
				});

				return deferred.promise;
			},

			validateState: function (data, workgroupId, year, ignoreFallBackUrl) {
				localStorage.setItem('userRoles', JSON.stringify(data.userRoles));
				localStorage.setItem('displayName', data.displayName);
				localStorage.setItem('termStates', JSON.stringify(data.termStates));

				// If workgroupId or year NOT set, and the ignoreFallBackUrl is not set to true
				if ( !(workgroupId && year) && !ignoreFallBackUrl) {
					this.fallbackToDefaultUrl();
					$rootScope.$emit('sharedStateSet', this.getSharedState());
					return false;
				} else {
					this.setSharedState(workgroupId, year, data.displayName, data.termStates);
				}

				return true;
			},

			/**
			 * Validates the given JWT token with the backend.
			 */
			validate: function (token, workgroupId, year, ignoreFallBackUrl) {
				var deferred = $q.defer();
				var scope = this;

				scope.validateToken(token).then(
					// Success
					function (response) {
						if(scope.validateState(response.data, workgroupId, year, ignoreFallBackUrl)) {
							deferred.resolve();
						} else {
							deferred.reject();
						}
					},
					// Failure
					function (response) {
						deferred.reject();
					}
				);

				return deferred.promise;
			},

			logout: function () {
				localStorage.removeItem('JWT');
				localStorage.removeItem('userRoles');
				localStorage.removeItem('displayName');
				localStorage.removeItem('termStates');
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

			getTermStates: function () {
				var termStates = null;

				try {
					termStates = JSON.parse(localStorage.getItem('termStates'));
				} catch(err) {
					console.log(err);
				}

				return termStates;
			},

			fallbackToDefaultUrl: function () {
				var scope = this;
				var userRoles = scope.getUserRoles();
				for (var i = 0; i < userRoles.length; i++) {
					userRole = userRoles[i];

					if (userRole.workgroupId > 0) {
						var workgroupId = userRole.workgroupId;
						var year = new Date().getFullYear();
						var url = '/' + workgroupId + '/' + year;
						$location.path(url);
						return;
					} else if (userRole.workgroupId == 0 && userRole.roleName == "admin") {
						scope.isAdmin = true;
					}

				}

				// If no workgroups...
				if (scope.isAdmin) {
					// Admin users can go to the administration view
					$window.location.href = "/admin";
					return;
				} else {
					// Other users don't have access to any workgroup, redirect to Access Denied page
					console.error("Authentication request received a 403. Redirecting to access denied page ...");
					localStorage.clear();
					$window.location.href = "/access-denied.html";
					return;
				}

			},

			setSharedState: function (workgroupId, year, displayName, termStates) {
				var scope = this;
				var userRoles = scope.getUserRoles();
				scope.activeYear = year;
				scope.displayName = displayName;
				scope.termStates = scope.getTermStates();

				for (var i = 0; i < userRoles.length; i++) {
					userRole = userRoles[i];
					var roles = [];
					roles.push(userRole.roleName);

					var workgroup = {
						id: userRole.workgroupId,
						name: userRole.workgroupName,
						roles: roles
					}

					// Set as active workgroup if matches
					if (userRole.workgroupId == workgroupId) {
						scope.activeWorkgroup = workgroup;
					}

					// Set isAdmin
					if (workgroup.id == 0 && userRole.roleName == "admin") {
						scope.isAdmin = true;
					} else if (_array_findById(scope.userWorkgroups, workgroup.id) == undefined) {
						// Append to userWorkgroups iff workgroup is valid and avoid duplicates
						scope.userWorkgroups.push(workgroup);
					} else {
						// Add role if necessary
						var userWorkgroup = _array_findById(scope.userWorkgroups, workgroup.id);
						userWorkgroup.roles.push(userRole.roleName);
					}
				}

				$rootScope.$emit('sharedStateSet', scope.getSharedState());
			},

			getSharedState: function () {
				return {
					workgroup: this.activeWorkgroup,
					year: this.activeYear,
					userWorkgroups: this.userWorkgroups,
					displayName: this.displayName,
					termStates: this.termStates,
					isAdmin: this.isAdmin,
					activeWorkgroup: this.activeWorkgroup
				}
			},

			toggleSidebarState: function () {
				var sidebarCollapsed = localStorage.getItem('sidebarCollapsed') == 'true';
				localStorage.setItem('sidebarCollapsed', !sidebarCollapsed);
				$rootScope.$emit('sidebarStateToggled', !sidebarCollapsed);
			},

			isSidebarCollapsed: function () {
				return localStorage.getItem('sidebarCollapsed') == 'true';
			}
		};
	});
