/**
 * Example: <spinner text="Fetching stuff..."></spinner>
 */
let spinner = function () {
	return {
		restrict: "E",
		replace: true,
		template: "<div style='width: 100%;' align='center'><div class='spinner-container'></div></div>",
		link: function (scope, element, attrs) {
			var target = $('.spinner-container', element); // eslint-disable-line no-undef
			var text = attrs.text ? ' &nbsp; ' + attrs.text : '';
			var size = attrs.size ? attrs.size : 32;
			target.html('<img src="/images/ajax-loader.gif" style="width:' + size + 'px; height:' + size + 'px; " />' + text);
		}
	};
};

export default spinner;
