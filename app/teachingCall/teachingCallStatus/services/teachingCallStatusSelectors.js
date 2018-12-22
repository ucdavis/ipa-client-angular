/*
	TeachingCallStatus entity will look like this:
	
	teachingCall.senate = ['instructors']
	teachingCall.federation = ['instructors']
	eligibleInstructors.senate = ['instructors']
	eligibleInstructors.federation = ['instructors']

	instructor = {
		id: 
		lastName:
		firstName:
		showUnavail:
		lastContacted:
		nextContact:
		dueDate:
		teachingCallReceiptId:
	}
*/

/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
teachingCallApp.service('teachingCallStatusSelectors', function () {
	return {

		generateInstructorGroup: function (instructors, teachingCallReceipts, inTeachingCall) {
			var generatedInstructors = [];
			var _self = this;

			instructors.ids.forEach( function (instructorId) {
				var instructor = instructors.list[instructorId];
				var teachingCallReceipt = teachingCallReceipts.list[instructor.teachingCallReceiptId];
				var isInstructorInTeachingCall = teachingCallReceipt ? true : false;

				if (inTeachingCall == isInstructorInTeachingCall) {
					var viewInstructor = _self.generateInstructor(instructor, teachingCallReceipt);
					generatedInstructors.push(viewInstructor);
				}

			});

			return generatedInstructors;
		},
		// Push teachingCallReceipt data onto the instructor
		generateInstructor: function (instructor, teachingCallReceipt) {
			var newInstructor = angular.copy(instructor); // eslint-disable-line no-undef
			var teachingCallReceiptCopy = angular.copy(teachingCallReceipt); // eslint-disable-line no-undef

				newInstructor.lastContactedAt = null;
				newInstructor.nextContactAt = null;
				newInstructor.dueDate = null;
				newInstructor.message = null;
				newInstructor.termsBlob = null;
				newInstructor.showUnavailabilities = null;
				newInstructor.workgroupId = null;
				newInstructor.scheduleId = null;
				newInstructor.isDone = null;

			if (teachingCallReceiptCopy) {

				if (teachingCallReceiptCopy.lastContactedAt) {
					newInstructor.lastContactedAt = moment(teachingCallReceiptCopy.lastContactedAt).format("YYYY-MM-DD").toFullDate(); // eslint-disable-line no-undef
				}

				if (teachingCallReceiptCopy.nextContactAt) {
					newInstructor.nextContactRaw = teachingCallReceiptCopy.nextContactAt;
					newInstructor.nextContactAt = moment(teachingCallReceiptCopy.nextContactAt).format("YYYY-MM-DD").toFullDate(); // eslint-disable-line no-undef
				}

				if (teachingCallReceiptCopy.dueDate) {
					newInstructor.dueDate = moment(teachingCallReceiptCopy.dueDate).format("YYYY-MM-DD").toFullDate(); // eslint-disable-line no-undef
				}

				newInstructor.message = teachingCallReceiptCopy.message;
				newInstructor.termsBlob = teachingCallReceiptCopy.termsBlob;
				newInstructor.showUnavailabilities = teachingCallReceiptCopy.showUnavailabilities;
				newInstructor.workgroupId = teachingCallReceiptCopy.workgroupId;
				newInstructor.scheduleId = teachingCallReceiptCopy.scheduleId;
				newInstructor.isDone = teachingCallReceiptCopy.isDone;
			}
			
			return newInstructor;
		}
	};
});
