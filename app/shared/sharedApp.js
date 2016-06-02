window.sharedApp = angular.module('sharedApp',
		[
		 // 3rd party
		 'ui.bootstrap',
		 'ngNotify',
		 'ngIdle',
		 // IPA Entities
		 'courseOfferingGroup',
		 'sectionGroup',
		 'courseOffering',
		 'course',
		 'instructor',
		 'scheduleInstructorNote',
		 'track',
		 'workgroup',
		 'user',
		 'schedule',
		 'term',
		 'role',
		 'section',
		 'activity',
		 'building',
		 'teachingAssignment',
		 'teachingPreference',
		 'teachingCallReceipt',
		 'teachingCallResponse'
		 ]);

sharedApp
	// Set the CSRF token
	.config(['$httpProvider', '$compileProvider', 'IdleProvider', 'KeepaliveProvider', '$locationProvider',
	         function($httpProvider, $compileProvider, IdleProvider, KeepaliveProvider, $locationProvider) {
		// Add CSRF token to all requests
		var csrfHeader = $('meta[name=csrf-header]').attr('content');
		$httpProvider.defaults.headers.common[csrfHeader] = $('meta[name=csrf-token]').attr('content');

		$httpProvider.useApplyAsync(true);
		$compileProvider.debugInfoEnabled(false);

	    // configure Idle settings
	    IdleProvider.idle(25 * 60); // 25 minutes: After this amount of time passes without the user performing an action the user is considered idle
	    IdleProvider.timeout(5 * 60); // 5 minute: The amount of time the user has to respond before they have been considered timed out
	    KeepaliveProvider.interval(5 * 60); // 5 minutes: This specifies how often the KeepAlive event is triggered and the HTTP request is issued
	}])
	// Detect route errors
	.run(['$rootScope', 'Idle',
	      function($rootScope, Idle) {
		$rootScope.$on('$routeChangeStart', function(e, curr, prev) {
			if (curr.$$route && curr.$$route.resolve) {
				// Show a loading message until promises aren't resolved
				$rootScope.loadingView = true;
			}
		});
		$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
			// Hide loading message
			$rootScope.loadingView = false;
		});

		// Set the initial 'unsavedItems' which is used for the alert
		// when fields are unsaved and the user tries to close the window
		$rootScope.unsavedItems = 0;

		// Start ngIdle watch
		Idle.watch();
	}]);
