import { _array_findById } from 'shared/helpers/array';

// eslint-disable-next-line no-undef
const Term = angular.module('Term', [])
.factory('Term', ['$http', function($http) {
	function Term(termData) {
		if (termData) {
			this.setData(termData);
		}
	}
	Term.prototype = {
			setData: function(termData) {
				angular.extend(this, termData); // eslint-disable-line no-undef
			},

			// Generates a useful table of terms for the given academic year, e.g. for academicYear = 2016
			// { id: 10, description: "Fall Quarter", shortCode: "10", termCode: "201610" }
			// { id: 1, description: "Winter Quarter", shortCode: "01", termCode: "201701" }
			// etc.
			generateTable: function (academicYear) {
				if (!academicYear) { return []; }

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
				angular.forEach(table, function(term, i) {  // eslint-disable-line no-undef
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
			getTermByTermShortCodeAndYear: function (termShortCode, year) {
				if (typeof termShortCode != "string" || termShortCode.length != 2) { return; }

				var termId = Number(termShortCode);
				var allTerms = this.generateTable(year);
				return _array_findById(allTerms, termId);
			},

			isLocked: function () {
				var termEnd = moment(this.endDate);
				var now = moment();
				return termEnd.isBefore(now);
			}

	};

	return Term;
}]);

export default Term;