// import { Course } from "@core/models/course.model";
// import { Section } from "@core/models/section.model";
// import { SyncAction } from "@core/models/sync-action.model";
// import { Activity } from "@core/models/activity.model";

// export interface SectionGroup {
//   id: number;
//   course: Course;
//   sections: Section[];
//   syncActions: SyncAction[];
//   supportAssignments: SupportAssignment[];
//   studentInstructionalSupportCallPreferences: StudentSupportPreference[];
//   instructorSupportPreferences: InstructorSupportPreference[];
//   teachingAssignments: TeachingAssignment[];
//   activities: Activity[];
//   termCode: string;
//   plannedSeats: number;
//   showTheStaff: boolean;
// }

export interface SectionGroup {
  id: number;
  courseId: number;
  termCode: string;
  plannedSeats: number;
  showTheStaff: boolean;
  readerAppointments: number;
  taAppointments: number;
}
