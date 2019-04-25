/**
 * @ngdoc service
 * @name ipaClientAngularApp.CourseService
 * @description
 * # CourseService
 * Service in the ipaClientAngularApp.
 */
class CourseService {
  constructor() {
    return {
      getUnits: function (course) {
        if (course.unitsHigh > 0) {
          return course.unitsHigh;
        } else if (course.unitsLow > 0) {
          return course.unitsLow;
        } else {
          return 0;
        }
      },
      getSCH: function (enrollment, course) {
        if (course.unitsHigh > 0) {
          return 0;
        } else if (course.unitsLow > 0) {
          return (enrollment * course.unitsLow) || 0;
        } else {
          return 0;
        }
      }
    };
  }
}

export default CourseService;
