'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:TeachingCallCtrl
 * @description
 * # TeachingCallCtrl
 * Controller of the ipaClientAngularApp
 */
assignmentApp.controller('TeachingCallCtrl', ['$scope', '$rootScope', '$routeParams', 'assignmentActionCreators',
		this.TeachingCallCtrl = function ($scope, $rootScope, $routeParams, assignmentActionCreators) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = parseInt($scope.year) + 1;
			$scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
				$scope.prepareTeachingCall();
				console.log($scope.view.state);
			});

			$scope.viewState = {};

			// Convert teachingCall active terms 'termsBlob' to array
			$scope.getActiveTerms = function() {
				var sortedTerms = ['05','06','07','08','09','10','01','02','03'];
				var termsBlob = $scope.view.state.activeTeachingCall.termsBlob;
				var teachingCallTerms = [];

				for (var i = 0; i < sortedTerms.length; i++) {
					if (termsBlob.charAt(i) == 1) {
						teachingCallTerms.push(sortedTerms[i]);
					}
				}

				return teachingCallTerms;
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

			$scope.addPreference = function(courseOffering, term, isBuyout, isSabbatical, isCourseRelease) {
				var instructor = {id: userService.getCurrentUser().instructorId};
				var isApproved = false;
				
				teachingPreferenceService.addInstructorTeachingPreference(courseOffering, term, $scope.teachingCall.scheduleId, isBuyout, isSabbatical, isCourseRelease, instructor, isApproved)
				.then(function(res){
					$scope.termPreferences = teachingPreferenceService.retrieveInstancesSortedByTerm();
					ngNotify.set("Added preference successfully",'success');
					$scope.autoSave();
				}, function() {
					ngNotify.set("Error adding preference",'error');
				});
			};

			$scope.updatePreference = function(preference, courseOffering, isBuyout, isSabbatical, isCourseRelease) {
				var term = preference.termCode.slice(-2);

				teachingPreferenceService.updateTeachingPreference(preference, courseOffering, isBuyout, isSabbatical, isCourseRelease)
				.then(function(res){
					ngNotify.set("Updated preference successfully",'success');
					$scope.autoSave();
				}, function() {
					ngNotify.set("Error updating preference",'error');
				});
			};

			$scope.deletePreference = function(preference) {
				var term = preference.termCode.slice(-2);

				teachingPreferenceService.deleteTeachingPreference(preference)
				.then(function(res){
					$scope.termPreferences = teachingPreferenceService.retrieveInstancesSortedByTerm();
					ngNotify.set("Removed preference successfully",'success');
					$scope.autoSave();
				}, function() {
					ngNotify.set("Error removing preference",'error');
				});
			};

			$scope.updatePreferencesOrder = function(sortedTeachingPreferenceIds, term) {
				teachingPreferenceService.updatePreferencesOrder(sortedTeachingPreferenceIds,term)
				.then(function(res) {
					ngNotify.set("Reordered preferences successfully",'success');
					$scope.autoSave();
				}, function() {
					ngNotify.set("Error reordering preferences",'error');
				});
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

				angular.forEach($scope.terms, function(term) {
					$scope.saveTeachingCallResponse(term, blob, 0);
				});
			};

			$scope.saveTeachingCallResponse = function(term, blob, delay) {
				var termCode = sharedService.termYear(term) + term;
				var teachingCallResponse = $scope.teachingCallResponse[term] || {};
				teachingCallResponse.availabilityBlob = blob || teachingCallResponse.availabilityBlob;

				// Report changes back to server after some delay
				$timeout.cancel($scope.timeout[term]);
				$scope.timeout[term] = $timeout(function() {
					teachingCallResponseService.updateOrCreateTeachingCallResponse(
						teachingCallResponse,
						termCode,
						$scope.instructorId,
						$routeParams.teachingCallId)
					.then(function(response){
						$scope.teachingCallResponse[term] = response;
						ngNotify.set("Saved changes successfully",'success');
						$scope.autoSave();
					}, function() {
						ngNotify.set("Error saving changes",'error');
					});
				}, delay);
			};

			$scope.updateTeachingCallReceipt = function(markAsDone) {
				$scope.teachingCallReceipt.isDone = markAsDone || $scope.teachingCallReceipt.isDone; 
				teachingCallReceiptService.updateTeachingCallReceipt($scope.teachingCallReceipt)
				.then(function(receipt){
					$scope.teachingCallReceipt = receipt;
					ngNotify.set("Saved successfully", "success");
					$scope.autoSave();
				}, function() {
					ngNotify.set("Error saving", "error");
				});
			};

			$scope.isScheduleTermLocked = function(term) {
				var termCode = $scope.termToTermCode(term);

				return $scope.view.state.scheduleTermStates.list[termCode].isLocked;
			};
/*
			$scope.refreshPreferences = function() {
				$scope.termPreferences = teachingPreferenceService.retrieveInstancesSortedByTerm();
			};

			$scope.autoSave = function() {
				$scope.viewState.lastSaved = moment().format('LTS');
			};
*/
			$scope.prepareTeachingCall = function() {
				$scope.terms = $scope.getActiveTerms();

				$scope.termAssignments = {};

				// Building an object of teachingAssignments for this instructor, separated by term
				for (var i = 0; i < $scope.view.state.teachingAssignments.ids.length; i++) {
					var teachingAssignment = $scope.view.state.teachingAssignments.list[$scope.view.state.teachingAssignments.ids[i]];

					if (teachingAssignment.instructorId == $scope.view.state.userInterface.instructorId) {
						var sectionGroup = $scope.view.state.sectionGroups.list[teachingAssignment.sectionGroupId];
						var course = $scope.view.state.courses.list[sectionGroup.courseId];

						teachingAssignment.subjectCode = course.subjectCode;
						teachingAssignment.courseNumber = course.courseNumber;

						if ($scope.termAssignments[teachingAssignment.termCode] == null) {
							$scope.termAssignments[teachingAssignment.termCode] = [];
						};

						$scope.termAssignments[teachingAssignment.termCode].push(teachingAssignment);
					}
				}

				// Building an object separated by terms, of unique courses based on schedule sectionGroups
				$scope.scheduledCourses = {};

				for (var i = 0; i < $scope.view.state.sectionGroups.ids.length; i++) {
					var sectionGroup = $scope.view.state.sectionGroups.list[$scope.view.state.sectionGroups.ids[i]];
					var course = $scope.view.state.courses.list[sectionGroup.courseId];

					// Adding metadata from sectionGroup
					course.seatsTotal = sectionGroup.plannedSeats;

					// Ignore courses being suppressed
					if (course.isHidden == false) {

						// Ensure termCode has been added
						if ($scope.scheduledCourses[sectionGroup.termCode] == null) {
							$scope.scheduledCourses[sectionGroup.termCode] = [];
						}

						// Ensure course hasn't already been added
						if ($scope.scheduledCourses[sectionGroup.termCode].indexOf(course) < 0) {
							$scope.scheduledCourses[sectionGroup.termCode].push(course);
						}
					}
				}


				console.log($scope.scheduledCourses);
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
			}
			
			$scope.termCodeToTerm = function(termCode) {
				return termCode.slice(-2);
			}
			//$scope.terms = termService.getActiveTerms();

			//$scope.year = sharedService.selectedYear();
			//$scope.activeWorkgroup = userService.getActiveWorkgroup();
			//$scope.termPreferences = teachingPreferenceService.retrieveInstancesSortedByTerm();
			//$scope.teachingCall = teachingCall;
			//$scope.teachingCallReceipt = teachingCallReceipt;
			//$scope.teachingCallResponse = teachingCallResponseService.retrieveInstancesSortedByTerm();
			//$scope.terms = termService.setActiveTermsByTermsBlob(teachingCall.termsBlob);
			//$scope.courseOfferings = courseOfferings;
			//$scope.instructorId = userService.getCurrentUser().instructorId;
			$scope.timeout = {};
	}]);

TeachingCallCtrl.validate = function (authService, assignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then( function() {
		assignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	})
}