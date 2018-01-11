/**
 * @ngdoc service
 * @name ipaClientAngularApp.dwService
 * @description
 * # dwService
 * Service in the ipaClientAngularApp.
 */
angular.module('sharedApp')
	.service('dwService', function () {
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
				var deferred = $q.defer();
				$http.get(dwUrl + "/sections/search/crn?termCode=" + termCode + "&crn=" + crn + "&token=" + dwToken)
					.success(function (result) {
						deferred.resolve(result);
					})
					.error(function () {
						deferred.reject();
					});

				return deferred.promise;
			}
		};
	});
