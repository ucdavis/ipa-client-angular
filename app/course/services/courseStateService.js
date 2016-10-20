/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */
courseApp.service('courseStateService', function ($rootScope, $log, Course, Term, SectionGroup, Section, Tag) {
	return {
		_state: {},
		_termReducers: function (action, terms) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					terms = {
						ids: []
					};
					var termList = {};
					var length = action.payload.terms ? action.payload.terms.length : 0;
					for (var i = 0; i < length; i++) {
						var termData = action.payload.terms[i];
						// Using termCode as key since the Term does not have an id
						termList[termData.termCode] = new Term(termData);
					}
					terms.ids = _array_sortIdsByProperty(termList, "termCode");
					terms.list = termList;
					return terms;
				default:
					return terms;
			}
		},
		_courseReducers: function (action, courses) {
			var scope = this;
			var newCourseIndex;

			switch (action.type) {
				case INIT_STATE:
				case IMPORT_COURSES:
				case TOGGLE_UNPUBLISHED_COURSES:
					courses = {
						newCourse: null,
						ids: [],
						importList: null,
					};
					var coursesList = {};
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var courseData = action.payload.courses[i];
						coursesList[courseData.id] = new Course(courseData);
					}
					courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
					courses.list = coursesList;
					return courses;
				case SEARCH_IMPORT_COURSES:
					var importList = [];
					action.payload.sectionGroups.forEach(function (sg) {
						// Find any duplicate in existing courses
						var matchingCourse = _.find(courses.list, function (course) {
							return (course.courseNumber == sg.courseNumber) && (course.sequencePattern == sg.sequencePattern);
						});
						// Find any duplicate in importList
						var matchingImportCourse = _.find(importList, function (course) {
							return (course.courseNumber == sg.courseNumber) && (course.sequencePattern == sg.sequencePattern);
						});
						// Add only non-duplicates
						if (matchingCourse === undefined && matchingImportCourse === undefined) {
							importList.push(new Course({
								subjectCode: action.payload.subjectCode,
								courseNumber: sg.courseNumber,
								title: sg.title,
								sequencePattern: sg.sequencePattern,
								effectiveTermCode: sg.effectiveTermCode,
								import: true
							}));
						}
					});
					courses.importList = _.sortBy(importList, function (course) {
						return course.subjectCode + course.courseNumber + course.sequenceNumber;
					});
					return courses;
				case TOGGLE_IMPORT_COURSE:
					var matchingImportCourse = _.find(courses.importList, function (course) {
						return (course.subjectCode == action.payload.subjectCode) &&
							(course.courseNumber == action.payload.courseNumber) &&
							(course.sequencePattern == action.payload.sequencePattern);
					});
					if (matchingImportCourse) {
						matchingImportCourse.import = !matchingImportCourse.import;
					}
					return courses;
				case NEW_COURSE:
					// Insert a new id of '0' at the specified index
					courses.ids.splice(action.payload.index, 0, 0);
					courses.newCourse = new Course();
					return courses;
				case CLOSE_NEW_COURSE_DETAILS:
					newCourseIndex = courses.ids.indexOf(0);
					courses.ids.splice(newCourseIndex, 1);
					courses.newCourse = null;
					return courses;
				case CREATE_COURSE:
					// Close details
					newCourseIndex = courses.ids.indexOf(0);
					courses.ids.splice(newCourseIndex, 1);
					courses.newCourse = null;
					// Insert new course
					courses.list[action.payload.course.id] = new Course(action.payload.course);
					courses.ids.splice(newCourseIndex, 0, action.payload.course.id);
					return courses;
				case REMOVE_COURSE:
					var courseIndex = courses.ids.indexOf(action.payload.course.id);
					courses.ids.splice(courseIndex, 1);
					delete courses.list[action.payload.course.id];
					return courses;
				case UPDATE_COURSE:
					courses.list[action.payload.course.id] = new Course(action.payload.course);
					return courses;
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query;

					// Specify the properties that we are interested in searching
					var courseKeyList = ['courseNumber', 'sequencePattern', 'subjectCode', 'title'];

					_object_search_properties(query, courses, courseKeyList);

					return courses;
				case UPDATE_TAG_FILTERS:
					// Set the course.isFiltered flag to false if any tag matches the filters
					courses.ids.forEach(function (courseId) {
						// Display all courses if none of the tags is checked
						if (action.payload.tagIds.length === 0) {
							delete courses.list[courseId].matchesTagFilters;
						} else {
							courses.list[courseId].matchesTagFilters = courses.list[courseId].tagIds
								.some(function (tagId) {
									return action.payload.tagIds.indexOf(tagId) >= 0;
								});
						}
					});
					return courses;
				case GET_COURSE_CENSUS:
					courses.list[action.payload.course.id].census = action.payload.census;
					return courses;
				case END_IMPORT_MODE:
					courses.importList = null;
					return courses;
				default:
					return courses;
			}
		},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;
			var sectionGroupData;

			switch (action.type) {
				case INIT_STATE:
				case IMPORT_COURSES:
				case TOGGLE_UNPUBLISHED_COURSES:
					sectionGroups = {
						newSectionGroup: null,
						selectedSectionGroup: null,
						ids: [],
						importList: null
					};
					var sectionGroupsList = {};
					var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
					for (var i = 0; i < length; i++) {
						sectionGroupData = action.payload.sectionGroups[i];
						sectionGroupsList[sectionGroupData.id] = new SectionGroup(sectionGroupData);
						sectionGroups.ids.push(sectionGroupData.id);
					}
					sectionGroups.list = sectionGroupsList;
					return sectionGroups;
				case SEARCH_IMPORT_COURSES:
					sectionGroups.importList = [];
					action.payload.sectionGroups.forEach(function (sg) {
						// Find any duplicate in importList
						var matchingImportSectionGroup = _.find(sectionGroups.importList, function (sectionGroup) {
							return (sectionGroup.courseNumber == sg.courseNumber) &&
								(sectionGroup.sequencePattern == sg.sequencePattern) &&
								(sectionGroup.termCode == sg.termCode);
						});
						// Add only non-duplicates
						if (matchingImportSectionGroup === undefined) {
							sectionGroups.importList.push(new SectionGroup({
								subjectCode: action.payload.subjectCode,
								courseNumber: sg.courseNumber,
								sequencePattern: sg.sequencePattern,
								plannedSeats: sg.seats,
								title: sg.title,
								termCode: sg.termCode,
								effectiveTermCode: sg.effectiveTermCode
							}));
						}
					});
					return sectionGroups;
				case ADD_SECTION_GROUP:
					sectionGroups.list[action.payload.sectionGroup.id] = new SectionGroup(action.payload.sectionGroup);
					sectionGroups.list[action.payload.sectionGroup.id].sectionIds = []; // Skips fetching sections for new SGs
					sectionGroups.ids.push(action.payload.sectionGroup.id);
					sectionGroups.selectedSectionGroup = sectionGroups.list[action.payload.sectionGroup.id];
					sectionGroups.newSectionGroup = null;
					return sectionGroups;
				case REMOVE_SECTION_GROUP:
					var sectionGroupIndex = sectionGroups.ids.indexOf(action.payload.sectionGroup.id);
					sectionGroups.ids.splice(sectionGroupIndex, 1);
					delete sectionGroups.list[action.payload.sectionGroup.id];
					return sectionGroups;
				case UPDATE_SECTION_GROUP:
					sectionGroups.list[action.payload.sectionGroup.id] = new SectionGroup(action.payload.sectionGroup);
					return sectionGroups;
				case FETCH_SECTIONS:
					sectionGroups.list[action.payload.sectionGroup.id].sectionIds = action.payload.sections
						.sort(function (sectionA, sectionB) {
							if (sectionA.sequenceNumber < sectionB.sequenceNumber) { return -1; }
							if (sectionA.sequenceNumber > sectionB.sequenceNumber) { return 1; }
							return 0;
						})
						.map(function (section) { return section.id; });
					return sectionGroups;
				case CREATE_SECTION:
					var sectionGroup = sectionGroups.list[action.payload.section.sectionGroupId];
					if (!sectionGroup.sectionIds) { sectionGroup.sectionIds = []; }
					sectionGroup.sectionIds.push(action.payload.section.id);
					return sectionGroups;
				case REMOVE_SECTION:
					var sectionIdIndex = sectionGroups.list[action.payload.section.sectionGroupId].sectionIds.indexOf(action.payload.section.id);
					sectionGroups.list[action.payload.section.sectionGroupId].sectionIds.splice(sectionIdIndex, 1);
					return sectionGroups;
				case CELL_SELECTED:
					sectionGroups.selectedSectionGroup = _.find(sectionGroups.list, function (sg) {
						return (sg.termCode == action.payload.termCode) && (sg.courseId == action.payload.courseId);
					});
					if (action.payload.termCode && sectionGroups.selectedSectionGroup === undefined) {
						sectionGroupData = {
							courseId: action.payload.courseId,
							plannedSeats: 0,
							termCode: action.payload.termCode.toString()
						};
						sectionGroups.newSectionGroup = new SectionGroup(sectionGroupData);
					}
					return sectionGroups;
				case CLOSE_DETAILS:
					sectionGroups.selectedSectionGroup = null;
					sectionGroups.newSectionGroup = null;
					return sectionGroups;
				case END_IMPORT_MODE:
					sectionGroups.importList = null;
					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_sectionReducers: function (action, sections) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sections = {
						list: {},
						ids: []
					};
					return sections;
				case FETCH_SECTIONS:
					action.payload.sections.forEach(function (sectionData) {
						sections.list[sectionData.id] = new Section(sectionData);
						sections.ids.push(sectionData.id);
					});
					return sections;
				case CREATE_SECTION:
					sections.list[action.payload.section.id] = new Section(action.payload.section);
					sections.ids.push(action.payload.section.id);
					return sections;
				case REMOVE_SECTION:
					var sectionIndex = sections.ids.indexOf(action.payload.section.id);
					sections.ids.splice(sectionIndex, 1);
					delete sections.list[action.payload.section.id];
					return sections;
				case UPDATE_SECTION:
					sections.list[action.payload.section.id] = new Section(action.payload.section);
					return sections;
				default:
					return sections;
			}
		},
		_tagReducers: function (action, tags) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					tags = {
						ids: [],
						list: {},
						availableIds: []	// Tags that are available to be used (not archived).
					};
					var tagsList = {};
					var length = action.payload.tags ? action.payload.tags.length : 0;
					for (var i = 0; i < length; i++) {
						var tagData = action.payload.tags[i];
						if (tagData.archived) { continue; }
						tagsList[tagData.id] = new Tag(tagData);
					}
					tags.ids = _array_sortIdsByProperty(tagsList, "name");
					tags.availableIds = tags.ids.filter(function (tagId) { return tagsList[tagId].archived === false; });
					tags.list = tagsList;
					return tags;
				default:
					return tags;
			}
		},
		_filterReducers: function (action, filters) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					// A filter is 'enabled' if it is checked, i.e. the category it represents
					// is selected to be shown/on/active.
					filters = {
						enabledTerms: [10, 1, 3], // these match the 'id' field in termDefinitions
						enabledTagIds: [],
						enableUnpublishedCourses: false
					};
					// Here is where we might load stored data about what filters
					// were left on last time.
					return filters;
				case TOGGLE_TERM_FILTER:
					var tagId = action.payload.termId;
					var idx = filters.enabledTerms.indexOf(tagId);
					// A term in the term filter dropdown has been toggled on or off.
					if (idx === -1) {
						// Toggle on
						filters.enabledTerms.push(tagId);
					} else {
						// Toggle off
						filters.enabledTerms.splice(idx, 1);
					}
					return filters;
				case UPDATE_TAG_FILTERS:
					filters.enabledTagIds = action.payload.tagIds;
					return filters;
				case TOGGLE_UNPUBLISHED_COURSES:
					filters.enableUnpublishedCourses = !filters.enableUnpublishedCourses;
					filters.enabledTagIds = [];
					return filters;
				default:
					return filters;
			}
		},
		_uiStateReducers: function (action, uiState) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
				case IMPORT_COURSES:
				case TOGGLE_UNPUBLISHED_COURSES:
					uiState = {
						tableGrayedOut: false,
						selectedCourseId: null,
						selectedTermCode: null,
						massImportMode: false,
						massImportCode: null,
						massImportYear: null,
						massImportPrivate: false,
						massImportInProgress: false
					};

					// lock the table if all terms are locked
					uiState.tableLocked = action.payload.terms
						.map(function (term) { return new Term(term); })
						.every(function (term) { return term.isLocked(); });

					return uiState;
				case NEW_COURSE:
					uiState.tableLocked = true;
					uiState.tableGrayedOut = true;
					return uiState;
				case CREATE_COURSE:
					uiState.selectedCourseId = action.payload.course.id;
					uiState.tableLocked = false;
					uiState.tableGrayedOut = false;
					return uiState;
				case CELL_SELECTED:
					uiState.selectedCourseId = action.payload.courseId;
					uiState.selectedTermCode = action.payload.termCode;
					return uiState;
				case CLOSE_DETAILS:
					uiState.selectedCourseId = null;
					uiState.selectedTermCode = null;
					return uiState;
				case CLOSE_NEW_COURSE_DETAILS:
					uiState.tableLocked = false;
					uiState.tableGrayedOut = false;
					return uiState;
				case BEGIN_IMPORT_MODE:
					uiState.tableLocked = true;
					uiState.tableGrayedOut = true;
					uiState.massImportMode = true;
					uiState.selectedCourseId = null;
					uiState.selectedTermCode = null;
					return uiState;
				case END_IMPORT_MODE:
					uiState.tableLocked = false;
					uiState.tableGrayedOut = false;
					uiState.massImportMode = false;
					uiState.massImportCode = null;
					uiState.massImportYear = null;
					uiState.massImportPrivate = false;
					return uiState;
				case REMOVE_COURSE:
					// Remove the details pane if it was showing the deleted course
					if (uiState.selectedCourseId == action.payload.course.id) {
						uiState.selectedCourseId = null;
					}
					return uiState;
				default:
					return uiState;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.terms = scope._termReducers(action, scope._state.terms);
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.sections = scope._sectionReducers(action, scope._state.sections);
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.filters = scope._filterReducers(action, scope._state.filters);
			newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

			scope._state = newState;
			$rootScope.$emit('courseStateChanged', {
				state: scope._state,
				action: action
			});

			$log.debug("Course state updated:");
			$log.debug(scope._state, action.type);
		}
	};
});
