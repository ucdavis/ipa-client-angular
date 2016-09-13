/**
 * Example: <spinner text="Fetching stuff..."></spinner>
 */
sharedApp.directive("spinner", this.spinner = function () {
	return {
		restrict: "E",
		replace: true,
		template: "<div style='width: 100%;' align='center'><div class='spinner-container'></div></div>",
		link: function(scope, element, attrs) {
			var target = $('.spinner-container', element);
			var text = attrs.text ? ' &nbsp; ' + attrs.text : '';
			target.html('<img src="/images/ajax-loader.gif" />' + text);
		}
	}
})