sharedApp.directive("searchableMultiselect", this.searchableMultiselect = function() {
	return {
		templateUrl: 'searchableMultiselect.html',
		restrict: 'AE',
		scope: {
			displayAttr: '@',
			selectedItems: '=',
			allItems: '=',
			readOnly: '=',
			selectItem: '&',
			unselectItem: '&',
			addItem: '&',
			isSearchable: '@'
		},
		link: function (scope, element, attrs) {
			scope.canAdd = (typeof attrs.addItem !== 'undefined');

			scope.updateSelectedItems = function (obj) {
				var selectedObj;
				for (i = 0; typeof scope.selectedItems !== 'undefined' && i < scope.selectedItems.length; i++) {
					if (typeof scope.selectedItems[i][scope.displayAttr] !== 'undefined' &&
						scope.selectedItems[i][scope.displayAttr].toUpperCase() === obj[scope.displayAttr].toUpperCase()) {
						selectedObj = scope.selectedItems[i];
						break;
					}
				}
				if (typeof selectedObj === 'undefined') {
					scope.selectItem({ item: obj });
				} else {
					scope.unselectItem({ item: selectedObj });
				}
			};

			scope.isItemSelected = function (item) {
				if (typeof scope.selectedItems === 'undefined') { return false; }

				var tmpItem;
				for (i = 0; i < scope.selectedItems.length; i++) {
					tmpItem = scope.selectedItems[i];
					if (typeof tmpItem !== 'undefined' &&
						typeof tmpItem[scope.displayAttr] !== 'undefined' &&
						typeof item[scope.displayAttr] !== 'undefined' &&
						tmpItem[scope.displayAttr].toUpperCase() === item[scope.displayAttr].toUpperCase()) {
						return true;
					}
				}

				return false;
			};

			scope.commaDelimitedSelected = function () {
				var list = "";
				angular.forEach(scope.selectedItems, function (item, index) {
					if (typeof item[scope.displayAttr] === 'undefined') { return; }
					list += item[scope.displayAttr];
					if (index < scope.selectedItems.length - 1) { list += ', '; }
				});
				return list.length ? list : "Nothing Selected";
			};
		}
	};
});
