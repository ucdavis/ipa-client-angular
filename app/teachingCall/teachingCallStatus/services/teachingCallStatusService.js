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
				payload = {};
				payload.receipts = receiptsPayload;
	
				return ApiService.put("/api/teachingCallView/" + workgroupId + "/" + year + "/contactInstructors", payload);
			},
			removeInstructorFromTeachingCall: function (teachingCallReceiptId) {
				return ApiService.delete("/api/teachingCallView/teachingCallReceipts/" + teachingCallReceiptId);
			}
		};
	}
}

export default TeachingCallStatusService;
