sharedApp.directive("infoTooltip", this.confirmButton = function ($document, $timeout) {
	return {
		restrict: 'A',
		scope: {
			confirmAction: '&confirmButton',
			confirmIsShown: '=?',
			confirmIsEnabled: '='
		},
		link: function (scope, element, attrs) {
			var buttonId = Math.floor(Math.random() * 10000000000),
				message = attrs.message || "Are you sure?",
				title = attrs.title || "Confirm",
				btnClass = attrs.btnClass || "btn-danger",
				placement = attrs.placement || "bottom";

			var html = "<div id=\"button-" + buttonId + "\" style=\"position: relative; width: 250px;\">" +
				"<p class=\"confirmbutton-msg\">" + message + "</p>" +
				"<div align=\"center\">" +
				"</div>" +
				"</div>";

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