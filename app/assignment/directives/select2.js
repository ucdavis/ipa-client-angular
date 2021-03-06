assignmentApp.directive("select2", this.select2 = function () { // eslint-disable-line no-undef
	return {
		restrict: 'C',
		scope: {
			optionIds: '=',
			selectedIds: '=',
			optionObjects: '='
		},
		link: function (scope, element) {
			scope.$watch("selectedIds", function () {
				if (scope.optionIds === undefined) { return; }

				element.empty();
				scope.optionIds.forEach(function (id) {
					var isSelected = scope.selectedIds.indexOf(id) >= 0;
					var optionBlock = $('<option></option>') // eslint-disable-line no-undef
						.val(id)
						.attr('selected', isSelected)
						.html(scope.optionObjects[id].name);

					element.append(optionBlock);
				});

				element.select2();
				element.addClass('visible');
			});
		}
	};
});
