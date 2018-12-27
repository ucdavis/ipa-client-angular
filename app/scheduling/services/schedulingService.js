/**
 * @ngdoc service
 * @name schedulingApp.schedulingService
 * @description
 * # schedulingService
 * Service in the schedulingApp.
 * schedulingApp specific api calls.
 */
class SchedulingService {
	constructor (ApiService) {
		return {
			getScheduleByWorkgroupIdAndYearAndTermCode: function (workgroupId, year, termCode) {
				return ApiService.get("/api/schedulingView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode);
			},
			updateActivity: function (activity) {
				return ApiService.put("/api/schedulingView/activities/" + activity.id, activity);
			},
			removeActivity: function (activityId) {
				return ApiService.delete("/api/schedulingView/activities/" + activityId);
			},
			createSharedActivity: function (activityCode, sectionGroupId) {
				return ApiService.post("/api/schedulingView/sectionGroups/" + sectionGroupId + "/activities/" + activityCode);
			},
			createActivity: function (activityCode, sectionId) {
				return ApiService.post("/api/schedulingView/sections/" + sectionId + "/activities/" + activityCode);
			},
			getActivities: function (section) {
				return ApiService.get("/api/schedulingView/sections/" + section.id + "/activities");
			},
			getCourseActivityTypes: function (course) {
				return ApiService.get("/activities?subjectCode=" + course.subjectCode + "&courseNumber=" + course.courseNumber + "&token=" + window.dwToken, null, window.dwUrl);
			},
			createSection: function (section) {
				return ApiService.post("/api/courseView/sectionGroups/" + section.sectionGroupId + "/sections", section);
			},
			deleteSection: function (section) {
				return ApiService.delete("/api/courseView/sections/" + section.id);
			}
		};
	}
}

SchedulingService.$inject = ['ApiService'];

export default SchedulingService;
