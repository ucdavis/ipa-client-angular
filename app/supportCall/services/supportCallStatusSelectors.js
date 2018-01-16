/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
supportCallApp.service('supportCallStatusSelectors', function () {
	return {

		// Will combine metadata of instructors and supportCallResponses,
		// Filtering based on eligibility and groupType
		generateInstructorGroup: function (instructors, supportCallResponses, isEligible) {
			generatedInstructors = [];
			self = this;

			instructors.ids.forEach( function (instructorId) {
				var instructor = instructors.list[instructorId];
				var supportCallResponse = supportCallResponses.list[instructor.supportCallResponseId];
				var isInstructorInSupportCall = supportCallResponse ? true : false;

				// Confirm matching eligibility filter
				if (isEligible != isInstructorInSupportCall) {
					var viewInstructor = self.generateInstructor(instructor, supportCallResponse);
					generatedInstructors.push(viewInstructor);
				}
			});

			return generatedInstructors;
		},

		generateSupportStaffGroup: function (supportStaffList, supportCallResponses, isEligible, groupType) {
			generatedSupportStaffList = [];
			self = this;

			supportStaffList.ids.forEach( function (supportStaffId) {
				var supportStaff = supportStaffList.list[supportStaffId];
				var supportCallResponse = supportCallResponses.list[supportStaff.supportCallResponseId];
				var isSupportStaffInSupportCall = supportCallResponse ? true : false;

				// Confirm matching eligibility filter
				if (isEligible == isSupportStaffInSupportCall) {
					return;
				}

				//Confirm matching group type
				groupConfirmed = false;
				if (groupType == "phd" && supportStaff.isPhd) {
					groupConfirmed = true;
				}
				if (groupType == "masters" && supportStaff.isMasters) {
					groupConfirmed = true;
				}
				if (groupType == "instructionalSupport" && supportStaff.isInstructionalSupport) {
					groupConfirmed = true;
				}

				if (groupType == "all") {
					groupConfirmed = true;
				}

				if (groupConfirmed == false) {
					return;
				}

				// Generate supportStaff
				var viewSupportStaff = self.generateSupportStaff(supportStaff, supportCallResponse);
				generatedSupportStaffList.push(viewSupportStaff);
			});

			return generatedSupportStaffList;
		},

		// Push supportCallResponse data onto the instructor
		generateSupportStaff: function (supportStaff, supportCallResponse) {
			var newSupportStaff = angular.copy(supportStaff);
			var supportCallResponseCopy = angular.copy(supportCallResponse);

			newSupportStaff.lastContactedAt = null;
			newSupportStaff.nextContactAt = null;
			newSupportStaff.dueDate = null;
			newSupportStaff.message = null;
			newSupportStaff.termCode = null;
			newSupportStaff.allowSubmissionAfterDueDate = null;
			newSupportStaff.scheduleId = null;
			newSupportStaff.workgroupId = null;
			newSupportStaff.submitted = null;
			
			newSupportStaff.collectGeneralComments = null;
			newSupportStaff.collectTeachingQualifications = null;
			newSupportStaff.collectPreferenceComments = null;
			newSupportStaff.collectEligibilityConfirmation = null;
			newSupportStaff.collectTeachingAssistantPreferences = null;
			newSupportStaff.collectReaderPreferences = null;
			newSupportStaff.collectAssociateInstructorPreferences = null;

			if (supportCallResponseCopy) {

				if (supportCallResponseCopy.lastContactedAt) {
					newSupportStaff.lastContactedAt = moment(supportCallResponseCopy.lastContactedAt).format("YYYY-MM-DD").toFullDate();
				}

				if (supportCallResponseCopy.nextContactAt) {
					newSupportStaff.nextContactAt = moment(supportCallResponseCopy.nextContactAt).format("YYYY-MM-DD").toFullDate();
				}

				if (supportCallResponseCopy.dueDate) {
					newSupportStaff.dueDate = moment(supportCallResponseCopy.dueDate).format("YYYY-MM-DD").toFullDate();
				}

				newSupportStaff.message = supportCallResponseCopy.message;
				newSupportStaff.termCode = supportCallResponseCopy.termCode;
				newSupportStaff.allowSubmissionAfterDueDate = supportCallResponseCopy.allowSubmissionAfterDueDate;
				newSupportStaff.scheduleId = supportCallResponseCopy.scheduleId;
				newSupportStaff.workgroupId = supportCallResponseCopy.workgroupId;
				newSupportStaff.submitted = supportCallResponseCopy.submitted;

				newSupportStaff.collectGeneralComments = supportCallResponseCopy.collectGeneralComments;
				newSupportStaff.collectTeachingQualifications = supportCallResponseCopy.collectTeachingQualifications;
				newSupportStaff.collectPreferenceComments = supportCallResponseCopy.collectPreferenceComments;
				newSupportStaff.collectEligibilityConfirmation = supportCallResponseCopy.collectEligibilityConfirmation;
				newSupportStaff.collectTeachingAssistantPreferences = supportCallResponseCopy.collectTeachingAssistantPreferences;
				newSupportStaff.collectReaderPreferences = supportCallResponseCopy.collectReaderPreferences;
				newSupportStaff.collectAssociateInstructorPreferences = supportCallResponseCopy.collectAssociateInstructorPreferences;
			}
			
			return newSupportStaff;
		},

		// Push supportCallResponse data onto the instructor
		generateInstructor: function (instructor, supportCallResponse) {
			var newInstructor = angular.copy(instructor);
			var supportCallResponseCopy = angular.copy(supportCallResponse);

				newInstructor.lastContactedAt = null;
				newInstructor.nextContactAt = null;
				newInstructor.dueDate = null;
				newInstructor.message = null;
				newInstructor.termCode = null;
				newInstructor.workgroupId = null;
				newInstructor.scheduleId = null;
				newInstructor.allowSubmissionAfterDueDate == null;
				newInstructor.submitted = null;

			if (supportCallResponseCopy) {

				if (supportCallResponseCopy.lastContactedAt) {
					newInstructor.lastContactedAt = moment(supportCallResponseCopy.lastContactedAt).format("YYYY-MM-DD").toFullDate();
				}

				if (supportCallResponseCopy.nextContactAt) {
					newInstructor.nextContactAt = moment(supportCallResponseCopy.nextContactAt).format("YYYY-MM-DD").toFullDate();
				}

				if (supportCallResponseCopy.dueDate) {
					newInstructor.dueDate = moment(supportCallResponseCopy.dueDate).format("YYYY-MM-DD").toFullDate();
				}

				newInstructor.message = supportCallResponseCopy.message;
				newInstructor.termCode = supportCallResponseCopy.termCode;
				newInstructor.workgroupId = supportCallResponseCopy.workgroupId;
				newInstructor.scheduleId = supportCallResponseCopy.scheduleId;
				newInstructor.submitted = supportCallResponseCopy.submitted;
				newInstructor.allowSubmissionAfterDueDate = supportCallResponseCopy.allowSubmissionAfterDueDate;
			}
			
			return newInstructor;
		}
	};
});