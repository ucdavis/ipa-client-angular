import 'angular/angular.js';
import 'ng-idle/angular-idle.js';
import 'angular-sanitize/angular-sanitize.js';
import 'angular-route/angular-route.min.js';
import toastr from 'toastr/build/toastr.min.js';
import 'angular-selectize2/dist/angular-selectize.js';
import 'ui-select/dist/select.js';
import 'bootstrap/dist/js/bootstrap.js';
import 'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js';

// Helpers
import array from './helpers/array.js'; // eslint-disable-line no-unused-vars
import dates from './helpers/dates.js'; // eslint-disable-line no-unused-vars
import object from './helpers/object.js'; // eslint-disable-line no-unused-vars
import sections from './helpers/sections.js'; // eslint-disable-line no-unused-vars
import string from './helpers/string.js'; // eslint-disable-line no-unused-vars
import types from './helpers/types.js'; // eslint-disable-line no-unused-vars

// Controllers
import SharedCtrl from './controllers/SharedCtrl.js';

// Services
import AuthService from './services/AuthService.js';
import ApiService from './services/ApiService.js';
import TeachingAssignmentService from './services/TeachingAssignmentService.js';
import SectionService from './services/SectionService.js';
import ActivityService from './services/ActivityService.js';
import UserService from './services/UserService.js';
import TagService from './services/TagService.js';

// Entities
import Activity from './entities/Activity.js'; // eslint-disable-line no-unused-vars
import Building from './entities/Building.js'; // eslint-disable-line no-unused-vars
import CourseOfferingGroup from './entities/CourseOfferingGroup.js'; // eslint-disable-line no-unused-vars
import CourseOffering from './entities/CourseOffering.js'; // eslint-disable-line no-unused-vars
import Course from './entities/Course.js'; // eslint-disable-line no-unused-vars
import CurrentUser from './entities/CurrentUser.js'; // eslint-disable-line no-unused-vars
import Event from './entities/Event.js'; // eslint-disable-line no-unused-vars
import Instructor from './entities/Instructor.js'; // eslint-disable-line no-unused-vars
import Location from './entities/Location.js'; // eslint-disable-line no-unused-vars
import Role from './entities/Role.js'; // eslint-disable-line no-unused-vars
import ScheduleInstructorNote from './entities/ScheduleInstructorNote.js'; // eslint-disable-line no-unused-vars
import ScheduleTermState from './entities/ScheduleTermState.js'; // eslint-disable-line no-unused-vars
import Schedule from './entities/Schedule.js'; // eslint-disable-line no-unused-vars
import Section from './entities/Section.js'; // eslint-disable-line no-unused-vars
import SectionGroup from './entities/SectionGroup.js'; // eslint-disable-line no-unused-vars
import SyncAction from './entities/SyncAction.js'; // eslint-disable-line no-unused-vars
import Tag from './entities/Tag.js'; // eslint-disable-line no-unused-vars
import TeachingAssignment from './entities/TeachingAssignment.js'; // eslint-disable-line no-unused-vars
import TeachingPreference from './entities/TeachingPreference.js'; // eslint-disable-line no-unused-vars
import TeachingCall from './entities/TeachingCall.js'; // eslint-disable-line no-unused-vars
import TeachingCallReceipt from './entities/TeachingCallReceipt.js'; // eslint-disable-line no-unused-vars
import TeachingCallResponse from './entities/TeachingCallResponse.js'; // eslint-disable-line no-unused-vars
import Term from './entities/Term.js'; // eslint-disable-line no-unused-vars
import User from './entities/User.js'; // eslint-disable-line no-unused-vars
import UserRole from './entities/UserRole.js'; // eslint-disable-line no-unused-vars
import Workgroup from './entities/Workgroup.js'; // eslint-disable-line no-unused-vars

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
import ipaFilter from './directives/ipaFilter/ipaFilter.js';
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
import noAccess from './directives/noAccess/noAccess.js';

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
	var csrfHeader = $('meta[name=csrf-header]').attr('content'); // eslint-disable-line no-undef
	if (csrfHeader === undefined) {
		console.warn("CSRF meta tag not found."); // eslint-disable-line no-console
	} else {
		$httpProvider.defaults.headers.common[csrfHeader] = $('meta[name=csrf-token]').attr('content'); // eslint-disable-line no-undef
	}

	$httpProvider.useApplyAsync(true);

	// Debugger mode
	try {
		$compileProvider.debugInfoEnabled(window.debuggerEnabled);
		$logProvider.debugEnabled(window.debuggerEnabled);
	} catch (e) {
		console.warn("Debugger status not defined. Please set value in clientConfig. Defaulting to enabled.", e); // eslint-disable-line no-console
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

function slowConnectionInterceptor ($rootScope, $timeout, $q) {
	var reqCount = 0;
	return {
		request: function (config) {
			reqCount++;
			if ($rootScope.slowResTime) { $timeout.cancel($rootScope.slowResTime); }
			if ($rootScope.timeOutTimer) { $timeout.cancel($rootScope.timeOutTimer); }

			var slowResDelay = 15000; // 15 seconds
			var timeOutDelay = 90000; // 90 seconds

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
				$http.post(window.serverRoot + "/api/reportJsException", exceptionObject, { withCredentials: true }).then(function(res) {
					return res.data;
				});
			}
		};
	});
}

exceptionHandler.$inject = ['$provide'];

// App declaration
const sharedApp = angular.module("sharedApp", sharedAppDependencies) // eslint-disable-line no-undef
.config(config)
.controller('SharedCtrl', SharedCtrl)
.service('ApiService', ApiService)
.service('AuthService', AuthService)
.service('TeachingAssignmentService', TeachingAssignmentService)
.service('SectionService', SectionService)
.service('ActivityService', ActivityService)
.service('UserService', UserService)
.service('TagService', TagService)
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
.directive('noAccess', noAccess)
.directive('ipaFilter', ipaFilter)
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

.config(exceptionHandler)

// Intercept Ajax traffic
 .config(function($httpProvider) {
	$httpProvider.interceptors.push(['$rootScope', '$timeout', '$q', slowConnectionInterceptor]);
})

// Detect route errors
.run(['$rootScope', 'Idle',
	function ($rootScope, Idle) {
		$rootScope.$on('$routeChangeStart', function (e, curr) {
			if (curr.$$route && curr.$$route.resolve) {
				// Show a loading message until promises aren't resolved
				$rootScope.loadingView = true;
			}
		});

		$rootScope.$on('$routeChangeSuccess', function () {
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
