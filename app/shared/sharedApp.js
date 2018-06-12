import * as clientConfig from './../../clientConfig.js';

import 'angular/angular.js';
import 'ng-idle/angular-idle.js';
import 'angular-sanitize/angular-sanitize.js';
import 'angular-route/angular-route.min.js';
import toastr from 'toastr/build/toastr.min.js';
import 'angular-selectize2/dist/angular-selectize.js';
import 'ui-select/dist/select.js';
import 'bootstrap/dist/js/bootstrap.js';
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js';

// Controllers
import SharedCtrl from './controllers/SharedCtrl.js';

// Services
import AuthService from './services/AuthService.js';
import ApiService from './services/ApiService.js';
import TeachingAssignmentService from './services/TeachingAssignmentService.js';

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
import availabilityGrid from './directives/availabilityGrid/availabilityGrid.js';
import ipaButton from './directives/ipaButton/ipaButton.js';
import ipaCheckbox from './directives/ipaCheckbox/ipaCheckbox.js';
import ipaCurrencyInput from './directives/ipaCurrencyInput/ipaCurrencyInput.js';
import ipaDatePicker from './directives/ipaDatePicker/ipaDatePicker.js';
import ipaDropdown from './directives/ipaDropdown/ipaDropdown.js';
import ipaHeader from './directives/ipaHeader/ipaHeader.js';
import ipaInput from './directives/ipaInput/ipaInput.js';
import currencyInput from './directives/ipaInput/currencyInput.js';
import ipaModal from './directives/ipaModal/ipaModal.js';
import ipaRadio from './directives/ipaRadio/ipaRadio.js';
import ipaSectionHeader from './directives/ipaSectionHeader/ipaSectionHeader.js';
import ipaTabs from './directives/ipaTabs/ipaTabs.js';
import ipaTabsVertical from './directives/ipaTabsVertical/ipaTabsVertical.js';
import ipaTermSelector from './directives/ipaTermSelector/ipaTermSelector.js';
import ipaTermSelectorDropdown from './directives/ipaTermSelectorDropdown/ipaTermSelectorDropdown.js';
import ipaToggle from './directives/ipaToggle/ipaToggle.js';
import nav from './directives/nav/nav.js';
import noMobileSupport from './directives/noMobileSupport/noMobileSupport.js';
import autoInput from './directives/autoInput.js';
import collapsableSidebarContainer from './directives/collapsableSidebarContainer.js';
import colorpicker from './directives/colorpicker.js';
import confirmButton from './directives/confirmButton.js';
import disableElement from './directives/disableElement.js';
import focusOnShow from './directives/focusOnShow.js';
import infoTooltip from './directives/infoTooltip.js';
import multiselectDropdown from './directives/multiselectDropdown/multiselectDropdown.js';
import popoverToggleCloseOthers from './directives/popoverToggleCloseOthers.js';
import preventDefault from './directives/preventDefault.js';
import searchableMultiselect from './directives/searchableMultiselect/searchableMultiselect.js';
import slider from './directives/slider.js';
import sortable from './directives/sortable.js';
import spinner from './directives/spinner.js';
import stickyHeader from './directives/stickyHeader.js';
import stopEvent from './directives/stopEvent.js';
import termFilter from './directives/termFilter/termFilter.js';

// Filters
import lastCommaFirst from './filters/lastCommaFirst.js';
import lastSpaceInitial from './filters/lastSpaceInitial.js';
import ordinal from './filters/ordinal.js';

// Dependencies
var sharedAppDependencies = [
	// 3rd party modules
	'ui.bootstrap',
	'ngIdle',
	'ngSanitize',
	'ui.select',
	'selectize', // Angular Selectize2, refers to itself as 'selectize'

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

function slowConnectionInterceptor ($rootScope, $timeout) {
	var reqCount = 0;
	return {
		request: function (config) {
			reqCount++;
			if ($rootScope.slowResTime) { $timeout.cancel($rootScope.slowResTime); }
			if ($rootScope.timeOutTimer) { $timeout.cancel($rootScope.timeOutTimer); }

			var slowResDelay = 15000; // 8 seconds
			var timeOutDelay = 45000; // 45 seconds

			$rootScope.slowResTime = $timeout(function () {
				$rootScope.$emit('toast', { message: "Server appears to be slow. Please standby...", type: "WARNING" });
			}, slowResDelay);

			$rootScope.timeOutTimer = $timeout(function () {
				$rootScope.$emit('toast', { message: "Server appears to have failed.", type: "ERROR", options: { timeOut: 0, closeButton: true } });
			}, timeOutDelay);

			return config;
		},
		response: function (response) {
			if (--reqCount === 0) {
				$timeout.cancel($rootScope.slowResTime);
				$timeout.cancel($rootScope.timeOutTimer);
				toastr.clear();
			}

			return response;
		},
		responseError: function (rejection) {
			if (--reqCount === 0) {
				$timeout.cancel($rootScope.slowResTime);
				$timeout.cancel($rootScope.timeOutTimer);
				toastr.clear();
			}

			// Redirect 'Access Denied' responses to /accessDenied
			if (rejection.status === 403) {
				$rootScope.loadingError = 403;
			}

			return $q.reject(rejection);
		}
	};
}

slowConnectionInterceptor.$inject = ['$rootScope', '$timeout'];

function tokenValidatorInterceptor () {
	return {
		responseError: function (rejection) {
			if (rejection.status === 440) {
				// Delete expired token and revalidate
				localStorage.removeItem('JWT');
				var authService = $injector.get('authService');
				authService.validate().then(function () {
					// $rootScope.toast.message = "This is inconcieveable";
					$rootScope.$emit('toast', { message: "Unable to validate authentication.", type: "ERROR" });
				});
			}

			return $q.reject(rejection);
		}
	};
}

function exceptionHandler($provide) {
	$provide.decorator("$exceptionHandler", function($delegate, $injector) {
		return function(exception, cause) {
			$delegate(exception, cause);

			var $http = $injector.get("$http");
			var $location = $injector.get("$location");
			var $rootScope = $injector.get("$rootScope");
			$rootScope.errorsSent = $rootScope.errorsSent || [];

			// Make sure an error is sent only once
			if ($rootScope.errorsSent.indexOf(exception.message) < 0) {
				$rootScope.errorsSent.push(exception.message);
				var exceptionObject = {
						message: exception.message,
						stack: exception.stack,
						url: $location.absUrl()
				};
				
				$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("JWT"); // Set proper headers
				$http.post(clientConfig.serverRoot + "/api/reportJsException", exceptionObject, { withCredentials: true }).then(function(res) {
					return res.data;
				});
			}
		};
	});
}

exceptionHandler.$inject = ['$provide'];

// App declaration
const sharedApp = angular.module("sharedApp", sharedAppDependencies)
.config(config)
.controller('SharedCtrl', SharedCtrl)
.service('ApiService', ApiService)
.service('AuthService', AuthService)
.service('TeachingAssignmentService', TeachingAssignmentService)
.directive('availabilityGrid', availabilityGrid)
.directive('ipaButton', ipaButton)
.directive('ipaCheckbox', ipaCheckbox)
.directive('ipaCurrencyInput', ipaCurrencyInput)
.directive('ipaDatePicker', ipaDatePicker)
.directive('ipaDropdown', ipaDropdown)
.directive('ipaHeader', ipaHeader)
.directive('ipaInput', ipaInput)
.directive('currencyInput', currencyInput)
.directive('ipaModal', ipaModal)
.directive('ipaRadio', ipaRadio)
.directive('ipaSectionHeader', ipaSectionHeader)
.directive('ipaTabs', ipaTabs)
.directive('ipaTabsVertical', ipaTabsVertical)
.directive('ipaTermSelector', ipaTermSelector)
.directive('ipaTermSelectorDropdown', ipaTermSelectorDropdown)
.directive('ipaToggle', ipaToggle)
.directive('nav', nav)
.directive('noMobileSupport', noMobileSupport)
.directive('autoInput', autoInput)
.directive('collapsableSidebarContainer', collapsableSidebarContainer)
.directive('colorpicker', colorpicker)
.directive('confirmButton', confirmButton)
.directive('disableElement', disableElement)
.directive('focusOnShow', focusOnShow)
.directive('infoTooltip', infoTooltip)
.directive('multiselectDropdown', multiselectDropdown)
.directive('popoverToggleCloseOthers', popoverToggleCloseOthers)
.directive('preventDefault', preventDefault)
.directive('searchableMultiselect', searchableMultiselect)
.directive('slider', slider)
.directive('sortable', sortable)
.directive('spinner', spinner)
.directive('stickyHeader', stickyHeader)
.directive('stopEvent', stopEvent)
.directive('termFilter', termFilter)
.filter('lastCommaFirst', lastCommaFirst)
.filter('lastSpaceInitial', lastSpaceInitial)
.filter('ordinal', ordinal)
.constant('Roles', {
	reviewer: 10,
	instructor: 15,
	academicPlanner: 2,
	presence: 9,
	studentPhd: 13,
	studentMasters: 12,
})
.constant('serverRoot', clientConfig.serverRoot)
.constant('dwUrl', clientConfig.dwUrl)
.constant('dwToken', clientConfig.dwToken)
.constant('debuggerEnabled', clientConfig.debuggerEnabled)

.config(tokenValidatorInterceptor)
.config(exceptionHandler)

// Intercept Ajax traffic
.config(function($httpProvider) {
	$httpProvider.interceptors.push(['$rootScope', '$timeout', slowConnectionInterceptor]);
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
);

export default sharedApp;
