teachingCallApp.service('teachingCallFormStateService', function (
	$rootScope, $log, SectionGroup, Course, ScheduleTermState,
	ScheduleInstructorNote, Term, Tag, Instructor, TeachingAssignment,
	TeachingCall, TeachingCallReceipt, TeachingCallResponse) {
	return {
		_state: {},
		_pageStateReducers: function (action, pageState) {
			var self = this;
			switch (action.type) {
				case INIT_STATE:
					pageState = {
						showUnavailabilities: null, // False
						dueDate: null, // "dec 15th 2016"
						comment: null, // "Only Fridays please"
						isDone: null, // True
						scheduleId: action.payload.scheduleId,
						terms: [],
						instructorId: action.payload.instructorId,
						teachingCallReceiptId: null,
						courseSearchQuery: {}
					};

					var termsBlob = null;

					if (action.payload.teachingCallReceipt == null) {
						return pageState;
					}

					// Use teachingCallReceipt to fill in form config data
					teachingCallReceipt = action.payload.teachingCallReceipt;

					if (teachingCallReceipt.scheduleId == action.payload.scheduleId
							&& teachingCallReceipt.instructorId == action.payload.instructorId) {

						pageState.isInstructorInTeachingCall = true;
						pageState.showUnavailabilities = teachingCallReceipt.showUnavailabilities;
						pageState.termsBlob = teachingCallReceipt.termsBlob;
						pageState.isDone = teachingCallReceipt.isDone;
						pageState.dueDate = teachingCallReceipt.dueDate;
						pageState.comment = teachingCallReceipt.comment;
						pageState.teachingCallReceiptId = teachingCallReceipt.id;
						termsBlob = teachingCallReceipt.termsBlob;
					}

					// Scaffold term objects to hold the rest of the data
					pageState.terms = this.scaffoldTermsFromBlob(termsBlob, action.year);

					// Find availabilityBlob data
					action.payload.teachingCallResponses.forEach ( function(teachingCallResponse) {
						pageState.terms.forEach( function(termContainer) {
							if (termContainer.termCode == teachingCallResponse.termCode) {
								termContainer.availabilityBlob = teachingCallResponse.availabilityBlob;
								termContainer.teachingCallResponseId = teachingCallResponse.id;
							}
						});
					});


					// Index the payload data for quick searching
					var teachingAssignmentsIndex = {};
					var teachingAssignments = action.payload.teachingAssignments;

					teachingAssignments.forEach( function (assignment) {
						teachingAssignmentsIndex[assignment.id] = assignment;
					});

					pageState.sectionGroupsIndex = {};
					pageState.sectionGroups = action.payload.sectionGroups;

					pageState.sectionGroups.forEach( function (sectionGroup) {
						pageState.sectionGroupsIndex[sectionGroup.id] = sectionGroup;
					});

					pageState.coursesIndex = {};
					pageState.courses = action.payload.courses;

					pageState.courses.forEach( function (course) {
						pageState.coursesIndex[course.id] = course;
					});

					// Process data into preferences, assignments, and scheduledCourses
					pageState.terms.forEach( function(termData) {
						termData.preferences = self.generatePreferences(action.payload.scheduleId, termData.termCode, action.payload.instructorId, teachingAssignments, pageState.sectionGroupsIndex, pageState.coursesIndex);
						termData.assignments = self.generateAssignments(action.payload.scheduleId, termData.termCode, action.payload.instructorId, teachingAssignments, pageState.sectionGroupsIndex, pageState.coursesIndex);
						termData.preferenceOptions = self.generatePreferenceOptions(action.payload.scheduleId, action.payload.instructorId, termData.termCode, termData.preferences, termData.assignments, pageState.sectionGroups, pageState.coursesIndex);
					});

					// Set selectedTermCode
					pageState.selectedTermCode = pageState.terms[0].termCode;

					// Calculate termSelection UI
					pageState.termSelection = [];

					pageState.terms.forEach ( function (term) {
						newTerm = {};
						newTerm.description = term.termDescription;
						newTerm.isSelected = false;
						newTerm.hasPreferences = false;
						newTerm.termCode = term.termCode;

						pageState.termSelection.push(newTerm);
					});

					pageState.termSelection[0].isSelected = true;
					pageState.selectedTermCode = pageState.termSelection[0].termCode;

					// Calculate Checklist values
					this.calculateChecklist(pageState);

					return pageState;
				case UPDATE_TEACHING_ASSIGNMENT_ORDER:
					var sortedIds = action.payload.sortedTeachingAssignmentIds;
					var termCode = action.payload.termCode;

					var preferences = null;
					pageState.terms.forEach( function (termContainer) {
						if (termContainer.termCode == termCode) {
							preferences = termContainer.preferences;
						}
					});

					// Update the preference priorities
					sortedIds.forEach( function(preferenceId, index) {
						preferences.forEach( function(preference) {
							if (preference.id == preferenceId) {
								preference.priority = index + 1;
							}
						});
					});

					// Calculate Checklist values
					this.calculateChecklist(pageState);

					return pageState;
				case ADD_PREFERENCE:
					var termCode = action.payload.termCode;

					// Ignore potential extra preferences created for different sequencePatterns
					var newPreference = action.payload.teachingAssignments[0];
					var newPreferenceArray = [];
					newPreferenceArray.push(newPreference);

					var preferenceObjects = this.generatePreferences(pageState.scheduleId, termCode, pageState.instructorId, newPreferenceArray, pageState.sectionGroupsIndex, pageState.coursesIndex);
					var newPreferenceObject = preferenceObjects[0];

					pageState.terms.forEach( function (termContainer) {
						if (termContainer.termCode == termCode) {
							preferences = termContainer.preferences;
						}
					});

					preferences.push(newPreferenceObject);

					// Calculate Checklist values
					this.calculateChecklist(pageState);

					return pageState;
				case REMOVE_PREFERENCE:
					var termCode = action.payload.termCode;
					preferenceIdsToMove = [];

					action.payload.teachingAssignments.forEach( function(slotAssignment) {
						preferenceIdsToMove.push(slotAssignment.id);
					});

					var preferences = null;
					var preferenceOptions = null;

					pageState.terms.forEach( function (termContainer) {
						if (termContainer.termCode == termCode) {
							preferences = termContainer.preferences;
							preferenceOptions = termContainer.preferenceOptions;
						}
					});

					preferenceOfInterest = null;
					removePreferenceIndex = null;
					preferences.forEach( function (slotPreference, index) {
						if (preferenceIdsToMove.indexOf(slotPreference.id) > -1) {
							preferenceOfInterest = slotPreference;
							removePreferenceIndex = index;
							return;
						}
					});

					preferences.splice(removePreferenceIndex, 1);
					preferenceOptions.push(preferenceOfInterest);
					preferenceOptions = self.sortCourses(preferenceOptions);

					// Calculate Checklist values
					this.calculateChecklist(pageState);

					return pageState;
				case CHANGE_TERM:
					// selectedTermCode
					pageState.selectedTermCode = action.payload.selectedTermCode;

					pageState.termSelection.forEach( function (term) {
							if (term.termCode == action.payload.selectedTermCode) {
								term.isSelected = true;
							} else {
								term.isSelected = false;
							}
					});

					return pageState;
				default:
					return pageState;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = scope._pageStateReducers(action, scope._state);

			scope._state = newState;

			$rootScope.$emit('teachingCallFormStateChanged', scope._state);

			$log.debug("Assignment state updated:");
			$log.debug(scope._state, action.type);
		},

		// Recalculates UI state for the checklist sidebar
		calculateChecklist: function (pageState) {

			// Wipe out previous values
			pageState.checklist = null;
			pageState.checklist = {
				preferencesChecked: false,
				commentsChecked: (pageState.comment && pageState.comment.length > 0) || false,
				terms: [],
				submitted: pageState.isDone || false,
				canSubmit: false
			};

			pageState.terms.forEach ( function (term) {
				newTerm = {};
				newTerm.description = term.termDescription;
				newTerm.isChecked = false;

				if (term.preferences && term.preferences.length > 0) {
					newTerm.isChecked = true;
					pageState.checklist.preferencesChecked = true;
					pageState.checklist.canSubmit = true;

					// Mark term in termSelection UI as having preferences
					pageState.termSelection.forEach( function (slotTerm) {
						if (slotTerm.termCode == term.termCode) {
							slotTerm.hasPreferences = true;
						}
					});
				}

				pageState.checklist.terms.push(newTerm);
			});
		},
		// Helper Methods
		scaffoldTermsFromBlob: function(termsBlob, academicYear) {
			var self = this;
			var terms = [];
			var allTermsReference = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
			var chronologicalTermsReference = ["05", "06", "07", "08", "09", "10", "01", "02", "03"];

			// Deserialize the termsBlob
			var relevantShortTermCodes = [];

			for ( var i = 0; i < termsBlob.length; i++) {
				var blobFlag = termsBlob.charAt(i);

				if (blobFlag == "1") {
					relevantShortTermCodes.push(allTermsReference[i]);
				}
			}

			// Chronologically order the terms
			var orderedshortTermCodes = [];

			chronologicalTermsReference.forEach( function(term) {
				if (relevantShortTermCodes.indexOf(term) > -1) {
					orderedshortTermCodes.push(term);
				}
			});

			// Scaffold the terms
			orderedshortTermCodes.forEach ( function( term) {
				var termNames = {
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

				var slotTerm = {
					termCode: null,
					termDescription: termNames[term],
					assignments: [],
					preferences: [],
					preferenceOptions: []
				};

				slotTerm.termCode = generateTermCode(academicYear, term);
				terms.push(slotTerm);
			});

			return terms;
		},
		// Return flattened objects that can be preferences, assignments, or preferenceOptions
		// Filtered by termCode and instructor, and whether or not it should be approved
		generateAbstractCourses: function (scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses, approved) {
			var self = this;
			var preferences = [];

			var uniqueAddedPreferences = [];

			teachingAssignments.forEach( function (slotAssignment) {
				// Ensure the assignment is not approved, from the instructor and the term of interest
				if (termCode != slotAssignment.termCode 
				|| instructorId != slotAssignment.instructorId
				|| slotAssignment.fromInstructor == false) {
					return;
				}

				var newPreference = {
					id: slotAssignment.id,
					priority: slotAssignment.priority,
					termCode: slotAssignment.termCode,
					scheduleId: scheduleId,
					description: null,
					instructorId: slotAssignment.instructorId
				};

				var sectionGroup = null;
				var course = null;

				// If this is a SectionGroup based preference
				if (slotAssignment.sectionGroupId > 0) {
					var sectionGroup = sectionGroups[slotAssignment.sectionGroupId];
					var course = courses[sectionGroup.courseId];

					newPreference.sectionGroupId = sectionGroup.id;
					newPreference.courseId = course.id;
					newPreference.subjectCode = course.subjectCode;
					newPreference.courseNumber = course.courseNumber;
					newPreference.effectiveTermCode = course.effectiveTermCode;
					newPreference.title = course.title;
					newPreference.description = newPreference.subjectCode + " " + newPreference.courseNumber;
					newPreference.uniqueIdentifier = newPreference.subjectCode + newPreference.courseNumber + newPreference.effectiveTermCode;

					// Ensure this preference has not already been added
					if (uniqueAddedPreferences.indexOf(newPreference.uniqueIdentifier) > -1) {
						return;
					}

					// Add the preference
					uniqueAddedPreferences.push(newPreference.uniqueIdentifier);
					preferences.push(newPreference);
				}

				// If this is a Non-course preference
				else if (slotAssignment.inResidence || slotAssignment.sabbatical || slotAssignment.courseRelease || slotAssignment.buyout) {
					if (slotAssignment.inResidence) {
						newPreference.description = "In Residence";
						newPreference.inResidence = true;
					} else if (slotAssignment.sabbatical) {
						newPreference.description = "Sabbatical";
						newPreference.sabbatical = true;
					} else if (slotAssignment.courseRelease) {
						newPreference.description = "Course Release";
						newPreference.courseRelease = true;
					} else if (slotAssignment.buyout) {
						newPreference.description = "Buyout";
						newPreference.buyout = true;
					}

					newPreference.uniqueIdentifier = newPreference.description;

					preferences.push(newPreference);
				}

				// If this is a Suggested course preference
				else if (slotAssignment.suggestedCourseNumber) {
					newPreference.isSuggested = true;
					newPreference.courseNumber = slotAssignment.suggestedCourseNumber;
					newPreference.subjectCode = slotAssignment.suggestedSubjectCode;
					newPreference.effectiveTermCode = slotAssignment.suggestedEffectiveTermCode;
					newPreference.description = newPreference.subjectCode + " " + newPreference.courseNumber;

					newPreference.suggestedCourseNumber = slotAssignment.suggestedCourseNumber;
					newPreference.suggestedSubjectCode = slotAssignment.suggestedSubjectCode;
					newPreference.suggestedEffectiveTermCode = slotAssignment.suggestedEffectiveTermCode;

					preferences.push(newPreference);
				}
				// Unknown preference type
				else {
					console.debug("course not determine the preference type");
					return;
				}
			});

			return preferences;
		},
		generateAllAbstractCourses: function (instructorId, termCode, sectionGroups, courses) {
			var self = this;
			var allCourses = [];

			var uniqueAddedCourses = [];

			sectionGroups.forEach( function (slotSectionGroup) {
				// Ensure the assignment is not approved, from the instructor and the term of interest
				if (termCode != slotSectionGroup.termCode) {
					return;
				}

				var course = courses[slotSectionGroup.courseId];

				// Ensure this preference has not already been added
				var uniqueIdentifier = course.subjectCode + course.courseNumber + course.effectiveTermCode;

				if (uniqueAddedCourses.indexOf(uniqueIdentifier) > -1) {
					return;
				}

				var newCourse = {
					id: slotSectionGroup.id,
					termCode: slotSectionGroup.termCode,
					scheduleId: course.scheduleId,
					sectionGroupId: slotSectionGroup.id,
					courseId: course.id,
					subjectCode: course.subjectCode,
					courseNumber: course.courseNumber,
					effectiveTermCode: course.effectiveTermCode,
					title: course.title,
					description: course.subjectCode + " " + course.courseNumber,
					uniqueIdentifier: uniqueIdentifier,
					instructorId: instructorId
				};

				// Add the preference
				uniqueAddedCourses.push(uniqueIdentifier);
				allCourses.push(newCourse);
			});

			// Sort the courses by subjectCode and then courseNumber
			allCourses = self.sortCourses(allCourses);

			return allCourses;
		},
		generatePreferences: function (scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses) {
			var approved = false;
			return this.generateAbstractCourses(scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses, approved);
		},
		generateAssignments: function (scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses) {
			var approved = true;
			return this.generateAbstractCourses(scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses, approved);
		},
		generatePreferenceOptions: function (scheduleId, instructorId, termCode, preferences, assignments, sectionGroups, courses) {
			// Gather all course identifiers that already exist as a preference or assignment
			var courseIdentifiersToFilter = [];

			preferences.forEach( function(preference) {
				courseIdentifiersToFilter.push(preference.uniqueIdentifier);
			});
			assignments.forEach( function(assignment) {
				courseIdentifiersToFilter.push(assignment.uniqueIdentifier);
			});

			var allCourses = this.generateAllAbstractCourses(instructorId, termCode, sectionGroups, courses);

			// Build the scheduledCourses as a subset of all Courses
			var preferenceOptions = [];
			preferenceOptions.push({
				buyout: true,
				description: "Buyout",
				scheduleId: scheduleId,
				instructorId: instructorId,
				termCode: termCode
			});
			preferenceOptions.push({
				courseRelease: true,
				description: "Course Release",
				scheduleId: scheduleId,
				instructorId: instructorId,
				termCode: termCode
			});
			preferenceOptions.push({
				sabbatical: true,
				description: "Sabbatical",
				scheduleId: scheduleId,
				instructorId: instructorId,
				termCode: termCode
			});
			preferenceOptions.push({
				inResidence: true,
				description: "In Residence",
				scheduleId: scheduleId,
				instructorId: instructorId,
				termCode: termCode
			});

			allCourses.forEach( function (course) {
				// Skip courses that are already an assignment or preference
				if (courseIdentifiersToFilter.indexOf(course.uniqueIdentifier) > -1) {
					return;
				}

				preferenceOptions.push(course);
			});

			return preferenceOptions;
		},
		sortCourses: function(courses) {
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
		},
		generateTermCode: function (year, term) {
			if (term.toString().length == 1) {
				term = "0" + Number(term);
			}

			if (["01", "02", "03"].indexOf(term) >= 0) { year++; }
			var termCode = year + term;

			return termCode;
		}
	};
});