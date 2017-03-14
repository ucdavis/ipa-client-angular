/**
 * @ngdoc service
 * @name ipaClientAngularApp.authService
 * @description
 * # authService
 * Service in the ipaClientAngularApp.
 */
angular.module('sharedApp')
	.service('authService', function ($http, $window, $q, $location, $rootScope, $log, CurrentUser, $route) {
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
						localStorage.removeItem('currentUser');
						$window.location.href = response.data.redirect + "?ref=" + $location.absUrl();

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
		/**
			* Provide the loginId of the user you would like to impersonate
			* The backend will modify the JWT and return an updated securityDTO.
			* The returned userRoles and displayNames will match the user being impersonated.
			* realUserLoginId and realUserDisplayName will hold the original identity if needed.
			* Redirects to summary screen on completion.
			*/
			impersonate: function (loginIdToImpersonate) {
				var token = localStorage.getItem('JWT');

				var self = this;
				var deferred = $q.defer();
				$http.post(serverRoot + '/impersonate/' + loginIdToImpersonate, { token: token }, { withCredentials: true }).then(function (response) {
					var token = response.data.token;
					$http.defaults.headers.common.Authorization = 'Bearer ' + token;
					localStorage.setItem('JWT', token);

					$window.location.href = "/summary";
				}, function (error) {

				});

				return deferred.promise;
			},

			/**
			 * This will remove impersonation and redirect to the summary screen.
			 */
			unimpersonate: function () {
				var token = localStorage.getItem('JWT');

				var self = this;
				var deferred = $q.defer();
				$http.post(serverRoot + '/unimpersonate', { token: token }, { withCredentials: true }).then(function (response) {
					var token = response.data.token;
					$http.defaults.headers.common.Authorization = 'Bearer ' + token;
					localStorage.setItem('JWT', token);

					$window.location.href = "/summary";
				}, function (error) {

				});

				return deferred.promise;
			},
			validateState: function (data, workgroupId, year, ignoreFallBackUrl) {
				var currentUser = new CurrentUser(data.displayName, data.userRoles);
				currentUser.setDisplayName(data.displayName);
				currentUser.setLoginId(data.loginId);
				currentUser.setRealUserDisplayName(data.realUserDisplayName);
				currentUser.setRealUserLoginId(data.realUserLoginId);

				currentUser.setUserRoles(data.userRoles);

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
						// User has access to requested page, let them in
						var workgroup = { id: workgroupId, name: matchingRole.workgroupName };
						this.setSharedState(workgroup, year);
					} else if (currentUser.isAdmin()) {
						// If the user is an admin, the current workgroup might have been set
						// in the admin page, and we don't have information about the name of
						// the workgroup in the payload. So, set the workgroupName to whatever
						// is already in localStorage if any.
						var currentWorkgroup = this.getCurrentWorkgroup();
						var workgroupName = (currentWorkgroup.id == Number(workgroupId)) ? currentWorkgroup.name : '';
						var workgroup = { id: workgroupId, name: workgroupName };
						this.setSharedState(workgroup, year);
					} else {
						// User is neither an admin nor has access to requested workgroup. redirect to access denied
						$log.error("User " + data.displayName + " does not have access to workgroupId " + workgroupId);
						$window.location.href = "/access-denied.html";
						return false;
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

			getCurrentUser: function () {
				return new CurrentUser(JSON.parse(localStorage.getItem('currentUser')) || {});
			},

			getCurrentWorkgroup: function () {
				return JSON.parse(localStorage.getItem('workgroup')) || {};
			},

			fallbackToDefaultUrl: function () {
				var scope = this;
				var currentUser = scope.getCurrentUser();
				var userRoles = currentUser.userRoles;

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
				if (currentUser.isAdmin()) {
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
					currentUser: this.getCurrentUser()
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
