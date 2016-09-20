'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:TeachingCallFormCtrl
 * @description
 * # TeachingCallFormCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('TeachingCallFormCtrl', ['$scope', '$rootScope', '$window', '$routeParams', '$timeout', 'assignmentActionCreators',
		this.TeachingCallFormCtrl = function ($scope, $rootScope, $window, $routeParams, $timeout, assignmentActionCreators) {
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
			$scope.getActiveTerms = function() {
				var sortedTerms = ['05','06','07','08','09','10','01','02','03'];
				var terms = $scope.termsBlobToTerms($scope.view.state.activeTeachingCall.termsBlob);
				var teachingCallTerms = [];

				for (var i = 0; i < sortedTerms.length; i++) {
					if (terms.indexOf(sortedTerms[i]) > -1) {
						teachingCallTerms.push(sortedTerms[i]);
					}
				}

				return teachingCallTerms;
			}

			// Decode termsBlob into two digit terms (example: '02', '04')
			$scope.termsBlobToTerms = function(termsBlob) {
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
			}

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

			$scope.getCourseOfferingIdsFromPreferences = function(preferences) {
				if (!preferences) return;
				return preferences.filter(function(preference) {
					return preference.courseOffering;
				}).map(function(preference) {
					return preference.courseOffering.id;
				});
			};

			$scope.getCoursesFromPreferences = function(preferences) {
				if (!preferences) return;
				return preferences.filter(function(preference) {
					return preference.course;
				}).map(function(preference) {
					return preference.course;
				});
			};

			$scope.addPreference = function(preference, courseOffering, isBuyout, isSabbatical, isCourseRelease) {
				var courseNumber, subjectCode, sectionGroup;
				var term = courseOffering;
				var scheduleId = $scope.view.state.activeTeachingCall.scheduleId;

				if (preference) {
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

				teachingAssignment.buyout = isBuyout;
				teachingAssignment.sabbatical = isSabbatical;
				teachingAssignment.courseRelease = isCourseRelease;
				teachingAssignment.schedule = {id: scheduleId};
				teachingAssignment.scheduleId = scheduleId;

				assignmentActionCreators.addPreference(teachingAssignment);
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
					if (termPrefs[i].isSabbatical) return true;
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

			$scope.prepareTeachingCall = function() {
				var activeTeachingCall = $scope.view.state.activeTeachingCall;

				activeTeachingCall.terms = $scope.getActiveTerms();

				activeTeachingCall.termAssignments = {};

				// Holds sectionGroupIds that should not be offered as preferences to add
				var alreadyHasPreferenceSectionGroupIds = [];

				// Building an object of teachingAssignments for this instructor, separated by term
				for (var i = 0; i < $scope.view.state.teachingAssignments.ids.length; i++) {
					var teachingAssignment = $scope.view.state.teachingAssignments.list[$scope.view.state.teachingAssignments.ids[i]];

					if (teachingAssignment.instructorId == $scope.view.state.userInterface.instructorId) {

						if (teachingAssignment.sectionGroupId) {
							var sectionGroup = $scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];
							var course = $scope.view.state.courses.list[sectionGroup.courseId];

							teachingAssignment.subjectCode = course.subjectCode;
							teachingAssignment.courseNumber = course.courseNumber;
						}

						if (activeTeachingCall.termAssignments[teachingAssignment.termCode] == null) {
							activeTeachingCall.termAssignments[teachingAssignment.termCode] = [];
						};

						var preferenceAlreadyAdded = false;
						// Ensure sectionGroup hasn't already been added as a preference
						for (var j = 0; j < activeTeachingCall.termAssignments[teachingAssignment.termCode].length; j++) {
							var slotAssignment = activeTeachingCall.termAssignments[teachingAssignment.termCode][j];

							if (teachingAssignment.subjectCode == slotAssignment.subjectCode
								&& teachingAssignment.courseNumber == slotAssignment.courseNumber) {
									preferenceAlreadyAdded = true;
							}
						}

						if (preferenceAlreadyAdded == false) {
							activeTeachingCall.termAssignments[teachingAssignment.termCode].push(teachingAssignment);
						}

						alreadyHasPreferenceSectionGroupIds.push(teachingAssignment.sectionGroupId);
					}
				}

				// Building an object separated by terms, of unique courses based on schedule sectionGroups
				activeTeachingCall.scheduledCourses = {};

				for (var i = 0; i < $scope.view.state.sectionGroups.ids.length; i++) {
					var sectionGroup = $scope.view.state.sectionGroups.list[$scope.view.state.sectionGroups.ids[i]];
					var originalCourse = $scope.view.state.courses.list[sectionGroup.courseId];
					var course = jQuery.extend(true, {}, originalCourse);

					var termCode = parseInt(sectionGroup.termCode);
					// Adding metadata from sectionGroup
					course.seatsTotal = sectionGroup.plannedSeats;

					// Ignore courses being suppressed
					if (course.isHidden == false) {

						// Ensure termCode has been added
						if (activeTeachingCall.scheduledCourses[termCode] == null) {
							activeTeachingCall.scheduledCourses[termCode] = [];
						}

						// Ensure course hasn't already been added
						var courseAlreadyExists = false;

						for (var j = 0; j < activeTeachingCall.scheduledCourses[termCode].length; j++) {
							var slotCourse = activeTeachingCall.scheduledCourses[termCode][j];

							if (slotCourse.subjectCode == course.subjectCode
								&& slotCourse.courseNumber == course.courseNumber) {
								courseAlreadyExists = true;
								break;
							}
						}

						if (courseAlreadyExists == false) {
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
				for (var i = 0; i < $scope.view.state.teachingCallReceipts.ids.length; i++) {
					var slotTeachingCallReceipt = $scope.view.state.teachingCallReceipts.list[$scope.view.state.teachingCallReceipts.ids[i]];
					if (slotTeachingCallReceipt.instructorId == $scope.view.state.userInterface.instructorId
						&& slotTeachingCallReceipt.teachingCallId == activeTeachingCall.id) {
							activeTeachingCall.teachingCallReceiptId = slotTeachingCallReceipt.id;
							activeTeachingCall.teachingCallReceipt = slotTeachingCallReceipt;
							break;
						}
				}
				activeTeachingCall.teachingCallReceipt = $scope.view.state.teachingCallReceipts.list[$scope.view.state.activeTeachingCall.teachingCallReceiptId];
				activeTeachingCall.teachingCallResponsesByTermCode = {};

				for (var i = 0; i < $scope.view.state.activeTeachingCall.terms.length; i++) {
					var termCode = $scope.termToTermCode($scope.view.state.activeTeachingCall.terms[i]);
					activeTeachingCall.teachingCallResponsesByTermCode[termCode] = {};

					for (var j = 0; j < $scope.view.state.teachingCallResponses.ids.length; j++) {
						var slotTeachingCallResponse = $scope.view.state.teachingCallResponses.list[$scope.view.state.teachingCallResponses.ids[j]];

						if (slotTeachingCallResponse.instructorId == $scope.view.state.userInterface.instructorId
						&& slotTeachingCallResponse.termCode == termCode) {
							activeTeachingCall.teachingCallResponsesByTermCode[termCode] = slotTeachingCallResponse;
						}
					}
				}

				assignmentActionCreators.initializeActiveTeachingCall(activeTeachingCall);
			}

			$scope.termToTermCode = function(term) {
				// Already a termCode
				if (term.length == 6) {
					return term;
				}

				var year = $scope.year;

				switch(term) {
					case "01":
					case "02":
					case "03":
						year++;
						break;
					default:
						year;
				}
				var termCode = year + term;

				return termCode;
			};

			$scope.termCodeToTerm = function(termCode) {
				return termCode.slice(-2);
			};

			$scope.getDescription = function(preference) {
				if (typeof preference === 'undefined') return 'Add';
				else if (preference.isBuyout) return 'Buyout';
				else if (preference.isSabbatical) return 'Sabbatical';
				else if (preference.isCourseRelease) return 'Course Release';
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
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}