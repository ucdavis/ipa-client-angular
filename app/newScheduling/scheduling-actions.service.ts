import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { AuthService } from '@core/auth/auth.service';
import { BehaviorSubject, Observable } from '../../node_modules/rxjs';
import { Course } from '@core/models/course.model';
import { SectionGroup } from '@core/models/section-group.model';

@Injectable({ providedIn: 'root' })
export class SchedulingActions {
  private _sectionGroups: BehaviorSubject<Array<SectionGroup>> = new BehaviorSubject([]);
  public readonly sectionGroups: Observable<Array<SectionGroup>> = this._sectionGroups.asObservable();

  private _courses: BehaviorSubject<Array<Course>> = new BehaviorSubject([]);
  public readonly courses: Observable<Array<Course>> = this._courses.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService) {}

  initializeData(data: any): void {
    this._sectionGroups.next(data.sectionGroups);
    this._courses.next(data.courses);
  }

  impersonateJarold() {
    this.authService.impersonate("JIWUNG");
  }

  unimpersonateJarold() {
    this.authService.unimpersonate();
  }
}
