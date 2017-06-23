budgetApp.factory("budgetService", this.budgetService = function($http, $q, $window) {
	return {
		getInitialState: function(workgroupId, year) {
			var deferred = $q.defer();

			// TeachingAssignments will have a potential 'replaced instructor' field set for buyouts
			var results = {
				budgetScenarios: [],
				courses: [],
				sectionGroups: [], // DTO that additionally has: # of sections, # of TAs, # of readers
				teachingAssignments: [],
				lineItems: [],
				instructors: [],
				costs: {
					taCost: 25,
					readerCost: 100,
					lecturerCosts: 250
				}
			};

			// Currently returning mock data
			deferred.resolve(results);

			return deferred.promise;
		},
	};
});
