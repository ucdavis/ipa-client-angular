/**
 * @ngdoc service
 * @name ipaClientAngularApp.AuditLogService
 * @description
 * # AuditLogService
 * Service in the ipaClientAngularApp.
 */
class AuditLogService {
  constructor() {
    return {
      getFullModuleName: function (module) {
        switch (module) {
          case 'assignments':
            return 'Assign Instructors';
          case 'budget':
            return 'Budget';
          case 'courses':
            return 'Courses';
          case 'scheduling':
            return 'Scheduling';
          case 'supportAssignments':
            return 'Support Staff Assignments';
          case 'supportCalls':
            return 'Support Calls';
          case 'teachingCalls':
            return 'Teaching Calls';
          default:
            return null;
        }
      },
    };
  }
}

export default AuditLogService;
