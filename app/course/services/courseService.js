/**
 * @ngdoc service
 * @name courseApp.courseService
 * @description
 * # courseService
 * Service in the courseApp.
 * courseApp specific api calls.
 */
courseApp.factory("courseService", this.courseService = function ($http, $q, $window) {
	return {
		getScheduleByWorkgroupIdAndYear: function (workgroupId, year, enableUnpublishedCourses) {
			var deferred = $q.defer();
			var showDoNotPrintParam = enableUnpublishedCourses ? "?showDoNotPrint=true" : "";

			$http.get(serverRoot + "/api/courseView/workgroups/" + workgroupId + "/years/" + year + showDoNotPrintParam, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		downloadSchedule: function (workgroupId, year, enableUnpublishedCourses) {
			var deferred = $q.defer();
			var showDoNotPrintParam = enableUnpublishedCourses ? "?showDoNotPrint=true" : "";

			$http.get(serverRoot + "/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel" + showDoNotPrintParam, { withCredentials: true })
				.success(function (payload) {
					$window.location.href = payload.redirect;
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		addSectionGroup: function (sectionGroup) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/courseView/sectionGroups/", sectionGroup, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		updateSectionGroup: function (sectionGroup) {
			var deferred = $q.defer();
			if (!sectionGroup) { return; }

			$http.put(serverRoot + "/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		removeSectionGroup: function (sectionGroupId) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/courseView/sectionGroups/" + sectionGroupId, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		createCourse: function (course, workgroupId, year) {
			var deferred = $q.defer();
			if (!course) { return; }

			course.tags = [];

			if (course.tagIds) {
				course.tagIds.forEach(function (tagId) {
					course.tags.push({ id: parseInt(tagId) });
				});
			}

			$http.post(serverRoot + "/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/courses", course, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		importCoursesAndSectionGroups: function (sectionGroupImports, workgroupId, year) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/courseView/workgroups/" + workgroupId + "/years/" + year + "/sectionGroups", sectionGroupImports, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		updateCourse: function (course) {
			var deferred = $q.defer();
			if (!course) { return; }

			$http.put(serverRoot + "/api/courseView/courses/" + course.id, course, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		deleteCourse: function (course) {
			var deferred = $q.defer();
			if (!course) { return; }

			$http.delete(serverRoot + "/api/courseView/courses/" + course.id, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		searchCourses: function (query) {
			var deferred = $q.defer();

			$http.get(dwUrl + "/courses/search?q=" + query + "&token=" + dwToken)
				.success(function (result) {
					deferred.resolve(result);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		searchImportCourses: function (subjectCode, year, includePrivate) {
			var deferred = $q.defer();
			var privateParam = includePrivate ? "&private=true" : "";

			$http.get(dwUrl + "/sections/search?subjectCode=" + subjectCode + "&academicYear=" + year + "&token=" + dwToken + privateParam)
				.success(function (result) {
					deferred.resolve(result);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		addTagToCourse: function (course, tag) {
			var deferred = $q.defer();
			if (!course) { return; }

			$http.post(serverRoot + "/api/courseView/courses/" + course.id + "/tags/" + tag.id, tag, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		removeTagFromCourse: function (course, tag) {
			var deferred = $q.defer();
			if (!course || !tag) { return; }

			$http.delete(serverRoot + "/api/courseView/courses/" + course.id + "/tags/" + tag.id, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		getSectionsBySectionGroupId: function (sectionGroupId) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/courseView/sectionGroups/" + sectionGroupId + "/sections/", { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		updateSection: function (section) {
			var deferred = $q.defer();
			if (!section) { return; }

			$http.put(serverRoot + "/api/courseView/sections/" + section.id, section, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		createSection: function (section) {
			var deferred = $q.defer();
			if (!section) { return; }

			$http.post(serverRoot + "/api/courseView/sectionGroups/" + section.sectionGroupId + "/sections", section, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		deleteSection: function (section) {
			var deferred = $q.defer();
			if (!section) { return; }

			$http.delete(serverRoot + "/api/courseView/sections/" + section.id, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		getCourseCensus: function (course) {
			var deferred = $q.defer();
			if (!course) { return; }

			$http.get(dwUrl + "/census?subjectCode=" + course.subjectCode + "&courseNumber=" + course.courseNumber + "&token=" + dwToken)
				.success(function (result) {
					deferred.resolve(result);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		}
	};
});
