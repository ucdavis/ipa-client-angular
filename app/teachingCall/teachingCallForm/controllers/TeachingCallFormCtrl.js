import { _array_sortByProperty } from 'shared/helpers/array';
import { isNumber } from 'shared/helpers/types';
import { _ } from 'underscore';

import 'TeachingCall/css/teaching-call-form.css';

class TeachingCallFormCtrl {
	constructor ($scope, $rootScope, $window, $route, $routeParams, $timeout, TeachingCallFormActionCreators, TeachingCallFormService, AuthService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$timeout = $timeout;
		this.TeachingCallFormActionCreators = TeachingCallFormActionCreators;
		this.TeachingCallFormService = TeachingCallFormService;
		this.AuthService = AuthService;
		$window.document.title = "Teaching Call";
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {};
		$scope.modals = {};

		$rootScope.$on('teachingCallFormStateChanged', function (event, data) {
			$scope.view.state = data.pageState;
			$scope.view.state.pastAssignments = data.pastAssignments;
			$scope.updateNavigateAwayGuard();
		});

		$rootScope.$on('sharedStateSet', function (event, data) {
			$scope.sharedState = data;
		});

		$scope.viewState = {
			showSuggestCourse: false
		};

		$scope.openTutorialModal = function () {
			$scope.modals.isTutorialModalOpen = true;
		};
		$scope.toggleSuggestCourse = function () {
			$scope.viewState.showSuggestCourse = !$scope.viewState.showSuggestCourse;
		};

		$scope.searchDWCourses = function (termContainer, query) {
			return TeachingCallFormService.searchDWCourses(query).then(function (results) {
				// Filter out existing preferences from returned results
				var preferencesToFilter = termContainer.preferences.map(function(option) {
					return option.description;
				});
				var filteredResults = results.filter(function (option) {
					return preferencesToFilter.indexOf(option.subjectCode + " " + option.courseNumber) === -1;
				}).map(function (option) {
					option.isSuggested = true;
					return option;
				});

				return filteredResults.slice(0, 20);
			}, function () {
				$rootScope.$emit('toast', { message: "Could not search courses.", type: "ERROR" });
			});
		};

		$scope.searchCourses = function (termContainer, query) {
			// Filter out existing options from list
			var optionsToFilter = termContainer.preferences.map(function(option) {
				return option.uniqueIdentifier || option.description;
			});
			var uniquePreferenceOptions = termContainer.preferenceOptions.filter(function (option) {
				return (optionsToFilter.indexOf(option.uniqueIdentifier || option.description) === -1);
			});

			uniquePreferenceOptions.forEach(function(course) {
				if (course.subjectCode) {
					course.description = course.subjectCode + " " + course.courseNumber + " " + course.title;
				}
			});

			var results = angular.copy(uniquePreferenceOptions); // eslint-disable-line no-undef
			if (query) {
				var options = {
					shouldSort: true,
					threshold: 0.8,
					location: 0,
					distance: 100,
					maxPatternLength: 32,
					minMatchCharLength: 1,
					includeScore: false,
					keys: [
						"description"
					]
				};
				var optimizedQuery = $scope.optimizeQueryFormat(query);

				var fuse = new Fuse(uniquePreferenceOptions, options); // eslint-disable-line no-undef
				var searchResults = fuse.search(optimizedQuery);
				results = angular.copy(searchResults); // eslint-disable-line no-undef
			}

			// Inject headers into results for displaying in typeahead dropdown
			var groupedResults = _.chain(results).groupBy(function (course) { return course.subjectCode; })
				.map(function (groupedCourses) { groupedCourses[0].firstInGroup = true; return groupedCourses; })
				.flatten().value();

			var resultsWithHeaders = angular.copy(groupedResults); // eslint-disable-line no-undef
			var headersAdded = 0;

			// Past Courses
			if ($scope.view.state.pastAssignments) {
				resultsWithHeaders.splice(0, 0, { description: "Past Assignments", header: true });
				headersAdded += 1;
			}

			// Current courses
			groupedResults.forEach(function (result, index) {
				if (result.firstInGroup === true) {
					var headerDescription = result.uniqueIdentifier ? result.subjectCode + " Courses" : "Non-Courses";
					resultsWithHeaders.splice(index + headersAdded, 0, { description: headerDescription, header: true });
					headersAdded += 1;
				}
			});
			resultsWithHeaders.push({ description: "Suggest a Course ...", suggestACourse: true });

			return resultsWithHeaders;
		};

		// Will improve query formatting when possible to improve search score
		// For example if it receives:
		// 'ECS 10' becomes 'ECS 010'
		// 'ECS010' becomes 'ecs 010'
		// 'ECS 1' becomes 'ecs 001'
		$scope.optimizeQueryFormat = function(query) {
			var optimizedQuery = angular.copy(query); // eslint-disable-line no-undef

			// Is there a space?
			if (optimizedQuery.indexOf(' ') == -1) {
				// Does it have 6 chars?
				if (optimizedQuery.length == 6) {
					// Does it follow the pattern 'ecs030'
					var subjectCode = optimizedQuery.slice(0,3);
					var courseNumber = optimizedQuery.slice(3);
					if (isNumber(courseNumber)) {
						return subjectCode + " " + courseNumber;
					}
				}
			}

			// Were there more than two chunks?
			var optimizedQuery = optimizedQuery.split(' ');
			if (optimizedQuery.length > 2) {
				return query;
			}

			// Is the second chunk numeric?
			var subjectCode = optimizedQuery[0];
			var courseNumber = optimizedQuery[1];

			if (isNumber(courseNumber) == false) {
				return query;
			}

			// Is the second chunk 1 or 2 chars?
			if (courseNumber.length > 2) {
				return query;
			}

			// Fill in the chunk with zeros
			if (courseNumber.length == 1) {
				courseNumber = "00" + courseNumber;
			} else {
				courseNumber = "0" + courseNumber;
			}

			return subjectCode + " " + courseNumber;
		};

		$scope.addPreference = function(preference, term) {
			// Reset add preference UI state
			var elements = $('.search-course-input'); // eslint-disable-line no-undef
			elements[0].focus();
			elements[0].blur();

			if (preference.suggestACourse) {
				$scope.toggleSuggestCourse();
				return;
			}

			// Preference is based off a new course (from Data Warehouse)
			if (preference && preference.isSuggested === true) {
				preference.suggestedEffectiveTermCode = preference.effectiveTermCode;
				preference.suggestedSubjectCode = preference.subjectCode;
				preference.suggestedCourseNumber = preference.courseNumber;
				preference.suggestedTitle = preference.title;
				preference.scheduleId = $scope.view.state.scheduleId;
				preference.instructorId = $scope.view.state.instructorId;
				preference.termCode = term;

				$scope.toggleSuggestCourse();
			}

			TeachingCallFormActionCreators.addPreference(preference, term);
			$scope.view.courseSearchQuery = {};
		};

		$scope.removePreference = function(teachingAssignment) {
			TeachingCallFormActionCreators.removePreference(teachingAssignment);
		};

		$scope.raisePriority = function (preference, preferences, termCode) {
			var sortedTeachingPreferenceIds = [];
			var indexToSwap = null;

			// Sort by priority
			var sortedPreferences = _array_sortByProperty(preferences, "priority");

			// Construct preferenceId array
			sortedPreferences.forEach (function (slotPreference, i) {
				sortedTeachingPreferenceIds.push(slotPreference.id);

				if (slotPreference.id == preference.id) {
					indexToSwap = i;
				}
			});

			var temp = sortedTeachingPreferenceIds[indexToSwap - 1];
			sortedTeachingPreferenceIds[indexToSwap - 1] = sortedTeachingPreferenceIds[indexToSwap];
			sortedTeachingPreferenceIds[indexToSwap] = temp;

			$scope.updateAssignmentsOrder(sortedTeachingPreferenceIds, termCode);
		};

		$scope.lowerPriority = function (preference, preferences, termCode) {
			var sortedTeachingPreferenceIds = [];
			var indexToSwap = null;

			// Sort by priority
			var sortedPreferences = _array_sortByProperty(preferences, "priority");

			// Construct preferenceId array
			sortedPreferences.forEach (function (slotPreference, i) {
				sortedTeachingPreferenceIds.push(slotPreference.id);

				if (slotPreference.id == preference.id) {
					indexToSwap = i;
				}
			});

			var temp = sortedTeachingPreferenceIds[indexToSwap + 1];
			sortedTeachingPreferenceIds[indexToSwap + 1] = sortedTeachingPreferenceIds[indexToSwap];
			sortedTeachingPreferenceIds[indexToSwap] = temp;

			$scope.updateAssignmentsOrder(sortedTeachingPreferenceIds, termCode);
		};

		$scope.updateAssignmentsOrder = function(sortedTeachingPreferenceIds, termCode) {
			TeachingCallFormActionCreators.updateAssignmentsOrder(sortedTeachingPreferenceIds, $scope.view.state.scheduleId, termCode);
		};

		$scope.saveTeachingCallResponse = function(termContainer, newBlob, delay) {
			// Identify is updating or creating

			var termCode = termContainer.termCode;

			var payload = {
				id: termContainer.teachingCallResponseId,
				availabilityBlob: newBlob || termContainer.availabilityBlob,
				termCode: termCode,
				instructorId: $scope.view.state.instructorId,
				scheduleId: $scope.view.state.scheduleId
			};

			// Report changes back to server after some delay
			$timeout.cancel($scope.timeout[termCode]);
			$scope.timeout[termCode] = $timeout(function() {
				// Either create or update the teachingCallResponse
				if (termContainer.teachingCallResponseId) {
					TeachingCallFormActionCreators.updateTeachingCallResponse(payload);
				} else {
					TeachingCallFormActionCreators.createAvailability(payload);
				}
			}, delay);
		};
		$scope.updateComment = function() {
			var payload = {
				comment: $scope.view.state.comment,
				id: $scope.view.state.teachingCallReceiptId
			};

			TeachingCallFormActionCreators.updateTeachingCallReceipt(payload);
		};
		$scope.submitTeachingCallForm = function() {
			var payload = {
				comment: $scope.view.state.comment,
				id: $scope.view.state.teachingCallReceiptId,
				isDone: true
			};

			TeachingCallFormActionCreators.submitTeachingCall(payload, $scope.workgroupId, $scope.year);
		};

		$scope.pretendSubmitForm = function() {
			TeachingCallFormActionCreators.pretendSubmitForm();
		};

		$scope.changeTerm = function (termCode) {
			TeachingCallFormActionCreators.changeTerm(termCode);
		};
		// Generates a 'display rank' for the subset of preferences that are not approved.
		// This is needed because approved preferences still have a 'priority' (rank) value, despite not being shown in the list
		$scope.generateDisplayRank = function (preference, preferences) {
			var displayRank = 1;

			if (preferences) {
				preferences.forEach( function(slotPreference) {
					if (preference.priority > slotPreference.priority) {
						displayRank++;
					}
				});
			}

			return displayRank;
		};

		$scope.updateNavigateAwayGuard = function () {
			if ($scope.view.state.teachingCallReceipt.isDone == false) {
				window.onbeforeunload = function (event) {
					var message = 'Are you sure you want to leave this page without submitting your preferences?';

					if (typeof event == 'undefined') {
						event = window.event;
					}

					if (event) {
						event.returnValue = message;
					}

					return message;
				};
			} else {
				window.onbeforeunload = null;
			}
		};

		$scope.timeout = {};
	}
}

TeachingCallFormCtrl.$inject = ['$scope', '$rootScope', '$window', '$route', '$routeParams', '$timeout', 'TeachingCallFormActionCreators', 'TeachingCallFormService', 'AuthService'];

export default TeachingCallFormCtrl;
