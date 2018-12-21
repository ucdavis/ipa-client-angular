/**
 * @ngdoc service
 * @name ipaClientAngularApp.termService
 * @description
 * # termService
 * Service in the ipaClientAngularApp.
 */
class TermService {
	constructor () {
		return {
			termCodeDescriptions: {
				'05': 'Summer Session 1',
				'06': 'Summer Special Session',
				'07': 'Summer Session 2',
				'08': 'Summer Quarter',
				'09': 'Fall Semester',
				'10': 'Fall Quarter',
				'01': 'Winter Quarter',
				'02': 'Spring Semester',
				'03': 'Spring Quarter'
			},

			/**
			 * Returns full term description given termCode, e.g. 201710 -> "Fall Quarter 2017"
			 * @param {string} termCode
			 * @returns {string} Full term description with year, e.g. "Fall Quarter 2017"
			 */
			getTermName: function(termCode) {
				var year, shortTermCode;

				if (!termCode || termCode.length != 6) {
					return null;
				}

				year = termCode.substring(0, 4);
				shortTermCode = termCode.slice(-2);
	
				return this.termCodeDescriptions[shortTermCode] + " " + year;
			},
			// Example: '10' -> 'Fall Quarter'
			getShortTermName: function(term) {
				var shortTerm = null;

				if (!term || term.toString().length > 2) { return null; }
				if (term.toString().length == 1) {
					shortTerm = "0" + term;
				} else {
					shortTerm = term;
				}

				return this.termCodeDescriptions[shortTerm];
			},
			getTermFromDescription: function(description) {
				var descriptionTerms = {
					'Summer Session 1': '05',
					'Summer Special Session': '06',
					'Summer Session 2': '07',
					'Summer Quarter': '08',
					'Fall Semester': '09',
					'Fall Quarter': '10',
					'Winter Quarter': '01',
					'Spring Semester': '02',
					'Spring Quarter': '03'
				};

				return descriptionTerms[description];
			},
			termToTermCode: function(termDTO, yearDTO) {
				var year = parseInt(angular.copy(yearDTO)); // eslint-disable-line no-undef
				var term = angular.copy(termDTO); // eslint-disable-line no-undef

				// Already a termCode
				if (term.length == 6) {
					return term;
				}

				if (parseInt(term) < 4) {
					return parseInt(year + 1) + term;
				} else {
					return year + term;
				}
			},
			termCodeToTerm: function (termCode) {
				return termCode.toString().slice(-2);
			}
		};
	}
}

export default TermService;
