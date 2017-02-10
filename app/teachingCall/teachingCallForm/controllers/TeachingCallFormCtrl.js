teachingCallApp.controller('TeachingCallFormCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$timeout', 'teachingCallFormActionCreators', 'teachingCallFormService',
		this.TeachingCallFormCtrl = function ($scope, $rootScope, $window, $routeParams, $timeout, teachingCallFormActionCreators, teachingCallFormService) {
			$window.document.title = "Teaching Call";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
				if ($scope.view.state.activeTeachingCall && $scope.view.state.activeTeachingCall.scheduledCourses == null) {
					$scope.prepareTeachingCall();
				}

			});

			$scope.viewState = {};

			// Convert teachingCall active terms 'termsBlob' to array
			$scope.getActiveTerms = function () {
				var sortedTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
				var terms = $scope.termsBlobToTerms($scope.view.state.activeTeachingCall.termsBlob);
				var teachingCallTerms = [];

				for (var i = 0; i < sortedTerms.length; i++) {
					if (terms.indexOf(sortedTerms[i]) > -1) {
						teachingCallTerms.push(sortedTerms[i]);
					}
				}

				return teachingCallTerms;
			};

			// Decode termsBlob into two digit terms (example: '02', '04')
			$scope.termsBlobToTerms = function (termsBlob) {
				var decodedTermsBlob = [];
				for (var j = 0; j < termsBlob.length; j++) {
					var isTermInTeachingCall = parseInt(termsBlob.charAt(j));

					if (isTermInTeachingCall) {
						term = j + 1;
						term = term.toString();
						if (term.toString().length == 1) {
							term = "0" + term;
						}

						decodedTermsBlob.push(term);
					}
				}
				return decodedTermsBlob;
			};

			$scope.getTermName = function(term) {
				termNames = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};

				return termNames[term];
			};

			// Filter out courses that match an assignment
			$scope.filterDuplicateCoursePreferences = function (courses, assignments) {
				var filteredCourses = [];

				courses.forEach( function (course) {
					var isCourseDuplicate = false;
					assignments.forEach ( function (assignment) {
						if ($scope.assignmentMatchesCourse(assignment, course)) {
							isCourseDuplicate = true;
						}
					});

					if (isCourseDuplicate == false) {
						filteredCourses.push(course);
					}
				});

				return filteredCourses;
			};

			$scope.assignmentMatchesCourse = function (assignment, course) {
				// Handle sab/release/buyout
				if (course.isBuyout) {
					if (assignment.isBuyout === course.isBuyout) {
						return true;
					} else {
						return false;
					}
				} else if (course.isSabbatical) {
					if (assignment.isSabbatical === course.isSabbatical) {
						return true;
					} else {
						return false;
					}
				} else if (course.isInResidence) {
					if (assignment.isInResidence === course.isInResidence) {
						return true;
					} else {
						return false;
					}
				} else if (course.isCourseRelease) {
					if (assignment.isCourseRelease === course.isCourseRelease) {
						return true;
					} else {
						return false;
					}
				}

				// Handle course based preferences
				var assignmentSubjectCode;
				var assignmentCourseNumber;

				if (assignment.subjectCode && assignment.courseNumber) {
					assignmentSubjectCode = assignment.subjectCode;
					assignmentCourseNumber = assignment.courseNumber;
				} else if (assignment.suggestedSubjectCode && assignment.suggestedCourseNumber) {
					assignmentSubjectCode = assignment.suggestedSubjectCode;
					assignmentCourseNumber = assignment.suggestedCourseNumber;
				}

				if (assignmentSubjectCode === course.subjectCode && assignmentCourseNumber === course.courseNumber) {
					return true;
				}

				return false;
			};

			$scope.searchCourses = function (term, query) {
				term = $scope.termToTermCode(term);
				var termAssignments = $scope.view.state.activeTeachingCall.termAssignments[term] || [];
				var scheduledCourses = $scope.view.state.activeTeachingCall.scheduledCourses[term] || [];

				// Display courses already on the schedule
				if (!query || query.length == 0) {
					var courses = [];
					courses.push({ isBuyout: true });
					courses.push({ isCourseRelease: true });
					courses.push({ isSabbatical: true });
					courses.push({ isInResidence: true });

					var filteredCourses = $scope.filterDuplicateCoursePreferences(scheduledCourses, termAssignments);

					filteredCourses = $scope.sortCourses(filteredCourses);

					courses.push.apply(courses, filteredCourses);
					return courses;
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

			$scope.getCourseOfferingIdsFromPreferences = function(preferences) {
				if (!preferences) { return; }
				return preferences.filter(function(preference) {
					return preference.courseOffering;
				}).map(function(preference) {
					return preference.courseOffering.id;
				});
			};

			$scope.getCoursesFromPreferences = function(preferences) {
				if (!preferences) { return; }
				return preferences.filter(function(preference) {
					return preference.course;
				}).map(function(preference) {
					return preference.course;
				});
			};

			$scope.addPreference = function(preference, term, isBuyout, isSabbatical, isInResidence, isCourseRelease) {
				// Reset add preference UI state
				var elements = $('.search-course-input');
				elements[0].focus();
				elements[0].blur();

				var courseNumber, subjectCode, sectionGroup;
				var scheduleId = $scope.view.state.activeTeachingCall.scheduleId;

				// Preference is based on an existing course
				if (preference && !preference.isSuggested) {
					courseNumber = preference.courseNumber;
					subjectCode = preference.subjectCode;

					// Find an appropriate sectionGroup
					for (var i = 0; i < $scope.view.state.sectionGroups.ids.length; i++) {
						var slotSectionGroup = $scope.view.state.sectionGroups.list[$scope.view.state.sectionGroups.ids[i]];
						var slotCourse = $scope.view.state.courses.list[slotSectionGroup.courseId];
						var instructor = $scope.view.state.instructors.list[$scope.view.state.userInterface.instructorId];
						if (slotCourse.subjectCode == subjectCode && slotCourse.courseNumber == courseNumber) {
							sectionGroup = slotSectionGroup;
							break;
						}
					}
				}

				// Preference is based off a new course (from Data Warehouse)
				if (preference && preference.isSuggested == true) {
					preference.suggestedEffectiveTermCode = preference.effectiveTermCode;
					preference.suggestedSubjectCode = preference.subjectCode;
					preference.suggestedCourseNumber = preference.courseNumber;
					preference.suggestedTitle = preference.title;
				}

				// Create a teachingAssignment based off the preference
				var teachingAssignment = {};
				teachingAssignment.termCode = term;
				// Used as a model for courseNumber/sectionGroup/scheduleId association

				if (sectionGroup && sectionGroup.id) {
					teachingAssignment.sectionGroup = sectionGroup;
					teachingAssignment.sectionGroupId = sectionGroup.id;
				}

				var instructorId = $scope.view.state.userInterface.instructorId;
				teachingAssignment.instructor = $scope.view.state.instructors.list[instructorId];
				teachingAssignment.instructorId = instructorId;

				teachingAssignment.buyout = preference.isBuyout;
				teachingAssignment.sabbatical = preference.isSabbatical;
				teachingAssignment.inResidence = preference.isInResidence;
				teachingAssignment.courseRelease = preference.isCourseRelease;
				teachingAssignment.schedule = {id: scheduleId};
				teachingAssignment.scheduleId = scheduleId;

				if (preference && preference.isSuggested == true) {
					teachingAssignment.suggestedEffectiveTermCode = preference.effectiveTermCode;
					teachingAssignment.suggestedSubjectCode = preference.subjectCode;
					teachingAssignment.suggestedCourseNumber = preference.courseNumber;
					teachingAssignment.suggestedTitle = preference.title;
				}
				teachingCallFormActionCreators.addPreference(teachingAssignment);
				$scope.view.courseSearchQuery = {};
			};

			$scope.removePreference = function(teachingAssignment) {
				teachingCallFormActionCreators.removePreference(teachingAssignment);
			};

			$scope.updateAssignmentsOrder = function(sortedTeachingPreferenceIds, term) {
				teachingCallFormActionCreators.updateAssignmentsOrder(sortedTeachingPreferenceIds, $scope.view.state.userInterface.scheduleId);
			};

			$scope.termHasSabbatical = function(term) {
				var termPrefs = $scope.termPreferences[term] || [];
				for (var i = 0; i < termPrefs.length ; i++) {
					if (termPrefs[i].isSabbatical) { return true; }
				}
				return false;
			};

			$scope.copyUnabailabilitiesToAllTerms = function(blob) {
				//Cancel all pending timeouts
				for (var term in $scope.timeout) {
					$timeout.cancel($scope.timeout[term]);
				}

				angular.forEach($scope.view.state.activeTeachingCall.terms, function(term) {
					$scope.saveTeachingCallResponse(term, blob, 0);
				});
			};

			$scope.saveTeachingCallResponse = function(term, blob, delay) {
				// Identify is updating or creating

				var termCode = $scope.termToTermCode(term);
				var teachingCallResponse = $scope.view.state.activeTeachingCall.teachingCallResponsesByTermCode[termCode] || {};
				teachingCallResponse.availabilityBlob = blob || teachingCallResponse.availabilityBlob;
				teachingCallResponse.termCode = termCode;
				teachingCallResponse.instructorId = $scope.view.state.userInterface.instructorId;
				teachingCallResponse.teachingCallId = $scope.view.state.activeTeachingCall.id;

				// Report changes back to server after some delay
				$timeout.cancel($scope.timeout[term]);
				$scope.timeout[term] = $timeout(function() {
					if (teachingCallResponse.id) {
						teachingCallFormActionCreators.updateTeachingCallResponse(teachingCallResponse);
					} else {
						teachingCallFormActionCreators.addTeachingCallResponse(teachingCallResponse);
					}
				}, delay);
			};

			$scope.updateTeachingCallReceipt = function(markAsDone) {
				var teachingCallReceipt = $scope.view.state.activeTeachingCall.teachingCallReceipt;

				// Update TeachingCallReceipt
				if (teachingCallReceipt.id) {
					if (markAsDone) {
						teachingCallReceipt.isDone = true;
					}

					teachingCallFormActionCreators.updateTeachingCallReceipt(teachingCallReceipt);
				}
			};

			$scope.isScheduleTermLocked = function(term) {
				var termCode = $scope.termToTermCode(term);

				return $scope.view.state.scheduleTermStates.list[termCode].isLocked;
			};

			$scope.submitTeachingCall = function() {
				var teachingCallReceipt = $scope.view.state.activeTeachingCall.teachingCallReceipt;

				if (teachingCallReceipt.id) {
					teachingCallReceipt.isDone = true;

					teachingCallFormActionCreators.submitTeachingCall(teachingCallReceipt, $scope.workgroupId, $scope.year);
				}
			};

			$scope.prepareTeachingCall = function () {
				var activeTeachingCall = $scope.view.state.activeTeachingCall;

				activeTeachingCall.terms = $scope.getActiveTerms();

				activeTeachingCall.termAssignments = {};

				// Holds sectionGroupIds that should not be offered as preferences to add
				var alreadyHasPreferenceSectionGroupIds = [];

				// Building an object of teachingAssignments for this instructor, separated by term
				var i, j, sectionGroup, course, termCode;
				for (i = 0; i < $scope.view.state.teachingAssignments.ids.length; i++) {
					var teachingAssignment = $scope.view.state.teachingAssignments.list[$scope.view.state.teachingAssignments.ids[i]];

					if (teachingAssignment.instructorId == $scope.view.state.userInterface.instructorId) {
						// If preference is course based, attach meta-data
						if (teachingAssignment.sectionGroupId) {
							sectionGroup = $scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];
							course = $scope.view.state.courses.list[sectionGroup.courseId];

							teachingAssignment.subjectCode = course.subjectCode;
							teachingAssignment.courseNumber = course.courseNumber;
						}

						if (activeTeachingCall.termAssignments[teachingAssignment.termCode] == null) {
							activeTeachingCall.termAssignments[teachingAssignment.termCode] = [];
						}

						var preferenceAlreadyAdded = false;
						// Ensure sectionGroup hasn't already been added as a preference
						for (j = 0; j < activeTeachingCall.termAssignments[teachingAssignment.termCode].length; j++) {
							var slotAssignment = activeTeachingCall.termAssignments[teachingAssignment.termCode][j];

							if (teachingAssignment.subjectCode == slotAssignment.subjectCode
								&& teachingAssignment.courseNumber == slotAssignment.courseNumber
								&& teachingAssignment.buyout == slotAssignment.buyout
								&& teachingAssignment.courseRelease == slotAssignment.courseRelease
								&& teachingAssignment.sabbatical == slotAssignment.sabbatical
								&& teachingAssignment.inResidence == slotAssignment.inResidence
								&& teachingAssignment.subjectCode != null) {
								preferenceAlreadyAdded = true;
							}
						}

						if (preferenceAlreadyAdded === false) {
							activeTeachingCall.termAssignments[teachingAssignment.termCode].push(teachingAssignment);
						}

						alreadyHasPreferenceSectionGroupIds.push(teachingAssignment.sectionGroupId);
					}
				}

				// Building an object separated by terms, of unique courses based on schedule sectionGroups
				activeTeachingCall.scheduledCourses = {};

				// Scaffold all teachingAssignment termCodeId arrays
				var allTerms = ['01', '02', '03', '04', '06', '07', '08', '09', '10'];
				allTerms.forEach( function (slotTerm) {
					var generatedTermCode = $scope.generateTermCode($scope.year, slotTerm);
					activeTeachingCall.scheduledCourses[generatedTermCode] = [];
				});

				for (i = 0; i < $scope.view.state.sectionGroups.ids.length; i++) {
					sectionGroup = $scope.view.state.sectionGroups.list[$scope.view.state.sectionGroups.ids[i]];
					var originalCourse = $scope.view.state.courses.list[sectionGroup.courseId];
					course = jQuery.extend(true, {}, originalCourse);

					termCode = parseInt(sectionGroup.termCode);
					// Adding metadata from sectionGroup
					course.seatsTotal = sectionGroup.plannedSeats;

					// Ensure termCode has been added
					if (activeTeachingCall.scheduledCourses[termCode] == null) {
						activeTeachingCall.scheduledCourses[termCode] = [];
					}

					// Ensure course hasn't already been added
					var courseAlreadyExists = false;

					for (j = 0; j < activeTeachingCall.scheduledCourses[termCode].length; j++) {
						var slotCourse = activeTeachingCall.scheduledCourses[termCode][j];

						if (slotCourse.subjectCode == course.subjectCode &&
							slotCourse.courseNumber == course.courseNumber) {
							courseAlreadyExists = true;
							break;
						}
					}

					if (courseAlreadyExists === false) {
						if (alreadyHasPreferenceSectionGroupIds.indexOf(course.sectionGroupTermCodeIds[termCode]) > -1) {
							course.hasPreference = true;
						} else {
							course.hasPreference = false;
						}

						activeTeachingCall.scheduledCourses[termCode].push(course);
					}
				}

				// Set teachingCallReceipt
				for (i = 0; i < $scope.view.state.teachingCallReceipts.ids.length; i++) {
					var slotTeachingCallReceipt = $scope.view.state.teachingCallReceipts.list[$scope.view.state.teachingCallReceipts.ids[i]];
					if (slotTeachingCallReceipt.instructorId == $scope.view.state.userInterface.instructorId &&
						slotTeachingCallReceipt.teachingCallId == activeTeachingCall.id) {
						activeTeachingCall.teachingCallReceiptId = slotTeachingCallReceipt.id;
						activeTeachingCall.teachingCallReceipt = slotTeachingCallReceipt;
						break;
					}
				}
				activeTeachingCall.teachingCallReceipt = $scope.view.state.teachingCallReceipts.list[$scope.view.state.activeTeachingCall.teachingCallReceiptId];
				activeTeachingCall.teachingCallResponsesByTermCode = {};

				for (i = 0; i < $scope.view.state.activeTeachingCall.terms.length; i++) {
					termCode = $scope.termToTermCode($scope.view.state.activeTeachingCall.terms[i]);
					activeTeachingCall.teachingCallResponsesByTermCode[termCode] = {};

					for (j = 0; j < $scope.view.state.teachingCallResponses.ids.length; j++) {
						var slotTeachingCallResponse = $scope.view.state.teachingCallResponses.list[$scope.view.state.teachingCallResponses.ids[j]];

						if (slotTeachingCallResponse.instructorId == $scope.view.state.userInterface.instructorId &&
							slotTeachingCallResponse.termCode == termCode) {
							activeTeachingCall.teachingCallResponsesByTermCode[termCode] = slotTeachingCallResponse;
						}
					}
				}

				teachingCallFormActionCreators.initializeActiveTeachingCall(activeTeachingCall);
			};

			// Generates a 'display rank' for the subset of preferences that are not approved.
			// This is needed because approved preferences still have a 'priority' (rank) value, despite not being shown in the list
			$scope.generateDisplayRank = function (preference, preferences) {
				var displayRank = 1;

				if (preferences) {
					preferences.forEach( function(slotPreference) {
						if (slotPreference.approved == false && preference.priority > slotPreference.priority) {
							displayRank++;
						}
					});
				}

				return displayRank;
			};

			$scope.generateTermCode = function (year, term) {
				if (term.toString().length == 1) {
					term = "0" + Number(term);
				}

				if (["01", "02", "03"].indexOf(term) >= 0) { year++; }
				var termCode = year + term;

				return termCode;
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

			$scope.termCodeToTerm = function(termCode) {
				return termCode.slice(-2);
			};

			$scope.getDescription = function(preference) {
				if (typeof preference === 'undefined') { return 'Add'; }
				else if (preference.buyout) { return 'Buyout'; }
				else if (preference.sabbatical) { return 'Sabbatical'; }
				else if (preference.inResidence) { return 'In Residence'; }
				else if (preference.courseRelease) { return 'Course Release'; }
				else if (preference.suggestedSubjectCode && preference.suggestedCourseNumber) {
					return preference.suggestedSubjectCode + ' ' + preference.suggestedCourseNumber;
				}
				else {
					return preference.subjectCode + ' ' + preference.courseNumber;
				}
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