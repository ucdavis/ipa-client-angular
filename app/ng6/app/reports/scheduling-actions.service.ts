// import { Injectable } from '@angular/core';
// import { ApiService } from '@core/api/api.service';
// import { AuthService } from '@core/auth/auth.service';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Course } from '@core/models/course.model';
// import { SectionGroup } from '@core/models/section-group.model';
// import { ActivatedRoute } from '@angular/router';
// import { ScheduleSummary } from '@reports/components/schedule-summary/schedule-summary.model';

// import { sortBy } from 'lodash';
// import * as moment from 'moment';

// @Injectable({ providedIn: 'root' })
// export class SchedulingActions {
//   private _workgroupId: number = null;
//   private _year: number = null;
//   private _termCode: number;

//   private _reportState: BehaviorSubject<ScheduleSummary[]> = new BehaviorSubject([]);
//   public readonly reportState$: Observable<ScheduleSummary[]> = this._reportState.asObservable();

//   // Normalized entity lists
//   private _sectionGroups: BehaviorSubject<SectionGroup[]> = new BehaviorSubject([]);
//   public readonly sectionGroups: Observable<SectionGroup[]> = this._sectionGroups.asObservable();

//   private _courses: BehaviorSubject<Course[]> = new BehaviorSubject([]);
//   public readonly courses: Observable<Course[]> = this._courses.asObservable();

//   // UI state tracking (ui state that has global significance)
//   private _uiState: BehaviorSubject<any> = new BehaviorSubject([]);
//   public readonly uiState: Observable<any> = this._uiState.asObservable();

//   // Calculations
//   private _calculations: BehaviorSubject<Course[]> = new BehaviorSubject([]);
//   public readonly calculations: Observable<Course[]> = this._calculations.asObservable();

//   constructor(
//     private apiService: ApiService,
//     private authService: AuthService,
//     private activatedRoute: ActivatedRoute
//   ) {}

//   // This is a required step - the 'main' component of the app should feed
//   // resolved data here, so it can be made easily available via observables
//   initializeData(): void {
//     this.activatedRoute.firstChild.params.subscribe(params => {
//       this._workgroupId = params.workgroupId;
//       this._year = params.year;
//       this._termCode = params.termCode;

//       this.generateReportData();
//     });

//     this.activatedRoute.firstChild.data.subscribe(data => {
//       this._sectionGroups.next(data.sectionGroups);
//       this._courses.next(data.courses);
//     });
//   }

//   getScheduleSummaryReport(): Observable<any> {
//     return this.apiService.get(
//       `/api/scheduleSummaryReportView/workgroups/${this._workgroupId}/years/${this._year}/terms/${this._year + this._termCode}`
//     );
//   }

//   generateReportData() {
//     this.getScheduleSummaryReport().subscribe(data => {
//       // Get course title for each section group
//       const courseArray = data.sectionGroups.map(sectionGroup => {
//         const matchedCourse = data.courses.find(course => {
//           return course.id === sectionGroup.courseId;
//         });
//         return {
//           sectionGroupId: sectionGroup.id,
//           title: `${matchedCourse.subjectCode} ${matchedCourse.courseNumber} ${matchedCourse.title}`
//         };
//       });
//       // Transform to object with { sectionGroupId: courseTitle }
//       const courseTable = courseArray.reduce(
//         (acc, course) => ((acc[course.sectionGroupId] = course.title), acc),
//         {}
//       );

//       const state = data.sections.map(section => {
//         // each section has activities common to the section group as well as it's own activities
//         const sectionActivities = data.activities.filter(activity => {
//           // activity common to the section group has no section id
//           if (activity.sectionGroupId === section.sectionGroupId && activity.sectionId === 0) {
//             return true;
//           }
//           // activity for individual section has section id
//           if (activity.sectionId === section.id) {
//             return true;
//           }
//         });

//         let formattedActivities = sectionActivities.map(activity => ({
//           type: this.getActivityCodeDescription(activity.activityTypeCode.activityTypeCode),
//           days: this.getWeekDays(activity.dayIndicator),
//           start: this.toStandardTime(activity.startTime),
//           end: this.toStandardTime(activity.endTime),
//           location: activity.locationDescription
//         }));

//         return {
//           title: courseTable[section.sectionGroupId],
//           section: section.sequenceNumber,
//           CRN: section.crn ? section.crn : '-',
//           enrollment: '0',
//           seats: section.seats,
//           activities: formattedActivities
//         };
//       });

//       let sortedState = sortBy(state, ['title', 'section']);
//       this._reportState.next(sortedState);
//     });
//   }

//   generateExcel() {
//     return this.apiService.get(
//       `/api/scheduleSummaryReportView/workgroups/${this._workgroupId}/years/${this._year}/terms/${
//         this._termCode
//       }/generateExcel`
//     );
//   }

//   addCourse(course: Course): void {
//     this.apiService
//       .post('/api/workgroups/' + this._workgroupId + '/years/' + this._year + '/courses', course)
//       .subscribe(response => {
//         response;
//         debugger;
//       });
//   }

//   updateCourse(course: Course) {}

//   deleteCourse(course: Course) {
//     //this.apiService()
//   }

//   impersonateJarold() {
//     this.authService.impersonate('JIWUNG');
//   }

//   unimpersonateJarold() {
//     this.authService.unimpersonate();
//   }

//   // Helper Functions
//   // TODO: Move to helper/utils service

//   // Turns 'D' into 'Discussion'
//   getActivityCodeDescription(code) {
//     let codeDescriptions = {
//       '%': 'World Wide Web Electronic Discussion',
//       '0': 'World Wide Web Virtual Lecture',
//       '1': 'Conference',
//       '2': 'Term Paper/Discussion',
//       '3': 'Film Viewing',
//       '6': 'Dummy Course',
//       '7': 'Combined Schedule',
//       '8': 'Project',
//       '9': 'Extensive Writing or Discussion',
//       A: 'Lecture',
//       B: 'Lecture/Discussion',
//       C: 'Laboratory',
//       D: 'Discussion',
//       E: 'Seminar',
//       F: 'Fieldwork',
//       G: 'Discussion/Laboratory',
//       H: 'Laboratory/Discussion',
//       I: 'Internship',
//       J: 'Independent Study',
//       K: 'Workshop',
//       L: 'Lecture/Lab',
//       O: 'Clinic',
//       P: 'PE Activity',
//       Q: 'Listening',
//       R: 'Recitation',
//       S: 'Studio',
//       T: 'Tutorial',
//       U: 'Auto Tutorial',
//       V: 'Variable',
//       W: 'Practice',
//       X: 'Performance Instruction',
//       Y: 'Rehearsal',
//       Z: 'Term Paper'
//     };
//     return codeDescriptions[code];
//   }

//   // Turns 0101010 into MWF
//   getWeekDays(dayIndicator) {
//     if (!dayIndicator || dayIndicator.length == 0) {
//       return '';
//     }

//     let days = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
//     let dayArr = dayIndicator.split('');

//     let dayStr = '';
//     dayArr.forEach((day, i) => {
//       if (day === '1') {
//         dayStr = dayStr + days[i];
//       }
//     });

//     return dayStr;
//   }

//   /**
//    * Converts 24 'military time' to 12 hour am/pm time
//    * handled cases:
//    * - "13:00:00"
//    * - "13:00"
//    * - "1300"
//    */
//   toStandardTime(time) {
//     let returnFormat = 'h:mm A';
//     if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-9][0-9]$/.test(time)) {
//       // Case "13:00:00"
//       return moment(time, 'HH:mm:ss').format(returnFormat);
//     } else if (/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
//       // Case "13:00"
//       return moment(time, 'HH:mm').format(returnFormat);
//     } else if (/^([0-9]|0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/.test(time)) {
//       // Case "1300"
//       return moment(time, 'HHmm').format(returnFormat);
//     }
//   }
// }
