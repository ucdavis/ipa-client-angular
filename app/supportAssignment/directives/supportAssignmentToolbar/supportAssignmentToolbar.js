let supportAssignmentToolbar = function () {
	return {
		restrict: 'E',
		template: require('./supportAssignmentToolbar.html'),
		replace: true,
		scope: {},
		link: function () {
			// intentionally empty
		}
	};
};

export default supportAssignmentToolbar;
