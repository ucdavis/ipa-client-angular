window.sharedApp = angular.module('sharedApp',
	[
		// 3rd party modules
		'ui.bootstrap',
		'ngIdle',
		'ngSanitize',
		'ui.select',

		// Local modules
		'courseOfferingGroup',
		'sectionGroup',
		'courseOffering',
		'course',
		'currentUser',
		'instructor',
		'location',
		'scheduleInstructorNote',
		'scheduleTermState',
		'tag',
		'workgroup',
		'user',
		'userRole',
		'schedule',
		'term',
		'role',
		'section',
		'syncAction',
		'activity',
		'building',
		'event',
		'teachingAssignment',
		'teachingPreference',
		'teachingCall',
		'teachingCallReceipt',
		'teachingCallResponse'
	]
);

sharedApp
	// Set the CSRF token
	.config(['$httpProvider', '$compileProvider', '$logProvider', 'IdleProvider', '$locationProvider',
		function ($httpProvider, $compileProvider, $logProvider, IdleProvider, $locationProvider) {
			// Add CSRF token to all requests
			var csrfHeader = $('meta[name=csrf-header]').attr('content');
			if (csrfHeader === undefined) {
				console.warn("CSRF meta tag not found.");
			} else {
				$httpProvider.defaults.headers.common[csrfHeader] = $('meta[name=csrf-token]').attr('content');
			}

			$httpProvider.useApplyAsync(true);

			// Debugger mode
			try {
				$compileProvider.debugInfoEnabled(debuggerEnabled);
				$logProvider.debugEnabled(debuggerEnabled);
			} catch (e) {
				console.warn("Debugger status not defined. Please set value in clientConfig. Defaulting to enabled.", e);
				$compileProvider.debugInfoEnabled(true);
				$logProvider.debugEnabled(true);
			}

			// Enable html5 mode paths
			$locationProvider.html5Mode({
				enabled: true
			});

			// Configure Idle settings
			IdleProvider.idle(240 * 60); // 28 minutes: After this amount of time passes without the user performing an action the user is considered idle
			IdleProvider.timeout(2 * 60); // 2 minute: The amount of time the user has to respond before they have been considered timed out
		}])

	// Detect route errors
	.run(['$rootScope', 'Idle',
		function ($rootScope, Idle) {
			$rootScope.$on('$routeChangeStart', function (e, curr, prev) {
				if (curr.$$route && curr.$$route.resolve) {
					// Show a loading message until promises aren't resolved
					$rootScope.loadingView = true;
				}
			});

			$rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
				// Hide loading message
				$rootScope.loadingView = false;
			});

			// Set the initial 'unsavedItems' which is used for the alert
			// when fields are unsaved and the user tries to close the window
			$rootScope.unsavedItems = 0;
			$rootScope.toast = {};

			// Start ngIdle watch
			Idle.watch();
		}
	])

	// Listen to toast requests
	.run(['$rootScope',
		function ($rootScope) {

			// Default options
			toastr.options = {
				"preventDuplicates": true
			};

			$rootScope.$on('toast', function (event, data) {
				var title = data.title ? data.title : '';
				var message = data.message ? data.message : '';
				var options = data.options ? data.options : {};

				switch (data.type) {
					case "SUCCESS":
						toastr.success(title, message, options);
						break;
					case "ERROR":
						options.timeOut = 0; // do not auto-hide error messages
						options.closeButton = true;
						toastr.error(title, message, options);
						break;
					case "WARNING":
						toastr.warning(title, message, options);
						break;
					default:
						toastr.info(title, message, options);
						break;
				}
			});
		}]
	)
	.constant('Roles', {
		reviewer: 10,
		instructor: 15,
		academicPlanner: 2,
		presence: 9
	});
	