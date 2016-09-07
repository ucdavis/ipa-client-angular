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

			/**
			 * Validates the given JWT token with the backend.
			 */
			validate: function (token, workgroupId, year, ignoreFallBackUrl) {
				var deferred = $q.defer();
				var userRoles = this.getUserRoles();
				var displayName = localStorage.getItem('displayName');
				var termStates = this.getTermStates();
				var scope = this;
				var requestPayload = {
					token: token,
					userRoles: userRoles,
					displayName: displayName,
					termStates: termStates
				};

				$http.post(serverRoot + '/login', requestPayload, { withCredentials: true }).then(function (response) {
					// Token may be null if we are redirecting
					if (response.data != null && response.data.token !== null) {
						var token = response.data.token;

						$http.defaults.headers.common.Authorization = 'Bearer ' + token;

						localStorage.setItem('JWT', token);
						localStorage.setItem('userRoles', JSON.stringify(response.data.userRoles));
						localStorage.setItem('displayName', response.data.displayName);
						localStorage.setItem('termStates', JSON.stringify(response.data.termStates));

						// If workgroupId or year NOT set, and the ignoreFallBackUrl is not set to true
						if ( !(workgroupId && year) && !ignoreFallBackUrl) {
							scope.fallbackToDefaultUrl();
							$rootScope.$emit('sharedStateSet', scope.getSharedState());
							deferred.reject();
						} else {
							scope.setSharedState(workgroupId, year, response.data.displayName, response.data.termStates);
						}

						deferred.resolve(response);
					} else if(response.data != null && response.data.redirect != null && response.data.redirect.length > 0) {
						// Received a request to redirect to CAS. Obey.
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
				});

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

			fallbackToDefaultUrl: function() {
				var scope = this;
				var userRoles = scope.getUserRoles();
				for (var i = 0; i < userRoles.length; i++) {
					userRole = userRoles[i];

					if (userRole.workgroupId > 0) {
						var workgroupId = userRole.workgroupId;
						var year = new Date().getFullYear();
						var url = '/' + workgroupId + '/' + year;
						$location.path(url);
					} else if (userRole.workgroupId == 0 && userRole.roleName == "admin") {
						scope.isAdmin = true;
					}

				}

				// If no workgroups...
				if (scope.isAdmin) {
					// Admin users can go to the administration view
					$window.location.href = "/admin";
				} else {
					// Other users don't have access to any workgroup, redirect to Access Denied page
					console.error("Authentication request received a 403. Redirecting to access denied page ...");
					localStorage.clear();
					$window.location.href = "/access-denied.html";
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

					// Set isAdmin
					if (workgroup.id == 0 && userRole.roleName == "admin") {
						scope.isAdmin = true;
					} else if (_array_findById(scope.userWorkgroups, workgroup.id) == undefined) {
						// Append to userWorkgroups iff workgroup is valid and avoid duplicates
						scope.userWorkgroups.push(workgroup);

						if (userRole.workgroupId == workgroupId) {
							scope.activeWorkgroup = workgroup;
						}
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
