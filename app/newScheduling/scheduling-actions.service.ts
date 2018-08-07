import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { AuthService } from '@core/auth/auth.service';
import { BehaviorSubject, Observable } from '../../node_modules/rxjs';
import { Course } from '@core/models/course.model';
import { SectionGroup } from '@core/models/section-group.model';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SchedulingActions {
  private _workgroupId: number = null;
  private _year: number = null;

  // Normalized entity lists
  private _sectionGroups: BehaviorSubject<Array<SectionGroup>> = new BehaviorSubject([]);
  public readonly sectionGroups: Observable<Array<SectionGroup>> = this._sectionGroups.asObservable();

  private _courses: BehaviorSubject<Array<Course>> = new BehaviorSubject([]);
  public readonly courses: Observable<Array<Course>> = this._courses.asObservable();

  // UI state tracking (ui state that has global significance)
  private _uiState: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly uiState: Observable<any> = this._uiState.asObservable();

  // Calculations
  private _calculations: BehaviorSubject<Array<Course>> = new BehaviorSubject([]);
  public readonly calculations: Observable<Array<Course>> = this._calculations.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  // This is a required step - the 'main' component of the app should feed resolved data here, so it can be made easily available via observables
  initializeData(): void {
    this._workgroupId = this.activatedRoute.snapshot.params.workgroupId;
    this._year = this.activatedRoute.snapshot.params.year;

    this._sectionGroups.next(this.activatedRoute.snapshot.data.sectionGroups);
    this._courses.next(this.activatedRoute.snapshot.data.courses);
  }

  addCourse(course: Course): void {
    this.apiService.post('/workgroups/' + this._workgroupId + '/years/' + this._year + '/courses', course).subscribe((response) => {
      response;
      debugger;
    });
  }

  updateCourse(course: Course) {

  }

  deleteCourse(course: Course) {
    //this.apiService()
  }

  impersonateJarold() {
    this.authService.impersonate("JIWUNG");
  }

  unimpersonateJarold() {
    this.authService.unimpersonate();
  }
}
