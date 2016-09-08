/**
 * Function: Detects Keys: Enter and ESC, and detects blur.. Calls defined functions if model is changed
 * Usage: <input auto-input on-enter="save()" on-blur="save()" on-escape="cancel()"></input>
 */

sharedApp.directive("autoInput", this.autoInput = function($rootScope) {
	return {
		scope: {
			ngModel: '=',
			onEnter: '&',
			onEscape: '&',
			onBlur: '&',
			onReset: '&',
			onChange: '&',
			clearOnInit: '@',
			helpTextPlacement: '@'
		},
		require: '?ngModel',
		controller: function($scope) {
			this.preventActions = function() {
				$scope.init();
			};

			this.resetTextbox = function() {
				$scope.resetTextbox(null, true);
			};
		},
		link: function(scope, element, attrs, ngModelCtrl) {
			var ENTER = 13;
			var ESCAPE = 27;
			scope.originalModel = scope.ngModel;
			scope.toolTipShown = false;

			// Set the element to its initial state:
			// Enter is disabled, and escape calls onEscape
			scope.init = function() {
				ngModelCtrl.$setPristine();

				if (scope.clearOnInit === 'true') {
					scope.originalModel = scope.ngModel = '';
				}

				element.unbind("blur keydown keypress");
				element.bind("keydown keypress", function(event) {
					if (event.which === ESCAPE) { // Escape
						if (typeof attrs.onEscape === 'undefined') return;

						scope.$apply(function() {
							scope.onEscape();
						});
					}
					else if (!element.hasClass('ng-dirty')) {
						element.addClass('ng-dirty');
					}
				});
			};
			scope.init();

			scope.removeTooltip = function() {
				element.tooltip('hide');
				scope.toolTipShown = false;

				// Decrement number of unsaved items, and enable Save Shield
				// TODO: move this bit into a service
				if (--$rootScope.unsavedItems === 0) window.onbeforeunload = null;
			};

			scope.$watch('ngModel', function(newVal, oldVal){
				if (typeof newVal === 'undefined' || newVal === scope.originalModel) return;
				if (typeof attrs.onChange !== 'undefined' && element.hasClass('ng-dirty')) scope.onChange({ previousValue: oldVal, currentValue: newVal });

				if (newVal !== oldVal && element.hasClass('ng-dirty') && !element.is(':focus')) {
					// Blur after some delay. The reason for the delay is that on Firefox this was triggered each time the number
					// input arrows are clicked since Firefox does not focus on the input box when those buttons are clicked
					clearTimeout(scope.timeout);
					scope.timeout = setTimeout(scope.blurTextbox, 500, null, true);
				}

				// Prevent window from closing and show tooltip if an onEnter method
				// is defined and if if the input is focused
				if (!scope.toolTipShown && typeof attrs.onEnter !== 'undefined'
					&& element.is(':focus')) {

					// Increment number of unsaved items, and enable Save Shield
					// TODO: Move this bit into a service
					$rootScope.unsavedItems++;
					window.onbeforeunload = function() {
						return "Some changes have not been saved yet";
					};

					// Add a tooltip to show that this is not yet saved
					element.tooltip({
						title: 'Enter to save',
						placement: scope.helpTextPlacement || 'right',
						trigger: 'manual'
					});
					element.tooltip('show');
					scope.toolTipShown = true;
				}

				element.unbind("blur keydown keypress");
				// Start listening to Enter and Blur events
				element.bind("keydown keypress", function(event) {
					if (event.which === ENTER) { // Enter
						if (typeof attrs.onEnter === 'undefined') return;

						scope.removeTooltip();

						scope.$apply(function() {
							scope.onEnter({originalValue: scope.originalModel});
							scope.originalModel = scope.ngModel;
							scope.init();
						});
					}
					if (event.which === ESCAPE) { // Escape
						scope.resetTextbox(event);
					}
				});
				element.bind("blur", scope.blurTextbox);
			});

			scope.blurTextbox = function (event, noApply) {
				if (typeof attrs.onBlur === 'undefined') return;

				scope.removeTooltip();

				var runBlurAction = function() {
					scope.onBlur({originalValue: scope.originalModel});
					scope.originalModel = scope.ngModel;
					scope.init();
				};

				if (noApply)
					runBlurAction();
				else
					scope.$apply(runBlurAction);
			}

			scope.resetTextbox = function(event, noApply) {
				if (event)
					event.preventDefault();

				scope.removeTooltip();

				var resetModel = function() {
					if (typeof attrs.onReset !== 'undefined')
						scope.onReset({currentValue: scope.ngModel, originalValue: scope.originalModel});

					scope.ngModel = scope.originalModel;
					scope.init();
					if (typeof attrs.onEscape !== 'undefined') scope.onEscape();
				};

				if (noApply) {
					resetModel();
				} else {
					scope.$apply(resetModel);
				}
			};
		}
	}
})