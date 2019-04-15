/**
 * @ngdoc service
 * @name ipaClientAngularApp.SchService
 * @description
 * # SchService
 * Service in the ipaClientAngularApp.
 */
class SchService {
  constructor() {
    return {
      getUnits: function (course) {
        if (course.unitsHigh) {
          return course.unitsHigh;
        } else {
          return course.unitsLow;
        }
      },
      getSCH: function (enrollment, course) {
        if (course.unitsHigh) {
          return 0;
        } else {
          return enrollment * course.unitsLow;
        }
      }
    };
  }
}

export default SchService;
