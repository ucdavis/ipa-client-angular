let studentSupportCallTooltip = function ($document, $timeout) {
	return {
		restrict: 'A',
		scope: {
			confirmAction: '&confirmButton',
			confirmIsShown: '=?',
			confirmIsEnabled: '='
		},
		link: function (scope, element, attrs) {

			var buttonId = Math.floor(Math.random() * 10000000000),
				message = attrs.message || "",
				allowSubmissionAfterDueDate = attrs.allowSubmissionAfterDueDate || false,
				collectAssociateInstructorPreferences = attrs.collectAssociateInstructorPreferences || false,
				collectEligibilityConfirmation = attrs.collectEligibilityConfirmation || false,
				collectGeneralComments = attrs.collectGeneralComments || false,
				collectPreferenceComments = attrs.collectPreferenceComments || false,
				collectReaderPreferences = attrs.collectReaderPreferences || false,
				collectTeachingAssistantPreferences = attrs.collectTeachingAssistantPreferences || false,
				collectTeachingQualifications = attrs.collectTeachingQualifications || false,
				collectLanguageProficiencies = attrs.collectLanguageProficiencies || false,
				title = attrs.title || "Confirm",
				placement = attrs.placement || "bottom";

			if (typeof allowSubmissionAfterDueDate === 'string') {
				allowSubmissionAfterDueDate = (allowSubmissionAfterDueDate == "true");
			}

			if (typeof collectAssociateInstructorPreferences === 'string') {
				collectAssociateInstructorPreferences = (collectAssociateInstructorPreferences == "true");
			}

			if (typeof collectEligibilityConfirmation === 'string') {
				collectEligibilityConfirmation = (collectEligibilityConfirmation == "true");
			}

			if (typeof collectGeneralComments === 'string') {
				collectGeneralComments = (collectGeneralComments == "true");
			}

			if (typeof collectPreferenceComments === 'string') {
				collectPreferenceComments = (collectPreferenceComments == "true");
			}

			if (typeof collectReaderPreferences === 'string') {
				collectReaderPreferences = (collectReaderPreferences == "true");
			}

			if (typeof collectTeachingAssistantPreferences === 'string') {
				collectTeachingAssistantPreferences = (collectTeachingAssistantPreferences == "true");
			}

			if (typeof collectTeachingQualifications === 'string') {
				collectTeachingQualifications = (collectTeachingQualifications == "true");
			}

			if (typeof collectLanguageProficiencies === 'string') {
				collectLanguageProficiencies = (collectLanguageProficiencies == "true");
			}

			var allowSubmissionAfterDueDateDescription = allowSubmissionAfterDueDate ? 'Yes' : 'No';

			var collectAssociateInstructorPreferencesDescription = collectAssociateInstructorPreferences ? 'Yes' : 'No';
			var collectEligibilityConfirmationDescription = collectEligibilityConfirmation ? 'Yes' : 'No';
			var collectGeneralCommentsDescription = collectGeneralComments ? 'Yes' : 'No';
			var collectPreferenceCommentsDescription = collectPreferenceComments ? 'Yes' : 'No';
			var collectReaderPreferencesDescription = collectReaderPreferences ? 'Yes' : 'No';
			var collectTeachingAssistantPreferencesDescription = collectTeachingAssistantPreferences ? 'Yes' : 'No';
			var collectTeachingQualificationsDescription = collectTeachingQualifications ? 'Yes' : 'No';
			var collectLanguageProficienciesDescription = collectLanguageProficiencies ? 'Yes' : 'No';


			var html = "<div id=\"button-" + buttonId + "\" style=\"position: relative; width: 250px;\">";
			
			html += '<p class="confirmbutton-msg"><b>Allow submission after due date</b>: ' + allowSubmissionAfterDueDateDescription + '</p>';

			html += '<p class="confirmbutton-msg"><b>Collect associate instructor preferences</b>: ' + collectAssociateInstructorPreferencesDescription + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect eligibility confirmation</b>: ' + collectEligibilityConfirmationDescription + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect general comments</b>: ' + collectGeneralCommentsDescription + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect preference comments</b>: ' + collectPreferenceCommentsDescription + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect reader preferences</b>: ' + collectReaderPreferencesDescription + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect teaching assistant preferences</b>: ' + collectTeachingAssistantPreferencesDescription + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect teaching qualifications</b>: ' + collectTeachingQualificationsDescription + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect language proficiencies</b>: ' + collectLanguageProficienciesDescription + '</p>';

			if (message && message.length > 0) {
				html += '<p class="confirmbutton-msg"><b>Email:</b> ' + message + '</p>';
			}

			html += '<div align="center">' + '</div>' + '</div>';

			element.popover({
				content: html,
				html: true,
				trigger: "manual",
				title: title,
				placement: placement,
				container: 'body'
			}).on('hidden.bs.popover', function () {
				scope.confirmIsShown = false;
				$timeout(function () {
					scope.$apply();
				});
			}).on('shown.bs.popover', function () {
				scope.confirmIsShown = true;
				$timeout(function () {
					scope.$apply();
				});
			});

			element.bind('click', function (e) {
				// Disable confirmation if confirmIsEnabled is provided but not true
				if (typeof scope.confirmIsEnabled !== 'undefined' && !scope.confirmIsEnabled) {
					scope.confirmAction();
					return;
				}

				var dontBubble = true;
				e.stopPropagation();
				// First remove all pre-existing popups
				$(".popover").hide();

				// Activate this popup
				element.popover('show');
				element.addClass('active');

				var pop = $("#button-" + buttonId);

				pop.closest(".popover").click(function (e) {
					if (dontBubble) {
						e.stopPropagation();
					}
				});

				$document.on('click.confirmbutton.' + buttonId, ":not(.popover, .popover *)", function () {
					$document.off('click.confirmbutton.' + buttonId);
					element.popover('hide');
					element.removeClass('active');
				});
			});
		}
	};
};

export default studentSupportCallTooltip;
