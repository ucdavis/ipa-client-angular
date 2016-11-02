/**
 * example:
 * <banner-to-do-list list-items="toDoItems"></banner-to-do-list>
 */
reportApp.directive("bannerToDoList", this.bannerToDoList = function () {
	return {
		restrict: "E",
		templateUrl: 'bannerToDoList.html',
		scope: {
			listItems: "=",
			onRemove: "&"
		},
		replace: true,
		link: function (scope, element, attrs) {
			// Minimize by default
			element.addClass('sis-todo-minimized');
			scope.viewMinimized = true;

			scope.toggleView = function () {
				element.toggleClass('sis-todo-minimized');
				scope.viewMinimized = !scope.viewMinimized;
			}
		}
	};
});
