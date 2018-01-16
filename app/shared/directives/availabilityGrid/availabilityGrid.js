sharedApp.directive("availabilityGrid", this.availabilityGrid = function($timeout) {
	return {
		restrict: 'E',
		templateUrl: 'availabilityGrid.html',
		replace: true,
		scope: {
			blob: '=',
			readOnly: '=',
			onChange: '&'
		},
		link: function(scope, element, attrs) {
			scope.days = ['M', 'T', 'W', 'R', 'F'];
			scope.hours = [7,8,9,10,11,12,1,2,3,4,5,6,7,8,9];

			scope.buildAvailabilityObject = function(blobArray) {
				var i = 0;
				scope.availability = {};
				for ( d = 0; d < scope.days.length; d++) {
					scope.availability[d] = {};
					for ( h = 0; h < scope.hours.length; h++) {
						if (i < blobArray.length) {
							scope.availability[d][h] = blobArray[i++];
						} else {
							// Should never happen: makes sure the object is of the
							// correct length if the blob passed was less than 75 items
							scope.availability[d][h] = '1';
						}
					}
				}
			};

			// Default availability array (all available)
			// This line creates an all 1's array the length of days x hours
			var blobArray = Array.apply(null, { length: (scope.days.length * scope.hours.length)}).map(function() { return 1; });
			scope.buildAvailabilityObject(blobArray);

			// Translate blob into availability array
			scope.$watch('blob', function(blob) {
				var blobArray = Array.apply(null, { length: (scope.days.length * scope.hours.length)}).map(function() { return 1; });

				if (blob && blob.length > 0) {
					blobArray = blob.split(',');
				}

				scope.buildAvailabilityObject(blobArray);
			});

			scope.saveAvailability = function () {
				if (scope.readOnly) { return; }

				// Translate back into blob
				var blob = [];
				for ( d = 0; d < scope.days.length; d++) {
					for ( h = 0; h < scope.hours.length; h++) {
						blob.push(scope.availability[d][h]);
					}
				}
				var stringBlob = blob.join(',');

				// Report changes back to controller after some delay
				$timeout.cancel(scope.timeout);
				scope.timeout = $timeout(function() {
					scope.onChange({blob: stringBlob});
				}, 500);
			};

			// Highlights the day/hour on hover
			element.delegate('td','mouseover mouseleave', function(e) {
				if (e.type == 'mouseover') {
					$(this).siblings('th').addClass("hover");
					element.find("thead th").eq($(this).index()).addClass("hover");
				}
				else {
					$(this).siblings('th').removeClass("hover");
					element.find("thead th").eq($(this).index()).removeClass("hover");
				}
			});

			// Highlights on drag if not locked
			if (!scope.readOnly) {

				var isMouseDown = false;
				var dragValue,dragClass;
				element.delegate('td','mousedown', function(e) {
					isMouseDown = true;
					var d = $(this).data().day;
					var h = $(this).data().hour;
					dragValue = scope.availability[d][h] = 1- scope.availability[d][h];
					scope.saveAvailability();

					dragClass = dragValue === 0 ? 'unavailable' : 'available';
					$(this).removeClass('available unavailable');
					$(this).addClass(dragClass);
					return false; // prevent text selection
				})
				.delegate('td','mouseover', function(e) {
					if (isMouseDown) {
						var d = $(this).data().day;
						var h = $(this).data().hour;
						scope.availability[d][h] = dragValue;
						scope.saveAvailability();

						$(this).removeClass('available unavailable');
						$(this).addClass(dragClass);
					}
				})
				.bind("selectstart", function () {
					return false; // prevent text selection in IE
				});

				$(document)
				.mouseup(function () {
					isMouseDown = false;
				});

			}
		}
	};
});
