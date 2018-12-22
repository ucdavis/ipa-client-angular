/**
 * Function: Detects Keys: Enter and ESC, and detects blur.. Calls defined functions if model is changed
 * Usage: <input auto-input on-enter="save()" on-blur="save()" on-escape="cancel()"></input>
 */

let collapsableSidebarContainer = function ($rootScope, AuthService) {
	return {
		link: function (scope, element) {

			$rootScope.$on('sidebarStateToggled', function (event, sidebarCollapsed) {
				updateClass(sidebarCollapsed);
			});

			var updateClass = function (sidebarCollapsed) {
				if (sidebarCollapsed) {
					element.addClass('sidebar-collapsed');
				} else {
					element.removeClass('sidebar-collapsed');
				}
			};

			updateClass(AuthService.isSidebarCollapsed());
		}
	};
};

export default collapsableSidebarContainer;
