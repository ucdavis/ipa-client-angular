let ipaDropdownSelect = function() {
	return {
		restrict: 'E',
		template: require('./ipaDropdownSelect.html'),
		replace: true,
		scope: {
			items: '<',
		},

	};
};

export default ipaDropdownSelect;
