/**
 * @ngdoc service
 * @name ipaClientAngularApp.termService
 * @description
 * # termService
 * Service in the ipaClientAngularApp.
 */
angular.module('sharedApp')
	.service('termService', function () {
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
			getShortTermName: function(term) {
				if (!term || term.length != 2) {
					return null;
				}

				return this.termCodeDescriptions[term];
			},
			termToTermCode: function(termDTO, yearDTO) {
				var year = parseInt(angular.copy(yearDTO));
				var term = angular.copy(termDTO);

				// Already a termCode
				if (term.length == 6) {
					return term;
				}

				if (parseInt(term) < 4) {
					return parseInt(year + 1) + term;
				} else {
					return year + term;
				}
			}
		};
	});
