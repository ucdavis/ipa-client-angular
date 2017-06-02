teachingCallApp.controller('TeachingCallFormCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$timeout', 'teachingCallFormActionCreators', 'teachingCallFormService',
		this.TeachingCallFormCtrl = function ($scope, $rootScope, $window, $routeParams, $timeout, teachingCallFormActionCreators, teachingCallFormService) {
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
				// Display courses already on the schedule
				if (!query || query.length == 0) {
					return termContainer.preferenceOptions;
				}

				// Display courses from DW (may include courses already added to the schedule)
				if (query.length >= 3) {
					// This typehead library works better with a promise,
					// so in this case the controller bypasses the normal state managaement data flow
					return teachingCallFormService.searchCourses(query).then(function (courseSearchResults) {
						var courses = courseSearchResults.slice(0, 20);

						courses.forEach(function (course) {
							course.isSuggested = true;
							course.description = course.subjectCode + " " + course.courseNumber;
							course.scheduleId = $scope.view.state.scheduleId;
							course.instructorId = $scope.view.state.instructorId;
							course.termCode = termContainer.termCode;
						});

						courses = $scope.sortCourses(courses);
						return courses;
					}, function (err) {
						$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
					});
				}

			};

			$scope.sortCourses = function(courses) {
					courses.sort(function (a, b) {
						// Use subject codes to sort if they don't match
						if (a.subjectCode > b.subjectCode) {
							return 1;
						}

						if (a.subjectCode < b.subjectCode) {
							return -1;
						}

						// Subject codes must have matched, use course numbers to sort instead
						if (a.courseNumber > b.courseNumber) {
							return 1;
						}

						if (a.courseNumber < b.courseNumber) {
							return -1;
						}

						return -1;
					});
				return courses;
			};

			$scope.addPreference = function(preference, term, isBuyout, isSabbatical, isInResidence, isCourseRelease) {
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

				teachingCallFormActionCreators.addPreference(preference, term);
				$scope.view.courseSearchQuery = {};
			};

			$scope.removePreference = function(teachingAssignment) {
				teachingCallFormActionCreators.removePreference(teachingAssignment);
			};

			$scope.updateAssignmentsOrder = function(sortedTeachingPreferenceIds, termContainer) {
				teachingCallFormActionCreators.updateAssignmentsOrder(sortedTeachingPreferenceIds, $scope.view.state.scheduleId, termContainer.termCode);
			};

			$scope.copyUnavailabilitiesToAllTerms = function(blob) {
				//Cancel all pending timeouts
				for (var termCode in $scope.timeout) {
					$timeout.cancel($scope.timeout[termCode]);
				}

				angular.forEach($scope.view.state.terms, function(termContainer) {
					termContainer.availabilityBlob = blob;
					$scope.saveTeachingCallResponse(termContainer, blob, 0);
				});
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
						teachingCallFormActionCreators.updateTeachingCallResponse(payload);
					} else {
						teachingCallFormActionCreators.createAvailability(payload);
					}
				}, delay);
			};
			$scope.updateComment = function() {
				var payload = {
					comment: $scope.view.state.comment,
					id: $scope.view.state.teachingCallReceiptId
				};

				teachingCallFormActionCreators.updateTeachingCallReceipt(payload);
			};
			$scope.submitTeachingCallForm = function() {
				var payload = {
					comment: $scope.view.state.comment,
					id: $scope.view.state.teachingCallReceiptId,
					isDone: true
				};

				teachingCallFormActionCreators.submitTeachingCall(payload, $scope.workgroupId, $scope.year);
			};

			$scope.changeTerm = function (termCode) {
				teachingCallFormActionCreators.changeTerm(termCode);
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
			setTimeout(function() {
				$( ".sortable-list" ).sortable();
			}, 1000);

	}]);

TeachingCallFormCtrl.validate = function (authService, teachingCallFormActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		teachingCallFormActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};