import './lineItemDropdown.css';

let lineItemDropdown = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./lineItemDropdown.html'),
		replace: true,
		scope: {
			lineItem: '<',
			isDeansOffice: '<'
		},
		link: function (scope) {
			scope.openEditLineItemModal = function(lineItem) {
				BudgetActions.openAddLineItemModal(lineItem);
			};

			scope.lockLineItem = function(lineItem) {
				BudgetActions.lockLineItem(lineItem);

				$(".line-item-dropdown").removeClass("open"); // eslint-disable-line no-undef
			}
			scope.deleteLineItem = function(lineItem) {
				BudgetActions.deleteLineItem(lineItem);

				// Ensure bootstrap dropdown closes properly when confirming deleting line item
				$(".line-item-dropdown").removeClass("open"); // eslint-disable-line no-undef
			};
		} // end link
	};
};

export default lineItemDropdown;
