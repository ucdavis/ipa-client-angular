let sortable = function () {
	return {
		restrict: "AE",
		scope: {
			dragStart: '&',
			dragEnd: '&',
			readOnly: '='
		},
		link: function (scope, element) {
			scope.$watch('readOnly', function (readOnly) {
				if (readOnly) { element.sortable().sortable("disable"); }
			});

			element.sortable({
				handle: '.preference-sortable-handle',
				items: ">li:not(.unsortable)",
				cancel: ".disable-sorting",
				start: function () {
					scope.dragStart();
				},
				update: function () {
					var sortedIds = element.sortable("serialize").split('pref[]=').join('').split('&');
					scope.dragEnd({ sortedIds: sortedIds });
				},
				axis: "y",
				placeholder: "ui-state-highlight"
			});
		}
	};
};

export default sortable;
