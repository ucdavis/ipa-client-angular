import { _array_sortIdsByProperty, _array_sortByProperty } from 'shared/helpers/array';
import { _object_search_properties } from 'shared/helpers/object';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupStateService
 * @description
 * # workgroupStateService
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
class AssignmentStateService {
	constructor ($rootScope, $log, SectionGroup, Course, ScheduleTermState,
	ScheduleInstructorNote, Term, Tag, Instructor, TeachingAssignment, TeachingCall,
	TeachingCallReceipt, TeachingCallResponse, ActionTypes, Roles, InstructorTypeService) {
		this.Roles = Roles;
		this.InstructorTypeService = InstructorTypeService;
		var _self = this;

		return {
			_state: {},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						courses = {
							ids: [],
							list: []
						};

						// Create courses
						var coursesList = {};
						var length = action.payload.courses ? action.payload.courses.length : 0;
						for (var i = 0; i < length; i++) {
							var course = new Course(action.payload.courses[i]);
							coursesList[course.id] = course;
							coursesList[course.id].isFiltered = false;
							coursesList[course.id].isHidden = false;
							// Set all courses to true initially as no tag filters are set
							coursesList[course.id].matchesTagFilters = true;

							// Add the termCode:sectionGroupId pairs
							coursesList[course.id].sectionGroupTermCodeIds = {};

							action.payload.sectionGroups
								.filter(function (sectionGroup) {
									return sectionGroup.courseId === course.id;
								})
								.forEach(function (sectionGroup) {
									coursesList[course.id].sectionGroupTermCodeIds[sectionGroup.termCode] = sectionGroup.id;
								});
						}
						courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
						courses.list = coursesList;
						return courses;
					case ActionTypes.UPDATE_TABLE_FILTER:
						var query = action.payload.query;

						// Apply search filters
						if (query.length > 0) {
							// Specify the properties that we are interested in searching
							var courseKeyList = ['courseNumber', 'sequencePattern', 'subjectCode', 'title'];

							_object_search_properties(query, courses, courseKeyList);
						} else {
							courses.ids.forEach(function(courseId) {
								courses.list[courseId].isFiltered = false;
							});
						}

						return courses;
					case ActionTypes.UPDATE_TAG_FILTERS:
						// Set the course.isFiltered flag to false if any tag matches the filters
						courses.ids.forEach(function (courseId) {
							// Display all courses if none of the tags is checked
							if (action.payload.tagIds.length === 0) {
								courses.list[courseId].matchesTagFilters = true;
							} else {
								courses.list[courseId].matchesTagFilters = courses.list[courseId].tagIds
									.some(function (tagId) {
										return action.payload.tagIds.indexOf(tagId) >= 0;
									});
							}
						});
						return courses;
					case ActionTypes.UPDATE_TEACHING_ASSIGNMENT:
						if (action.payload.course) {
							var course = action.payload.course;
							var sectionGroup = action.payload.sectionGroup;
							courses.ids.push(course.id);
							courses.list[course.id] = course;
							courses.list[course.id].sectionGroupTermCodeIds = {};
							courses.list[course.id].sectionGroupTermCodeIds[sectionGroup.termCode] = sectionGroup.id;
						}
						return courses;
					default:
						return courses;
				}
			},
			_instructorTypeReducers: function (action, instructorTypes) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						var instructorTypes = {
							ids: [],
							list: {}
						};

						action.payload.instructorTypes.forEach( function(instructorType) {
							instructorTypes.list[instructorType.id] = instructorType;
							instructorTypes.ids.push(instructorType.id);
						});
						instructorTypes.ids = InstructorTypeService.orderInstructorTypeIdsAlphabetically(instructorTypes.ids, instructorTypes);
						return instructorTypes;
					default:
						return instructorTypes;
				}
			},
			_supportStaffReducers: function (action, supportStaffList) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						var supportStaffList = {
							ids: [],
							list: {}
						};

						action.payload.supportStaffList.forEach( function(supportStaff) {
							supportStaffList.list[supportStaff.id] = supportStaff;
							supportStaffList.ids.push(supportStaff.id);
						});
						return supportStaffList;
					default:
						return supportStaffList;
				}
			},
			_studentPreferenceReducers: function (action, studentPreferences) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						var studentPreferences = {
							ids: [],
							list: {}
						};

						var supportStaffList = {
							ids: [],
							list: {}
						};

						action.payload.supportStaffList.forEach( function(supportStaff) {
							supportStaffList.list[supportStaff.id] = supportStaff;
							supportStaffList.ids.push(supportStaff.id);
						});

						action.payload.studentSupportPreferences.forEach( function(preference) {
							var supportStaff = supportStaffList.list[preference.supportStaffId];

							if (supportStaff) {
								preference.description = supportStaff.firstName + " " + supportStaff.lastName;
								studentPreferences.list[preference.id] = preference;
								studentPreferences.ids.push(preference.id);
							}
						});
						return studentPreferences;
					default:
						return studentPreferences;
				}
			},
			_teachingAssignmentReducers: function (action, teachingAssignments) {
				var i, index;

				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						teachingAssignments = {
							ids: [],
							list: []
						};
						var teachingAssignmentsList = {};
						var length = action.payload.teachingAssignments ? action.payload.teachingAssignments.length : 0;
						for (i = 0; i < length; i++) {
							var teachingAssignment = new TeachingAssignment(action.payload.teachingAssignments[i]);
							teachingAssignmentsList[teachingAssignment.id] = teachingAssignment;
						}
						teachingAssignments.ids = _array_sortIdsByProperty(teachingAssignmentsList, ["approved"]);
						teachingAssignments.list = teachingAssignmentsList;
						return teachingAssignments;
					case ActionTypes.UPDATE_TEACHING_ASSIGNMENT:
						teachingAssignments.list[action.payload.teachingAssignment.id] = action.payload.teachingAssignment;
						return teachingAssignments;
					case ActionTypes.ADD_TEACHING_ASSIGNMENT:
						teachingAssignments.list[action.payload.teachingAssignment.id] = action.payload.teachingAssignment;
						teachingAssignments.ids.push(action.payload.teachingAssignment.id);
						return teachingAssignments;
					case ActionTypes.REMOVE_TEACHING_ASSIGNMENT:
						index = teachingAssignments.ids.indexOf(action.payload.teachingAssignment.id);
						if (index > -1) {
							teachingAssignments.ids.splice(index, 1);
						}
						return teachingAssignments;
					default:
						return teachingAssignments;
				}
			},
			_teachingCallReducers: function (action, teachingCalls) {
				var teachingCall;

				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						teachingCalls = {
							ids: [],
							list: [],
							eligibleGroups: {}
						};
						teachingCalls.eligibleGroups.senateInstructors = true;
						teachingCalls.eligibleGroups.federationInstructors = true;

						var teachingCallsList = {};
						var length = action.payload.teachingCalls ? action.payload.teachingCalls.length : 0;
						for (var i = 0; i < length; i++) {
							teachingCall = new TeachingCall(action.payload.teachingCalls[i]);
							teachingCallsList[teachingCall.id] = teachingCall;

							// Gather eligible group data
							if (teachingCall.sentToSenate) {
								teachingCalls.eligibleGroups.senateInstructors = false;
							}
							if (teachingCall.sentToFederation) {
								teachingCalls.eligibleGroups.federationInstructors = false;
							}

						}
						teachingCalls.ids = _array_sortIdsByProperty(teachingCallsList, ["id"]);
						teachingCalls.list = teachingCallsList;
						return teachingCalls;
					default:
						return teachingCalls;
				}
			},
			_teachingCallReceiptReducers: function (action, teachingCallReceipts) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						teachingCallReceipts = {
							ids: [],
							list: []
						};

						var teachingCallReceiptsList = {};
						var length = action.payload.teachingCallReceipts ? action.payload.teachingCallReceipts.length : 0;
						for (var i = 0; i < length; i++) {
							var teachingCallReceipt = new TeachingCallReceipt(action.payload.teachingCallReceipts[i]);
							teachingCallReceiptsList[teachingCallReceipt.id] = teachingCallReceipt;
						}
						teachingCallReceipts.ids = _array_sortIdsByProperty(teachingCallReceiptsList, ["id"]);
						teachingCallReceipts.list = teachingCallReceiptsList;
						return teachingCallReceipts;
					case ActionTypes.UPDATE_TEACHING_CALL_RECEIPT:
						teachingCallReceipts.list[action.payload.teachingCallReceipt.id] = action.payload.teachingCallReceipt;
						return teachingCallReceipts;
					default:
						return teachingCallReceipts;
				}
			},
			_teachingCallResponseReducers: function (action, teachingCallResponses) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						teachingCallResponses = {
							ids: [],
							list: []
						};

						var teachingCallResponsesList = {};
						var length = action.payload.teachingCallResponses ? action.payload.teachingCallResponses.length : 0;
						for (var i = 0; i < length; i++) {
							var teachingCallResponse = new TeachingCallResponse(action.payload.teachingCallResponses[i]);
							teachingCallResponsesList[teachingCallResponse.id] = teachingCallResponse;
						}
						teachingCallResponses.ids = _array_sortIdsByProperty(teachingCallResponsesList, ["id"]);
						teachingCallResponses.list = teachingCallResponsesList;
						return teachingCallResponses;
					case ActionTypes.UPDATE_TEACHING_CALL_RESPONSE:
						teachingCallResponses.list[action.payload.teachingCallResponse.id] = action.payload.teachingCallResponse;
						return teachingCallResponses;
					default:
						return teachingCallResponses;
				}
			},
			_instructorReducers: function (action, instructors) {
				var i, j, instructor, teachingAssignments, teachingAssignment;

				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						var users = {
							ids: [],
							list: {}
						};

						action.payload.users.forEach(function(user) {
							users.ids.push(user.id);
							users.list[user.id] = user;
						});

						var userRoles = {
							ids: [],
							list: {}
						};

						action.payload.userRoles.forEach(function(userRole) {
							userRoles.ids.push(userRole.id);
							userRoles.list[userRole.id] = userRole;
						});

						var teachingAssignments = {
							ids: [],
							list: {}
						};

						action.payload.teachingAssignments.forEach(function(teachingAssignment) {
							teachingAssignments.ids.push(teachingAssignment.id);
							teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
						});

						instructors = {
							ids: [],
							list: []
						};

						var instructorsList = {};
						var length = action.payload.instructors ? action.payload.instructors.length : 0;

						// Loop over instructors
						for (i = 0; i < length; i++) {
							instructor = new Instructor(action.payload.instructors[i]);
							instructor.teachingAssignmentTermCodeIds = {};
							instructor.instructorTypeId = _self.getInstructorTypeId(instructor, teachingAssignments, userRoles, users);
							// Scaffold all teachingAssignment termCodeId arrays
							var termStates = [];
							var allTerms = ['01', '02', '03', '04', '05','06', '07', '08', '09', '10'];
							allTerms.forEach(function (slotTerm) {
								var generatedTermCode = _self.generateTermCode(action.year, slotTerm);
								termStates.push(generatedTermCode);
								instructor.teachingAssignmentTermCodeIds[generatedTermCode] = [];
							});

							instructor.isFiltered = false;

							// Create arrays of teachingAssignmentIds for each termCode
							for (j = 0; j < termStates.length; j++) {
								let termCode = termStates[j];
								instructor.teachingAssignmentTermCodeIds[termCode] = [];

								// Create array of teachingAssignmentIds that are associated to this termCode and instructor
								action.payload.teachingAssignments
									.filter(function (teachingAssignment) {
										return (teachingAssignment.instructorId === instructor.id && teachingAssignment.termCode === termCode);
									})
									.forEach(function (teachingAssignment) {
										instructor.teachingAssignmentTermCodeIds[termCode].push(teachingAssignment.id);
									});
							}

							// Create arrays of teachingCallResponseIds
							instructor.teachingCallResponses = [];

							for (j = 0; j < action.payload.teachingCallResponses.length; j++) {
								var teachingCallResponse = action.payload.teachingCallResponses[j];
								if (teachingCallResponse.instructorId == instructor.id) {
									instructor.teachingCallResponses.push(teachingCallResponse);
								}
							}

							// Find scheduleInstructorNote associated to this instructor, if it exists
							instructor.scheduleInstructorNoteId = null;
							for (j = 0; j < action.payload.scheduleInstructorNotes.length; j++) {
								let scheduleInstructorNote = action.payload.scheduleInstructorNotes[j];
								if (scheduleInstructorNote.instructorId == instructor.id) {
									instructor.scheduleInstructorNoteId = scheduleInstructorNote.id;
								}
							}

							// Find teachingCallReceipt associated to this instructor, if it exists
							instructor.teachingCallReceiptId = null;
							for (j = 0; j < action.payload.teachingCallReceipts.length; j++) {
								var teachingCallReceipt = action.payload.teachingCallReceipts[j];
								if (teachingCallReceipt.instructorId == instructor.id) {
									instructor.teachingCallReceiptId = teachingCallReceipt.id;
								}
							}

							instructorsList[instructor.id] = instructor;
						}
						instructors.ids = _array_sortIdsByProperty(instructorsList, ["lastName"]);
						instructors.list = instructorsList;
						return instructors;
					case ActionTypes.UPDATE_TABLE_FILTER:
						var query = action.payload.query;

						if (query.length > 0) {
							// Specify the properties that we are interested in searching
							var instructorKeyList = ['emailAddress', 'firstName', 'lastName', 'fullName', 'loginId', 'ucdStudentSID'];

							_object_search_properties(query, instructors, instructorKeyList);
						} else {
							instructors.ids.forEach(function (instructorId) {
								instructors.list[instructorId].isFiltered = false;
							});
						}

						return instructors;
					case ActionTypes.ASSIGN_ASSOCIATE_INSTRUCTOR:
						var instructor = action.payload.instructor;
						var teachingAssignment = action.payload.teachingAssignment;

						if (instructors.ids.indexOf(instructor.id) == -1) {
							instructor.teachingCallResponses = [];
							instructor.teachingAssignmentTermCodeIds = {};

							// Scaffold all teachingAssignment termCodeId arrays
							var allTerms = ['01', '02', '03', '04', '06', '07', '08', '09', '10'];
							allTerms.forEach(function (slotTerm) {
								var generatedTermCode = _self.generateTermCode(action.payload.year, slotTerm);
								instructor.teachingAssignmentTermCodeIds[generatedTermCode] = [];
							});

							instructor.isFiltered = false;

							instructors.ids.push(instructor.id);
							instructors.list[instructor.id] = instructor;
						}

						return instructors;
					case ActionTypes.ADD_SCHEDULE_INSTRUCTOR_NOTE: {
						let scheduleInstructorNote = action.payload.scheduleInstructorNote;
						for (i = 0; i < instructors.ids.length; i++) {
							let instructor = instructors.list[instructors.ids[i]];
							if (instructor.id == scheduleInstructorNote.instructorId) {
								instructor.scheduleInstructorNoteId = scheduleInstructorNote.id;
							}
						}
						return instructors;
					}
					case ActionTypes.ADD_TEACHING_ASSIGNMENT:
						teachingAssignment = action.payload.teachingAssignment;
						instructor = instructors.list[teachingAssignment.instructorId];
						if (instructor) {
							instructor.teachingAssignmentTermCodeIds[teachingAssignment.termCode].push(teachingAssignment.id);
						}
						return instructors;
					case ActionTypes.REMOVE_TEACHING_ASSIGNMENT: {
						teachingAssignment = action.payload.teachingAssignment;
						instructor = instructors.list[teachingAssignment.instructorId];

						if (!instructor) {
							return instructors;
						}

						let termCode = teachingAssignment.termCode;
						let index = instructor.teachingAssignmentTermCodeIds[termCode].indexOf(teachingAssignment.id);

						if (index > -1) {
							instructor.teachingAssignmentTermCodeIds[action.payload.teachingAssignment.termCode].splice(index, 1);
						}

						return instructors;
					}
					default:
						return instructors;
				}
			},
			_scheduleTermStateReducers: function (action, scheduleTermStates) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						scheduleTermStates = {
							ids: []
						};
						var scheduleTermStateList = {};
						var length = action.payload.scheduleTermStates ? action.payload.scheduleTermStates.length : 0;
						for (var i = 0; i < length; i++) {
							var scheduleTermStateData = action.payload.scheduleTermStates[i];
							// Using termCode as key since the scheduleTermState does not have an id
							scheduleTermStateList[scheduleTermStateData.termCode] = new ScheduleTermState(scheduleTermStateData);
						}
						scheduleTermStates.ids = _array_sortIdsByProperty(scheduleTermStateList, "termCode");
						scheduleTermStates.list = scheduleTermStateList;
						return scheduleTermStates;
					default:
						return scheduleTermStates;
				}
			},
			_userRoleReducers: function (action, userRoles) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
					var userRoles = {
							ids: [],
							list: {}
						};

						action.payload.userRoles.forEach(function(userRole) {
							userRoles.ids.push(userRole.id);
							userRoles.list[userRole.id] = userRole;
						});

						return userRoles;
					default:
						return userRoles;
				}
			},
			_userReducers: function (action, users) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
					var users = {
							ids: [],
							list: {}
						};

						action.payload.users.forEach(function(user) {
							users.ids.push(user.id);
							users.list[user.id] = user;
						});

						return users;
					default:
						return users;
				}
			},
			_tagReducers: function (action, tags) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						tags = {
							ids: [],
							list: []
						};
						var tagsList = {};
						var length = action.payload.tags ? action.payload.tags.length : 0;
						for (var i = 0; i < length; i++) {
							var tagData = action.payload.tags[i];
							tagsList[tagData.id] = new Tag(tagData);
						}
						tags.ids = _array_sortIdsByProperty(tagsList, "id");
						tags.list = tagsList;
						return tags;
					default:
						return tags;
				}
			},
			_scheduleInstructorNoteReducers: function (action, scheduleInstructorNotes) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						scheduleInstructorNotes = {
							ids: [],
							list: {},
							byInstructorId: {}
						};

						action.payload.scheduleInstructorNotes.forEach(function(scheduleInstructorNoteData) {
							var scheduleInstructorNote = new ScheduleInstructorNote(scheduleInstructorNoteData);
							scheduleInstructorNotes.ids.push(scheduleInstructorNote.id);
							scheduleInstructorNotes.list[scheduleInstructorNote.id] = scheduleInstructorNote;
							scheduleInstructorNotes.byInstructorId[scheduleInstructorNote.instructorId] = scheduleInstructorNote;
						});
						return scheduleInstructorNotes;
					case ActionTypes.UPDATE_SCHEDULE_INSTRUCTOR_NOTE:
						scheduleInstructorNotes.list[action.payload.scheduleInstructorNote.id] = action.payload.scheduleInstructorNote;
						scheduleInstructorNotes.byInstructorId[action.payload.scheduleInstructorNote.instructorId] = action.payload.scheduleInstructorNote;
						return scheduleInstructorNotes;
					case ActionTypes.ADD_SCHEDULE_INSTRUCTOR_NOTE:
						scheduleInstructorNotes.list[action.payload.scheduleInstructorNote.id] = action.payload.scheduleInstructorNote;
						scheduleInstructorNotes.ids.push(action.payload.scheduleInstructorNote.id);
						scheduleInstructorNotes.byInstructorId[action.payload.scheduleInstructorNote.instructorId] = action.payload.scheduleInstructorNote;
						return scheduleInstructorNotes;
					default:
						return scheduleInstructorNotes;
				}
			},
			_sectionGroupReducers: function (action, sectionGroups) {
				var sectionGroup, i, teachingAssignment, index;

				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						sectionGroups = {
							newSectionGroup: {},
							ids: []
						};

						// Hash supportStaff and studentPreferences for AI calculations
						var supportStaffList = {
							ids: [],
							list: {}
						};

						action.payload.supportStaffList.forEach( function(supportStaff) {
							supportStaffList.list[supportStaff.id] = supportStaff;
							supportStaffList.ids.push(supportStaff.id);
						});

						var studentPreferences = {
							ids: [],
							list: {}
						};

						action.payload.studentSupportPreferences.forEach( function(preference) {
							studentPreferences.list[preference.id] = preference;
							studentPreferences.ids.push(preference.id);
						});

						var sectionGroupsList = {};

						var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
						for (i = 0; i < length; i++) {
							sectionGroup = new SectionGroup(action.payload.sectionGroups[i]);
							sectionGroupsList[sectionGroup.id] = sectionGroup;
							sectionGroups.ids.push(sectionGroup.id);

							sectionGroupsList[sectionGroup.id].isAssigned = false;

							if (sectionGroup.showTheStaff == true) {
								sectionGroupsList[sectionGroup.id].isAssigned = true;
							}

							// Create a list of teachingAssignmentIds that are associated to this sectionGroup
							sectionGroupsList[sectionGroup.id].teachingAssignmentIds = [];
							action.payload.teachingAssignments
								.filter(function (teachingAssignment) {
									return teachingAssignment.sectionGroupId === sectionGroup.id;
								})
								.forEach(function (teachingAssignment) {
									if (teachingAssignment.approved == true) {
										sectionGroupsList[sectionGroup.id].isAssigned = true;
									}
									sectionGroupsList[sectionGroup.id].teachingAssignmentIds.push(teachingAssignment.id);
								});

							// Add AI preference data
							sectionGroupsList[sectionGroup.id].aiAssignmentOptions = {
								preferences: [],
								other: []
							};

							var preferredSupportStaffIds = [];

							action.payload.studentSupportPreferences
								.filter(function (preference) {
									return (preference.type === "associateInstructor" && preference.sectionGroupId == sectionGroup.id);
								})
								.forEach(function (preference) {
									var supportStaffDTO = angular.copy(supportStaffList.list[preference.supportStaffId]); // eslint-disable-line no-undef

									if (supportStaffDTO) {
										supportStaffDTO.priority = preference.priority;

										sectionGroupsList[sectionGroup.id].aiAssignmentOptions.preferences.push(supportStaffDTO);
										preferredSupportStaffIds.push(supportStaffDTO.id);
									}
								});

								var otherSupportStaffIds = supportStaffList.ids.slice();
								otherSupportStaffIds = otherSupportStaffIds.filter(function(id) { return preferredSupportStaffIds.indexOf(id) == -1;});

								otherSupportStaffIds.forEach(function(supportStaffId) {
									var supportStaffDTO = angular.copy(supportStaffList.list[supportStaffId]); // eslint-disable-line no-undef
									sectionGroupsList[sectionGroup.id].aiAssignmentOptions.other.push(supportStaffDTO);
								});
						}

						sectionGroups.list = sectionGroupsList;
						return sectionGroups;
					case ActionTypes.ADD_TEACHING_ASSIGNMENT:
						teachingAssignment = action.payload.teachingAssignment;
						sectionGroup = {};
						if (teachingAssignment.sectionGroupId) {
							sectionGroup = sectionGroups.list[teachingAssignment.sectionGroupId];
							sectionGroup.teachingAssignmentIds.push(teachingAssignment.id);
						}
						return sectionGroups;
					case ActionTypes.UPDATE_TEACHING_ASSIGNMENT:
						if (action.payload.sectionGroup) {
							var sectionGroup = action.payload.sectionGroup;
							sectionGroups.ids.push(sectionGroup.id);
							sectionGroups.list[sectionGroup.id] = sectionGroup;
						}
						return sectionGroups;
					case ActionTypes.REMOVE_TEACHING_ASSIGNMENT:
						teachingAssignment = action.payload.teachingAssignment;
						sectionGroup = sectionGroups.list[teachingAssignment.sectionGroupId];
						if (sectionGroup) {
							index = sectionGroup.teachingAssignmentIds.indexOf(teachingAssignment.id);
							if (index > -1) {
								sectionGroup.teachingAssignmentIds.splice(index, 1);
							}
						}
						return sectionGroups;
					case ActionTypes.CREATE_PLACEHOLDER_STAFF:
					case ActionTypes.REMOVE_PLACEHOLDER_STAFF:
						sectionGroup = sectionGroups.list[action.payload.sectionGroup.id];
						sectionGroup.isAssigned = action.payload.sectionGroup.isAssigned;
						return sectionGroups;
					default:
						return sectionGroups;
				}
			},
			_filterReducers: function (action, filters) {
				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						// A filter is 'enabled' if it is checked, i.e. the category it represents
						// is selected to be shown/on/active.
						filters = {
							enabledTagIds: [],
							enableUnpublishedCourses: false
						};
						// Here is where we might load stored data about what filters
						// were left on last time.
						return filters;
					case ActionTypes.UPDATE_TAG_FILTERS:
						filters.enabledTagIds = action.payload.tagIds;
						return filters;
					case ActionTypes.TOGGLE_UNPUBLISHED_COURSES:
						filters.enableUnpublishedCourses = !filters.enableUnpublishedCourses;
						filters.enabledTagIds = [];
						return filters;
					case ActionTypes.TOGGLE_COMPLETED_INSTRUCTORS:
						filters.showCompletedInstructors = action.payload.showCompletedInstructors;
						return filters;
					default:
						return filters;
				}
			},
			_theStaffReducers: function(action, theStaff) {
				switch (action.type) {

					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						var theStaff = {};
						theStaff.termCodes = {};

						action.payload.sectionGroups.forEach(function(sectionGroup) {
							if (sectionGroup.showTheStaff) {
								// Scaffold assignments array if this is the first in the termCode
								if (!theStaff.termCodes[sectionGroup.termCode]) {
									theStaff.termCodes[sectionGroup.termCode] = [];
								}

								theStaff.termCodes[sectionGroup.termCode].push(sectionGroup.id);
							}
						});
						return theStaff;
					case ActionTypes.CREATE_PLACEHOLDER_STAFF:
						var termCode = action.payload.sectionGroup.termCode;
						var sectionGroupId = action.payload.sectionGroup.id;
						theStaff.termCodes[termCode] = theStaff.termCodes[termCode] || [];
						theStaff.termCodes[parseInt(termCode)].push(sectionGroupId);
						return theStaff;
					case ActionTypes.REMOVE_PLACEHOLDER_STAFF:
						var termCode = action.payload.sectionGroup.termCode;
						var sectionGroupId = action.payload.sectionGroup.id;
						var index = theStaff.termCodes[termCode].indexOf(sectionGroupId);
						theStaff.termCodes[termCode].splice(index, 1);

						if (theStaff.termCodes[termCode].length == 0) {
							delete theStaff.termCodes[termCode];
						}
						return theStaff;
					case ActionTypes.ADD_TEACHING_ASSIGNMENT:
					case ActionTypes.UPDATE_TEACHING_ASSIGNMENT:
						var sectionGroupId = action.payload.teachingAssignment.sectionGroupId;
						var termCode = action.payload.teachingAssignment.termCode;

						if (theStaff.termCodes[termCode]) {
							var index = theStaff.termCodes[termCode].indexOf(sectionGroupId);
							if(index > -1) {
								theStaff.termCodes[termCode].splice(index, 1);

								if (theStaff.termCodes[termCode].length == 0) {
									delete theStaff.termCodes[termCode];
								}
							}
						}
						return theStaff;
					default:
						return theStaff;
				}
			},
			_userInterfaceReducers: function (action, userInterface) {
				var i;

				switch (action.type) {
					case ActionTypes.INIT_ASSIGNMENT_VIEW:
						userInterface = {};

						userInterface.instructorId = action.payload.instructorId;
						userInterface.userId = action.payload.userId;

						userInterface.scheduleId = action.payload.scheduleId;
						userInterface.year = action.year;

						userInterface.showInstructors = (action.tab == "instructors");
						userInterface.showCourses = (action.tab != "instructors");

						// Set default enabledTerms based on scheduleTermState data
						var enabledTerms = {};
						enabledTerms.list = {};
						enabledTerms.ids = [];
						for (i = 0; i < action.payload.scheduleTermStates.length; i++) {
							var term = action.payload.scheduleTermStates[i].termCode;
							// Generate an id based off termCode
							var id = Number(term.slice(-2));
							enabledTerms.ids.push(id);
						}

						enabledTerms.ids = _self.orderTermsChronologically(enabledTerms.ids);

						// Generate termCode list entries
						for (i = 1; i < 11; i++) {
							// 4 is not used as a termCode
							if (i != 4) {
								var termCode = _self.generateTermCode(action.year, i);
								enabledTerms.list[i] = termCode;
							}
						}

						userInterface.enabledTerms = enabledTerms;

						// Check localStorage for saved termFilter settings
						var termFiltersBlob = localStorage.getItem("termFilters");
						if (termFiltersBlob) {
							userInterface.enabledTerms.ids = _self.deserializeTermFiltersBlob(termFiltersBlob);
						}

						return userInterface;
					case ActionTypes.SWITCH_MAIN_VIEW:
						if (userInterface === undefined) {
							userInterface = {};
						}

						userInterface.showCourses = action.payload.showCourses;
						userInterface.showInstructors = action.payload.showInstructors;
						return userInterface;
					case ActionTypes.TOGGLE_TERM_FILTER:
						var termId = action.payload.termId;
						var idx = userInterface.enabledTerms.ids.indexOf(termId);
						// A term in the term filter dropdown has been toggled on or off.
						if (idx === -1) {
							// Toggle on
							userInterface.enabledTerms.ids.push(termId);
							userInterface.enabledTerms.ids = _self.orderTermsChronologically(userInterface.enabledTerms.ids);
						} else {
							// Toggle off
							userInterface.enabledTerms.ids.splice(idx, 1);
						}
						var termFiltersBlob = _self.serializeTermFilters(userInterface.enabledTerms.ids);
						localStorage.setItem("termFilters", termFiltersBlob);
						return userInterface;
					default:
						return userInterface;
				}
			},
			reduce: function (action) {
				var scope = this;

				if (!action || !action.type) {
					return;
				}

				let newState = {};
				newState.scheduleTermStates = scope._scheduleTermStateReducers(action, scope._state.scheduleTermStates);
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.instructors = scope._instructorReducers(action, scope._state.instructors);
				newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
				newState.teachingCallReceipts = scope._teachingCallReceiptReducers(action, scope._state.teachingCallReceipts);
				newState.teachingCallResponses = scope._teachingCallResponseReducers(action, scope._state.teachingCallResponses);
				newState.teachingCalls = scope._teachingCallReducers(action, scope._state.teachingCalls);
				newState.scheduleInstructorNotes = scope._scheduleInstructorNoteReducers(action, scope._state.scheduleInstructorNotes);
				newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
				newState.tags = scope._tagReducers(action, scope._state.tags);
				newState.filters = scope._filterReducers(action, scope._state.filters);
				newState.theStaff = scope._theStaffReducers(action, scope._state.theStaff);
				newState.supportStaffList = scope._supportStaffReducers(action, scope._state.supportStaffList);
				newState.studentPreferences = scope._studentPreferenceReducers(action, scope._state.studentPreferences);
				newState.instructorTypes = scope._instructorTypeReducers(action, scope._state.instructorTypes);
				newState.userRoles = scope._userRoleReducers(action, scope._state.userRoles);
				newState.users = scope._userReducers(action, scope._state.users);

				newState = _self.generateAdjustedPriorities(newState);

				scope._state = newState;

				$rootScope.$emit('assignmentStateChanged', scope._state);
				$log.debug("Assignment state updated:");
				$log.debug(scope._state, action.type);
			}
		};
	}

	// Group related TeachingAssignments and generate adjusted priority for looping over in dropdown
	generateAdjustedPriorities (newState) {
		if (!newState.teachingAssignments) { return newState; }

		newState.instructors.ids.forEach(function (instructorId) {
			Object.keys(newState.instructors.list[instructorId].teachingAssignmentTermCodeIds).forEach(function (termCodeId) {
				var uniqueAssignments = [];
				var uniqueCoursesAdded = [];
				var termTeachingAssignmentIds = newState.instructors.list[instructorId].teachingAssignmentTermCodeIds[termCodeId];

				termTeachingAssignmentIds.forEach(function (teachingAssignmentId) {
					var teachingAssignment = newState.teachingAssignments.list[teachingAssignmentId];
					var sectionGroup = newState.sectionGroups.list[teachingAssignment.sectionGroupId];

					// Non-course option or suggested course
					if (teachingAssignment.sectionGroupId === null || teachingAssignment.sectionGroupId === 0) {
						if (teachingAssignment.buyout) {
							uniqueCoursesAdded.push("Buyout");
						} else if (teachingAssignment.courseRelease) {
							uniqueCoursesAdded.push("CourseRelease");
						} else if (teachingAssignment.sabbatical) {
							uniqueCoursesAdded.push("Sabbatical");
						} else if (teachingAssignment.inResidence) {
							uniqueCoursesAdded.push("InResidence");
						} else if (teachingAssignment.sabbaticalInResidence) {
							uniqueCoursesAdded.push("SabbaticalInResidence");
						} else if (teachingAssignment.leaveOfAbsense) {
							uniqueCoursesAdded.push("LeaveOfAbsense");
						} else if (teachingAssignment.workLifeBalance) {
							uniqueCoursesAdded.push("WorkLifeBalance");
						} else {
							var uniqueIdentifier = teachingAssignment.suggestedSubjectCode + teachingAssignment.suggestedCourseNumber + teachingAssignment.suggestedEffectiveTermCode;
							teachingAssignment.uniqueIdentifier = uniqueIdentifier;
							teachingAssignment.relatedAssignmentIds = [];
							uniqueCoursesAdded.push(uniqueIdentifier);
						}
						uniqueAssignments.push(teachingAssignment);
					}

					if (sectionGroup) {
						var course = newState.courses.list[sectionGroup.courseId];
						var uniqueIdentifier = course.subjectCode + course.courseNumber + course.effectiveTermCode;
						if (uniqueCoursesAdded.indexOf(uniqueIdentifier) < 0) {
							teachingAssignment.uniqueIdentifier = uniqueIdentifier;
							teachingAssignment.relatedAssignmentIds = [];
							uniqueAssignments.push(teachingAssignment);
							uniqueCoursesAdded.push(uniqueIdentifier);
						}

						if (uniqueCoursesAdded.indexOf(uniqueIdentifier) > -1) {
							var uniqueAssignment = uniqueAssignments.find(function (assignment) {
								return assignment.uniqueIdentifier === uniqueIdentifier;
							});
							uniqueAssignment.relatedAssignmentIds.push(teachingAssignment.id);
						}
					}
				});

				var uniqueAssignmentsByPriority = _array_sortByProperty(uniqueAssignments, "priority");
				var priority = 1;

				var firstAssignmentIdInGroup;
				var relatedCourseApproved = false;
				uniqueAssignmentsByPriority.forEach(function (assignment) {
					if (assignment.relatedAssignmentIds) {
						firstAssignmentIdInGroup = assignment.id;
						assignment.relatedAssignmentIds.forEach(function (teachingAssignmentId) {
							if (newState.teachingAssignments.list[teachingAssignmentId].approved === true) {
								relatedCourseApproved = true;
							}
							newState.teachingAssignments.list[teachingAssignmentId].adjustedPriority = priority;
							priority++;
						});
					} else {
						newState.teachingAssignments.list[assignment.id].adjustedPriority = priority;
						priority++;
					}

					if (firstAssignmentIdInGroup) {
						newState.teachingAssignments.list[firstAssignmentIdInGroup].relatedAssignmentIds.forEach(function (teachingAssignmentId) {
							newState.teachingAssignments.list[teachingAssignmentId].relatedCourseApproved = relatedCourseApproved;
						});
						firstAssignmentIdInGroup = null;
						relatedCourseApproved = false;
					}
				});
			});
		});

		return newState;
	}

	generateTermCode (year, term) {
		if (term.toString().length == 1) {
			term = "0" + Number(term);
		}

		if (["01", "02", "03"].indexOf(term) >= 0) { year++; }
		var termCode = year + term;

		return termCode;
	}

	// Sorts a list of termIds into chronological order
	orderTermsChronologically (terms) {
		var orderedTermsReference = [5, 6, 7, 8, 9, 10, 1, 2, 3];
		terms.sort(function (a, b) {
			if (orderedTermsReference.indexOf(a) > orderedTermsReference.indexOf(b)) {
				return 1;
			}
			return -1;
		});

		return terms;
	}

	// Creates a buildfield to store enabled term filters
	// Always 9 digits (skips 4th unused term), and in chronologic order
	// Example: "101010001"
	serializeTermFilters (termFilters) {
		var termsBlob = "";
		var orderedTerms = [5, 6, 7, 8, 9, 10, 1, 2, 3];

		orderedTerms.forEach(function (term) {
			if (termFilters.indexOf(term) > -1) {
				termsBlob += "1";
			} else {
				termsBlob += "0";
			}
		});
		return termsBlob;
	}

	deserializeTermFiltersBlob (termFiltersBlob) {
		var termFiltersArray = [];
		var orderedTerms = [5, 6, 7, 8, 9, 10, 1, 2, 3];

		for (var i = 0; i < orderedTerms.length; i++) {

			if (termFiltersBlob[i] == "1") {
				termFiltersArray.push(orderedTerms[i]);
			}
		}

		return termFiltersArray;
	}

	getInstructorTypeId (instructor, teachingAssignments, userRoles, users) {
		var user = this.getUserByLoginId(instructor.loginId, users);

		if (user) {
			// Attempt to find via userRole
			for (var i = 0; i < userRoles.ids.length; i++) {
				var userRole = userRoles.list[userRoles.ids[i]];

				if (userRole.roleId == this.Roles.instructor && userRole.userId == user.id) {
					return userRole.instructorTypeId;
				}
			}
		}

		// Attempt to find via teachingAssignment
		for (var i = 0; i < teachingAssignments.ids.length; i++) {
			var teachingAssignment = teachingAssignments.list[teachingAssignments.ids[i]];

			if (teachingAssignment.instructorId == instructor.id) {
				return teachingAssignment.instructorTypeId;
			}
		}

		return null;
	}

	getUserByLoginId (loginId, users) {
		for (var i = 0; i < users.ids.length; i++) {
			var user = users.list[users.ids[i]];

			if (user.loginId == loginId) {
				return user;
			}
		}

		return null;
	}
}

AssignmentStateService.$inject = ['$rootScope', '$log', 'SectionGroup', 'Course', 'ScheduleTermState',
	'ScheduleInstructorNote', 'Term', 'Tag', 'Instructor', 'TeachingAssignment',
	'TeachingCall', 'TeachingCallReceipt', 'TeachingCallResponse', 'ActionTypes', 'Roles', 'InstructorTypeService'];

export default AssignmentStateService;
