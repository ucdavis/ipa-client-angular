/**
 * Triggers 'open' on the clicked popover, and close on the other popovers
 * Requires to change the default trigger of the element to 'open'
 * e.g popover-trigger="open"
 */
let popoverToggleCloseOthers = function() {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			scope.closeOthers = function() {
				$('*[uib-popover], *[uib-popover-template]').not(element).each(function() { // eslint-disable-line no-undef
					angular.element(this).triggerHandler('close'); // eslint-disable-line no-undef
				});
				$('.popover.in').remove(); // eslint-disable-line no-undef
			};

			scope.open = function() {
				element.triggerHandler('open');
			};

			if (!angular.isDefined(attr.initCallback)) { // eslint-disable-line no-undef
				element.bind('click', function (e) {
					e.stopPropagation();
					scope.closeOthers();
					scope.open();
				});
			}
		}
	};
};

export default popoverToggleCloseOthers;
