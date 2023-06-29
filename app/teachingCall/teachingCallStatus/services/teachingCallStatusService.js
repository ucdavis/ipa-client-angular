class TeachingCallStatusService {
	constructor (ApiService) {
		return {
			getInitialState: function(workgroupId, year) {
				return ApiService.get("/api/teachingCallView/" + workgroupId + "/" + year + "/teachingCallStatus");
			},
			addInstructorsToTeachingCall: function (workgroupId, year, teachingCallConfig) {
				return ApiService.post("/api/teachingCallView/" + workgroupId + "/" + year + "/addInstructors", teachingCallConfig);
			},
			contactInstructors: function (workgroupId, year, receiptsPayload) {
				let payload = {};
				payload.receipts = receiptsPayload;

				return ApiService.put("/api/teachingCallView/" + workgroupId + "/" + year + "/contactInstructors", payload);
			},
			removeInstructorFromTeachingCall: function (teachingCallReceiptId) {
				return ApiService.delete("/api/teachingCallView/teachingCallReceipts/" + teachingCallReceiptId);
			},
			lockTeachingCalls: function(workgroupId, year, instructorIds) {
				return ApiService.post(`/api/teachingCallView/${workgroupId}/${year}/close`, instructorIds);
			},
			unlockTeachingCall: function(teachingCallReceiptId) {
				return ApiService.post(`/api/teachingCallView/teachingCallReceipts/${teachingCallReceiptId}/unlock`);
			},
			getAuditLogs: function (workgroupId, year) {
				var endpoint = "/api/workgroups/" + workgroupId + "/years/" + year + "/modules/Teaching Calls" + "/auditLogs";
				return ApiService.get(encodeURI(endpoint));
			}
		};
	}
}

export default TeachingCallStatusService;
