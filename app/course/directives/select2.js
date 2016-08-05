courseApp.directive("select2", this.select2 = function () {
	return {
		restrict: 'C',
		scope: {
			optionIds: '=',
			selectedIds: '=',
			optionObjects: '='
		},
		link: function (scope, element, attrs) {
			scope.$watch("selectedIds", function () {
				if (scope.optionIds == undefined) return;

				element.empty();
				scope.optionIds.forEach(function (id) {
					var isSelected = scope.selectedIds.indexOf(id.toString()) >= 0;
					var optionBlock = $('<option></option>')
						.val(id)
						.attr('selected', isSelected)
						.html(scope.optionObjects[id].name);

					element.append(optionBlock)
				});

				element.select2();
				element.addClass('visible');
			});
		}
	}
});
