/**
 * @ngdoc service
 * @name ipaClientAngularApp.authService
 * @description
 * # authService
 * Service in the ipaClientAngularApp.
 */
angular.module('sharedApp')
	.service('authService', function ($http, $window, $q, $location, $rootScope, $log, CurrentUser) {
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
					} else if (response.data != null && response.data.redirect != null && response.data.redirect.length > 0) {
						// Received a request to redirect to CAS. Obey!
						localStorage.removeItem('JWT');
						localStorage.removeItem('userRoles');
						localStorage.removeItem('displayName');
						localStorage.removeItem('termStates');
						$window.location.href = response.data.redirect + "?ref=" + $location.absUrl(); ı

						deferred.reject();
					}
				}, function (error) {
					var message;
					if (error.status == 400) {
						// Token is invalid. Grab a new token
						localStorage.removeItem('JWT');
						location.reload();
					} else if (error.status == 403) {
						// User has no access, redirect to Access Denied page
						$log.error("Authentication request received a 403. Redirecting to access denied page ...");
						localStorage.clear();
						$window.location.href = "/access-denied.html";
					} else if (error.status == -1) {
						message = "Request was aborted or server was not found. Check that the backend is running.";
						$log.error(message);
						self.redirectToErrorPage(error, message);
					} else {
						message = "Unknown error occurred while authenticating. Details:";
						$log.error(message);
						$log.error(error);
						self.redirectToErrorPage(error, message);
					}

					deferred.reject();
				});

				return deferred.promise;
			},

			validateState: function (data, workgroupId, year, ignoreFallBackUrl) {
				var currentUser = new CurrentUser(data.displayName, data.userRoles);
				currentUser.setDisplayName(data.displayName);
				currentUser.setUserRoles(data.userRoles);
				console.log(currentUser);

				localStorage.setItem('currentUser', JSON.stringify(currentUser));
				localStorage.setItem('termStates', JSON.stringify(data.termStates));

				// If workgroupId or year NOT set, and the ignoreFallBackUrl is not set to true
				if (!(workgroupId && year) && !ignoreFallBackUrl) {
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
						if (scope.validateState(response.data, workgroupId, year, ignoreFallBackUrl)) {
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
				redirectUrl = redirectUrl || serverRoot + "/logout";
				$window.location.href = redirectUrl;
			},

			getUserRoles: function () {
				var userRoles = [];

				try {
					userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];
				} catch (err) {
					$log.error(err);
				}

				return userRoles;
			},

			getWorkgroups: function () {
				var userRoles = this.getUserRoles();
				return _.uniq(
					userRoles
						.filter(function (ur) { return ur.workgroupId > 0; })
						.map(function (ur) { return { id: ur.workgroupId, name: ur.workgroupName }; }),
					'id'
				);
			},

			getTermStates: function () {
				var termStates = [];

				try {
					termStates = JSON.parse(localStorage.getItem('termStates')) || [];
				} catch (err) {
					$log.error(err);
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
				return userRoles.some(function (ur) { return ur.roleName == "admin" && ur.workgroupId === 0; });
			},

			hasRole: function (roleName) {
				var userRoles = this.getUserRoles();
				var workgroup = this.getCurrentWorkgroup();
				return userRoles.some(function (userRole) { return userRole.roleName == roleName && userRole.workgroupId == workgroup.id; });
			},

			hasRoles: function (roleNames) {
				if (roleNames instanceof Array === false) {
					$log.error("Parameter passed to hasRoles() is not valid", roleNames);
					return false;
				}
				var userRoles = this.getUserRoles();
				var workgroup = this.getCurrentWorkgroup();
				return userRoles.some(function (userRole) { return roleNames.indexOf(userRole.roleName) >= 0 && userRole.workgroupId == workgroup.id; });
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

				// Loop over the user roles to look for user workgroups
				for (var i = 0; i < userRoles.length; i++) {
					userRole = userRoles[i];

					// Find the first valid workgroup in the roles and do the redirect
					if (userRole.workgroupId > 0) {
						var workgroupId = userRole.workgroupId;
						var year = new Date().getFullYear();
						var url = '/' + workgroupId + '/' + year;
						$location.path(url);
						return;
					}

				}

				// If no workgroups...
				if (scope.isAdmin()) {
					// Admin users can go to the administration view
					$window.location.href = "/admin";
					return;
				} else {
					// Other users don't have access to any workgroup, redirect to Access Denied page
					$log.error("Authentication request received a 403. Redirecting to access denied page ...");
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
					termStates: this.getTermStates(),
					// currentUser: this.getCurrentUser()

					allUserRoles: this.getUserRoles(),
					currentUserRoles: this.getCurrentUserRoles(),
					userWorkgroups: this.getWorkgroups(),
					displayName: localStorage.getItem('displayName') || '',
					isAdmin: this.isAdmin(),
					isAcademicPlanner: this.hasRole('academicPlanner'),
					isReviewer: this.hasRole('reviewer'),
					isInstructor: this.hasRoles(['senateInstructor', 'federationInstructor'])
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

			/**
			 * Redirects to an error page by POSTing the details of the error.
			 *
			 * It accomplishes this by creating a form and submitting that form.
			 *
			 * @param  {[type]} error   [description]
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			redirectToErrorPage: function (error, message) {
				var stack = "method: " + error.config.method + ", url: " + error.config.url + ", status code: " + error.status;

				var errorForm = "<form id=\"unknownErrorForm\" method=\"POST\" action=\"/unknown-error.html\" style=\"display: none;\">";
				errorForm += "<input type=\"text\" name=\"message\" value=\"" + message + "\" />";
				errorForm += "<input type=\"text\" name=\"stack\" value=\"" + stack + "\" />";
				errorForm += "<input type=\"text\" name=\"url\" value=\"" + error.config.url + "\" />";
				errorForm += "</form>";

				$("body").append(errorForm);

				$("form#unknownErrorForm").submit();
			}
		};
	});
