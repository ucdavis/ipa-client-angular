import { Injectable } from '@angular/core';
import { ApiService } from '@core/api/api.service';
import { Store } from '@ngrx/store';
import { SchedulingState } from '@scheduling/models/scheduling.model';

@Injectable({ providedIn: 'root' })
export class SchedulingActions {
  constructor(private apiService: ApiService, private store: Store<SchedulingState>) {}

  getCourses(): void {
    this.store.dispatch({type: 'GET_COURSES'});

    let url: String = "/api/workgroups/" + 20 + "/years/" + 2018 + "/courses";

    this.apiService.get(url).subscribe((data: any) => {
      this.store.dispatch({ type: 'GET_COURSES_SUCCESS', payload: data });
    }
  );
  }
}
