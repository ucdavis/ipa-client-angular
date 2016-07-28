angular.module('term', [])

.factory('Term', ['$http', function($http) {
	function Term(termData) {
		if (termData) {
			this.setData(termData);
		}
	};
	Term.prototype = {
			setData: function(termData) {
				angular.extend(this, termData);
			},
			
			// Generates a useful table of terms for the given academic year, e.g. for academicYear = 2016
			// { id: 10, description: "Fall Quarter", shortCode: "10", termCode: "201610" }
			// { id: 1, description: "Winter Quarter", shortCode: "01", termCode: "201701" }
			// etc.
			generateTable: function(academicYear) {
				var table = [
					{ id: 5,  description: "Summer Session 1",       shortCode: "05"},
					{ id: 6,  description: "Summer Special Session", shortCode: "06"},
					{ id: 7,  description: "Summer Session 2",       shortCode: "07"},
					{ id: 8,  description: "Summer Quarter",         shortCode: "08"},
					{ id: 9,  description: "Fall Semester",          shortCode: "09"},
					{ id: 10, description: "Fall Quarter",           shortCode: "10"},
					{ id: 1,  description: "Winter Quarter",         shortCode: "01"},
					{ id: 2,  description: "Spring Semester",        shortCode: "02"},
					{ id: 3,  description: "Spring Quarter",         shortCode: "03"}
				];
				angular.forEach(table, function(term, i) {
					if(Number(term.shortCode) < 5) {
						term.code = (Number(academicYear) + 1).toString() + term.shortCode;
					} else {
						term.code = academicYear.toString() + term.shortCode;
					}
				});

				return table;
			}
			
	};

	return Term;
}]);
