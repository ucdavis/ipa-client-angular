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
		createBudgetScenario: function(newBudgetScenario, budgetId, scenarioId) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/budgetView/budgets/" + budgetId + "/budgetScenarios?scenarioId=" + scenarioId, newBudgetScenario, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createSectionGroupCostComment: function(sectionGroupCostComment) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/budgetView/sectionGroupCosts/" + sectionGroupCostComment.sectionGroupCostId + "/sectionGroupCostComments", sectionGroupCostComment, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createLineItemComment: function(lineItemComment) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/budgetView/lineItems/" + lineItemComment.lineItemId + "/lineItemComments", lineItemComment, { withCredentials: true })
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
		},
		createLineItem: function(newLineItem, budgetScenarioId) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/budgetView/budgetScenarios/" + budgetScenarioId + "/lineItems", newLineItem, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateLineItem: function(lineItem, budgetScenarioId) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/budgetView/budgetScenarios/" + budgetScenarioId + "/lineItems/" + lineItem.id, lineItem, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteLineItem: function(lineItem) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/budgetView/lineItems/" + lineItem.id, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateInstructorCost: function(instructorCost) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/budgetView/instructorCosts/" + instructorCost.id, instructorCost, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateBudget: function(budget) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/budgetView/budgets/" + budget.id, budget, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateBudgetScenario: function(budgetScenario) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/budgetView/budgetScenarios/" + budgetScenario.id, budgetScenario, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateSectionGroupCost: function(sectionGroupCost) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/budgetView/sectionGroupCosts/" + sectionGroupCost.id, sectionGroupCost, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		deleteLineItems: function(budgetScenario, lineItemIds) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/budgetView/budgetScenarios/" + budgetScenario.id, lineItems, { withCredentials: true })
			.success(function(results) {
				deferred.resolve(results);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
	};
});
