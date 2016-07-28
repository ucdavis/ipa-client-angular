sharedApp.directive("multiselectDropdown", this.multiselectDropdown = function() {
	return {
		templateUrl: 'multiselectDropdown.html',
		restrict: 'A',
		scope: {
			items: '=',
			activeIds: '=',
			toggleItem: '&'
		},
		link: function(scope, element, attrs) {
			scope.selectItem = function($event, id) {
				// Ensure checkboxes do not close the dropdown
				$event.preventDefault();
				$event.stopPropagation();

				if(typeof attrs.toggleItem !== 'undefined') {
					// This is how we call the callback.
					// See: http://tech.europace.de/passing-functions-to-angularjs-directives/
					scope.toggleItem( { id: id } );
				}
			}
		}
	}
});
