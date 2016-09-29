sharedApp.directive("disableElement", this.disableElement = function () {
	return {
		restrict: "AE",
		scope: {
			disableElement: '='
		},
		link: function (scope, element, attrs) {
			scope.$watch('disableElement', function (disableElement) {
				if (disableElement) {
					element
						.css('position', 'relative')
						.css('overflow', 'hidden')
						.css('cursor', 'not-allowed');
					element.prepend("<div class='disable-cover'></div>");
				} else {
					element
						.css('position', '')
						.css('overflow', '')
						.css('cursor', '');
					element.find('.disable-cover').remove();
				}
			});
		}
	};
});