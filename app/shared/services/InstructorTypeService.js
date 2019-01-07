/**
 * @ngdoc service
 * @name ipaClientAngularApp.InstructorTypeService
 * @description
 * # InstructorTypeService
 * Service in the ipaClientAngularApp.
 */
class InstructorTypeService {
	constructor () {
		return {
			orderInstructorTypeIdsAlphabetically: function(instructorTypeIds, instructorTypes) {
				instructorTypeIds.sort(function(aId, bId) {
					let aDescription = instructorTypes.list[aId].description;
					let bDescription = instructorTypes.list[bId].description;

					if (aDescription < bDescription) { return -1; }
					if (aDescription > bDescription) { return 1; }

					return 0;
				});

				return instructorTypeIds;
			}
		};
	}
}

export default InstructorTypeService;
