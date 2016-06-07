sharedApp.directive("nav", this.nav = function() {
	return {
		restrict: 'E',
		templateUrl: 'nav.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.year = attrs.year;
			scope.termCode = attrs.termCode;
			scope.workgroupCode = attrs.workgroupCode;

			scope.terms = [
				{ id: 1, description: "Fall Quarter", code: "10" },
				{ id: 2, description: "Winter Quarter", code: "01" },
				{ id: 3, description: "Spring Quarter", code: "03" }
			];

			// Sidebar Collapse icon
			element.find(".sidebar-collapse-icon").on('click', function (ev) {
				ev.preventDefault();
				var open = $('.page-container').hasClass("sidebar-collapsed");

				if (open) {
					$('.page-container').removeClass("sidebar-collapsed");
				}
				else {
					$('.page-container').addClass("sidebar-collapsed");
				}
			});

		}
	}
})