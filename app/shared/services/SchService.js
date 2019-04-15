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
        if (course.unitsLow > 0) {
          return course.unitsLow;
        } else if (course.unitsHigh > 0) {
          return course.unitsHigh;
        }
      },
      getSCH: function (enrollment, course) {
        debugger;
        if (course.unitsLow > 0) {
          return (enrollment * course.unitsLow)  || 0;
        } else {
          return 0;
        }
      }
    };
  }
}

export default SchService;
