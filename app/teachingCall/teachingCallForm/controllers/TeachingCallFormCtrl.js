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


		$rootScope.$on('teachingCallFormStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.viewState = {};

		$scope.searchCourses = function (termContainer, query) {
			termContainer.preferenceOptions.forEach(function(course) {
				if (course.subjectCode) {
					course.description = course.subjectCode + " " + course.courseNumber + " " + course.title;
				}
			});

			// Display courses already on the schedule
			if (!query || query.length == 0) {
				return termContainer.preferenceOptions;
			}

			var optimizedQuery = $scope.optimizeQueryFormat(query);

			if (query.length >= 3) {
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

				var fuse = new Fuse(termContainer.preferenceOptions, options);
				var results = fuse.search(optimizedQuery);

				return results;
			}
		};

		// Will improve query formatting when possible to improve search score
		// For example if it receives:
		// 'ECS 10' becomes 'ECS 010'
		// 'ECS010' becomes 'ecs 010'
		// 'ECS 1' becomes 'ecs 001'
		$scope.optimizeQueryFormat = function(query) {
			var optimizedQuery = angular.copy(query);

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

		$scope.addPreference = function(preference, term, isBuyout, isSabbatical, isInResidence, isWorkLifeBalance, isLeaveOfAbsence, isCourseRelease) {
			// Reset add preference UI state
			var elements = $('.search-course-input');
			elements[0].focus();
			elements[0].blur();

			var courseNumber, subjectCode, sectionGroup;
			var scheduleId = $scope.view.state.scheduleId;

			// Preference is based off a new course (from Data Warehouse)
			if (preference && preference.isSuggested == true) {
				preference.suggestedEffectiveTermCode = preference.effectiveTermCode;
				preference.suggestedSubjectCode = preference.subjectCode;
				preference.suggestedCourseNumber = preference.courseNumber;
				preference.suggestedTitle = preference.title;
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

		$scope.timeout = {};
		this.getPayload();
	}

	getPayload () {
		var _self = this;
		return this.AuthService.validate(localStorage.getItem('JWT'), _self.$route.current.params.workgroupId, _self.$route.current.params.year).then(function () {
			if (_self.$route.current.params.workgroupId && _self.$route.current.params.year) {
				_self.TeachingCallFormActionCreators.getInitialState(_self.$route.current.params.workgroupId, _self.$route.current.params.year);
			}
		});
	}
}

TeachingCallFormCtrl.$inject = ['$scope', '$rootScope', '$window', '$route', '$routeParams', '$timeout', 'TeachingCallFormActionCreators', 'TeachingCallFormService', 'AuthService'];

export default TeachingCallFormCtrl;
