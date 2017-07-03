budgetApp.service('budgetActions', function ($rootScope, $window, budgetService, budgetReducers) {
	return {
		getInitialState: function (workgroupId, year) {
			budgetService.getInitialState(workgroupId, year).then(function (results) {
				var action = {
					type: INIT_STATE,
					payload: results,
					year: year,
					workgroupId: workgroupId
				};

				budgetReducers.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
	};
});