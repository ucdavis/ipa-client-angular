// Helpers
import array from './helpers/array.js';
import dates from './helpers/dates.js';
import object from './helpers/object.js';
import sections from './helpers/sections.js';
import string from './helpers/string.js';
import types from './helpers/types.js';

// Config
import exceptionHandler from './exceptionHandler.js';
import { slowConnectionInterceptor } from './sharedInterceptors.js';
import { tokenValidatorInterceptor } from './sharedInterceptors.js';

// Controllers
import SharedCtrl from './controllers/SharedCtrl.js';

// Services
import AuthService from './services/AuthService.js';

// Entities
import Activity from './entities/Activity.js';
import Building from './entities/Building.js';
import CourseOfferingGroup from './entities/CourseOfferingGroup.js';
import CourseOffering from './entities/CourseOffering.js';
import Course from './entities/Course.js';
import CurrentUser from './entities/CurrentUser.js';
import Event from './entities/Event.js';
import Instructor from './entities/Instructor.js';
import Location from './entities/Location.js';
import Role from './entities/Role.js';
import ScheduleInstructorNote from './entities/ScheduleInstructorNote.js';
import ScheduleTermState from './entities/ScheduleTermState.js';
import Schedule from './entities/Schedule.js';
import Section from './entities/Section.js';
import SectionGroup from './entities/SectionGroup.js';
import SyncAction from './entities/SyncAction.js';
import Tag from './entities/Tag.js';
import TeachingAssignment from './entities/TeachingAssignment.js';
import TeachingPreference from './entities/TeachingPreference.js';
import TeachingCall from './entities/TeachingCall.js';
import TeachingCallReceipt from './entities/TeachingCallReceipt.js';
import TeachingCallResponse from './entities/TeachingCallResponse.js';
import Term from './entities/Term.js';
import User from './entities/User.js';
import UserRole from './entities/UserRole.js';
import Workgroup from './entities/Workgroup.js';

// Directives
import ipaButton from './directives/ipaButton/ipaButton.js';
import ipaHeader from './directives/ipaHeader/ipaHeader.js';
import ipaTermSelectorDropdown from './directives/ipaTermSelectorDropdown/ipaTermSelectorDropdown.js';

import nav from './directives/nav/nav.js';

// Dependencies
var sharedAppDependencies = [
	// 3rd party modules
	'ui.bootstrap',
	'ngIdle',
	'ngSanitize',
	'ui.select',
	'selectize',

	// Local modules
		'CourseOfferingGroup',
		'SectionGroup',
		'CourseOffering',
		'Course',
		'CurrentUser',
		'Instructor',
		'Location',
		'ScheduleInstructorNote',
		'ScheduleTermState',
		'Tag',
		'Workgroup',
		'User',
		'UserRole',
		'Schedule',
		'Term',
		'Role',
		'Section',
		'SyncAction',
		'Activity',
		'Building',
		'Event',
		'TeachingAssignment',
		'TeachingPreference',
		'TeachingCall',
		'TeachingCallReceipt',
		'TeachingCallResponse'
];

// Config
function config ($httpProvider, $compileProvider, $logProvider, IdleProvider, $locationProvider) {
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
}

config.$inject = ['$httpProvider', '$compileProvider', '$logProvider', 'IdleProvider', '$locationProvider'];

// App declaration
const sharedApp = angular.module("sharedApp", sharedAppDependencies)
.config(config)
.controller('SharedCtrl', SharedCtrl)
.service('AuthService', AuthService)
.directive('ipaButton', ipaButton)
.directive('ipaHeader', ipaHeader)
.directive('ipaTermSelectorDropdown', ipaTermSelectorDropdown)
.directive('nav', nav)

/*
.config(slowConnectionInterceptor)
.config(tokenValidatorInterceptor)
.config(exceptionHandler)
// Intercept Ajax traffic
.config(function($httpProvider) {
	$httpProvider.interceptors.push(slowConnectionInterceptor);
	$httpProvider.interceptors.push(tokenValidatorInterceptor);
})

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
*/
export default sharedApp;
