budgetApp.factory("budgetService", this.budgetService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/budgetView/workgroups/" + workgroupId + "/years/" + year, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createBudgetScenario: function(newBudgetScenario, budgetId) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/budgetView/budgets/" + budgetId + "/budgetScenarios", newBudgetScenario, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteBudgetScenario: function(budgetScenarioId) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/budgetView/budgetScenarios/" + budgetScenarioId, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
