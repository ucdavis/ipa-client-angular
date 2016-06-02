sharedApp.directive("spinner", this.spinner = function(siteConfig) {
	return {
		restrict: "E",
		replace: true,
		template: "<div style='width: 100%;' align='center'><div class='spinner-container'></div></div>",
		link: function(scope, element, attrs) {
			var opts = {
				length: 4,
				width: 2,
				radius: 4,
				scale: 0.15,
				left: '0%',
				className: 'spinner',
				position: 'relative'
			};

			var target = $('.spinner-container', element);
			var spinner = new Spinner(opts).spin(target.get(0));
			element.prepend("<span ng-show='text'>" + attrs.text +" </span>");
		}
	}
})