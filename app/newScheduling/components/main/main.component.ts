import { Component } from '@angular/core';
import { AuthService } from '@core';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@scheduling/models/app.model';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { SchedulingActions } from '@scheduling/scheduling-actions.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  scheduling: Observable<SchedulingState>;
  schedulingName: String;
  schedulingShow: boolean;
  courses: Array<any>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private schedulingActions: SchedulingActions) {

      this.scheduling = this.store.select('scheduling');
  }

  ngOnInit() {
    console.log("[DEBUG] main component");
    this.scheduling.subscribe((state) => {
      console.log(state);
      this.schedulingName = state.name;
      this.schedulingShow = state.showName;
      this.courses = state.courses.list;
    })
  }

  validateToken() {
    //const jwt = localStorage.getItem('JWT');
    // this.authService.validateToken(jwt);
  }

  getCourses() {
    this.schedulingActions.getCourses();
  }

  toggleMessage() {
    this.store.dispatch({type: 'TOGGLE_MESSAGE'})
  }
}
