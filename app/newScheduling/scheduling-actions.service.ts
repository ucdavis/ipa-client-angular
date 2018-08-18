import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { AuthService } from '@core/auth/auth.service';
import { BehaviorSubject, Observable } from '../../node_modules/rxjs';
import { Course } from '@core/models/course.model';
import { SectionGroup } from '@core/models/section-group.model';
import { ActivatedRoute } from '@angular/router';
import { ScheduleSummary } from '@scheduling/components/schedule-summary/schedule-summary.model';

@Injectable({ providedIn: 'root' })
export class SchedulingActions {
  private _workgroupId: number = null;
  private _year: number = null;
  private _termCode: number;
  private _reportState: BehaviorSubject<ScheduleSummary[]> = new BehaviorSubject([]);

  // Normalized entity lists
  private _sectionGroups: BehaviorSubject<SectionGroup[]> = new BehaviorSubject([]);
  public readonly sectionGroups: Observable<SectionGroup[]> = this._sectionGroups.asObservable();

  private _courses: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  public readonly courses: Observable<Course[]> = this._courses.asObservable();

  // UI state tracking (ui state that has global significance)
  private _uiState: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly uiState: Observable<any> = this._uiState.asObservable();

  // Calculations
  private _calculations: BehaviorSubject<Course[]> = new BehaviorSubject([]);
  public readonly calculations: Observable<Course[]> = this._calculations.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  // This is a required step - the 'main' component of the app should feed resolved data here, so it can be made easily available via observables
  initializeData(): void {
    this.activatedRoute.firstChild.params.subscribe(params => {
      this._workgroupId = params.workgroupId;
      this._year = params.year;
      this._termCode = params.termCode;

      this.formatReportData();
    });

    this.activatedRoute.firstChild.data.subscribe(data => {
      this._sectionGroups.next(data.sectionGroups);
      this._courses.next(data.courses);
    });
  }

  getScheduleSummaryReport(): Observable<any> {
    let url = `/api/scheduleSummaryReportView/workgroups/${this._workgroupId}/years/${
      this._year
    }/terms/${this._year + this._termCode}`;

    return this.apiService.get(url);
  }

  formatReportData() {
    this.getScheduleSummaryReport().subscribe(data => {
      // Get course title for each section group
      let courseArray = data.sectionGroups.map(sectionGroup => {
        let matchedCourse = data.courses.find(course => {
          return course.id === sectionGroup.courseId;
        });
        return { sectionGroupId: sectionGroup.id, title: matchedCourse.title };
      });

      // Transform to object with { sectionGroupId: courseTitle }
      const courseTable = courseArray.reduce(
        (acc, course) => ((acc[course.sectionGroupId] = course.title), acc),
        {}
      );

      let state = data.sections.map(section => ({
        title: courseTable[section.sectionGroupId],
        section: section.sequenceNumber,
        CRN: section.crn,
        enrollment: '0',
        seats: section.seats,
        activities: [{ type: 'none', days: 'none', start: 'none', end: 'none', location: 'none' }]
      }));

      this._reportState.next(state);
    });
  }

  getReportState() {
    return this._reportState.asObservable();
  }

  addCourse(course: Course): void {
    this.apiService
      .post('/api/workgroups/' + this._workgroupId + '/years/' + this._year + '/courses', course)
      .subscribe(response => {
        response;
        debugger;
      });
  }

  updateCourse(course: Course) {}

  deleteCourse(course: Course) {
    //this.apiService()
  }

  impersonateJarold() {
    this.authService.impersonate('JIWUNG');
  }

  unimpersonateJarold() {
    this.authService.unimpersonate();
  }
}
