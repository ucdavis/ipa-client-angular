/**
 * @ngdoc service
 * @name courseApp.courseActionCreators
 * @description
 * # courseActionCreators
 * Service in the courseApp.
 * Central location for sharedState information.
 */
courseApp.service('courseActionCreators', function (courseStateService, courseService, $rootScope, Role) {
	return {
		getInitialState: function (workgroupId, year) {
			courseService.getScheduleByWorkgroupIdAndYear(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		setActiveCell: function (courseId, termCode) {
			var action = {
				type: CELL_SELECTED,
				payload: {
					courseId: courseId,
					termCode: termCode
				}
			};
			courseStateService.reduce(action);
		},
		toggleImportCourse: function (subjectCode, courseNumber, sequencePattern) {
			var action = {
				type: TOGGLE_IMPORT_COURSE,
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
				type: CLOSE_DETAILS,
				payload: {}
			};
			courseStateService.reduce(action);
		},
		closeNewCourseDetails: function () {
			var action = {
				type: CLOSE_NEW_COURSE_DETAILS,
				payload: {}
			};
			courseStateService.reduce(action);
		},
		toggleTermFilter: function (termId) {
			var action = {
				type: TOGGLE_TERM_FILTER,
				payload: {
					termId: termId
				}
			};
			courseStateService.reduce(action);
		},
		setUnpublishedCoursesFilter: function (workgroupId, year, enableUnpublishedCourses) {
			courseService.getScheduleByWorkgroupIdAndYear(workgroupId, year, enableUnpublishedCourses).then(function (payload) {
				var action = {
					type: TOGGLE_UNPUBLISHED_COURSES,
					payload: payload
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateTagFilters: function (tagIds) {
			var action = {
				type: UPDATE_TAG_FILTERS,
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
					type: ADD_SECTION_GROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateSectionGroup: function (sectionGroup) {
			courseService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', { message: "Updated course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
				var action = {
					type: UPDATE_SECTION_GROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeSectionGroup: function (sectionGroup) {
			if (!sectionGroup) { return; }
			courseService.removeSectionGroup(sectionGroup.id).then(function () {
				$rootScope.$emit('toast', { message: "Deleted course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS" });
				var action = {
					type: REMOVE_SECTION_GROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteCourse: function (course) {
			var courseTitle = course.title;
			courseService.deleteCourse(course).then(function () {
				$rootScope.$emit('toast', { message: "Deleted course " + courseTitle, type: "SUCCESS" });
				var action = {
					type: REMOVE_COURSE,
					payload: {
						course: course
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteMultipleCourses: function (courseIds, workgroupId, year) {
			var self = this;
			courseService.deleteMultipleCourses(courseIds, workgroupId, year).then(function () {
				$rootScope.$emit('toast', { message: "Deleted courses.", type: "SUCCESS" });
				var action = {
					type: DELETE_MULTIPLE_COURSES,
					payload: {
						courseIds: courseIds
					}
				};
				courseStateService.reduce(action);

				self.closeCourseDeletionModal();
				self.deselectAllCourseRows();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		searchImportCourses: function (subjectCode, year, includePrivate) {
			var action = {
				type: BEGIN_SEARCH_IMPORT_COURSES,
				payload: {}
			};
			courseStateService.reduce(action);
			courseService.searchImportCourses(subjectCode, year, includePrivate).then(function (sectionGroups) {
				var action = {
					type: SEARCH_IMPORT_COURSES,
					payload: {
						subjectCode: subjectCode,
						sectionGroups: sectionGroups
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		searchCoursesFromIPA: function (workgroupId, year, includePrivate) {
			var action = {
				type: BEGIN_SEARCH_IMPORT_COURSES,
				payload: {}
			};
			courseStateService.reduce(action);
			courseService.searchCoursesFromIPA(workgroupId, year, includePrivate).then(function (sectionGroups) {
				var action = {
					type: SEARCH_IMPORT_COURSES,
					payload: {
						subjectCode: null,
						sectionGroups: sectionGroups
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		newCourse: function (index) {
			var action = {
				type: NEW_COURSE,
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
					type: CREATE_COURSE,
					payload: {
						course: createdCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});

		},
		importCoursesAndSectionGroups: function (sectionGroupImports, workgroupId, year, importedCoursesCount, importTimes, importAssignments) {
			var importTimes = importTimes ? true : false;
			var importAssignments = importAssignments ? true : false;

			courseService.importCoursesAndSectionGroups(sectionGroupImports, workgroupId, year, importTimes, importAssignments).then(function (payload) {
				$rootScope.$emit('toast', { message: "Created " + importedCoursesCount + " courses", type: "SUCCESS" });
				var action = {
					type: IMPORT_COURSES,
					payload: payload
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		importCoursesAndSectionGroupsFromIPA: function (sectionGroupImports, workgroupId, year, importedCoursesCount, importTimes, importAssignments) {
			var importTimes = importTimes ? true : false;
			var importAssignments = importAssignments ? true : false;

			courseService.importCoursesAndSectionGroupsFromIPA(sectionGroupImports, workgroupId, year, importTimes, importAssignments).then(function (payload) {
				$rootScope.$emit('toast', { message: "Created " + importedCoursesCount + " courses", type: "SUCCESS" });
				var action = {
					type: IMPORT_COURSES,
					payload: payload
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateCourse: function (course) {
			courseService.updateCourse(course).then(function (updatedCourse) {
				$rootScope.$emit('toast', { message: "Updated course " + updatedCourse.title, type: "SUCCESS" });
				var action = {
					type: UPDATE_COURSE,
					payload: {
						course: updatedCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addTagToCourse: function (course, tag) {
			courseService.addTagToCourse(course, tag).then(function (updatedCourse) {
				$rootScope.$emit('toast', { message: "Added tag " + tag.name, type: "SUCCESS" });
				var action = {
					type: UPDATE_COURSE,
					payload: {
						course: updatedCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeTagFromCourse: function (course, tag) {
			courseService.removeTagFromCourse(course, tag).then(function (updatedCourse) {
				$rootScope.$emit('toast', { message: "Removed tag " + tag.name, type: "SUCCESS" });
				var action = {
					type: UPDATE_COURSE,
					payload: {
						course: updatedCourse
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		getSectionsBySectionGroup: function (sectionGroup) {
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
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateSection: function (section) {
			courseService.updateSection(section).then(function (section) {
				$rootScope.$emit('toast', { message: "Updated section " + section.sequenceNumber, type: "SUCCESS" });
				var action = {
					type: UPDATE_SECTION,
					payload: {
						section: section
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createSection: function (section) {
			courseService.createSection(section).then(function (section) {
				$rootScope.$emit('toast', { message: "Created section " + section.sequenceNumber, type: "SUCCESS" });
				var action = {
					type: CREATE_SECTION,
					payload: {
						section: section
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteSection: function (section) {
			courseService.deleteSection(section).then(function () {
				$rootScope.$emit('toast', { message: "Deleted section " + section.sequenceNumber, type: "SUCCESS" });
				var action = {
					type: REMOVE_SECTION,
					payload: {
						section: section
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateTableFilter: function (query) {
			var action = {
				type: UPDATE_TABLE_FILTER,
				payload: {
					query: query
				}
			};
			courseStateService.reduce(action);
		},
		beginImportMode: function () {
			var action = {
				type: BEGIN_IMPORT_MODE,
				payload: {}
			};
			courseStateService.reduce(action);
		},
		endImportMode: function () {
			var action = {
				type: END_IMPORT_MODE,
				payload: {}
			};
			courseStateService.reduce(action);
		},
		getCourseCensus: function (course) {
			courseService.getCourseCensus(course).then(function (census) {
				var action = {
					type: GET_COURSE_CENSUS,
					payload: {
						course: course,
						census: census
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		toggleSelectCourse: function(courseId) {
			courseStateService.reduce({
				type: TOGGLE_SELECT_COURSE_ROW,
				payload: {
					courseId: courseId
				}
			});
		},
		selectAllCourseRows: function(courseIds) {
			courseStateService.reduce({
				type: SELECT_ALL_COURSE_ROWS,
				payload: {
					courseIds: courseIds
				}
			});
		},
		deselectAllCourseRows: function() {
			courseStateService.reduce({
				type: DESELECT_ALL_COURSE_ROWS,
				payload: {}
			});
		},
		openCourseDeletionModal: function() {
			courseStateService.reduce({
				type: OPEN_COURSE_DELETION_MODAL,
				payload: {}
			});
		},
		closeCourseDeletionModal: function() {
			courseStateService.reduce({
				type: CLOSE_COURSE_DELETION_MODAL,
				payload: {}
			});
		}
	};
});
