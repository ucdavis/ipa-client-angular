sharedApp.directive("modalAddSupportCall", this.modalAddSupportCall = function ($rootScope) {
	return {
		restrict: 'E',
		templateUrl: 'AddSupportCallModal.html',
		replace: true,
		scope: {
			state: '='
		},
		link: function (scope) {
			scope.supportCallConfigData = {};
			scope.supportCallConfigData.minimumNumberOfPreferences = 5;
			scope.supportCallConfigData.mode = supportCallMode;
			scope.supportCallConfigData.sendEmails = true;
			scope.supportCallConfigData.dueDate;
			scope.supportCallConfigData.rawDueDate;
			scope.supportCallConfigData.message = "Please consider your preferences for next year. As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";

			// Datepicker config
			scope.formats = ['MMMM dd, yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
			scope.format = scope.formats[0];

			scope.inlineOptions = {
				minDate: new Date(),
				showWeeks: false
			};

			scope.dateOptions = {
				formatYear: 'yy',
				maxDate: new Date(2030, 5, 22),
				minDate: new Date(),
				startingDay: 1,
				showWeeks: false
			};

			scope.popup1 = {};
			scope.open1 = function() {
				scope.popup1.opened = true;
			};

			// Populate participantPool
			scope.supportCallConfigData.participantPool = [];

			if (scope.supportCallConfigData.mode == "instructor") {
				scope.supportCallConfigData.participantPool = scope.state.eligible.instructors;
			} else {
				scope.supportCallConfigData.participantPool = scope.state.eligible.supportStaff;
			}

			/* View Methods */
			scope.toggleSendEmails = function () {
				if (scope.supportCallConfigData.sendEmails) {
					scope.supportCallConfigData.sendEmails = false;
				} else {
					scope.supportCallConfigData.sendEmails = true;
				}
			};

			scope.toggleAllowSubmissionAfterDueDate = function () {
				if (scope.supportCallConfigData.allowSubmissionAfterDueDate) {
					scope.supportCallConfigData.allowSubmissionAfterDueDate = false;
				} else {
					scope.supportCallConfigData.allowSubmissionAfterDueDate = true;
				}
			};

			scope.toggleCollectGeneralComments = function () {
				if (scope.supportCallConfigData.collectGeneralComments) {
					scope.supportCallConfigData.collectGeneralComments = false;
				} else {
					scope.supportCallConfigData.collectGeneralComments = true;
				}
			};

			scope.toggleCollectTeachingQualifications = function () {
				if (scope.supportCallConfigData.collectTeachingQualifications) {
					scope.supportCallConfigData.collectTeachingQualifications = false;
				} else {
					scope.supportCallConfigData.collectTeachingQualifications = true;
				}
			};

			scope.toggleCollectPreferenceComments = function () {
				if (scope.supportCallConfigData.collectPreferenceComments) {
					scope.supportCallConfigData.collectPreferenceComments = false;
				} else {
					scope.supportCallConfigData.collectPreferenceComments = true;
				}
			};

			scope.toggleCollectEligibilityConfirmation = function () {
				if (scope.supportCallConfigData.collectEligibilityConfirmation) {
					scope.supportCallConfigData.collectEligibilityConfirmation = false;
				} else {
					scope.supportCallConfigData.collectEligibilityConfirmation = true;
				}
			};

			scope.toggleCollectTeachingAssistantPreferences = function () {
				if (scope.supportCallConfigData.collectTeachingAssistantPreferences) {
					scope.supportCallConfigData.collectTeachingAssistantPreferences = false;
				} else {
					scope.supportCallConfigData.collectTeachingAssistantPreferences = true;
				}
			};

			scope.toggleCollectTeachingAssistantPreferences = function () {
				if (scope.supportCallConfigData.collectTeachingAssistantPreferences) {
					scope.supportCallConfigData.collectTeachingAssistantPreferences = false;
				} else {
					scope.supportCallConfigData.collectTeachingAssistantPreferences = true;
				}
			};

			scope.toggleCollectReaderPreferences = function () {
				if (scope.supportCallConfigData.collectReaderPreferences) {
					scope.supportCallConfigData.collectReaderPreferences = false;
				} else {
					scope.supportCallConfigData.collectReaderPreferences = true;
				}
			};

			scope.toggleCollectAssociateInstructorPreferences = function () {
				if (scope.supportCallConfigData.collectAssociateInstructorPreferences) {
					scope.supportCallConfigData.collectAssociateInstructorPreferences = false;
				} else {
					scope.supportCallConfigData.collectAssociateInstructorPreferences = true;
				}
			};

			scope.toggleParticipant = function (participant) {
				if (participant.invited) {
					participant.invited = false;
				} else {
					participant.invited = true;
				}
			};

			scope.areAllInstructorsInvited = function() {
				invitedInstructors = 0;

				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.invited && participant.isInstructor) {
						invitedInstructors++;
					}
				});

				if (invitedInstructors == scope.state.eligible.instructors.length) {
					return true;
				}

				return false;
			};

			scope.areAllMastersInvited = function() {
				invitedInstructors = 0;

				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.invited && participant.isMasters) {
						invitedInstructors++;
					}
				});

				if (invitedInstructors == scope.state.eligible.masters.length) {
					return true;
				}

				return false;
			};

			scope.areAllPhdsInvited = function() {
				invitedInstructors = 0;

				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.invited && participant.isPhd) {
						invitedInstructors++;
					}
				});

				if (invitedInstructors == scope.state.eligible.phds.length) {
					return true;
				}

				return false;
			};

			scope.areAllInstructionalSupportInvited = function() {
				invitedInstructors = 0;

				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.invited && participant.isInstructionalSupport) {
						invitedInstructors++;
					}
				});

				if (invitedInstructors == scope.state.eligible.instructionalSupports.length) {
					return true;
				}

				return false;
			};

			scope.inviteInstructors = function() {
				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.isInstructor) {
						participant.invited = true;
					}
				});
			};

			scope.inviteMasters = function() {
				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.isMasters) {
						participant.invited = true;
					}
				});
			};

			scope.invitePhds = function() {
				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.isPhd) {
						participant.invited = true;
					}
				});
			};

			scope.inviteInstructionalSupport = function() {
				scope.supportCallConfigData.participantPool.forEach( function(participant) {
					if (participant.isInstructionalSupport) {
						participant.invited = true;
					}
				});
			};

			scope.submit = function () {
				var messageInput = $('.support-call-message-input').val();
				if (messageInput) {
					scope.supportCallConfigData.message = messageInput.replace(/\r?\n/g, '<br />');
				}

				if (scope.supportCallConfigData.mode == "instructor") {
					instructionalSupportCallStatusActionCreators.addInstructorsSupportCall(scope.state.scheduleId, scope.supportCallConfigData);
				} else {
					instructionalSupportCallStatusActionCreators.addSupportStaffSupportCall(scope.state.scheduleId, scope.supportCallConfigData);
				}

				$uibModalInstance.dismiss('cancel');
			};

			scope.dismiss = function() {
				$uibModalInstance.dismiss('cancel');
			};

			scope.isAddFormComplete = function() {
				if (scope.supportCallConfigData.mode == "supportStaff") {
					// Ensure at least one preference type is set
					if(!scope.supportCallConfigData.collectAssociateInstructorPreferences
						&& !scope.supportCallConfigData.collectReaderPreferences
						&& !scope.supportCallConfigData.collectTeachingAssistantPreferences) {
						return false;
					}
				}

				// Ensure at least participant is selected
				var atLeastOneInvited = false;

				scope.supportCallConfigData.participantPool.forEach( function (participant) {
					if (participant.invited == true) {
						atLeastOneInvited = true;
					}
				});

				if (atLeastOneInvited == false) {
					return false;
				}

				return true;
			};

		} // End link
	};
});