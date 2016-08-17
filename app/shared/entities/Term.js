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
				var year;
				angular.forEach(table, function(term, i) {
					if(Number(term.shortCode) < 5) {
						year = (Number(academicYear) + 1);
					} else {
						year = academicYear;
					}
					term.code = year.toString() + term.shortCode;
					term.fullDescription = term.description + ' ' + year.toString();
				});

				return table;
			},

			// Returns a proper term object for a given termCode
			getTermByTermCode: function (termCode) {
				if (typeof termCode != "string" || termCode.length != 6) { return; }

				var year;
				var termId = Number(termCode.slice(-2));
				if (termId < 5) {
					year = Number(termCode.substr(0, 4)) - 1;
				} else {
					year = Number(termCode.substr(0, 4));
				}
				var allTerms = this.generateTable(year);
				return _array_findById(allTerms, termId);
			}

	};

	return Term;
}]);
