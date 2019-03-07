/**
 * @ngdoc service
 * @name ipaClientAngularApp.CreditHoursService
 * @description
 * # SchService
 * Service in the ipaClientAngularApp.
 */
class SchService {
  constructor() {
    return {
      getSCH: function (seats, course) {
        if (course.unitsHigh) {
          // variable unit course
          return 0;
        } else {
          return seats * course.unitsLow;
        }
      }
    };
  }
}

export default SchService;
