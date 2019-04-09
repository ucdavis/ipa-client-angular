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
        debugger;
        var variableCourseNumbers = ['90', '98', '99', '190', '192', '194', '197', '198', '199', '298', '299', '396'];

        if (variableCourseNumbers.includes(course.courseNumber.replace(/\D/g,''))) {
          return 0;
        } else {
          return course.unitsLow;
        }
      }
    };
  }
}

export default SchService;
