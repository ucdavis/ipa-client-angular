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
      getUnits: function(course, sectionGroup) {
        if (sectionGroup) {
          course.unitsVariable = sectionGroup.unitsVariable;
        }

        if (course.unitsHigh > 0) {
          return course.unitsVariable || 0;
        } else if (course.unitsLow > 0) {
          return course.unitsLow;
        } else {
          return 0;
        }
      },
      getSCH: function(enrollment, course, sectionGroup) {
        if (sectionGroup) {
          course.unitsVariable = sectionGroup.unitsVariable;
        }

        if (course.unitsVariable > 0) {
          return enrollment * course.unitsVariable || 0;
        } else if (course.unitsHigh > 0) {
          // variable unit course without defined units, do not use in SCH calculation
          return 0;
        } else if (course.unitsLow > 0) {
          return enrollment * course.unitsLow || 0;
        } else {
          return 0;
        }
      }
    };
  }
}

export default CourseService;
