/**
 * @ngdoc service
 * @name courseApp.courseActionCreators
 * @description
 * # courseActionCreators
 * Service in the courseApp.
 * Central location for sharedState information.
 */
class CourseActionCreators {
	constructor (CourseStateService, CourseService, $rootScope, Role, ActionTypes) {
		return {
			getInitialState: function (workgroupId, year) {
				courseService.getScheduleByWorkgroupIdAndYear(workgroupId, year).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: payload
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load initial course state.", type: "ERROR" });
				});
			},
			submitMassAssignTags: function (userActions, tagIds, courseIds, workgroupId, year) {
				massAssignTags = {
					tagIdsToAdd: [],
					tagIdsToRemove: [],
					courseIds: courseIds
				};
	
				tagIds.forEach(function(tagId) {
					if (userActions[tagId].userChoice == "add") {
						massAssignTags.tagIdsToAdd.push(tagId);
					}
					if (userActions[tagId].userChoice == "remove") {
						massAssignTags.tagIdsToRemove.push(tagId);
					}
				});
	
				courseService.submitMassAssignTags(massAssignTags, workgroupId, year).then(function (payload) {
					var action = {
						type: ActionTypes.MASS_ASSIGN_TAGS,
						massAssignTags: massAssignTags
					};
					courseStateService.reduce(action);
					$rootScope.$emit('toast', { message: "Updated tags.", type: "SUCCESS" });
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update tags.", type: "ERROR" });
				});
			},
			setActiveCell: function (courseId, termCode) {
				var action = {
					type: ActionTypes.CELL_SELECTED,
					payload: {
						courseId: courseId,
						termCode: termCode
					}
				};
				courseStateService.reduce(action);
			},
			toggleImportCourse: function (subjectCode, courseNumber, sequencePattern) {
				var action = {
					type: ActionTypes.TOGGLE_IMPORT_COURSE,
					payload: {
						subjectCode: subjectCode,
						courseNumber: courseNumber,
						sequencePattern: sequencePattern
					}
				};
				courseStateService.reduce(action);
			},
			closeDetails: function () {
				var action = {
					type: ActionTypes.CLOSE_DETAILS,
					payload: {}
				};
				courseStateService.reduce(action);
			},
			closeNewCourseDetails: function () {
				var action = {
					type: ActionTypes.CLOSE_NEW_COURSE_DETAILS,
					payload: {}
				};
				courseStateService.reduce(action);
			},
			toggleTermFilter: function (termId) {
				var action = {
					type: ActionTypes.TOGGLE_TERM_FILTER,
					payload: {
						termId: termId
					}
				};
				courseStateService.reduce(action);
			},
			setUnpublishedCoursesFilter: function (workgroupId, year, enableUnpublishedCourses) {
				courseService.getScheduleByWorkgroupIdAndYear(workgroupId, year, enableUnpublishedCourses).then(function (payload) {
					var action = {
						type: ActionTypes.TOGGLE_UNPUBLISHED_COURSES,
						payload: payload
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not toggle unpublished courses.", type: "ERROR" });
				});
			},
			updateTagFilters: function (tagIds) {
				var action = {
					type: ActionTypes.UPDATE_TAG_FILTERS,
					payload: {
						tagIds: tagIds
					}
				};
				courseStateService.reduce(action);
			},
			addSectionGroup: function (sectionGroup) {
				courseService.addSectionGroup(sectionGroup).then(function (sectionGroup) {
					$rootScope.$emit('toast', { message: "Created course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_SECTION_GROUP,
						payload: {
							sectionGroup: sectionGroup
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create course offering.", type: "ERROR" });
				});
			},
			updateSectionGroup: function (sectionGroup) {
				courseService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
					$rootScope.$emit('toast', { message: "Updated course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SECTION_GROUP,
						payload: {
							sectionGroup: sectionGroup
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update course offering.", type: "ERROR" });
				});
			},
			removeSectionGroup: function (sectionGroup) {
				if (!sectionGroup) { return; }
				courseService.removeSectionGroup(sectionGroup.id).then(function () {
					$rootScope.$emit('toast', { message: "Deleted course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_SECTION_GROUP,
						payload: {
							sectionGroup: sectionGroup
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete course offering.", type: "ERROR" });
				});
			},
			deleteCourse: function (course) {
				var courseTitle = course.title;
				courseService.deleteCourse(course).then(function () {
					$rootScope.$emit('toast', { message: "Deleted course " + courseTitle, type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_COURSE,
						payload: {
							course: course
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete course.", type: "ERROR" });
				});
			},
			deleteMultipleCourses: function (courseIds, workgroupId, year) {
				var self = this;
				courseService.deleteMultipleCourses(courseIds, workgroupId, year).then(function () {
					$rootScope.$emit('toast', { message: "Deleted courses.", type: "SUCCESS" });
					var action = {
						type: ActionTypes.DELETE_MULTIPLE_COURSES,
						payload: {
							courseIds: courseIds
						}
					};
					courseStateService.reduce(action);
	
					self.closeCourseDeletionModal();
					self.deselectAllCourseRows();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Unable to delete multiple courses.", type: "ERROR" });
				});
			},
			searchImportCourses: function (subjectCode, year, includePrivate) {
				var action = {
					type: ActionTypes.BEGIN_SEARCH_IMPORT_COURSES,
					payload: {}
				};
				courseStateService.reduce(action);
				courseService.searchImportCourses(subjectCode, year, includePrivate).then(function (sectionGroups) {
					var action = {
						type: ActionTypes.SEARCH_IMPORT_COURSES,
						payload: {
							subjectCode: subjectCode,
							sectionGroups: sectionGroups
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not search import courses.", type: "ERROR" });
				});
			},
			searchCoursesFromIPA: function (workgroupId, year, includePrivate) {
				var action = {
					type: ActionTypes.BEGIN_SEARCH_IMPORT_COURSES,
					payload: {}
				};
				courseStateService.reduce(action);
				courseService.searchCoursesFromIPA(workgroupId, year, includePrivate).then(function (sectionGroups) {
					var action = {
						type: ActionTypes.SEARCH_IMPORT_COURSES,
						payload: {
							subjectCode: null,
							sectionGroups: sectionGroups
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not search IPA courses.", type: "ERROR" });
				});
			},
			newCourse: function (index) {
				var action = {
					type: ActionTypes.NEW_COURSE,
					payload: {
						index: index
					}
				};
				courseStateService.reduce(action);
				// This needs to run after the reducer
				this.setActiveCell(0);
			},
			/**
			 * POSTs to create a course
			 *
			 * @param  newCourse		new course object
			 * @param  workgroupId
			 * @param  year
			 * @returns							created course
			 */
			createCourse: function (newCourse, workgroupId, year) {
				courseService.createCourse(newCourse, workgroupId, year).then(function (createdCourse) {
					$rootScope.$emit('toast', { message: "Created course " + createdCourse.title, type: "SUCCESS" });
					var action = {
						type: ActionTypes.CREATE_COURSE,
						payload: {
							course: createdCourse
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create course.", type: "ERROR" });
				});
	
			},
			importCoursesAndSectionGroups: function (sectionGroupImports, workgroupId, year, importedCoursesCount, importTimes, importAssignments) {
				var importTimes = importTimes ? true : false;
				var importAssignments = importAssignments ? true : false;
	
				courseService.importCoursesAndSectionGroups(sectionGroupImports, workgroupId, year, importTimes, importAssignments).then(function (payload) {
					$rootScope.$emit('toast', { message: "Created " + importedCoursesCount + " courses", type: "SUCCESS" });
					var action = {
						type: ActionTypes.IMPORT_COURSES,
						payload: payload
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not import courses.", type: "ERROR" });
				});
			},
			importCoursesAndSectionGroupsFromIPA: function (sectionGroupImports, workgroupId, year, importedCoursesCount, importTimes, importAssignments) {
				var importTimes = importTimes ? true : false;
				var importAssignments = importAssignments ? true : false;
	
				courseService.importCoursesAndSectionGroupsFromIPA(sectionGroupImports, workgroupId, year, importTimes, importAssignments).then(function (payload) {
					$rootScope.$emit('toast', { message: "Created " + importedCoursesCount + " courses", type: "SUCCESS" });
					var action = {
						type: ActionTypes.IMPORT_COURSES,
						payload: payload
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not import courses from IPA.", type: "ERROR" });
				});
			},
			updateCourse: function (course) {
				courseService.updateCourse(course).then(function (updatedCourse) {
					$rootScope.$emit('toast', { message: "Updated course " + updatedCourse.title, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_COURSE,
						payload: {
							course: updatedCourse
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update course.", type: "ERROR" });
				});
			},
			addTagToCourse: function (course, tag) {
				courseService.addTagToCourse(course, tag).then(function (updatedCourse) {
					$rootScope.$emit('toast', { message: "Added tag " + tag.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_COURSE,
						payload: {
							course: updatedCourse
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not add tag to course.", type: "ERROR" });
				});
			},
			removeTagFromCourse: function (course, tag) {
				courseService.removeTagFromCourse(course, tag).then(function (updatedCourse) {
					$rootScope.$emit('toast', { message: "Removed tag " + tag.name, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_COURSE,
						payload: {
							course: updatedCourse
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not remove tag from course.", type: "ERROR" });
				});
			},
			getSectionsBySectionGroup: function (sectionGroup) {
				courseStateService.reduce({
					type: ActionTypes.BEGIN_FETCH_SECTIONS,
					payload: {}
				});
				courseService.getSectionsBySectionGroupId(sectionGroup.id).then(function (sections) {
					var action = {
						type: FETCH_SECTIONS,
						payload: {
							sectionGroup: sectionGroup,
							sections: sections
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not get sections for section group.", type: "ERROR" });
				});
			},
			updateSection: function (section) {
				courseService.updateSection(section).then(function (section) {
					$rootScope.$emit('toast', { message: "Updated section " + section.sequenceNumber, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SECTION,
						payload: {
							section: section
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update section.", type: "ERROR" });
				});
			},
			createSection: function (section) {
				courseService.createSection(section).then(function (section) {
					$rootScope.$emit('toast', { message: "Created section " + section.sequenceNumber, type: "SUCCESS" });
					var action = {
						type: ActionTypes.CREATE_SECTION,
						payload: {
							section: section
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create section.", type: "ERROR" });
				});
			},
			deleteSection: function (section) {
				courseService.deleteSection(section).then(function () {
					$rootScope.$emit('toast', { message: "Deleted section " + section.sequenceNumber, type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_SECTION,
						payload: {
							section: section
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete section.", type: "ERROR" });
				});
			},
			updateTableFilter: function (query) {
				var action = {
					type: ActionTypes.UPDATE_TABLE_FILTER,
					payload: {
						query: query
					}
				};
				courseStateService.reduce(action);
			},
			beginImportMode: function () {
				var action = {
					type: ActionTypes.BEGIN_IMPORT_MODE,
					payload: {}
				};
				courseStateService.reduce(action);
			},
			endImportMode: function () {
				var action = {
					type: ActionTypes.END_IMPORT_MODE,
					payload: {}
				};
				courseStateService.reduce(action);
			},
			getCourseCensus: function (course) {
				courseStateService.reduce({
					type: BEGIN_FETCH_CENSUS,
					payload: {}
				});
	
				courseService.getCourseCensus(course).then(function (census) {
					var action = {
						type: ActionTypes.GET_COURSE_CENSUS,
						payload: {
							course: course,
							census: census
						}
					};
					courseStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not get course census.", type: "ERROR" });
				});
			},
			toggleSelectCourse: function(courseId) {
				courseStateService.reduce({
					type: ActionTypes.TOGGLE_SELECT_COURSE_ROW,
					payload: {
						courseId: courseId
					}
				});
			},
			selectAllCourseRows: function(courseIds) {
				courseStateService.reduce({
					type: ActionTypes.SELECT_ALL_COURSE_ROWS,
					payload: {
						courseIds: courseIds
					}
				});
			},
			deselectAllCourseRows: function() {
				courseStateService.reduce({
					type: ActionTypes.DESELECT_ALL_COURSE_ROWS,
					payload: {}
				});
			},
			openCourseDeletionModal: function() {
				courseStateService.reduce({
					type: ActionTypes.OPEN_COURSE_DELETION_MODAL,
					payload: {}
				});
			},
			closeCourseDeletionModal: function() {
				courseStateService.reduce({
					type: ActionTypes.CLOSE_COURSE_DELETION_MODAL,
					payload: {}
				});
			}
		};
	
	}
}

CourseActionCreators.$inject = ['CourseStateService', 'CourseService', '$rootScope', 'Role', 'ActionTypes'];

export default CourseActionCreators;
