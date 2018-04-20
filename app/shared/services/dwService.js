/**
 * @ngdoc service
 * @name ipaClientAngularApp.dwService
 * @description
 * # dwService
 * Service in the ipaClientAngularApp.
 */
class DwService {
	constructor(ApiService) {
		this.apiService = ApiService;

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
			 * Returns activities associated to the specified crn/termCode
			 * @param {string} crn
			 * @param {string} termCode
			 * @returns {List[activity]}
			 */
			getDwActivitiesByCrn: function (crn, termCode) {
				return apiService.get("/sections/search/crn?termCode=" + termCode + "&crn=" + crn + "&token=" + dwToken, null, dwUrl);
			},
			/**
			 * Provides a list of census snapshots based on the parameters given.
			 * SubjectCode param is required.
			 */
			getDwCensusData: function(subjectCode, courseNumber, termCode) {
				if (subjectCode == null) { return null; }

				var paramArray = [];
				paramArray.push("?subjectCode=" + subjectCode);

				if (courseNumber) {
					paramArray.push("courseNumber=" + courseNumber);
				}

				if (termCode) {
					paramArray.push("termCode=" + termCode);
				}

				params = paramArray.join("&");

				return apiService.get("/census" + params + "&token=" + dwToken, null, dwUrl);
			}
		};
	}
}

export default DwService;
