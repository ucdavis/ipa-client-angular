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
			validateToken: function (token) {
				var self = this;
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
						var message = "Request was aborted or server was not found. Check that the backend is running.";
						console.error(message);
						// Do not redirect until reportJsException comes back
						self.reportJsException(error, message).then(function(res) {
							$window.location.href = "/unknown-error.html";
						},
						function(res) {
							$window.location.href = "/unknown-error.html";
						});
					} else {
						var message = "Unknown error occurred while authenticating. Details:";
						console.error(message);
						console.error(error);
						// Do not redirect until reportJsException comes back
						self.reportJsException(error, message).then(function(res) {
							$window.location.href = "/unknown-error.html";
						},
						function(res) {
							$window.location.href = "/unknown-error.html";
						});
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
					var matchingRole = _.findWhere(data.userRoles, { workgroupId: Number(workgroupId) });
					if (matchingRole) {
						var workgroup = { id: matchingRole.workgroupId, name: matchingRole.workgroupName };
						this.setSharedState(workgroup, year);
					}
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

			logout: function (redirectUrl) {
				localStorage.removeItem('JWT');
				localStorage.removeItem('userRoles');
				localStorage.removeItem('displayName');
				localStorage.removeItem('termStates');
				redirectUrl = redirectUrl || serverRoot + "/logout"
				$window.location.href = redirectUrl;
			},

			getUserRoles: function () {
				var userRoles = [];

				try {
					userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];
				} catch(err) {
					console.log(err);
				}

				return userRoles;
			},

			getWorkgroups: function () {
				var userRoles = this.getUserRoles();
				return _.uniq(
					userRoles
						.filter(function (ur) { return ur.workgroupId > 0 })
						.map(function (ur) { return { id: ur.workgroupId, name: ur.workgroupName } })
					, 'id'
				);
			},

			getTermStates: function () {
				var termStates = [];

				try {
					termStates = JSON.parse(localStorage.getItem('termStates')) || [];
				} catch(err) {
					console.log(err);
				}

				return termStates;
			},

			getTermStateByTermCode: function (termCode) {
				return this.getTermStates().filter(function (ts) {
					return ts.termCode == termCode;
				})[0];
			},

			isAdmin: function () {
				var userRoles = this.getUserRoles();
				return userRoles.some(function(ur) { return ur.roleName == "admin" && ur.workgroupId == 0; });
			},

			isAcademicPlanner: function () {
				var userRoles = this.getUserRoles();
				var workgroup = this.getCurrentWorkgroup();
				return userRoles.some(function(userRole) { return userRole.roleName == "academicPlanner" && userRole.workgroupId == workgroup.id; });
			},

			isInstructor: function () {
				var userRoles = this.getUserRoles();
				var workgroup = this.getCurrentWorkgroup();
				return userRoles.some(function(userRole) { return (userRole.roleName == "senateInstructor" || userRole.roleName == "federationInstructor") && userRole.workgroupId == workgroup.id; });
			},

			getCurrentWorkgroup: function () {
				return JSON.parse(localStorage.getItem('workgroup')) || {};
			},

			getCurrentUserRoles: function () {
				var userRoles = this.getUserRoles();
				var workgroup = this.getCurrentWorkgroup();
				return userRoles
					.filter(function (ur) { return ur.workgroupId == workgroup.id; })
					.map(function (ur) { return ur.roleName; });
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
						// scope.isAdmin = true;
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

			setSharedState: function (workgroup, year) {
				localStorage.setItem('workgroup', JSON.stringify(workgroup));
				localStorage.setItem('year', year || moment().year());
				$rootScope.$emit('sharedStateSet', this.getSharedState());
			},

			getSharedState: function () {
				return {
					workgroup: this.getCurrentWorkgroup(),
					year: Number(localStorage.getItem('year')) || moment().year(),
					allUserRoles: this.getUserRoles(),
					currentUserRoles: this.getCurrentUserRoles(),
					userWorkgroups: this.getWorkgroups(),
					displayName: localStorage.getItem('displayName') || '',
					termStates: this.getTermStates(),
					isAdmin: this.isAdmin(),
					isAcademicPlanner: this.isAcademicPlanner(),
					isInstructor: this.isInstructor()
				};
			},

			toggleSidebarState: function () {
				var sidebarCollapsed = localStorage.getItem('sidebarCollapsed') == 'true';
				localStorage.setItem('sidebarCollapsed', !sidebarCollapsed);
				$rootScope.$emit('sidebarStateToggled', !sidebarCollapsed);
			},

			isSidebarCollapsed: function () {
				return localStorage.getItem('sidebarCollapsed') == 'true';
			},

			reportJsException: function(error, message) {
				var stack = "method: " + error.config.method + ", url: " + error.config.url + ", status code: " + error.status;
				var exceptionObject = {
						message: message,
						stack: stack,
						url: error.config.url
				};

				$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("JWT"); // Set proper headers
				return $http.post(serverRoot + "/api/reportJsException", exceptionObject);
			}
		};
	});
