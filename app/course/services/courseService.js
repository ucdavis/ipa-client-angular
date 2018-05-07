/**
 * @ngdoc service
 * @name courseApp.courseService
 * @description
 * # courseService
 * Service in the courseApp.
 * courseApp specific api calls.
 */
class CourseService {
	constructor (ApiService, $q, $http, $window) {
		this.ApiService = ApiService;
		this.$q = $q;
		this.$http = $http;
		this.$window = $window;

		var _self = this;
		this.ApiService = ApiService;
		return {
			getScheduleByWorkgroupIdAndYear: function (workgroupId, year, enableUnpublishedCourses) {
				var showDoNotPrintParam = enableUnpublishedCourses ? "?showDoNotPrint=true" : "";
				return _self.ApiService.get("/api/courseView/workgroups/" + workgroupId + "/years/" + year + showDoNotPrintParam);
			},
			downloadSchedule: function (workgroupId, year, enableUnpublishedCourses) {
				var deferred = $q.defer();
				var showDoNotPrintParam = enableUnpublishedCourses ? "?showDoNotPrint=true" : "";

				_self.$http.get(serverRoot + "/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel" + showDoNotPrintParam, { withCredentials: true })
					.then(function (payload) {
						_self.$window.location.href = payload.redirect;
						deferred.resolve(payload);
					},
					function () {
						deferred.reject();
					});

				return deferred.promise;
			},
			addSectionGroup: function (sectionGroup) {
				return _self.ApiService.post("/api/courseView/sectionGroups/", sectionGroup);
			},
			updateSectionGroup: function (sectionGroup) {
				return _self.ApiService.put("/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup);
			},
			removeSectionGroup: function (sectionGroupId) {
				return _self.ApiService.delete("/api/courseView/sectionGroups/" + sectionGroupId);
			},
			createCourse: function (course, workgroupId, year) {
				if (!course) { return; }
	
				course.tags = [];
	
				if (course.tagIds) {
	
					course.tagIds.forEach(function (tagId) {
						course.tags.push({ id: parseInt(tagId) });
					});
				}
	
				return _self.ApiService.post("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/courses", course);
			},
			importCoursesAndSectionGroups: function (sectionGroupImports, workgroupId, year, importTimes, importAssignments) {
				return _self.ApiService.post("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/sectionGroups?importTimes=" + importTimes + "&importAssignments=" + importAssignments, sectionGroupImports);
			},
			importCoursesAndSectionGroupsFromIPA: function (sectionGroupImports, workgroupId, year, importTimes, importAssignments) {
				return _self.ApiService.post("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/createCourses?importTimes=" + importTimes + "&importAssignments=" + importAssignments, sectionGroupImports);
			},
			updateCourse: function (course) {
				if (!course) { return; }
	
				return _self.ApiService.put("/api/courseView/courses/" + course.id, course);
			},
			deleteCourse: function (course) {
				return _self.ApiService.delete("/api/courseView/courses/" + course.id);
			},
			deleteMultipleCourses: function (courseIds, workgroupId, year) {
				return _self.ApiService.put("/api/courseView/schedules/" + workgroupId + "/" + year + "/courses", courseIds);
			},
			submitMassAssignTags: function (massAssignTags, workgroupId, year) {
				return _self.ApiService.put("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/massAddTags", massAssignTags);
			},
			searchCourses: function (query) {
				return _self.ApiService.get("/courses/search?q=" + query + "&token=" + dwToken, null, dwUrl);
			},
			searchImportCourses: function (subjectCode, year, includePrivate) {
				var privateParam = includePrivate ? "&private=true" : "";
	
				return _self.ApiService.get("/sections/search?subjectCode=" + subjectCode + "&academicYear=" + year + "&token=" + dwToken + privateParam, null, dwUrl);
			},
			addTagToCourse: function (course, tag) {
				if (!course) { return; }
	
				return _self.ApiService.post("/api/courseView/courses/" + course.id + "/tags/" + tag.id, tag);
			},
			removeTagFromCourse: function (course, tag) {
				if (!course || !tag) { return; }
	
				return _self.ApiService.delete("/api/courseView/courses/" + course.id + "/tags/" + tag.id);
			},
			getSectionsBySectionGroupId: function (sectionGroupId) {
				return _self.ApiService.get("/api/courseView/sectionGroups/" + sectionGroupId + "/sections/");
			},
			updateSection: function (section) {
				if (!section) { return; }
	
				return _self.ApiService.put("/api/courseView/sections/" + section.id, section);
			},
			createSection: function (section) {
				if (!section) { return; }
	
				return _self.ApiService.post("/api/courseView/sectionGroups/" + section.sectionGroupId + "/sections", section);
			},
			deleteSection: function (section) {
				if (!section) { return; }
	
				return _self.ApiService.delete("/api/courseView/sections/" + section.id);
			},
			getCourseCensus: function (course) {
				if (!course) { return; }
	
				return _self.ApiService.get("/census?subjectCode=" + course.subjectCode + "&courseNumber=" + course.courseNumber + "&token=" + dwToken, null, dwUrl);
			},
			searchCoursesFromIPA: function (workgroupId, year, includePrivate) {
				var privateParam = includePrivate ? "&private=true" : "";
	
				return _self.ApiService.get("/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/queryCourses", includePrivate);
			}
		};
	}
}

CourseService.$inject = ['ApiService', '$q', '$http', '$window'];

export default CourseService;
