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
					return assignmentService.searchCourses(query).then(function (courseSearchResults) {
						var courses = courseSearchResults.slice(0, 20);

						courses.forEach(function (course) {
							course.isSuggested = true;
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

			$scope.getDisplayTextFromCourse = function(course) {
				if (course == undefined) {
					return "";
				}

				// If entry is a buyout/sabbatical/course release
				if (course.isBuyout) {
					return "Buyout";
				} else if (course.isSabbatical) {
					return "Sabbatical";
				} else if (course.isInResidence) {
					return "In Residence";
				} else if (course.isCourseRelease) {
					return "Course Release";
				}
				// If entry is a standard course that was already added to the schedule
				else if ( course.subjectCode.length > 0
					&& course.courseNumber.length > 0
					&& course.title.length > 0 ) {
						var displayText = course.subjectCode + ' ' + course.courseNumber + ' ' + course.title;
						return displayText;
				} else {
					return "";
				}
			};

			$scope.addPreference = function(preference, term, isBuyout, isSabbatical, isInResidence, isCourseRelease) {
				// Reset add preference UI state
				var elements = $('.search-course-input');
				elements[0].focus();
				elements[0].blur();

				var courseNumber, subjectCode, sectionGroup;
				var scheduleId = $scope.view.state.pageState.scheduleId;

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
				teachingCallFormActionCreators.updateAssignmentsOrder(sortedTeachingPreferenceIds, $scope.view.state.pageState.scheduleId, termContainer.termCode);
			};

			$scope.copyUnavailabilitiesToAllTerms = function(blob) {
				//Cancel all pending timeouts
				for (var termCode in $scope.timeout) {
					$timeout.cancel($scope.timeout[termCode]);
				}

				angular.forEach($scope.view.state.pageState.terms, function(termContainer) {
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
					instructorId: $scope.view.state.pageState.instructorId,
					scheduleId: $scope.view.state.pageState.scheduleId
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
					comment: $scope.view.state.pageState.comment,
					id: $scope.view.state.pageState.teachingCallReceiptId
				};

				teachingCallFormActionCreators.updateTeachingCallReceipt(payload);
			};
			$scope.submitTeachingCallForm = function() {
				var payload = {
					comment: $scope.view.state.pageState.comment,
					id: $scope.view.state.pageState.teachingCallReceiptId,
					isDone: true
				};

				teachingCallFormActionCreators.submitTeachingCall(payload, $scope.workgroupId, $scope.year);
			};


			$scope.isScheduleTermLocked = function(term) {
				var termCode = $scope.termToTermCode(term);

				return $scope.view.state.scheduleTermStates.list[termCode].isLocked;
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

			$scope.termToTermCode = function(term) {
				// Already a termCode
				if (term.length == 6) {
					return term;
				}
				var year = $scope.year;

				if (["01", "02", "03"].indexOf(term) >= 0) { year++; }
				var termCode = year + term;

				return termCode;
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