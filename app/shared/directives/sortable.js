sharedApp.directive("sortable", this.sortable = function () {
	return {
		restrict: "AE",
		scope: {
			dragStart: '&',
			dragEnd: '&',
			readOnly: '='
		},
		link: function (scope, element, attrs) {
			scope.$watch('readOnly', function (readOnly) {
				if (readOnly) { element.sortable().sortable("disable"); }
			});

			element.sortable({
				handle: '.preference-sortable-handle',
				items: ">li:not(.unsortable)",
				cancel: ".disable-sorting",
				start: function (event, ui) {
					scope.dragStart();
				},
				update: function (event, ui) {
					var sortedIds = element.sortable("serialize").split('pref[]=').join('').split('&');
					scope.dragEnd({ sortedIds: sortedIds });
				},
				axis: "y",
				placeholder: "ui-state-highlight"
			});
		}
	};
});