import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { AuthService } from '@core/auth/auth.service';
import { BehaviorSubject, Observable } from '../../node_modules/rxjs';

@Injectable({ providedIn: 'root' })
export class SchedulingActions {
  private _sectionGroups: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  public readonly sectionGroups: Observable<Array<any>> = this._sectionGroups.asObservable();

  constructor(
    private apiService: ApiService,
    //private store: Store<SchedulingState>,
    private authService: AuthService) {}

  initializeData(data: any): void {
    this._sectionGroups.next(data.sectionGroups);
  }

  getCourses(): void {
    //this.store.dispatch({type: 'GET_COURSES'});

    let url: String = "/api/workgroups/" + 20 + "/years/" + 2018 + "/courses";

    this.apiService.get(url).subscribe((data: any) => {
      //this.store.dispatch({ type: 'GET_COURSES_SUCCESS', payload: data });
    }
  );
  }

  impersonateJarold() {
    this.authService.impersonate("JIWUNG");
  }

  unimpersonateJarold() {
    this.authService.unimpersonate();
  }

}
