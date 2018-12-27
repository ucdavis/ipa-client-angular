import { _ } from 'underscore';

class AuthService {
	constructor ($http, $window, $q, $location, $rootScope, $log, CurrentUser, $route) {
		this.$http = $http;
		this.$window = $window;
		this.$q = $q;
		this.$location = $location;
		this.$rootScope = $rootScope;
		this.$log = $log;
		this.CurrentUser = CurrentUser;
		this.$route = $route;

		return {
			validateToken: function (token) {
				var self = this;
				var deferred = $q.defer();

				$http.post(window.serverRoot + '/login', { token: token }, { withCredentials: true }).then(function (response) {
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
						deferred.reject(response);
					}
				}, function (error) {
					var message;
					var jwt = localStorage.getItem('JWT');
					var loginId = null;

					var currentUser = localStorage.getItem('currentUser');
					if (currentUser) {
						loginId = JSON.parse(currentUser).loginId;
					}

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
						// Request was aborted (e.g. user hit reload while it took too long) or server not found
						$rootScope.$emit('toast', { message: "Could not authenticate due to server error. Try reloading the page.", type: "ERROR", timeOut: 60000 });
						message = "Request was aborted or server was not found. Check that the backend is running.";
						$log.error(message);
					} else {
						// Backend exceptions generate HTTP 500, which would fall here and redirect to form.
						// If the user fills out the form, we can tie their user story to our backend
						// exception e-mails.
						message = "Unknown error occurred while authenticating. Details:";
						$log.error(message);
						$log.error(error);
						self.redirectToErrorPage(error, message, loginId, jwt);
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

				var deferred = $q.defer();
				$http.post(window.serverRoot + '/impersonate/' + loginIdToImpersonate, { token: token }, { withCredentials: true }).then(function (response) {
					var token = response.data.token;
					$http.defaults.headers.common.Authorization = 'Bearer ' + token;
					localStorage.setItem('JWT', token);

					// Pull out the workgroupId and year from the existing url to create a new summary url
					var explodedUrl = $window.location.href.split('/');
					var workgroupIndex = explodedUrl.indexOf("workgroups");
					var workgroupId = explodedUrl[workgroupIndex + 1];
					var year = explodedUrl[workgroupIndex + 2];

					$window.location.href = "/summary/" + workgroupId + "/" + year;
				}, function () {
					// FIXME: Shouuldn't we do something here?
				});

				return deferred.promise;
			},

			/**
			 * This will remove impersonation and redirect to the summary screen.
			 */
			unimpersonate: function () {
				var token = localStorage.getItem('JWT');

				var deferred = $q.defer();
				$http.post(window.serverRoot + '/unimpersonate', { token: token }, { withCredentials: true }).then(function (response) {
					var token = response.data.token;
					$http.defaults.headers.common.Authorization = 'Bearer ' + token;
					localStorage.setItem('JWT', token);

					$window.location.href = "/summary";
				}, function () {
					// FIXME: Shouldn't we do something here?
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
				}

				var matchingRole = _.findWhere(data.userRoles, { workgroupId: Number(workgroupId) });

				if (matchingRole) {
					// User has access to requested page, let them in
					var workgroup = { id: workgroupId, name: matchingRole.workgroupName };
					this.setSharedState(workgroup, year);

					return true;
				} else if (currentUser.isAdmin()) {
					// If the user is an admin, the current workgroup might have been set
					// in the admin page, and we don't have information about the name of
					// the workgroup in the payload. So, set the workgroupName to whatever
					// is already in localStorage if any.
					var currentWorkgroup = this.getCurrentWorkgroup();
					var workgroupName = (currentWorkgroup.id == Number(workgroupId)) ? currentWorkgroup.name : '';
					var workgroup = { id: workgroupId, name: workgroupName };
					this.setSharedState(workgroup, year);

					return true;
				} else {
					// User is neither an admin nor has access to requested workgroup. redirect to access denied
					$log.error("User " + data.displayName + " does not have access to workgroupId " + workgroupId);
					$window.location.href = "/access-denied.html";

					return false;
				}
			},

			/**
			 * Validates the given JWT token with the backend.
			 * Also performs various login actions like setting Google Analytics user ID.
			 */
			validate: function (ignoreFallBackUrl) {
				var token = localStorage.getItem('JWT');
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var deferred = $q.defer();
				var scope = this;

				scope.validateToken(token).then(
					// Success
					function (response) {
						if (scope.validateState(response.data, workgroupId, year, ignoreFallBackUrl)) {
							// Log the user to Google Analytics (only in production mode)
							if(window.ipaRunningMode === 'production') {
								ga('set', 'userId', String(response.data.userTrackingId)); // eslint-disable-line no-undef
								ga('send', 'event', 'authentication', 'user-id available'); // eslint-disable-line no-undef
							}
							deferred.resolve();
						} else {
							deferred.resolve();
						}
					},
					// Failure
					function () {
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
				redirectUrl = redirectUrl || window.serverRoot + "/logout";
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
					let userRole = userRoles[i];

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
				localStorage.setItem('year', year || moment().year()); // eslint-disable-line no-undef
				$rootScope.$emit('sharedStateSet', this.getSharedState());
			},

			getSharedState: function () {
				return {
					workgroup: this.getCurrentWorkgroup(),
					year: Number(localStorage.getItem('year')) || moment().year(), // eslint-disable-line no-undef
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
			redirectToErrorPage: function (error, message, loginId, jwt) {
				var stack = "method: " + error.config.method + ", url: " + error.config.url + ", status code: " + error.status;

				var errorForm = "<form id=\"unknownErrorForm\" method=\"POST\" action=\"/unknown-error.html\" style=\"display: none;\">";
				errorForm += "<input type=\"text\" name=\"message\" value=\"" + message + "\" />";
				errorForm += "<input type=\"text\" name=\"stack\" value=\"" + stack + "\" />";
				errorForm += "<input type=\"text\" name=\"loginId\" value=\"" + loginId + "\" />";
				errorForm += "<input type=\"text\" name=\"jwt\" value=\"" + jwt + "\" />";
				errorForm += "<input type=\"text\" name=\"url\" value=\"" + error.config.url + "\" />";
				errorForm += "</form>";

				$("body").append(errorForm); // eslint-disable-line no-undef

				$("form#unknownErrorForm").submit(); // eslint-disable-line no-undef
			}
		};
	}
}

AuthService.$inject = ['$http', '$window', '$q', '$location', '$rootScope', '$log', 'CurrentUser', '$route'];

export default AuthService;
