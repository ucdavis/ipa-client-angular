sharedApp.directive("instructorSupportCallTooltip", this.confirmButton = function ($document, $timeout) {
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

				title = attrs.title || "Confirm",
				btnClass = attrs.btnClass || "btn-danger",
				placement = attrs.placement || "bottom";

			if (typeof allowSubmissionAfterDueDate === 'string') {
				allowSubmissionAfterDueDate = (allowSubmissionAfterDueDate == "true");
			}

			var allowSubmissionAfterDueDateDescription = allowSubmissionAfterDueDate ? 'Yes' : 'No';

			var html = "<div id=\"button-" + buttonId + "\" style=\"position: relative; width: 250px;\">";
			
			html += '<p class="confirmbutton-msg"><b>Allow Submission After Due Date</b>: ' + allowSubmissionAfterDueDateDescription + '</p>';

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
});