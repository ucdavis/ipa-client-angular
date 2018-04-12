/**
 * @ngdoc service
 * @name schedulingApp.schedulingService
 * @description
 * # schedulingService
 * Service in the schedulingApp.
 * schedulingApp specific api calls.
 */
schedulingApp.factory("schedulingService", this.schedulingService = function (apiService) {
	return {
		getScheduleByWorkgroupIdAndYearAndTermCode: function (workgroupId, year, termCode) {
			return apiService.get("/api/schedulingView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode);
		},
		updateActivity: function (activity) {
			return apiService.put("/api/schedulingView/activities/" + activity.id, activity);
		},
		removeActivity: function (activityId) {
			return apiService.delete("/api/schedulingView/activities/" + activityId);
		},
		createSharedActivity: function (activityCode, sectionGroupId) {
			return apiService.post("/api/schedulingView/sectionGroups/" + sectionGroupId + "/activities/" + activityCode);
		},
		createActivity: function (activityCode, sectionId) {
			return apiService.post("/api/schedulingView/sections/" + sectionId + "/activities/" + activityCode);
		},
		getActivities: function (section) {
			return apiService.get("/api/schedulingView/sections/" + section.id + "/activities");
		},
		getCourseActivityTypes: function (course) {
			return apiService.get("/activities?subjectCode=" + course.subjectCode + "&courseNumber=" + course.courseNumber + "&token=" + dwToken, null, dwUrl);
		},
		createSection: function (section) {
			return apiService.post("/api/courseView/sectionGroups/" + section.sectionGroupId + "/sections", section);
		},
		deleteSection: function (section) {
			return apiService.delete("/api/courseView/sections/" + section.id);
		}
	};
});
