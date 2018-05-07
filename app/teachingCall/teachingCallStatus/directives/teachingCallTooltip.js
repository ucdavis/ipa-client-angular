let teachingCallTooltip = function ($document, $timeout) {
	return {
		restrict: 'A',
		scope: {
			confirmAction: '&confirmButton',
			confirmIsShown: '=?',
			confirmIsEnabled: '='
		},
		link: function (scope, element, attrs) {
			scope.termsBlobToTerms = function (termsBlob) {
				// Convert termsBlob to terms
				var allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10'];
				var relevantTerms = [];

				for (var i = 0; i < termsBlob.length; i++) {
					var blobFlag = termsBlob[i];
					if (blobFlag == "1") {
						var termCode = allTerms[i];
						relevantTerms.push(termCode);
					}
				}

				// sort terms Chronologically
				var chronologicallyOrderedTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
				var sortedTerms = [];
				chronologicallyOrderedTerms.forEach( function(term) {
					if (relevantTerms.indexOf(term) > -1) {
						sortedTerms.push(term);
					}
				});
				// Convert termCodes to term descriptions
				let allTermDescriptions = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};

				// Comma Separated term descriptions
				let termDescriptions = "";
				let firstTerm = true;
				sortedTerms.forEach(function(term) {

					if (firstTerm) {
						termDescriptions += allTermDescriptions[term];
						firstTerm = false;
					} else {
						termDescriptions += ", ";
						termDescriptions += allTermDescriptions[term];
					}
				});

				return termDescriptions;
			};

			var buttonId = Math.floor(Math.random() * 10000000000),
				message = attrs.message || "",
				termsBlob = attrs.termsBlob || "no termsBlob",
				showUnavail = attrs.showUnavail || "no showUnavail",

				title = attrs.title || "Confirm",
				btnClass = attrs.btnClass || "btn-danger",
				placement = attrs.placement || "bottom";

			if (typeof showUnavail === 'string') {
				showUnavail = (showUnavail == "true");
			}
			var collectUnavailDescription = showUnavail ? 'Yes' : 'No';
			var termsList = scope.termsBlobToTerms(termsBlob);

			var html = "<div id=\"button-" + buttonId + "\" style=\"position: relative; width: 250px;\">";
			
			html += '<p class="confirmbutton-msg"><b>Terms:</b> ' + termsList + '</p>';
			html += '<p class="confirmbutton-msg"><b>Collect Unavailabilities</b>: ' + collectUnavailDescription + '</p>';

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

export default teachingCallTooltip;
