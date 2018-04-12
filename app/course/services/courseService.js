/**
 * @ngdoc service
 * @name courseApp.courseService
 * @description
 * # courseService
 * Service in the courseApp.
 * courseApp specific api calls.
 */
courseApp.factory("courseService", this.courseService = function (apiService) {
	return {
		getScheduleByWorkgroupIdAndYear: function (workgroupId, year, enableUnpublishedCourses) {
			var showDoNotPrintParam = enableUnpublishedCourses ? "?showDoNotPrint=true" : "";
			return apiService.get("/api/courseView/workgroups/" + workgroupId + "/years/" + year + showDoNotPrintParam);
		},
		downloadSchedule: function (workgroupId, year, enableUnpublishedCourses) {
			var showDoNotPrintParam = enableUnpublishedCourses ? "?showDoNotPrint=true" : "";
			return apiService.get("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel" + showDoNotPrintParam);
		},
		addSectionGroup: function (sectionGroup) {
			return apiService.post("/api/courseView/sectionGroups/", sectionGroup);
		},
		updateSectionGroup: function (sectionGroup) {
			return apiService.put("/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup);
		},
		removeSectionGroup: function (sectionGroupId) {
			return apiService.delete("/api/courseView/sectionGroups/" + sectionGroupId);
		},
		createCourse: function (course, workgroupId, year) {
			if (!course) { return; }

			course.tags = [];

			if (course.tagIds) {

				course.tagIds.forEach(function (tagId) {
					course.tags.push({ id: parseInt(tagId) });
				});
			}

			return apiService.post("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/courses", course);
		},
		importCoursesAndSectionGroups: function (sectionGroupImports, workgroupId, year, importTimes, importAssignments) {
			return apiService.post("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/sectionGroups?importTimes=" + importTimes + "&importAssignments=" + importAssignments, sectionGroupImports);
		},
		importCoursesAndSectionGroupsFromIPA: function (sectionGroupImports, workgroupId, year, importTimes, importAssignments) {
			return apiService.post("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/createCourses?importTimes=" + importTimes + "&importAssignments=" + importAssignments, sectionGroupImports);
		},
		updateCourse: function (course) {
			if (!course) { return; }

			return apiService.put("/api/courseView/courses/" + course.id, course);
		},
		deleteCourse: function (course) {
			return apiService.delete("/api/courseView/courses/" + course.id);
		},
		deleteMultipleCourses: function (courseIds, workgroupId, year) {
			return apiService.put("/api/courseView/schedules/" + workgroupId + "/" + year + "/courses", courseIds);
		},
		submitMassAssignTags: function (massAssignTags, workgroupId, year) {
			return apiService.put("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/massAddTags", massAssignTags);
		},
		searchCourses: function (query) {
			return apiService.get("/courses/search?q=" + query + "&token=" + dwToken, null, dwUrl);
		},
		searchImportCourses: function (subjectCode, year, includePrivate) {
			var privateParam = includePrivate ? "&private=true" : "";

			return apiService.get("/sections/search?subjectCode=" + subjectCode + "&academicYear=" + year + "&token=" + dwToken + privateParam, null, dwUrl);
		},
		addTagToCourse: function (course, tag) {
			if (!course) { return; }

			return apiService.post("/api/courseView/courses/" + course.id + "/tags/" + tag.id, tag);
		},
		removeTagFromCourse: function (course, tag) {
			if (!course || !tag) { return; }

			return apiService.delete("/api/courseView/courses/" + course.id + "/tags/" + tag.id);
		},
		getSectionsBySectionGroupId: function (sectionGroupId) {
			return apiService.get("/api/courseView/sectionGroups/" + sectionGroupId + "/sections/");
		},
		updateSection: function (section) {
			if (!section) { return; }

			return apiService.put("/api/courseView/sections/" + section.id, section);
		},
		createSection: function (section) {
			if (!section) { return; }

			return apiService.post("/api/courseView/sectionGroups/" + section.sectionGroupId + "/sections", section);
		},
		deleteSection: function (section) {
			if (!section) { return; }

			return apiService.delete("/api/courseView/sections/" + section.id);
		},
		getCourseCensus: function (course) {
			if (!course) { return; }

			return apiService.get("/census?subjectCode=" + course.subjectCode + "&courseNumber=" + course.courseNumber + "&token=" + dwToken, null, dwUrl);
		},
		searchCoursesFromIPA: function (workgroupId, year, includePrivate) {
			var privateParam = includePrivate ? "&private=true" : "";

			return apiService.get("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/queryCourses", includePrivate);
		}
	};
});
