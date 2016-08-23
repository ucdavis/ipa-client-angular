'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */
courseApp.service('courseStateService', function ($rootScope, Course, ScheduleTermState, SectionGroup, Section, Tag) {
	return {
		_state: {},
		_scheduleTermStateReducers: function (action, scheduleTermStates) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
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
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						newCourse: null,
						ids: []
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
				case NEW_COURSE:
					// Insert a new id of '0' at the specified index
					courses.ids.splice(action.payload.index, 0, 0);
					courses.newCourse = new Course();
					return courses;
				case CLOSE_NEW_COURSE_DETAILS:
					var newCourseIndex = courses.ids.indexOf(0);
					courses.ids.splice(newCourseIndex, 1);
					courses.newCourse = null;
					return courses;
				case CREATE_COURSE:
					// Close details
					var newCourseIndex = courses.ids.indexOf(0);
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
					courses.list[action.payload.course.id] = action.payload.course;
					return courses;
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query.toLowerCase();

					courses.ids.forEach(function (courseId) {
						courses.list[courseId].isFiltered = true;
						for(key in courses.list[courseId]) {
							if (typeof courses.list[courseId][key] == "string"
								&& courses.list[courseId][key].toLowerCase().search(query) >= 0) {
								courses.list[courseId].isFiltered = false;
							}
						}

						return courses.list[courseId];
					});
					return courses;
				case GET_COURSE_CENSUS:
					courses.list[action.payload.course.id].census = action.payload.census;
					return courses;
				default:
					return courses;
			}
		},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						newSectionGroup: null,
						selectedSectionGroup: null,
						ids: []
					};
					var sectionGroupsList = {};
					var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
					for (var i = 0; i < length; i++) {
						var sectionGroupData = action.payload.sectionGroups[i];
						sectionGroupsList[sectionGroupData.id] = new SectionGroup(sectionGroupData);
						sectionGroups.ids.push(sectionGroupData.id);
					}
					sectionGroups.list = sectionGroupsList;
					return sectionGroups;
				case ADD_SECTION_GROUP:
					sectionGroups.list[action.payload.sectionGroup.id] = new SectionGroup(action.payload.sectionGroup);
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
					sectionGroups.list[action.payload.sectionGroup.id] = action.payload.sectionGroup;
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
					sectionGroups.list[action.payload.section.sectionGroupId].sectionIds.push(action.payload.section.id);
					return sectionGroups;
				case REMOVE_SECTION:
					var sectionIdIndex = sectionGroups.list[action.payload.section.sectionGroupId].sectionIds.indexOf(action.payload.section.id);
					sectionGroups.list[action.payload.section.sectionGroupId].sectionIds.splice(sectionIdIndex, 1);
					return sectionGroups;
				case CELL_SELECTED:
					sectionGroups.selectedSectionGroup = _.find(sectionGroups.list, function (sg) {
						return (sg.termCode == action.payload.termCode) && (sg.courseId == action.payload.courseId);
					});
					if (action.payload.termCode && sectionGroups.selectedSectionGroup == undefined) {
						var sectionGroupData = {
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
					sections.list[action.payload.section.id] = action.payload.section;
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
						ids: []
					};
					var tagsList = {};
					var length = action.payload.tags ? action.payload.tags.length : 0;
					for (var i = 0; i < length; i++) {
						var tagData = action.payload.tags[i];
						if (tagData.archived == false) {
							tagsList[tagData.id] = new Tag(tagData);
						}
					}
					tags.ids = _array_sortIdsByProperty(tagsList, "name");
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
						enabledTags: [],
						enablePublishedCourses: true,
						enableUnpublishedCourses: false
					};
					// Here is where we might load stored data about what filters
					// were left on last time.
					return filters;
				case TOGGLE_TERM_FILTER:
					var termId = action.payload.termId;
					var idx = filters.enabledTerms.indexOf(termId);
					// A term in the term filter dropdown has been toggled on or off.
					if(idx === -1) {
						// Toggle on
						filters.enabledTerms.push(termId);
					} else {
						// Toggle off
						filters.enabledTerms.splice(idx, 1);
					}
					return filters;
				default:
					return filters;
			}
		},
		_uiStateReducers: function (action, uiState) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					uiState = {
						tableLocked: false,
						selectedCourseId: null,
						selectedTermCode: null,
						massImportMode: false
					};
					return uiState;
				case NEW_COURSE:
					uiState.tableLocked = true;
					return uiState;
				case CREATE_COURSE:
					uiState.selectedCourseId = action.payload.course.id;
					uiState.tableLocked = false;
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
					return uiState;
				case BEGIN_IMPORT_MODE:
					uiState.massImportMode = true;
					return uiState;
				case END_IMPORT_MODE:
					uiState.massImportMode = false;
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
			newState.scheduleTermStates = scope._scheduleTermStateReducers(action, scope._state.scheduleTermStates);
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.sections = scope._sectionReducers(action, scope._state.sections);
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.filters = scope._filterReducers(action, scope._state.filters);
			newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

			scope._state = newState;
			$rootScope.$emit('courseStateChanged', {
				state: scope._state,
				actionType: action.type
			});

			console.debug("Course state updated:");
			console.debug(scope._state);
		}
	}
});
