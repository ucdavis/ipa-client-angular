/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:TeachingCallFormCtrl
 * @description
 * # TeachingCallFormCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('TeachingCallFormCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$timeout', 'assignmentActionCreators', 'assignmentService',
		this.TeachingCallFormCtrl = function ($scope, $rootScope, $window, $routeParams, $timeout, assignmentActionCreators, assignmentService) {
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

			$scope.searchCourses = function (term, query) {
				term = $scope.termToTermCode(term);

				// Display courses already on the schedule
				if (!query || query.length == 0) {
					var results = [];
					results.push({ isBuyout: true });
					results.push({ isCourseRelease: true });
					results.push({ isSabbatical: true });

					var scheduledCourses = $scope.view.state.activeTeachingCall.scheduledCourses[term];
					results.push.apply(results, scheduledCourses);
					return results;
				}

				// Display courses from DW (may include courses already added to the schedule)
				if (query.length >= 3) {
					// This typehead library works better with a promise,
					// so in this case the controller bypasses the normal state managaement data flow
					return assignmentService.searchCourses(query).then(function (courseSearchResults) {
						var results = courseSearchResults.slice(0, 20);

						results.forEach(function (course) {
							course.isSuggested = true;
						});

						return results;
					}, function (err) {
						$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
					});
				}

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

			$scope.addPreference = function(preference, term, isBuyout, isSabbatical, isCourseRelease) {
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
				teachingAssignment.courseRelease = preference.isCourseRelease;
				teachingAssignment.schedule = {id: scheduleId};
				teachingAssignment.scheduleId = scheduleId;

				if (preference && preference.isSuggested == true) {
					teachingAssignment.suggestedEffectiveTermCode = preference.effectiveTermCode;
					teachingAssignment.suggestedSubjectCode = preference.subjectCode;
					teachingAssignment.suggestedCourseNumber = preference.courseNumber;
					teachingAssignment.suggestedTitle = preference.title;
				}
				assignmentActionCreators.addPreference(teachingAssignment);
				$scope.view.courseSearchQuery = {};
			};

			$scope.removePreference = function(teachingAssignment) {
				assignmentActionCreators.removePreference(teachingAssignment);
			};

			$scope.updateAssignmentsOrder = function(sortedTeachingPreferenceIds, term) {
				assignmentActionCreators.updateAssignmentsOrder(sortedTeachingPreferenceIds, $scope.view.state.userInterface.scheduleId);
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
						assignmentActionCreators.updateTeachingCallResponse(teachingCallResponse);
					} else {
						assignmentActionCreators.addTeachingCallResponse(teachingCallResponse);
					}
				}, delay);
			};

			$scope.updateTeachingCallReceipt = function(markAsDone) {
				var teachingCallReceipt = $scope.view.state.activeTeachingCall.teachingCallReceipt;

				if (markAsDone) {
					teachingCallReceipt.isDone = true;
				}

				assignmentActionCreators.updateTeachingCallReceipt(teachingCallReceipt);

				window.location.pathname = "/summary";
			};

			$scope.isScheduleTermLocked = function(term) {
				var termCode = $scope.termToTermCode(term);

				return $scope.view.state.scheduleTermStates.list[termCode].isLocked;
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

							if (teachingAssignment.subjectCode == slotAssignment.subjectCode &&
								teachingAssignment.courseNumber == slotAssignment.courseNumber) {
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

				for (i = 0; i < $scope.view.state.sectionGroups.ids.length; i++) {
					sectionGroup = $scope.view.state.sectionGroups.list[$scope.view.state.sectionGroups.ids[i]];
					var originalCourse = $scope.view.state.courses.list[sectionGroup.courseId];
					course = jQuery.extend(true, {}, originalCourse);

					termCode = parseInt(sectionGroup.termCode);
					// Adding metadata from sectionGroup
					course.seatsTotal = sectionGroup.plannedSeats;

					// Ignore courses being suppressed
					if (course.isHidden === false) {

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

				assignmentActionCreators.initializeActiveTeachingCall(activeTeachingCall);
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

TeachingCallFormCtrl.validate = function (authService, assignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};