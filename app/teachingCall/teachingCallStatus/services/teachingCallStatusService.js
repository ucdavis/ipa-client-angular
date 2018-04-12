teachingCallApp.factory("teachingCallStatusService", this.teachingCallStatusService = function(apiService) {
	return {
		getInitialState: function(workgroupId, year) {
			return apiService.get("/api/teachingCallView/" + workgroupId + "/" + year + "/teachingCallStatus");
		},
		addInstructorsToTeachingCall: function (workgroupId, year, teachingCallConfig) {
			return apiService.post("/api/teachingCallView/" + workgroupId + "/" + year + "/addInstructors", teachingCallConfig);
		},
		contactInstructors: function (workgroupId, year, receiptsPayload) {
			payload = {};
			payload.receipts = receiptsPayload;

			return apiService.put("/api/teachingCallView/" + workgroupId + "/" + year + "/contactInstructors", payload);
		},
		removeInstructorFromTeachingCall: function (teachingCallReceiptId) {
			return apiService.delete("/api/teachingCallView/teachingCallReceipts/" + teachingCallReceiptId);
		}
	};
});
